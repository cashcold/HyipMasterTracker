import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { store } from '../db/store.ts';
import { IMonitor } from '../types.ts';

export async function getMonitors(req: AuthRequest, res: Response) {
  try {
    const monitors = [...store.monitors].sort((a, b) => b.trustScore - a.trustScore);
    return res.json({ monitors });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch monitors' });
  }
}

export async function getMonitorById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const monitor = store.monitors.find((m) => m.id === id || m.name.toLowerCase() === id.toLowerCase());
    if (!monitor) return res.status(404).json({ error: 'Monitor not found' });

    // Find all projects reported by this monitor
    const reports: any[] = [];
    store.projects.forEach((p) => {
      const monRep = p.monitorStatuses?.find((ms) => ms.monitorId === monitor.id);
      if (monRep) {
        reports.push({
          projectId: p.id,
          projectName: p.name,
          projectSlug: p.slug,
          projectStatus: p.status,
          reportedStatus: monRep.status,
          rating: monRep.rating,
          notes: monRep.notes,
          reportedAt: monRep.reportedAt,
        });
      }
    });

    return res.json({ monitor, reports });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch monitor details' });
  }
}

export async function createMonitor(req: AuthRequest, res: Response) {
  try {
    const { name, website, logo, trustScore, description } = req.body;
    if (!name || !website) return res.status(400).json({ error: 'Name and website are required' });

    const newMonitor: IMonitor = {
      id: `mon-${Date.now()}`,
      name: name.trim(),
      website: website.trim(),
      logo: logo || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&auto=format&fit=crop&q=80',
      trustScore: parseFloat(Number(trustScore || 8.0).toFixed(1)),
      description: description || 'Independent monitoring provider.',
      status: 'Active',
      lastUpdate: new Date().toISOString(),
      projectsReported: 0,
      createdAt: new Date().toISOString(),
    };

    store.monitors.push(newMonitor);
    store.persist();
    return res.status(201).json({ message: 'Monitor created', monitor: newMonitor });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create monitor' });
  }
}
