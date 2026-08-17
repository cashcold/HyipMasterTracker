import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { store } from '../db/store.ts';
import { IReview, IEvent } from '../types.ts';

export async function getReviews(req: AuthRequest, res: Response) {
  try {
    const { projectId, status = 'Approved', limit = '50' } = req.query as Record<string, string>;

    let results = [...store.reviews];

    if (projectId) {
      results = results.filter((r) => r.projectId === projectId);
    }

    if (status && status !== 'all') {
      results = results.filter((r) => r.status === status);
    }

    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({
      reviews: results.slice(0, parseInt(limit, 10) || 50),
      total: results.length,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}

export async function createReview(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const { projectId, rating, title, content, category, evidence } = req.body;

    if (!projectId || !rating || !title || !content) {
      return res.status(400).json({ error: 'Project ID, rating (1-10), title, and content are required' });
    }

    const project = store.projects.find((p) => p.id === projectId || p.slug === projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const ratingNum = Math.max(1, Math.min(10, parseInt(rating, 10) || 5));
    const requiresApproval = store.settings.requireReviewApproval;

    const newReview: IReview = {
      id: `rev-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      projectSlug: project.slug,
      userId: req.user.id,
      userName: req.user.name || req.user.username,
      userAvatar: req.user.avatar,
      rating: ratingNum,
      title: title.trim(),
      content: content.trim(),
      category: category || 'Positive',
      evidence: evidence ? evidence.trim() : undefined,
      status: requiresApproval ? 'Pending' : 'Approved',
      helpfulCount: 0,
      helpfulVoters: [],
      reports: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.reviews.unshift(newReview);

    // If auto-approved, update project review stats & create event
    if (!requiresApproval) {
      project.reviewCount = (project.reviewCount || 0) + 1;
      const approvedRevs = store.reviews.filter((r) => r.projectId === project.id && r.status === 'Approved');
      const avg = approvedRevs.reduce((acc, curr) => acc + curr.rating, 0) / approvedRevs.length;
      project.rating = parseFloat(avg.toFixed(1));

      const event: IEvent = {
        id: `evt-${Date.now()}`,
        projectId: project.id,
        projectName: project.name,
        projectSlug: project.slug,
        type: 'REVIEW_ADDED',
        message: `New community review posted (${ratingNum}/10) for ${project.name}.`,
        createdAt: new Date().toISOString(),
      };
      store.events.unshift(event);
    }

    store.persist();

    return res.status(201).json({
      message: requiresApproval
        ? 'Review submitted and pending moderator review'
        : 'Review published successfully',
      review: newReview,
    });
  } catch (err: any) {
    console.error('Error submitting review:', err);
    return res.status(500).json({ error: 'Failed to submit review' });
  }
}

export async function voteHelpful(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required to vote' });

    const { id } = req.params;
    const review = store.reviews.find((r) => r.id === id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    const userId = req.user.id;
    if (review.helpfulVoters.includes(userId)) {
      // Toggle un-vote
      review.helpfulVoters = review.helpfulVoters.filter((uid) => uid !== userId);
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      review.helpfulVoters.push(userId);
      review.helpfulCount += 1;
    }

    store.persist();
    return res.json({ helpfulCount: review.helpfulCount, helpfulVoters: review.helpfulVoters });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to record vote' });
  }
}

export async function reportReview(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const { id } = req.params;
    const { reason } = req.body;
    const review = store.reviews.find((r) => r.id === id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    review.reports.push({
      userId: req.user.id,
      reason: reason || 'Inappropriate or spam content',
      date: new Date().toISOString(),
    });

    if (review.reports.length >= 3 && review.status === 'Approved') {
      review.status = 'Flagged';
    }

    store.persist();
    return res.json({ message: 'Review reported for moderator investigation' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to report review' });
  }
}

export async function updateReviewStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const review = store.reviews.find((r) => r.id === id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    review.status = status;
    review.updatedAt = new Date().toISOString();

    // Recalculate project rating
    const project = store.projects.find((p) => p.id === review.projectId);
    if (project) {
      const approvedRevs = store.reviews.filter((r) => r.projectId === project.id && r.status === 'Approved');
      project.reviewCount = approvedRevs.length;
      if (approvedRevs.length > 0) {
        const avg = approvedRevs.reduce((acc, curr) => acc + curr.rating, 0) / approvedRevs.length;
        project.rating = parseFloat(avg.toFixed(1));
      }
    }

    store.persist();
    return res.json({ message: `Review status updated to ${status}`, review });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update review status' });
  }
}

export async function deleteReview(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const idx = store.reviews.findIndex((r) => r.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Review not found' });

    const [deleted] = store.reviews.splice(idx, 1);
    store.persist();
    return res.json({ message: 'Review deleted', id: deleted.id });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete review' });
  }
}
