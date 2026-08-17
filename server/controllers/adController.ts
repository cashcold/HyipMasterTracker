import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { store } from '../db/store.ts';
import { IAdvertisement } from '../types.ts';

export async function getAdvertisements(req: AuthRequest, res: Response) {
  try {
    const { position } = req.query as Record<string, string>;
    let ads = store.advertisements.filter((a) => a.status === 'Active');

    if (position) {
      ads = ads.filter((a) => a.position.toLowerCase() === position.toLowerCase());
    }

    // Increment impressions
    ads.forEach((a) => {
      a.impressions = (a.impressions || 0) + 1;
    });
    store.persist();

    return res.json({ advertisements: ads });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch advertisements' });
  }
}

export async function clickAdvertisement(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const ad = store.advertisements.find((a) => a.id === id);
    if (!ad) return res.status(404).json({ error: 'Advertisement not found' });

    ad.clicks = (ad.clicks || 0) + 1;
    store.persist();

    return res.json({ success: true, targetUrl: ad.targetUrl });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to track ad click' });
  }
}

export async function adminGetAllAds(req: AuthRequest, res: Response) {
  try {
    return res.json({ advertisements: store.advertisements });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch advertisements' });
  }
}

export async function adminCreateAd(req: AuthRequest, res: Response) {
  try {
    const data = req.body;
    const newAd: IAdvertisement = {
      id: `ad-${Date.now()}`,
      title: data.title,
      image: data.image,
      targetUrl: data.targetUrl,
      position: data.position || 'Homepage Hero',
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      status: data.status || 'Active',
      priority: Number(data.priority) || 1,
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };

    store.advertisements.push(newAd);
    store.persist();
    return res.status(201).json({ message: 'Advertisement created', advertisement: newAd });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create ad' });
  }
}
