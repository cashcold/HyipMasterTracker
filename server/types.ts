export type UserRole = 'USER' | 'MODERATOR' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';

export type ProjectStatus = 'PAYING' | 'WAITING' | 'PROBLEM' | 'NOT PAID' | 'CLOSED' | 'UNKNOWN';

export type EventType =
  | 'PROJECT_ADDED'
  | 'STATUS_CHANGED'
  | 'PAYMENT_REPORTED'
  | 'PROBLEM_REPORTED'
  | 'NOT_PAID'
  | 'PROJECT_CLOSED'
  | 'REVIEW_ADDED'
  | 'RISK_CHANGED'
  | 'PROJECT_UPDATED'
  | 'MONITOR_ADDED'
  | 'MONITOR_REPORT';

export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected' | 'Flagged';

export type ReviewCategory =
  | 'Positive'
  | 'Neutral'
  | 'Negative'
  | 'Payment Experience'
  | 'Withdrawal Experience'
  | 'Technical Problem'
  | 'Support Experience';

export type NotificationType = 'info' | 'success' | 'warning' | 'danger';

export type AdPosition =
  | 'Homepage Hero'
  | 'Homepage Featured'
  | 'Sidebar'
  | 'HYIP Listing'
  | 'Project Page';

export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPlan {
  id: string;
  name: string;
  advertisedReturn: string; // e.g. "3% Daily"
  duration: string; // e.g. "30 Days"
  minInvestment: number;
  maxInvestment: number;
  type: 'Daily' | 'Weekly' | 'Monthly' | 'Fixed' | 'Compound' | 'After Plan' | 'After Term' | 'Other' | string;
}

export interface IMonitorReport {
  id: string;
  monitorId: string;
  monitorName: string;
  monitorLogo?: string;
  status: ProjectStatus;
  rating: number; // 1-10
  notes?: string;
  reportedAt: string;
}

export interface IProject {
  id: string;
  name: string;
  slug: string;
  domain: string;
  websiteUrl: string;
  logo: string;
  screenshot?: string;
  description: string;
  country?: string;
  category: string;
  status: ProjectStatus;
  riskScore: number; // 0.0 - 10.0
  riskLevel: 'Very High Confidence' | 'Good' | 'Moderate' | 'High Risk' | 'Critical Risk';
  riskOverrideReason?: string;
  rating: number; // 1.0 - 10.0
  dateAdded: string;
  lastUpdated: string;
  lifetimeDays: number;
  minInvestment: number;
  maxInvestment: number;
  ourInvestment?: number;
  referralPercentage: string;
  paymentMethods: string[];
  withdrawalMethods: string;
  plans: IPlan[];
  monitorStatuses: IMonitorReport[];
  isFeatured: boolean;
  isSponsored: boolean;
  isApproved: boolean;
  viewsCount: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IMonitor {
  id: string;
  name: string;
  website: string;
  logo: string;
  trustScore: number; // 1-10
  description: string;
  status: 'Active' | 'Inactive' | 'Under Review';
  lastUpdate: string;
  projectsReported: number;
  createdAt: string;
}

export interface IReview {
  id: string;
  projectId: string;
  projectName: string;
  projectSlug: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-10
  title: string;
  content: string;
  category: ReviewCategory;
  evidence?: string;
  status: ReviewStatus;
  helpfulCount: number;
  helpfulVoters: string[];
  reports: { userId: string; reason: string; date: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface IEvent {
  id: string;
  projectId: string;
  projectName: string;
  projectSlug: string;
  type: EventType;
  oldStatus?: ProjectStatus;
  newStatus?: ProjectStatus;
  message: string;
  monitorId?: string;
  monitorName?: string;
  createdBy?: string;
  createdAt: string;
}

export interface IWatchlist {
  id: string;
  userId: string;
  projectId: string;
  createdAt: string;
}

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  projectId?: string;
  projectSlug?: string;
  isRead: boolean;
  createdAt: string;
}

export interface IAdvertisement {
  id: string;
  title: string;
  image: string;
  targetUrl: string;
  position: AdPosition;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Paused' | 'Expired';
  priority: number;
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface IProjectSubmission {
  id: string;
  submittedBy?: string;
  submitterEmail: string;
  projectData: Partial<IProject>;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface IAuditLog {
  id: string;
  userId?: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  createdAt: string;
}

export interface IContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  replyNotes?: string;
  createdAt: string;
}

export interface ISiteSettings {
  websiteName: string;
  tagline: string;
  contactEmail: string;
  defaultRiskThresholds: {
    criticalMax: number;
    highMax: number;
    moderateMax: number;
    goodMax: number;
  };
  requireReviewApproval: boolean;
  allowUserRegistrations: boolean;
  maintenanceMode: boolean;
  disclaimerNotice: string;
}
