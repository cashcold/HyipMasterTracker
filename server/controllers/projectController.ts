import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { store, getRandomCryptoImage } from '../db/store.ts';
import { IProject, IEvent, INotification, IAuditLog, ProjectStatus } from '../types.ts';
import { calculateRiskScore } from '../services/riskScoreService.ts';

// Helper to generate URL-safe slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export async function getProjects(req: AuthRequest, res: Response) {
  try {
    const {
      status,
      risk,
      investment,
      lifetime,
      planType,
      category,
      paymentMethod,
      search,
      sort = 'default',
      page = '1',
      limit = '20',
      featured,
    } = req.query as Record<string, string>;

    let results = store.projects.filter((p) => p.isApproved);

    // Filter by status
    if (status && status.toUpperCase() !== 'ALL') {
      const statusUpper = status.toUpperCase();
      if (statusUpper === 'PROBLEMATIC') {
        results = results.filter((p) => ['PROBLEM', 'NOT PAID', 'CLOSED'].includes(p.status));
      } else {
        results = results.filter((p) => p.status === statusUpper);
      }
    }

    // Filter by risk tier
    if (risk && risk.toLowerCase() !== 'all') {
      const r = risk.toLowerCase();
      if (r === 'very-high-confidence' || r === 'very_high') {
        results = results.filter((p) => p.riskScore >= 9.0);
      } else if (r === 'good' || r === 'low') {
        results = results.filter((p) => p.riskScore >= 7.0 && p.riskScore < 9.0);
      } else if (r === 'moderate' || r === 'medium') {
        results = results.filter((p) => p.riskScore >= 5.0 && p.riskScore < 7.0);
      } else if (r === 'high' || r === 'high-risk') {
        results = results.filter((p) => p.riskScore >= 3.0 && p.riskScore < 5.0);
      } else if (r === 'critical' || r === 'critical-risk') {
        results = results.filter((p) => p.riskScore < 3.0);
      }
    }

    // Filter by investment amount
    if (investment && investment !== 'all') {
      if (investment === 'under10') {
        results = results.filter((p) => p.minInvestment <= 10);
      } else if (investment === '10-100') {
        results = results.filter((p) => p.minInvestment >= 10 && p.minInvestment <= 100);
      } else if (investment === '100-1000') {
        results = results.filter((p) => p.minInvestment >= 100 && p.minInvestment <= 1000);
      } else if (investment === '1000plus') {
        results = results.filter((p) => p.minInvestment >= 1000);
      }
    }

    // Filter by lifetime
    if (lifetime && lifetime !== 'all') {
      if (lifetime === 'new' || lifetime === 'under7') {
        results = results.filter((p) => p.lifetimeDays <= 7);
      } else if (lifetime === 'under30') {
        results = results.filter((p) => p.lifetimeDays <= 30);
      } else if (lifetime === '30-90') {
        results = results.filter((p) => p.lifetimeDays >= 30 && p.lifetimeDays <= 90);
      } else if (lifetime === '90-180') {
        results = results.filter((p) => p.lifetimeDays >= 90 && p.lifetimeDays <= 180);
      } else if (lifetime === '180plus') {
        results = results.filter((p) => p.lifetimeDays > 180);
      }
    }

    // Filter by plan type
    if (planType && planType.toLowerCase() !== 'all') {
      results = results.filter((p) =>
        p.plans?.some((plan) => plan.type.toLowerCase() === planType.toLowerCase())
      );
    }

    // Filter by category
    if (category && category.toLowerCase() !== 'all') {
      results = results.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
    }

    // Filter by payment method
    if (paymentMethod && paymentMethod.toLowerCase() !== 'all') {
      const pm = paymentMethod.toLowerCase().trim();
      results = results.filter((p) =>
        p.paymentMethods?.some((method) => method.toLowerCase().includes(pm))
      );
    }

    // Filter by featured
    if (featured === 'true') {
      results = results.filter((p) => p.isFeatured || p.isSponsored);
    }

    // Search query
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sort && sort !== 'default' && sort !== 'order') {
      results.sort((a, b) => {
        switch (sort) {
          case 'newest':
            return new Date(b.dateAdded || b.createdAt).getTime() - new Date(a.dateAdded || a.createdAt).getTime();
          case 'oldest':
            return new Date(a.dateAdded || a.createdAt).getTime() - new Date(b.dateAdded || b.createdAt).getTime();
          case 'highest-risk-score':
          case 'highest-confidence':
          case 'score':
            return b.riskScore - a.riskScore;
          case 'lowest-risk-score':
            return a.riskScore - b.riskScore;
          case 'highest-rating':
            return b.rating - a.rating;
          case 'longest-lifetime':
            return b.lifetimeDays - a.lifetimeDays;
          case 'most-reviews':
            return b.reviewCount - a.reviewCount;
          case 'recently-updated':
            return new Date(b.lastUpdated || b.updatedAt).getTime() - new Date(a.lastUpdated || a.updatedAt).getTime();
          default:
            return 0;
        }
      });
    }

    const total = results.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const totalPages = Math.ceil(total / limitNum);
    const offset = (pageNum - 1) * limitNum;
    const paginated = results.slice(offset, offset + limitNum);

    // Calculate dynamic stats
    const stats = {
      total: store.projects.filter((p) => p.isApproved).length,
      paying: store.projects.filter((p) => p.isApproved && p.status === 'PAYING').length,
      waiting: store.projects.filter((p) => p.isApproved && p.status === 'WAITING').length,
      problem: store.projects.filter((p) => p.isApproved && p.status === 'PROBLEM').length,
      notPaid: store.projects.filter((p) => p.isApproved && p.status === 'NOT PAID').length,
      closed: store.projects.filter((p) => p.isApproved && p.status === 'CLOSED').length,
    };

    return res.json({
      projects: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
      stats,
    });
  } catch (err: any) {
    console.error('Error in getProjects:', err);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

export async function getProjectBySlug(req: AuthRequest, res: Response) {
  try {
    const { slug } = req.params;
    const project = store.projects.find(
      (p) => p.slug === slug || p.id === slug || p.domain.toLowerCase() === slug.toLowerCase()
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Increment views
    project.viewsCount = (project.viewsCount || 0) + 1;
    store.persist();

    // Compute live risk assessment breakdown
    const riskAnalysis = calculateRiskScore(project);

    // Get project events history
    const events = store.events
      .filter((e) => e.projectId === project.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Get project reviews
    const reviews = store.reviews
      .filter((r) => r.projectId === project.id && r.status === 'Approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Check if watched by current user
    let isWatched = false;
    if (req.user) {
      isWatched = store.watchlists.some((w) => w.userId === req.user!.id && w.projectId === project.id);
    }

    return res.json({
      project,
      riskAnalysis,
      events,
      reviews,
      isWatched,
    });
  } catch (err: any) {
    console.error('Error in getProjectBySlug:', err);
    return res.status(500).json({ error: 'Failed to fetch project details' });
  }
}

export async function compareProjects(req: AuthRequest, res: Response) {
  try {
    const slugs = (req.query.slugs as string)?.split(',') || [];
    if (slugs.length === 0) {
      return res.status(400).json({ error: 'Please provide project slugs to compare' });
    }

    const projects = store.projects
      .filter((p) => slugs.includes(p.slug) || slugs.includes(p.id))
      .slice(0, 4);

    const comparisons = projects.map((p) => {
      const riskAnalysis = calculateRiskScore(p);
      return {
        ...p,
        riskAnalysis,
      };
    });

    return res.json({ projects: comparisons });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to compare projects' });
  }
}

export async function createProject(req: AuthRequest, res: Response) {
  try {
    const data = req.body;
    if (!data.name || !data.domain) {
      return res.status(400).json({ error: 'Project name and domain are required' });
    }

    const slug = slugify(data.name);
    if (store.projects.some((p) => p.slug === slug)) {
      return res.status(400).json({ error: 'A project with this name/slug already exists' });
    }

    const initialStatus = data.status || 'WAITING';
    const riskAnalysis = calculateRiskScore({
      ...data,
      status: initialStatus,
      lifetimeDays: 1,
      rating: 7.0,
      monitorStatuses: [],
    });

    const newProject: IProject = {
      id: `proj-${Date.now()}`,
      name: data.name.trim(),
      slug,
      domain: data.domain.trim().toLowerCase().replace(/^https?:\/\//, ''),
      websiteUrl: data.websiteUrl || `https://${data.domain}`,
      logo: data.logo || getRandomCryptoImage(slug),
      screenshot: data.screenshot || getRandomCryptoImage(slug + '-screenshot'),
      description: data.description || 'Monitored investment program.',
      country: data.country || 'Global',
      category: data.category || 'DeFi & Arbitrage',
      status: initialStatus,
      riskScore: riskAnalysis.score,
      riskLevel: riskAnalysis.riskLevel,
      rating: data.rating || 7.0,
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      lifetimeDays: 1,
      minInvestment: Number(data.minInvestment) || 10,
      maxInvestment: Number(data.maxInvestment) || 10000,
      referralPercentage: data.referralPercentage || '5%',
      paymentMethods: data.paymentMethods || ['USDT', 'Bitcoin', 'Ethereum'],
      withdrawalMethods: data.withdrawalMethods || 'Manual within 24h',
      plans: data.plans || [
        {
          id: `plan-${Date.now()}-1`,
          name: 'Standard Tier',
          advertisedReturn: '2.5% Daily',
          duration: '30 Days',
          minInvestment: 10,
          maxInvestment: 1000,
          type: 'Daily',
        },
      ],
      monitorStatuses: [],
      isFeatured: Boolean(data.isFeatured),
      isSponsored: Boolean(data.isSponsored),
      isApproved: true,
      viewsCount: 1,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Prepend to store array so the new item immediately appears at the top of all listings
    store.projects.unshift(newProject);

    // Event: PROJECT_ADDED
    const event: IEvent = {
      id: `evt-${Date.now()}`,
      projectId: newProject.id,
      projectName: newProject.name,
      projectSlug: newProject.slug,
      type: 'PROJECT_ADDED',
      newStatus: newProject.status,
      message: `Project "${newProject.name}" was added to HyipMasterTracker directory.`,
      createdBy: req.user?.username || 'admin',
      createdAt: new Date().toISOString(),
    };
    store.events.unshift(event);

    // Audit log
    store.auditLogs.push({
      id: `log-${Date.now()}`,
      userId: req.user?.id,
      userEmail: req.user?.email || 'system',
      action: 'CREATE_PROJECT',
      entity: 'PROJECT',
      entityId: newProject.id,
      newData: newProject,
      createdAt: new Date().toISOString(),
    });

    store.persist();

    return res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (err: any) {
    console.error('Error creating project:', err);
    return res.status(500).json({ error: 'Failed to create project' });
  }
}

export async function updateProjectStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status, reason, notifyUsers = true } = req.body;

    const project = store.projects.find((p) => p.id === id || p.slug === id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const oldStatus = project.status;
    const newStatus: ProjectStatus = status;

    if (oldStatus === newStatus) {
      return res.json({ message: 'Status is unchanged', project });
    }

    project.status = newStatus;
    project.lastUpdated = new Date().toISOString();
    project.updatedAt = new Date().toISOString();

    // Recalculate risk score automatically
    const riskAnalysis = calculateRiskScore(project);
    project.riskScore = riskAnalysis.score;
    project.riskLevel = riskAnalysis.riskLevel;

    // Determine event type
    let eventType: IEvent['type'] = 'STATUS_CHANGED';
    if (newStatus === 'NOT PAID') eventType = 'NOT_PAID';
    if (newStatus === 'PROBLEM') eventType = 'PROBLEM_REPORTED';
    if (newStatus === 'CLOSED') eventType = 'PROJECT_CLOSED';
    if (newStatus === 'PAYING') eventType = 'PAYMENT_REPORTED';

    const eventMessage =
      reason || `Status updated from ${oldStatus} to ${newStatus}${reason ? `: ${reason}` : '.'}`;

    const event: IEvent = {
      id: `evt-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      projectSlug: project.slug,
      type: eventType,
      oldStatus,
      newStatus,
      message: eventMessage,
      createdBy: req.user?.username || 'admin',
      createdAt: new Date().toISOString(),
    };
    store.events.unshift(event);

    // Notify all users watching this project
    if (notifyUsers) {
      const watchers = store.watchlists.filter((w) => w.projectId === project.id);
      let notifType: INotification['type'] = 'info';
      if (newStatus === 'NOT PAID' || newStatus === 'CLOSED') notifType = 'danger';
      else if (newStatus === 'PROBLEM') notifType = 'warning';
      else if (newStatus === 'PAYING') notifType = 'success';

      watchers.forEach((w) => {
        store.notifications.unshift({
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          userId: w.userId,
          type: notifType,
          title: `Status Alert: ${project.name}`,
          message: `Watched project "${project.name}" status changed from ${oldStatus} to ${newStatus}.`,
          projectId: project.id,
          projectSlug: project.slug,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      });
    }

    // Audit Log
    store.auditLogs.push({
      id: `log-${Date.now()}`,
      userId: req.user?.id,
      userEmail: req.user?.email || 'system',
      action: 'CHANGE_PROJECT_STATUS',
      entity: 'PROJECT',
      entityId: project.id,
      oldData: { status: oldStatus },
      newData: { status: newStatus, reason },
      createdAt: new Date().toISOString(),
    });

    store.persist();

    return res.json({
      message: `Project status updated to ${newStatus}`,
      project,
      event,
    });
  } catch (err: any) {
    console.error('Error updating status:', err);
    return res.status(500).json({ error: 'Failed to update project status' });
  }
}

export async function updateProjectRisk(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { riskScore, reason } = req.body;

    const project = store.projects.find((p) => p.id === id || p.slug === id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const oldScore = project.riskScore;
    const newScore = parseFloat(Number(riskScore).toFixed(1));

    project.riskScore = Math.max(0.1, Math.min(9.8, newScore));
    if (reason) project.riskOverrideReason = reason;
    project.lastUpdated = new Date().toISOString();

    const event: IEvent = {
      id: `evt-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      projectSlug: project.slug,
      type: 'RISK_CHANGED',
      message: `Risk score updated from ${oldScore} to ${newScore}${reason ? ` (${reason})` : ''}`,
      createdBy: req.user?.username || 'admin',
      createdAt: new Date().toISOString(),
    };
    store.events.unshift(event);

    store.auditLogs.push({
      id: `log-${Date.now()}`,
      userId: req.user?.id,
      userEmail: req.user?.email || 'admin',
      action: 'UPDATE_RISK_SCORE',
      entity: 'PROJECT',
      entityId: project.id,
      oldData: { riskScore: oldScore },
      newData: { riskScore: newScore, reason },
      createdAt: new Date().toISOString(),
    });

    store.persist();
    return res.json({ message: 'Risk score updated', project });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update risk score' });
  }
}

export async function updateProject(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const project = store.projects.find((p) => p.id === id || p.slug === id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const updates = req.body;
    delete updates.id;
    delete updates.slug;

    Object.assign(project, updates);
    project.lastUpdated = new Date().toISOString();
    project.updatedAt = new Date().toISOString();

    store.auditLogs.push({
      id: `log-${Date.now()}`,
      userId: req.user?.id,
      userEmail: req.user?.email || 'admin',
      action: 'UPDATE_PROJECT',
      entity: 'PROJECT',
      entityId: project.id,
      newData: updates,
      createdAt: new Date().toISOString(),
    });

    store.persist();
    return res.json({ message: 'Project updated successfully', project });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update project' });
  }
}

export async function deleteProject(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const idx = store.projects.findIndex((p) => p.id === id || p.slug === id);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });

    const deleted = store.projects.splice(idx, 1)[0];

    store.auditLogs.push({
      id: `log-${Date.now()}`,
      userId: req.user?.id,
      userEmail: req.user?.email || 'admin',
      action: 'DELETE_PROJECT',
      entity: 'PROJECT',
      entityId: deleted.id,
      oldData: deleted,
      createdAt: new Date().toISOString(),
    });

    store.persist();
    return res.json({ message: 'Project deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete project' });
  }
}
