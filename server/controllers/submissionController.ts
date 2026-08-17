import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { store, getRandomCryptoImage } from '../db/store.ts';
import { IProjectSubmission, IProject } from '../types.ts';
import { calculateRiskScore } from '../services/riskScoreService.ts';

export async function submitProject(req: AuthRequest, res: Response) {
  try {
    if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
      return res.status(403).json({
        error: 'Access restricted: Only verified platform administrators (admin) can add or submit projects for monitoring.',
      });
    }

    const {
      name,
      domain,
      websiteUrl,
      description,
      logo,
      screenshot,
      category,
      country,
      minInvestment,
      maxInvestment,
      advertisedPlans,
      referralInformation,
      paymentMethods,
      contactEmail,
    } = req.body;

    if (!name || !domain || !contactEmail) {
      return res.status(400).json({ error: 'Project name, domain, and contact email are required' });
    }

    const newSubmission: IProjectSubmission = {
      id: `sub-${Date.now()}`,
      submittedBy: req.user?.id,
      submitterEmail: contactEmail.trim().toLowerCase(),
      projectData: {
        name: name.trim(),
        domain: domain.trim().toLowerCase().replace(/^https?:\/\//, ''),
        websiteUrl: websiteUrl || `https://${domain}`,
        description: description || 'Submitted project awaiting review.',
        logo: logo || getRandomCryptoImage(domain),
        screenshot: screenshot || getRandomCryptoImage(domain + '-screen'),
        category: category || 'HYIP General',
        country: country || 'Unspecified',
        minInvestment: Number(minInvestment) || 10,
        maxInvestment: Number(maxInvestment) || 10000,
        referralPercentage: referralInformation || '5%',
        paymentMethods: Array.isArray(paymentMethods) ? paymentMethods : [paymentMethods || 'Crypto'],
        plans: advertisedPlans
          ? [
              {
                id: `p-${Date.now()}`,
                name: 'Advertised Tier',
                advertisedReturn: advertisedPlans,
                duration: '30 Days',
                minInvestment: Number(minInvestment) || 10,
                maxInvestment: Number(maxInvestment) || 10000,
                type: 'Daily',
              },
            ]
          : [],
      },
      status: 'Pending Review',
      createdAt: new Date().toISOString(),
    };

    store.submissions.unshift(newSubmission);
    store.persist();

    return res.status(201).json({
      message: 'Project submitted successfully for admin review and monitor initialization',
      submission: newSubmission,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to submit project' });
  }
}

export async function getSubmissions(req: AuthRequest, res: Response) {
  try {
    return res.json({ submissions: store.submissions });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch submissions' });
  }
}

export async function reviewSubmission(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { action, adminNotes } = req.body; // action: 'approve' | 'reject'

    const sub = store.submissions.find((s) => s.id === id);
    if (!sub) return res.status(404).json({ error: 'Submission not found' });

    sub.status = action === 'approve' ? 'Approved' : 'Rejected';
    sub.adminNotes = adminNotes;
    sub.reviewedBy = req.user?.username || 'admin';
    sub.reviewedAt = new Date().toISOString();

    if (action === 'approve' && sub.projectData) {
      const pData = sub.projectData;
      const slug = pData.name
        ? pData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
        : `project-${Date.now()}`;

      const initialStatus = 'WAITING';
      const risk = calculateRiskScore({ status: initialStatus, lifetimeDays: 1 });

      const newProj: IProject = {
        id: `proj-${Date.now()}`,
        name: pData.name || 'New Project',
        slug,
        domain: pData.domain || 'example.com',
        websiteUrl: pData.websiteUrl || `https://${pData.domain}`,
        logo: pData.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        screenshot: pData.screenshot || '',
        description: pData.description || 'Verified submission.',
        country: pData.country || 'Global',
        category: pData.category || 'Arbitrage',
        status: initialStatus,
        riskScore: risk.score,
        riskLevel: risk.riskLevel,
        rating: 6.5,
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        lifetimeDays: 1,
        minInvestment: pData.minInvestment || 10,
        maxInvestment: pData.maxInvestment || 10000,
        referralPercentage: pData.referralPercentage || '5%',
        paymentMethods: pData.paymentMethods || ['USDT'],
        withdrawalMethods: 'Manual within 24h',
        plans: pData.plans || [],
        monitorStatuses: [],
        isFeatured: false,
        isSponsored: false,
        isApproved: true,
        viewsCount: 1,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Prepend to store array so the newly approved project immediately appears at the top
      store.projects.unshift(newProj);
      store.events.unshift({
        id: `evt-${Date.now()}`,
        projectId: newProj.id,
        projectName: newProj.name,
        projectSlug: newProj.slug,
        type: 'PROJECT_ADDED',
        newStatus: 'WAITING',
        message: `Project "${newProj.name}" approved from webmaster submission.`,
        createdAt: new Date().toISOString(),
      });
    }

    store.persist();
    return res.json({ message: `Submission ${sub.status.toLowerCase()}`, submission: sub });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process submission review' });
  }
}
