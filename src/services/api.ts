import {
  IProject,
  IRiskAnalysis,
  IReview,
  IEvent,
  IMonitor,
  INotification,
  IAdvertisement,
  IProjectSubmission,
  IAuditLog,
  ISiteSettings,
  IUser,
  ICryptoRate,
  ICryptoPaymentGateway,
  IDepositFlowItem,
} from '../types.ts';

const BASE_URL = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Network request failed');
  }
  return data;
}

const FALLBACK_CRYPTO_RATES: ICryptoRate[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    priceUsd: 67840.5,
    change24h: 2.34,
    high24h: 68450.0,
    low24h: 66200.0,
    volume24h: 32450000000,
    marketCap: 1340000000000,
    sparkline: [66200, 66500, 66800, 66400, 67100, 67500, 67840],
    iconColor: '#f7931a',
    iconSymbol: '₿',
    network: 'Bitcoin Core',
    confirmationTime: '1-3 blocks (~15-30m)',
    avgFee: '~$1.20',
    popularityRank: 1,
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    priceUsd: 3520.8,
    change24h: 1.85,
    high24h: 3580.0,
    low24h: 3440.0,
    volume24h: 18200000000,
    marketCap: 423000000000,
    sparkline: [3440, 3460, 3490, 3470, 3510, 3500, 3520],
    iconColor: '#627eea',
    iconSymbol: 'Ξ',
    network: 'Ethereum (ERC-20)',
    confirmationTime: '12 blocks (~3m)',
    avgFee: '~$1.80',
    popularityRank: 2,
  },
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether USD',
    priceUsd: 1.0,
    change24h: 0.02,
    high24h: 1.002,
    low24h: 0.999,
    volume24h: 54100000000,
    marketCap: 114000000000,
    sparkline: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    iconColor: '#26a17b',
    iconSymbol: '₮',
    network: 'TRC-20 / BEP-20 / ERC-20',
    confirmationTime: 'Instant - 2m',
    avgFee: '<$0.50 (TRC20)',
    popularityRank: 3,
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    priceUsd: 154.2,
    change24h: 4.12,
    high24h: 158.0,
    low24h: 147.5,
    volume24h: 4800000000,
    marketCap: 72000000000,
    sparkline: [147.5, 149.0, 151.2, 150.0, 153.5, 152.8, 154.2],
    iconColor: '#14f195',
    iconSymbol: '◎',
    network: 'Solana SPL',
    confirmationTime: 'Instant (~5s)',
    avgFee: '<$0.01',
    popularityRank: 4,
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    priceUsd: 592.6,
    change24h: -0.84,
    high24h: 602.0,
    low24h: 588.0,
    volume24h: 1300000000,
    marketCap: 89000000000,
    sparkline: [602, 598, 595, 591, 594, 590, 592.6],
    iconColor: '#f3ba2f',
    iconSymbol: 'BNB',
    network: 'BNB Smart Chain (BEP-20)',
    confirmationTime: 'Instant (~10s)',
    avgFee: '~$0.08',
    popularityRank: 5,
  },
  {
    id: 'tron',
    symbol: 'TRX',
    name: 'TRON',
    priceUsd: 0.158,
    change24h: 1.42,
    high24h: 0.161,
    low24h: 0.154,
    volume24h: 920000000,
    marketCap: 13800000000,
    sparkline: [0.154, 0.155, 0.156, 0.155, 0.157, 0.156, 0.158],
    iconColor: '#eb0029',
    iconSymbol: 'TRX',
    network: 'TRON Network (TRC-20)',
    confirmationTime: 'Instant (~3s)',
    avgFee: '<$0.02',
    popularityRank: 6,
  },
  {
    id: 'litecoin',
    symbol: 'LTC',
    name: 'Litecoin',
    priceUsd: 74.85,
    change24h: 0.95,
    high24h: 76.2,
    low24h: 73.5,
    volume24h: 420000000,
    marketCap: 5600000000,
    sparkline: [73.5, 73.9, 74.5, 74.1, 75.0, 74.4, 74.85],
    iconColor: '#345d9d',
    iconSymbol: 'Ł',
    network: 'Litecoin Core',
    confirmationTime: '1-2 blocks (~5m)',
    avgFee: '<$0.05',
    popularityRank: 7,
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    priceUsd: 0.118,
    change24h: 3.25,
    high24h: 0.122,
    low24h: 0.113,
    volume24h: 890000000,
    marketCap: 17200000000,
    sparkline: [0.113, 0.114, 0.116, 0.115, 0.119, 0.117, 0.118],
    iconColor: '#c2a633',
    iconSymbol: 'Ð',
    network: 'Dogecoin Core',
    confirmationTime: '1-3 blocks (~3m)',
    avgFee: '~$0.04',
    popularityRank: 8,
  },
  {
    id: 'the-open-network',
    symbol: 'TON',
    name: 'Toncoin',
    priceUsd: 5.62,
    change24h: 2.15,
    high24h: 5.75,
    low24h: 5.45,
    volume24h: 340000000,
    marketCap: 14200000000,
    sparkline: [5.45, 5.5, 5.58, 5.52, 5.65, 5.59, 5.62],
    iconColor: '#0088cc',
    iconSymbol: 'TON',
    network: 'TON Blockchain',
    confirmationTime: 'Instant (~4s)',
    avgFee: '<$0.01',
    popularityRank: 9,
  },
  {
    id: 'monero',
    symbol: 'XMR',
    name: 'Monero',
    priceUsd: 168.4,
    change24h: -0.45,
    high24h: 171.0,
    low24h: 166.2,
    volume24h: 95000000,
    marketCap: 3100000000,
    sparkline: [169, 170, 168, 167, 168.5, 167.8, 168.4],
    iconColor: '#ff6600',
    iconSymbol: 'ɱ',
    network: 'Monero Privacy Core',
    confirmationTime: '2-5 blocks (~10m)',
    avgFee: '<$0.05',
    popularityRank: 10,
  },
];

