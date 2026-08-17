import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { store } from '../db/store.ts';
import { IWatchlist } from '../types.ts';

export async function getWatchlist(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const userWatchlist = store.watchlists.filter((w) => w.userId === req.user!.id);
    const projectIds = userWatchlist.map((w) => w.projectId);

    const watchedProjects = store.projects
      .filter((p) => projectIds.includes(p.id))
      .map((p) => {
        const watchEntry = userWatchlist.find((w) => w.projectId === p.id);
        return {
          ...p,
          watchlistedAt: watchEntry?.createdAt,
        };
      });

    return res.json({ watchlist: watchedProjects, total: watchedProjects.length });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
}

export async function toggleWatchlist(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const { projectId } = req.params;
    const project = store.projects.find((p) => p.id === projectId || p.slug === projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const idx = store.watchlists.findIndex(
      (w) => w.userId === req.user!.id && w.projectId === project.id
    );

    let isWatched = false;
    if (idx !== -1) {
      store.watchlists.splice(idx, 1);
      isWatched = false;
    } else {
      const newEntry: IWatchlist = {
        id: `w-${Date.now()}`,
        userId: req.user.id,
        projectId: project.id,
        createdAt: new Date().toISOString(),
      };
      store.watchlists.push(newEntry);
      isWatched = true;
    }

    store.persist();
    return res.json({
      message: isWatched ? 'Added to watchlist' : 'Removed from watchlist',
      isWatched,
      projectId: project.id,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update watchlist' });
  }
}
