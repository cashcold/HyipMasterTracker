import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { store } from '../db/store.ts';
import { UserRole } from '../types.ts';

export async function getAdminDashboard(req: AuthRequest, res: Response) {
  try {
    const projects = store.projects;
    const users = store.users;
    const reviews = store.reviews;
    const submissions = store.submissions;
    const ads = store.advertisements;
    const messages = store.contactMessages;

    const metrics = {
      totalProjects: projects.length,
      payingProjects: projects.filter((p) => p.status === 'PAYING').length,
      problemProjects: projects.filter((p) => p.status === 'PROBLEM').length,
      notPaidProjects: projects.filter((p) => p.status === 'NOT PAID').length,
      closedProjects: projects.filter((p) => p.status === 'CLOSED').length,
      waitingProjects: projects.filter((p) => p.status === 'WAITING').length,
      totalUsers: users.length,
      pendingReviews: reviews.filter((r) => r.status === 'Pending').length,
      flaggedReviews: reviews.filter((r) => r.status === 'Flagged').length,
      pendingSubmissions: submissions.filter((s) => s.status === 'Pending Review').length,
      activeAds: ads.filter((a) => a.status === 'Active').length,
      unreadMessages: messages.filter((m) => m.status === 'New').length,
      totalMonitors: store.monitors.length,
      totalAuditLogs: store.auditLogs.length,
    };

    const recentAuditLogs = store.auditLogs.slice(0, 10);
    const pendingReviewsList = reviews.filter((r) => r.status === 'Pending' || r.status === 'Flagged').slice(0, 5);
    const pendingSubmissionsList = submissions.filter((s) => s.status === 'Pending Review').slice(0, 5);

    return res.json({
      metrics,
      recentAuditLogs,
      pendingReviewsList,
      pendingSubmissionsList,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch admin dashboard metrics' });
  }
}

export async function getUsers(req: AuthRequest, res: Response) {
  try {
    const { search, role, status } = req.query as Record<string, string>;

    let list = store.users.map((u) => {
      const { passwordHash: _, ...safe } = u;
      return safe;
    });

    if (role && role !== 'all') {
      list = list.filter((u) => u.role === role);
    }

    if (status) {
      if (status === 'suspended') list = list.filter((u) => u.isSuspended);
      if (status === 'active') list = list.filter((u) => !u.isSuspended);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q)
      );
    }

    return res.json({ users: list });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function updateUserRole(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { role } = req.body as { role: UserRole };

    const user = store.users.find((u) => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.id === req.user?.id) {
      return res.status(400).json({ error: 'You cannot change your own administrative role' });
    }

    const oldRole = user.role;
    user.role = role;
    user.updatedAt = new Date().toISOString();

    store.auditLogs.push({
      id: `log-${Date.now()}`,
      userId: req.user?.id,
      userEmail: req.user?.email || 'admin',
      action: 'CHANGE_USER_ROLE',
      entity: 'USER',
      entityId: user.id,
      oldData: { role: oldRole },
      newData: { role },
      createdAt: new Date().toISOString(),
    });

    store.persist();
    const { passwordHash: _, ...safe } = user;
    return res.json({ message: 'User role updated', user: safe });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update user role' });
  }
}

export async function toggleUserSuspension(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const user = store.users.find((u) => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.id === req.user?.id) {
      return res.status(400).json({ error: 'You cannot suspend your own account' });
    }

    user.isSuspended = !user.isSuspended;
    user.updatedAt = new Date().toISOString();

    store.auditLogs.push({
      id: `log-${Date.now()}`,
      userId: req.user?.id,
      userEmail: req.user?.email || 'admin',
      action: user.isSuspended ? 'SUSPEND_USER' : 'ACTIVATE_USER',
      entity: 'USER',
      entityId: user.id,
      newData: { isSuspended: user.isSuspended },
      createdAt: new Date().toISOString(),
    });

    store.persist();
    return res.json({
      message: `User ${user.isSuspended ? 'suspended' : 'activated'} successfully`,
      isSuspended: user.isSuspended,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to toggle user suspension' });
  }
}

export async function getAuditLogs(req: AuthRequest, res: Response) {
  try {
    const { limit = '100', entity } = req.query as Record<string, string>;
    let logs = [...store.auditLogs];

    if (entity && entity !== 'all') {
      logs = logs.filter((l) => l.entity === entity.toUpperCase());
    }

    logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json({ auditLogs: logs.slice(0, parseInt(limit, 10) || 100) });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
}

export async function getSettings(req: AuthRequest, res: Response) {
  try {
    return res.json({ settings: store.settings });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
}

export async function updateSettings(req: AuthRequest, res: Response) {
  try {
    const updates = req.body;
    store.settings = {
      ...store.settings,
      ...updates,
    };

    store.auditLogs.push({
      id: `log-${Date.now()}`,
      userId: req.user?.id,
      userEmail: req.user?.email || 'admin',
      action: 'UPDATE_SETTINGS',
      entity: 'SETTINGS',
      entityId: 'global',
      newData: updates,
      createdAt: new Date().toISOString(),
    });

    store.persist();
    return res.json({ message: 'Settings saved successfully', settings: store.settings });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update settings' });
  }
}

export async function resetDatabase(req: AuthRequest, res: Response) {
  try {
    store.seedInitialData();
    store.persist();
    return res.json({ message: 'Database reset and re-seeded successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reset database' });
  }
}