export const api = {
  // Auth
  register: (data: any) => request<{ message: string; token: string; user: IUser }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request<{ message: string; token: string; user: IUser }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request<{ user: IUser }>('/auth/me'),
  updateProfile: (data: any) => request<{ message: string; user: IUser }>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Projects
  getProjects: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{
      projects: IProject[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
      stats: { total: number; paying: number; waiting: number; problem: number; notPaid: number; closed: number };
    }>(`/projects?${qs}`);
  },
  getProjectBySlug: (slug: string) =>
    request<{
      project: IProject;
      riskAnalysis: IRiskAnalysis;
      events: IEvent[];
      reviews: IReview[];
      isWatched: boolean;
    }>(`/projects/${slug}`),
  compareProjects: (slugs: string[]) =>
    request<{ projects: (IProject & { riskAnalysis: IRiskAnalysis })[] }>(`/projects/compare?slugs=${slugs.join(',')}`),
  createProject: (data: any) => request<{ message: string; project: IProject }>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => request<{ message: string; project: IProject }>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) => request<{ message: string }>(`/projects/${id}`, { method: 'DELETE' }),
  updateProjectStatus: (id: string, data: { status: string; reason?: string }) =>
    request<{ message: string; project: IProject; event: IEvent }>(`/projects/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  updateProjectRisk: (id: string, data: { riskScore: number; reason?: string }) =>
    request<{ message: string; project: IProject }>(`/projects/${id}/risk`, { method: 'PUT', body: JSON.stringify(data) }),

  // Reviews
  getReviews: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ reviews: IReview[]; total: number }>(`/reviews?${qs}`);
  },
  createReview: (data: any) => request<{ message: string; review: IReview }>('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  voteHelpful: (id: string) => request<{ helpfulCount: number; helpfulVoters: string[] }>(`/reviews/${id}/vote`, { method: 'POST' }),
  reportReview: (id: string, reason: string) => request<{ message: string }>(`/reviews/${id}/report`, { method: 'POST', body: JSON.stringify({ reason }) }),
  updateReviewStatus: (id: string, status: string) => request<{ message: string; review: IReview }>(`/reviews/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  deleteReview: (id: string) => request<{ message: string }>(`/reviews/${id}`, { method: 'DELETE' }),

  // Events
  getEvents: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ events: IEvent[]; total: number; page: number; limit: number }>(`/events?${qs}`);
  },

  // Watchlist
  getWatchlist: () => request<{ watchlist: (IProject & { watchlistedAt: string })[]; total: number }>('/watchlist'),
  toggleWatchlist: (projectId: string) =>
    request<{ message: string; isWatched: boolean; projectId: string }>(`/watchlist/${projectId}`, { method: 'POST' }),

  // Notifications
  getNotifications: () => request<{ notifications: INotification[]; unreadCount: number }>('/notifications'),
  markNotificationRead: (id: string) => request<{ message: string }>(`/notifications/${id}/read`, { method: 'PUT' }),

  // Monitors
  getMonitors: () => request<{ monitors: IMonitor[] }>('/monitors'),
  getMonitorById: (id: string) => request<{ monitor: IMonitor; reports: any[] }>(`/monitors/${id}`),
  createMonitor: (data: any) => request<{ message: string; monitor: IMonitor }>('/monitors', { method: 'POST', body: JSON.stringify(data) }),

  // Advertisements
  getAdvertisements: (position?: string) =>
    request<{ advertisements: IAdvertisement[] }>(`/advertisements${position ? `?position=${encodeURIComponent(position)}` : ''}`),
  clickAdvertisement: (id: string) => request<{ success: boolean; targetUrl: string }>(`/advertisements/${id}/click`, { method: 'POST' }),
  adminGetAllAds: () => request<{ advertisements: IAdvertisement[] }>('/admin/advertisements'),
  adminCreateAd: (data: any) => request<{ message: string; advertisement: IAdvertisement }>('/admin/advertisements', { method: 'POST', body: JSON.stringify(data) }),

  // Submissions
  submitProject: (data: any) => request<{ message: string; submission: IProjectSubmission }>('/submissions', { method: 'POST', body: JSON.stringify(data) }),
  getSubmissions: () => request<{ submissions: IProjectSubmission[] }>('/admin/submissions'),
  reviewSubmission: (id: string, action: 'approve' | 'reject', adminNotes?: string) =>
    request<{ message: string; submission: IProjectSubmission }>(`/admin/submissions/${id}/review`, { method: 'PUT', body: JSON.stringify({ action, adminNotes }) }),

  // Crypto Live Rates & Gateways
  getCryptoRates: async () => {
    try {
      return await request<{
        rates: ICryptoRate[];
        lastUpdated: string;
        baseCurrency: string;
        totalTracked: number;
      }>('/crypto/rates');
    } catch {
      return {
        rates: FALLBACK_CRYPTO_RATES,
        lastUpdated: new Date().toISOString(),
        baseCurrency: 'USD',
        totalTracked: FALLBACK_CRYPTO_RATES.length,
      };
    }
  },
  getCryptoPayments: async () => {
    try {
      return await request<{
        gateways: ICryptoPaymentGateway[];
        totalGateways: number;
        updatedAt: string;
      }>('/crypto/payments');
    } catch {
      return {
        gateways: [],
        totalGateways: 0,
        updatedAt: new Date().toISOString(),
      };
    }
  },

  // Stats
  getStatistics: () =>
    request<{
      summary: any;
      dailyDepositActivity: any[];
      depositFlow: IDepositFlowItem[];
      statusDistribution: any[];
      riskDistribution: any[];
      monthlyTrends: any[];
      categoryStats: any[];
    }>('/statistics'),

  getDepositFlow: () =>
    request<{
      success: boolean;
      count: number;
      deposits: IDepositFlowItem[];
      updatedAt: string;
    }>('/statistics/deposit-flow'),

  // Contact
  submitContact: (data: any) => request<{ message: string; id: string }>('/contact', { method: 'POST', body: JSON.stringify(data) }),
  getContactMessages: () => request<{ messages: any[] }>('/admin/messages'),
  updateContactStatus: (id: string, data: any) => request<{ message: string }>(`/admin/messages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Admin
  getAdminDashboard: () =>
    request<{
      metrics: any;
      recentAuditLogs: IAuditLog[];
      pendingReviewsList: IReview[];
      pendingSubmissionsList: IProjectSubmission[];
    }>('/admin/dashboard'),
  getUsers: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ users: IUser[] }>(`/admin/users?${qs}`);
  },
  updateUserRole: (id: string, role: string) => request<{ message: string; user: IUser }>(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  toggleUserSuspension: (id: string) => request<{ message: string; isSuspended: boolean }>(`/admin/users/${id}/suspend`, { method: 'PUT' }),
  getAuditLogs: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ auditLogs: IAuditLog[] }>(`/admin/audit-logs?${qs}`);
  },
  getSettings: () => request<{ settings: ISiteSettings }>('/admin/settings'),
  updateSettings: (data: Partial<ISiteSettings>) => request<{ message: string; settings: ISiteSettings }>('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
  resetDatabase: () => request<{ message: string }>('/admin/reset-db', { method: 'POST' }),
};
