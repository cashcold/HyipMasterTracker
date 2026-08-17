import { Router } from 'express';
import {
  authMiddleware,
  optionalAuthMiddleware,
  requireAdmin,
  requireModerator,
} from '../middleware/auth.ts';

// Controllers
import * as authCtrl from '../controllers/authController.ts';
import * as projectCtrl from '../controllers/projectController.ts';
import * as reviewCtrl from '../controllers/reviewController.ts';
import * as eventCtrl from '../controllers/eventController.ts';
import * as watchlistCtrl from '../controllers/watchlistController.ts';
import * as notifCtrl from '../controllers/notificationController.ts';
import * as monitorCtrl from '../controllers/monitorController.ts';
import * as adCtrl from '../controllers/adController.ts';
import * as subCtrl from '../controllers/submissionController.ts';
import * as statsCtrl from '../controllers/statsController.ts';
import * as contactCtrl from '../controllers/contactController.ts';
import * as adminCtrl from '../controllers/adminController.ts';
import * as cryptoCtrl from '../controllers/cryptoController.ts';

const router = Router();

// ==================== CRYPTO LIVE RATES & PAYMENTS ====================
router.get('/crypto/rates', cryptoCtrl.getCryptoRates);
router.get('/crypto/payments', cryptoCtrl.getCryptoPayments);

// ==================== AUTHENTICATION ====================
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', authMiddleware, authCtrl.getMe);
router.put('/auth/profile', authMiddleware, authCtrl.updateProfile);

// ==================== PROJECTS ====================
router.get('/projects', optionalAuthMiddleware, projectCtrl.getProjects);
router.get('/projects/compare', optionalAuthMiddleware, projectCtrl.compareProjects);
router.get('/projects/:slug', optionalAuthMiddleware, projectCtrl.getProjectBySlug);
router.post('/projects', authMiddleware, requireAdmin, projectCtrl.createProject);
router.put('/projects/:id', authMiddleware, requireAdmin, projectCtrl.updateProject);
router.delete('/projects/:id', authMiddleware, requireAdmin, projectCtrl.deleteProject);
router.put('/projects/:id/status', authMiddleware, requireAdmin, projectCtrl.updateProjectStatus);
router.put('/projects/:id/risk', authMiddleware, requireAdmin, projectCtrl.updateProjectRisk);

// ==================== REVIEWS ====================
router.get('/reviews', optionalAuthMiddleware, reviewCtrl.getReviews);
router.post('/reviews', authMiddleware, reviewCtrl.createReview);
router.post('/reviews/:id/vote', authMiddleware, reviewCtrl.voteHelpful);
router.post('/reviews/:id/report', authMiddleware, reviewCtrl.reportReview);
router.put('/reviews/:id/status', authMiddleware, requireModerator, reviewCtrl.updateReviewStatus);
router.delete('/reviews/:id', authMiddleware, requireModerator, reviewCtrl.deleteReview);

// ==================== EVENTS ====================
router.get('/events', eventCtrl.getEvents);

// ==================== WATCHLIST ====================
router.get('/watchlist', authMiddleware, watchlistCtrl.getWatchlist);
router.post('/watchlist/:projectId', authMiddleware, watchlistCtrl.toggleWatchlist);

// ==================== NOTIFICATIONS ====================
router.get('/notifications', authMiddleware, notifCtrl.getNotifications);
router.put('/notifications/:id/read', authMiddleware, notifCtrl.markNotificationRead);

// ==================== MONITORS ====================
router.get('/monitors', monitorCtrl.getMonitors);
router.get('/monitors/:id', monitorCtrl.getMonitorById);
router.post('/monitors', authMiddleware, requireModerator, monitorCtrl.createMonitor);

// ==================== ADVERTISEMENTS ====================
router.get('/advertisements', adCtrl.getAdvertisements);
router.post('/advertisements/:id/click', adCtrl.clickAdvertisement);

// ==================== SUBMISSIONS ====================
router.post('/submissions', optionalAuthMiddleware, subCtrl.submitProject);

// ==================== STATISTICS ====================
router.get('/statistics', statsCtrl.getPlatformStatistics);
router.get('/statistics/deposit-flow', statsCtrl.getDepositFlow);

// ==================== CONTACT ====================
router.post('/contact', contactCtrl.submitContact);

// ==================== ADMIN SUITE ====================
router.get('/admin/dashboard', authMiddleware, requireModerator, adminCtrl.getAdminDashboard);
router.get('/admin/users', authMiddleware, requireAdmin, adminCtrl.getUsers);
router.put('/admin/users/:id/role', authMiddleware, requireAdmin, adminCtrl.updateUserRole);
router.put('/admin/users/:id/suspend', authMiddleware, requireAdmin, adminCtrl.toggleUserSuspension);

router.get('/admin/submissions', authMiddleware, requireModerator, subCtrl.getSubmissions);
router.put('/admin/submissions/:id/review', authMiddleware, requireModerator, subCtrl.reviewSubmission);

router.get('/admin/advertisements', authMiddleware, requireModerator, adCtrl.adminGetAllAds);
router.post('/admin/advertisements', authMiddleware, requireModerator, adCtrl.adminCreateAd);

router.get('/admin/audit-logs', authMiddleware, requireAdmin, adminCtrl.getAuditLogs);
router.get('/admin/messages', authMiddleware, requireModerator, contactCtrl.getContactMessages);
router.put('/admin/messages/:id', authMiddleware, requireModerator, contactCtrl.updateContactStatus);

router.get('/admin/settings', authMiddleware, requireAdmin, adminCtrl.getSettings);
router.put('/admin/settings', authMiddleware, requireAdmin, adminCtrl.updateSettings);
router.post('/admin/reset-db', authMiddleware, requireAdmin, adminCtrl.resetDatabase);

export default router;
