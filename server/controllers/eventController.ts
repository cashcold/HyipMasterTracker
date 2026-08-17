import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { store } from '../db/store.ts';

export async function getEvents(req: AuthRequest, res: Response) {
  try {
    const { type, projectId, limit = '50', page = '1' } = req.query as Record<string, string>;

    let results = [...store.events];

    if (projectId) {
      results = results.filter((e) => e.projectId === projectId);
    }

    if (type && type.toLowerCase() !== 'all') {
      const typeLower = type.toLowerCase();
      if (typeLower === 'paying') {
        results = results.filter((e) => e.type === 'PAYMENT_REPORTED' || e.newStatus === 'PAYING');
      } else if (typeLower === 'problem') {
        results = results.filter((e) => e.type === 'PROBLEM_REPORTED' || e.newStatus === 'PROBLEM');
      } else if (typeLower === 'not_paid') {
        results = results.filter((e) => e.type === 'NOT_PAID' || e.newStatus === 'NOT PAID');
      } else if (typeLower === 'closed') {
        results = results.filter((e) => e.type === 'PROJECT_CLOSED' || e.newStatus === 'CLOSED');
      } else if (typeLower === 'added') {
        results = results.filter((e) => e.type === 'PROJECT_ADDED');
      } else if (typeLower === 'reviews') {
        results = results.filter((e) => e.type === 'REVIEW_ADDED');
      } else {
        results = results.filter((e) => e.type === type.toUpperCase());
      }
    }

    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = parseInt(limit, 10) || 50;
    const total = results.length;
    const paginated = results.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return res.json({
      events: paginated,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}
