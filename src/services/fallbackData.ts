import fallbackDb from '../../data/db.json';

// Helper to generate dynamic 30-day telemetry
function generateFallbackDailyActivity() {
  const now = new Date();
  const list = [];
  const avgDailyBase = 52000;

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const wave = Math.sin((30 - i) * 0.35) * 0.25;
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendDip = isWeekend ? 0.78 : 1.12;
    const noise = 0.88 + ((i * 17) % 31) / 100;
    const growthFactor = 1 + ((30 - i) / 30) * 0.35;

    const volumeUsd = Math.round(avgDailyBase * (1 + wave) * weekendDip * noise * growthFactor);
    const inflowCount = Math.max(15, Math.round(volumeUsd / 220));

    list.push({
      date: dateStr,
      formattedDate,
      timestamp: d.getTime(),
      volumeUsd,
      inflowCount,
      btcEquivalent: +(volumeUsd / 64200).toFixed(2),
      ethEquivalent: +(volumeUsd / 3450).toFixed(2),
      usdtVolume: Math.round(volumeUsd * 0.7),
      activePrograms: 12,
      avgDepositSize: Math.round(volumeUsd / inflowCount),
      movingAvg7d: volumeUsd,
    });
  }

  for (let i = 0; i < list.length; i++) {
    const windowStart = Math.max(0, i - 6);
    const subset = list.slice(windowStart, i + 1);
    const avgVol = Math.round(subset.reduce((acc, item) => acc + item.volumeUsd, 0) / subset.length);
    list[i].movingAvg7d = avgVol;
  }

  return list;
}

