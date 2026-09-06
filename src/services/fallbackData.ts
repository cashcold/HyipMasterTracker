import fallbackDb from '../../data/db.json';

export function getFallbackData(endpoint: string): any | null {
  const cleanEndpoint = endpoint.split('?')[0];

  if (cleanEndpoint === '/projects') {
    const projects = fallbackDb.projects || [];
    const paying = projects.filter((p: any) => p.status === 'PAYING').length;
    const problem = projects.filter((p: any) => p.status === 'PROBLEM').length;
    const notPaid = projects.filter((p: any) => p.status === 'NOT PAID').length;
    const waiting = projects.filter((p: any) => p.status === 'WAITING').length;
    const closed = projects.filter((p: any) => p.status === 'CLOSED').length;

    return {
      success: true,
      projects,
      pagination: {
        page: 1,
        limit: projects.length,
        total: projects.length,
        totalPages: 1,
      },
      stats: {
        total: projects.length,
        paying,
        problem,
        notPaid,
        waiting,
        closed,
      },
    };
  }

  if (cleanEndpoint.startsWith('/projects/')) {
    const slug = cleanEndpoint.replace('/projects/', '');
    const project = (fallbackDb.projects || []).find(
      (p: any) => p.slug === slug || p.id === slug
    );
    if (project) {
      return { success: true, project };
    }
  }

  if (cleanEndpoint === '/statistics') {
    const projects = fallbackDb.projects || [];
    const paying = projects.filter((p: any) => p.status === 'PAYING').length;
    const waiting = projects.filter((p: any) => p.status === 'WAITING').length;
    const problem = projects.filter((p: any) => p.status === 'PROBLEM').length;
    const notPaid = projects.filter((p: any) => p.status === 'NOT PAID').length;
    const closed = projects.filter((p: any) => p.status === 'CLOSED').length;

    return {
      summary: {
        totalProjects: projects.length,
        activeProjects: projects.length,
        paying,
        payingProjects: paying,
        waiting,
        waitingProjects: waiting,
        problem,
        problemProjects: problem,
        notPaid,
        notPaidProjects: notPaid,
        closed,
        closedProjects: closed,
        totalMonitors: (fallbackDb.monitors || []).length,
        totalReviews: (fallbackDb.reviews || []).length,
        totalEvents: (fallbackDb.events || []).length,
        total30dVolume: 1612816,
        avgDailyVolume: 53761,
        peakDayVolume: 84930,
        peakDayDate: 'Aug 28',
        dayOverDayGrowth: -20.9,
      },
      dailyDepositActivity: [
        { date: 'Aug 25', count: 12, amount: 24500 },
        { date: 'Aug 27', count: 18, amount: 38200 },
        { date: 'Aug 29', count: 24, amount: 56100 },
        { date: 'Aug 31', count: 32, amount: 74200 },
        { date: 'Sep 02', count: 28, amount: 62000 },
        { date: 'Sep 04', count: 35, amount: 84930 },
      ],
      depositFlow: [],
      statusDistribution: [
        { name: 'Paying', count: paying, percentage: Math.round((paying / projects.length) * 100) },
        { name: 'Waiting', count: waiting, percentage: Math.round((waiting / projects.length) * 100) },
      ],
      riskDistribution: [
        { range: 'Low Risk (8.0-10.0)', count: 4, label: 'Good' },
        { range: 'Moderate (6.0-7.9)', count: 6, label: 'Moderate' },
        { range: 'High Risk (<6.0)', count: 2, label: 'High' },
      ],
      monthlyTrends: [],
      categoryStats: [],
    };
  }

  if (cleanEndpoint === '/events') {
    return {
      success: true,
      events: fallbackDb.events || [],
      pagination: { page: 1, limit: 20, total: (fallbackDb.events || []).length, totalPages: 1 },
    };
  }

  if (cleanEndpoint === '/reviews') {
    return {
      success: true,
      reviews: fallbackDb.reviews || [],
      pagination: { page: 1, limit: 20, total: (fallbackDb.reviews || []).length, totalPages: 1 },
    };
  }

  if (cleanEndpoint === '/monitors') {
    return {
      success: true,
      monitors: fallbackDb.monitors || [],
    };
  }

  if (cleanEndpoint === '/crypto/rates') {
    return {
      success: true,
      rates: [
        { symbol: 'BTC', name: 'Bitcoin', price: 92450.25, change24h: 2.45 },
        { symbol: 'ETH', name: 'Ethereum', price: 2740.1, change24h: 1.82 },
        { symbol: 'USDT', name: 'Tether USD', price: 1.0, change24h: 0.01 },
        { symbol: 'TRX', name: 'Tron', price: 0.245, change24h: 3.12 },
        { symbol: 'BNB', name: 'BNB Chain', price: 615.8, change24h: -0.45 },
        { symbol: 'LTC', name: 'Litecoin', price: 98.4, change24h: 0.85 },
        { symbol: 'SOL', name: 'Solana', price: 184.2, change24h: 4.15 },
        { symbol: 'DOGE', name: 'Dogecoin', price: 0.22, change24h: -1.2 },
      ],
    };
  }

  if (cleanEndpoint === '/crypto/payments') {
    return {
      success: true,
      gateways: [
        { symbol: 'USDT', name: 'Tether (TRC20)', network: 'Tron', fee: 'Low ($1)', confirmations: 1 },
        { symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin Mainnet', fee: 'Network', confirmations: 2 },
        { symbol: 'ETH', name: 'Ethereum', network: 'ERC20', fee: 'Variable', confirmations: 12 },
        { symbol: 'TRX', name: 'Tron', network: 'TRC20', fee: '<$0.05', confirmations: 1 },
        { symbol: 'LTC', name: 'Litecoin', network: 'Litecoin', fee: '<$0.01', confirmations: 3 },
      ],
    };
  }

  return null;
}
