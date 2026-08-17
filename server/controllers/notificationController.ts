import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { store } from '../db/store.ts';

export async function getNotifications(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const userNotifs = store.notifications
      .filter((n) => n.userId === req.user!.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const unreadCount = userNotifs.filter((n) => !n.isRead).length;

    return res.json({
      notifications: userNotifs,
      unreadCount,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}

export async function markNotificationRead(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const { id } = req.params;
    if (id === 'all') {
      store.notifications
        .filter((n) => n.userId === req.user!.id)
        .forEach((n) => {
          n.isRead = true;
        });
    } else {
      const notif = store.notifications.find((n) => n.id === id && n.userId === req.user!.id);
      if (notif) notif.isRead = true;
    }

    store.persist();
    return res.json({ message: 'Notifications marked as read' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to mark notifications read' });
  }
}
