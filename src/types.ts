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

export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
  watchlistCount?: number;
  unreadNotifs?: number;
  reviewCount?: number;
}

export interface IPlan {
  id: string;
  name: string;
  advertisedReturn: string;
  duration: string;
  minInvestment: number;
  maxInvestment: number;
  type: string;
}

export interface IMonitorReport {
  id: string;
  monitorId: string;
  monitorName: string;
  monitorLogo?: string;
  status: ProjectStatus;
  rating: number;
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
  riskScore: number;
  riskLevel: 'Very High Confidence' | 'Good' | 'Moderate' | 'High Risk' | 'Critical Risk';
  riskOverrideReason?: string;
  rating: number;
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

export interface IRiskFactor {
  score: number;
  label: string;
  details: string;
}

export interface IRiskAnalysis {
  score: number;
  riskLevel: string;
  factors: {
    ageFactor: IRiskFactor;
    monitorConsensus: IRiskFactor;
    returnSustainability: IRiskFactor;
    communitySentiment: IRiskFactor;
    statusPenalty: IRiskFactor;
  };
  disclaimer: string;
}

export interface IMonitor {
  id: string;
  name: string;
  website: string;
  logo: string;
  trustScore: number;
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
  rating: number;
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
  position: string;
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

export interface ICryptoRate {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  sparkline: number[];
  iconColor: string;
  iconSymbol: string;
  network: string;
  confirmationTime: string;
  avgFee: string;
  popularityRank: number;
}

export interface ICryptoPaymentGateway {
  id: string;
  symbol: string;
  name: string;
  network: string;
  category: string;
  standard: string;
  iconColor: string;
  iconSymbol: string;
  minDepositUsd: number;
  avgSpeed: string;
  avgFeeUsd: number;
  acceptedPercentage: number;
  badgeClass: string;
  isPopular: boolean;
  description: string;
}

export interface IDepositFlowItem {
  id: string;
  projectId: string;
  projectName: string;
  projectSlug: string;
  projectLogo: string;
  investorName: string;
  investorCountry: string;
  investorFlag: string;
  amountUsd: number;
  cryptoAmount: string;
  paymentMethod: string;
  planName: string;
  txHash: string;
  status: 'CONFIRMED' | 'VERIFIED_ON_CHAIN' | 'PROCESSING';
  timestamp: string;
  timeAgo: string;
  formattedTime: string;
  fullDate: string;
}