function generateFallbackDepositFlow() {
  const now = Date.now();
  const raw = [
    {
      id: 'dep-flow-0',
      minutesAgo: 1,
      projectName: 'Aura Diamond Holdings',
      projectSlug: 'aura-diamond-holdings',
      projectLogo: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
      investorName: 'Alexander_Sterling',
      investorCountry: 'United Kingdom',
      investorFlag: '🇬🇧',
      amountUsd: 18500,
      cryptoAmount: '18,500.00 USDT',
      paymentMethod: 'USDT (TRC20)',
      planName: 'Imperial Emerald Vault Plan (+20% Profit)',
      txHash: '0xda41...e782',
      status: 'VERIFIED_ON_CHAIN',
    },
    {
      id: 'dep-flow-1',
      minutesAgo: 4,
      projectName: 'GoldBod Pro',
      projectSlug: 'goldbod-pro',
      projectLogo: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&auto=format&fit=crop&q=80',
      investorName: 'Kwame_Asante_GH',
      investorCountry: 'Ghana',
      investorFlag: '🇬🇭',
      amountUsd: 2500,
      cryptoAmount: '38,500 GHS',
      paymentMethod: 'MTN Mobile Money',
      planName: '3-Day Flash Gold Vault (6% Daily)',
      txHash: 'MoMo-GH-82914',
      status: 'VERIFIED_ON_CHAIN',
    },
    {
      id: 'dep-flow-2',
      minutesAgo: 7,
      projectName: 'CloudMineX',
      projectSlug: 'cloudminex',
      projectLogo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      investorName: 'CryptoWhale_Tokyo',
      investorCountry: 'Japan',
      investorFlag: '🇯🇵',
      amountUsd: 9400,
      cryptoAmount: '0.146 BTC',
      paymentMethod: 'Bitcoin (BTC)',
      planName: 'Scrypt ASIC Cloud Cluster 90TH/s',
      txHash: '38fa...9b21',
      status: 'VERIFIED_ON_CHAIN',
    },
    {
      id: 'dep-flow-3',
      minutesAgo: 11,
      projectName: 'Prime Gold Resources',
      projectSlug: 'prime-gold-resources',
      projectLogo: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&auto=format&fit=crop&q=80',
      investorName: 'Marcus_Vance_US',
      investorCountry: 'United States',
      investorFlag: '🇺🇸',
      amountUsd: 4200,
      cryptoAmount: '4,200.00 USDT',
      paymentMethod: 'USDT (BEP20)',
      planName: 'Institutional Tier I Gold Reserve',
      txHash: '0x81bb...cc43',
      status: 'VERIFIED_ON_CHAIN',
    },
    {
      id: 'dep-flow-4',
      minutesAgo: 16,
      projectName: 'AlphaYield Protocol',
      projectSlug: 'alphayield-protocol',
      projectLogo: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=600&auto=format&fit=crop&q=80',
      investorName: 'Elena_Rostova',
      investorCountry: 'Germany',
      investorFlag: '🇩🇪',
      amountUsd: 1500,
      cryptoAmount: '0.435 ETH',
      paymentMethod: 'Ethereum (ERC20)',
      planName: 'Standard Daily Yield Alpha',
      txHash: '0x12fa...66a0',
      status: 'VERIFIED_ON_CHAIN',
    },
    {
      id: 'dep-flow-5',
      minutesAgo: 22,
      projectName: 'QuantumEarn AI',
      projectSlug: 'quantumearn-ai',
      projectLogo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80',
      investorName: 'TechVenture_SG',
      investorCountry: 'Singapore',
      investorFlag: '🇸🇬',
      amountUsd: 3200,
      cryptoAmount: '3,200.00 USDC',
      paymentMethod: 'USDC (Solana)',
      planName: 'HFT Bot Arbitrage Matrix',
      txHash: '4kK...9wE',
      status: 'VERIFIED_ON_CHAIN',
    },
    {
      id: 'dep-flow-6',
      minutesAgo: 29,
      projectName: 'ZenithCore Energy',
      projectSlug: 'zenithcore-energy',
      projectLogo: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80',
      investorName: 'Henrik_Larsen',
      investorCountry: 'Norway',
      investorFlag: '🇳🇴',
      amountUsd: 2800,
      cryptoAmount: '2,800.00 USDT',
      paymentMethod: 'USDT (TRC20)',
      planName: 'Clean Hydro Power Yield',
      txHash: '0x99dd...77ff',
      status: 'VERIFIED_ON_CHAIN',
    },
    {
      id: 'dep-flow-7',
      minutesAgo: 38,
      projectName: 'PrimeGrowth Yield',
      projectSlug: 'primegrowth-yield',
      projectLogo: 'https://images.unsplash.com/photo-1622979135240-caa6648190b6?w=600&auto=format&fit=crop&q=80',
      investorName: 'Lucas_Silva_BR',
      investorCountry: 'Brazil',
      investorFlag: '🇧🇷',
      amountUsd: 1200,
      cryptoAmount: '1,200.00 USDT',
      paymentMethod: 'USDT (BEP20)',
      planName: 'Prime Dynamic Yield Pool',
      txHash: '0x33aa...88cc',
      status: 'VERIFIED_ON_CHAIN',
    },
    {
      id: 'dep-flow-8',
      minutesAgo: 49,
      projectName: 'GoldBod Pro',
      projectSlug: 'goldbod-pro',
      projectLogo: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&auto=format&fit=crop&q=80',
      investorName: 'Abena_Mansah',
      investorCountry: 'Ghana',
      investorFlag: '🇬🇭',
      amountUsd: 1800,
      cryptoAmount: '27,720 GHS',
      paymentMethod: 'Telecel Cash',
      planName: '3-Day Flash Gold Vault (6% Daily)',
      txHash: 'MoMo-TC-19402',
      status: 'VERIFIED_ON_CHAIN',
    },
  ];

  return raw.map((d) => {
    const timestamp = now - d.minutesAgo * 60 * 1000;
    const dateObj = new Date(timestamp);
    return {
      ...d,
      timestamp,
      timeAgo: `${d.minutesAgo}m ago`,
      formattedTime: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  });
}

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

    const dailyDepositActivity = generateFallbackDailyActivity();
    const depositFlow = generateFallbackDepositFlow();
    const total30dVolume = dailyDepositActivity.reduce((sum, item) => sum + item.volumeUsd, 0);

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
        total30dVolume,
        avgDailyVolume: Math.round(total30dVolume / 30),
        peakDayVolume: Math.max(...dailyDepositActivity.map((d) => d.volumeUsd)),
        peakDayDate: 'Recent',
        dayOverDayGrowth: 4.8,
      },
      dailyDepositActivity,
      depositFlow,
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

  if (cleanEndpoint === '/statistics/deposit-flow') {
    const deposits = generateFallbackDepositFlow();
    return {
      success: true,
      count: deposits.length,
      deposits,
      updatedAt: new Date().toISOString(),
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
          low24h: 0.998,
          volume24h: 48900000000,
          marketCap: 114000000000,
          sparkline: [1.0, 1.001, 0.999, 1.0, 1.0, 1.001, 1.0],
          iconColor: '#26a17b',
          iconSymbol: '₮',
          network: 'TRON / TRC-20 & ERC-20',
          confirmationTime: '19 blocks (~1m)',
          avgFee: '~$1.00',
          popularityRank: 3,
        },
        {
          id: 'tron',
          symbol: 'TRX',
          name: 'TRON',
          priceUsd: 0.158,
          change24h: 3.12,
          high24h: 0.162,
          low24h: 0.152,
          volume24h: 890000000,
          marketCap: 13800000000,
          sparkline: [0.152, 0.154, 0.155, 0.153, 0.156, 0.157, 0.158],
          iconColor: '#eb0029',
          iconSymbol: 'TRX',
          network: 'TRON (TRC-20)',
          confirmationTime: 'Instant (~3s)',
          avgFee: '<$0.05',
          popularityRank: 4,
        },
        {
          id: 'binancecoin',
          symbol: 'BNB',
          name: 'BNB Chain',
          priceUsd: 592.4,
          change24h: -0.45,
          high24h: 601.0,
          low24h: 588.0,
          volume24h: 1200000000,
          marketCap: 86500000000,
          sparkline: [598, 595, 591, 593, 590, 594, 592],
          iconColor: '#f3ba2f',
          iconSymbol: 'BNB',
          network: 'BNB Smart Chain (BEP-20)',
          confirmationTime: '15 blocks (~45s)',
          avgFee: '~$0.15',
          popularityRank: 5,
        },
        {
          id: 'litecoin',
          symbol: 'LTC',
          name: 'Litecoin',
          priceUsd: 74.8,
          change24h: 0.85,
          high24h: 76.5,
          low24h: 73.2,
          volume24h: 420000000,
          marketCap: 5600000000,
          sparkline: [73.5, 74.0, 73.8, 74.2, 74.5, 74.6, 74.8],
          iconColor: '#345d9d',
          iconSymbol: 'Ł',
          network: 'Litecoin Network',
          confirmationTime: '6 blocks (~15m)',
          avgFee: '<$0.01',
          popularityRank: 6,
        },
        {
          id: 'solana',
          symbol: 'SOL',
          name: 'Solana',
          priceUsd: 154.2,
          change24h: 4.15,
          high24h: 158.0,
          low24h: 147.5,
          volume24h: 3600000000,
          marketCap: 71200000000,
          sparkline: [148, 149, 151, 150, 153, 152, 154],
          iconColor: '#14f195',
          iconSymbol: 'SOL',
          network: 'Solana Mainnet-Beta',
          confirmationTime: 'Finalized (~1s)',
          avgFee: '<$0.005',
          popularityRank: 7,
        },
        {
          id: 'dogecoin',
          symbol: 'DOGE',
          name: 'Dogecoin',
          priceUsd: 0.118,
          change24h: -1.2,
          high24h: 0.122,
          low24h: 0.115,
          volume24h: 680000000,
          marketCap: 17200000000,
          sparkline: [0.121, 0.12, 0.119, 0.117, 0.118, 0.117, 0.118],
          iconColor: '#c2a633',
          iconSymbol: 'Ð',
          network: 'Dogecoin Core',
          confirmationTime: '6 blocks (~6m)',
          avgFee: '~$0.08',
          popularityRank: 8,
        },
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

  if (cleanEndpoint === '/categories') {
    return {
      success: true,
      categories: [
        'Crypto Staking',
        'Forex Trading',
        'AI Trading Bots',
        'Real Estate Tokens',
        'Commodities & Gold',
        'Cloud Mining',
      ],
    };
  }

  return null;
}
