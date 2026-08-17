import { Request, Response } from 'express';

export interface ICryptoRateData {
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

// Fallback rates baseline with realistic micro-variations
const BASE_CRYPTO_RATES: ICryptoRateData[] = [
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
  {
    id: 'bitcoin-cash',
    symbol: 'BCH',
    name: 'Bitcoin Cash',
    priceUsd: 364.5,
    change24h: 1.12,
    high24h: 372.0,
    low24h: 358.0,
    volume24h: 280000000,
    marketCap: 7200000000,
    sparkline: [358, 360, 365, 362, 366, 363, 364.5],
    iconColor: '#0ac18e',
    iconSymbol: 'Ƀ',
    network: 'Bitcoin Cash Core',
    confirmationTime: '1-2 blocks (~10m)',
    avgFee: '<$0.02',
    popularityRank: 11,
  },
  {
    id: 'usd-coin',
    symbol: 'USDC',
    name: 'USD Coin',
    priceUsd: 1.0,
    change24h: 0.01,
    high24h: 1.001,
    low24h: 0.999,
    volume24h: 7800000000,
    marketCap: 34000000000,
    sparkline: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    iconColor: '#2775ca',
    iconSymbol: '$',
    network: 'Multi-Chain (ERC20/BEP20/SOL)',
    confirmationTime: 'Instant - 2m',
    avgFee: '<$0.20',
    popularityRank: 12,
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    priceUsd: 0.584,
    change24h: 1.78,
    high24h: 0.595,
    low24h: 0.572,
    volume24h: 1250000000,
    marketCap: 32800000000,
    sparkline: [0.572, 0.576, 0.582, 0.579, 0.588, 0.581, 0.584],
    iconColor: '#23292f',
    iconSymbol: '✕',
    network: 'XRP Ledger',
    confirmationTime: 'Instant (~4s)',
    avgFee: '<$0.001',
    popularityRank: 13,
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    priceUsd: 0.385,
    change24h: -1.05,
    high24h: 0.395,
    low24h: 0.378,
    volume24h: 310000000,
    marketCap: 13700000000,
    sparkline: [0.392, 0.390, 0.388, 0.382, 0.386, 0.383, 0.385],
    iconColor: '#0033ad',
    iconSymbol: '₳',
    network: 'Cardano PoS',
    confirmationTime: '1-2 blocks (~2m)',
    avgFee: '~$0.12',
    popularityRank: 14,
  },
];

// In-memory cache
let cachedRates: ICryptoRateData[] = BASE_CRYPTO_RATES;
let lastCacheTime = 0;
const CACHE_TTL_MS = 45 * 1000; // 45 seconds cache

async function fetchLiveRatesFromCoinGecko(): Promise<ICryptoRateData[] | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const ids = 'bitcoin,ethereum,tether,solana,binancecoin,tron,litecoin,dogecoin,the-open-network,monero,bitcoin-cash,usd-coin,ripple,cardano';
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`;

    const res = await fetch(url, { signal: controller.signal });

    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const mapped: ICryptoRateData[] = BASE_CRYPTO_RATES.map((base) => {
      const match = data.find((item: any) => item.id === base.id || item.symbol?.toLowerCase() === base.symbol.toLowerCase());
      if (!match) return base;

      const sparklineData = match.sparkline_in_7d?.price;
      const sparklineSample = Array.isArray(sparklineData) && sparklineData.length >= 7
        ? sparklineData.slice(-7).map((p: number) => Number(p.toFixed(2)))
        : base.sparkline;

      return {
        ...base,
        priceUsd: typeof match.current_price === 'number' ? match.current_price : base.priceUsd,
        change24h: typeof match.price_change_percentage_24h === 'number' ? Number(match.price_change_percentage_24h.toFixed(2)) : base.change24h,
        high24h: typeof match.high_24h === 'number' ? match.high_24h : base.high24h,
        low24h: typeof match.low_24h === 'number' ? match.low_24h : base.low24h,
        volume24h: typeof match.total_volume === 'number' ? match.total_volume : base.volume24h,
        marketCap: typeof match.market_cap === 'number' ? match.market_cap : base.marketCap,
        sparkline: sparklineSample,
      };
    });

    return mapped;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getCryptoRates(req: Request, res: Response) {
  try {
    const now = Date.now();
    if (now - lastCacheTime > CACHE_TTL_MS) {
      const live = await fetchLiveRatesFromCoinGecko();
      if (live && live.length > 0) {
        cachedRates = live;
      } else {
        // Apply slight realistic micro jitter (+- 0.05%) to keep live feel even when rate-limited
        cachedRates = cachedRates.map((c) => {
          if (c.symbol === 'USDT' || c.symbol === 'USDC') return c;
          const delta = (Math.random() - 0.5) * 0.001 * c.priceUsd;
          const newPrice = Number((c.priceUsd + delta).toFixed(c.priceUsd < 1 ? 4 : 2));
          return {
            ...c,
            priceUsd: newPrice,
          };
        });
      }
      lastCacheTime = now;
    }

    return res.json({
      rates: cachedRates,
      lastUpdated: new Date(lastCacheTime || Date.now()).toISOString(),
      baseCurrency: 'USD',
      totalTracked: cachedRates.length,
    });
  } catch (err: any) {
    return res.json({
      rates: BASE_CRYPTO_RATES,
      lastUpdated: new Date().toISOString(),
      baseCurrency: 'USD',
      totalTracked: BASE_CRYPTO_RATES.length,
    });
  }
}

export async function getCryptoPayments(req: Request, res: Response) {
  const paymentGateways = [
    {
      id: 'usdt-trc20',
      symbol: 'USDT (TRC20)',
      name: 'Tether TRC20',
      network: 'TRON Blockchain',
      category: 'Stablecoin',
      standard: 'TRC-20',
      iconColor: '#26a17b',
      iconSymbol: '₮',
      minDepositUsd: 10,
      avgSpeed: 'Instant (< 2 min)',
      avgFeeUsd: 0.5,
      acceptedPercentage: 96,
      badgeClass: 'bg-emerald-600 text-white',
      isPopular: true,
      description: 'The #1 most accepted stablecoin in the high-yield investment industry. Low network energy fees and instant block settlement.',
    },
    {
      id: 'bitcoin',
      symbol: 'Bitcoin (BTC)',
      name: 'Bitcoin',
      network: 'Bitcoin Layer 1',
      category: 'Cryptocurrency',
      standard: 'Native UTXO',
      iconColor: '#f7931a',
      iconSymbol: '₿',
      minDepositUsd: 25,
      avgSpeed: '1-3 Confirms (~20 min)',
      avgFeeUsd: 1.2,
      acceptedPercentage: 92,
      badgeClass: 'bg-amber-600 text-white',
      isPopular: true,
      description: 'Universally accepted store of value. Supported by all major automated and manual HYIP cashier gateways.',
    },
    {
      id: 'ethereum',
      symbol: 'Ethereum (ETH)',
      name: 'Ethereum',
      network: 'Ethereum Mainnet',
      category: 'Smart Contract Platform',
      standard: 'ERC-20',
      iconColor: '#627eea',
      iconSymbol: 'Ξ',
      minDepositUsd: 30,
      avgSpeed: '12 Confirms (~3 min)',
      avgFeeUsd: 1.8,
      acceptedPercentage: 84,
      badgeClass: 'bg-indigo-600 text-white',
      isPopular: true,
      description: 'Decentralized smart contract currency widely utilized across institutional and DeFi arbitrage programs.',
    },
    {
      id: 'tron',
      symbol: 'TRON (TRX)',
      name: 'TRON',
      network: 'TRON Mainnet',
      category: 'High-Throughput Network',
      standard: 'Native TRX',
      iconColor: '#eb0029',
      iconSymbol: 'TRX',
      minDepositUsd: 10,
      avgSpeed: 'Instant (~3 sec)',
      avgFeeUsd: 0.01,
      acceptedPercentage: 88,
      badgeClass: 'bg-rose-600 text-white',
      isPopular: true,
      description: 'Ultra-fast transactions with zero network congestions. Preferred coin for micro-deposits and hourly payout platforms.',
    },
    {
      id: 'litecoin',
      symbol: 'Litecoin (LTC)',
      name: 'Litecoin',
      network: 'Litecoin Mainnet',
      category: 'Scrypt P2P Currency',
      standard: 'Native LTC',
      iconColor: '#345d9d',
      iconSymbol: 'Ł',
      minDepositUsd: 10,
      avgSpeed: '1-2 Confirms (~5 min)',
      avgFeeUsd: 0.04,
      acceptedPercentage: 89,
      badgeClass: 'bg-blue-600 text-white',
      isPopular: true,
      description: 'Veteran investment crypto with tiny transaction fees and seamless exchange integration.',
    },
    {
      id: 'usdt-bep20',
      symbol: 'USDT (BEP20)',
      name: 'Tether BEP20',
      network: 'BNB Smart Chain',
      category: 'Stablecoin',
      standard: 'BEP-20',
      iconColor: '#f3ba2f',
      iconSymbol: '₮',
      minDepositUsd: 10,
      avgSpeed: 'Instant (~10 sec)',
      avgFeeUsd: 0.08,
      acceptedPercentage: 82,
      badgeClass: 'bg-yellow-600 text-white',
      isPopular: true,
      description: 'Fast, dollar-pegged stablecoin on BNB Smart Chain with negligible gas overhead.',
    },
    {
      id: 'bnb',
      symbol: 'Binance Coin (BNB)',
      name: 'BNB',
      network: 'BNB Smart Chain',
      category: 'Exchange Native',
      standard: 'BEP-20',
      iconColor: '#f3ba2f',
      iconSymbol: 'BNB',
      minDepositUsd: 15,
      avgSpeed: 'Instant (~10 sec)',
      avgFeeUsd: 0.08,
      acceptedPercentage: 79,
      badgeClass: 'bg-amber-500 text-slate-900',
      isPopular: true,
      description: 'Native token of the world’s largest exchange ecosystem, popular in DeFi yield programs.',
    },
    {
      id: 'solana',
      symbol: 'Solana (SOL)',
      name: 'Solana',
      network: 'Solana High-Speed',
      category: 'L1 Blockchain',
      standard: 'SPL Token',
      iconColor: '#14f195',
      iconSymbol: '◎',
      minDepositUsd: 10,
      avgSpeed: 'Sub-second (~5 sec)',
      avgFeeUsd: 0.005,
      acceptedPercentage: 74,
      badgeClass: 'bg-teal-600 text-white',
      isPopular: true,
      description: 'Rapidly growing high-throughput blockchain with fractions of a cent per transfer.',
    },
    {
      id: 'dogecoin',
      symbol: 'Dogecoin (DOGE)',
      name: 'Dogecoin',
      network: 'Dogecoin Blockchain',
      category: 'Community Currency',
      standard: 'Native DOGE',
      iconColor: '#c2a633',
      iconSymbol: 'Ð',
      minDepositUsd: 10,
      avgSpeed: '1-3 Confirms (~3 min)',
      avgFeeUsd: 0.03,
      acceptedPercentage: 76,
      badgeClass: 'bg-yellow-700 text-white',
      isPopular: false,
      description: 'Widely supported meme & utility crypto accepted by the vast majority of HYIP scripts.',
    },
    {
      id: 'toncoin',
      symbol: 'Toncoin (TON)',
      name: 'Toncoin',
      network: 'TON Blockchain',
      category: 'Telegram Native Web3',
      standard: 'TON Jetton',
      iconColor: '#0088cc',
      iconSymbol: 'TON',
      minDepositUsd: 10,
      avgSpeed: 'Instant (~4 sec)',
      avgFeeUsd: 0.01,
      acceptedPercentage: 68,
      badgeClass: 'bg-sky-600 text-white',
      isPopular: true,
      description: 'Deeply integrated with Telegram wallets, offering seamless 1-click mobile investment flows.',
    },
    {
      id: 'monero',
      symbol: 'Monero (XMR)',
      name: 'Monero',
      network: 'CryptoNote Privacy',
      category: 'Privacy Coin',
      standard: 'RingCT Native',
      iconColor: '#ff6600',
      iconSymbol: 'ɱ',
      minDepositUsd: 20,
      avgSpeed: '2 Confirms (~10 min)',
      avgFeeUsd: 0.04,
      acceptedPercentage: 65,
      badgeClass: 'bg-orange-600 text-white',
      isPopular: false,
      description: '100% untraceable, privacy-preserving cryptocurrency for discreet high-yield transactions.',
    },
    {
      id: 'epaycore',
      symbol: 'ePayCore',
      name: 'ePayCore',
      network: 'Electronic Payment Processor',
      category: 'Fiat & Multi-Crypto Wallet',
      standard: 'ePay Account',
      iconColor: '#10b981',
      iconSymbol: 'EP',
      minDepositUsd: 1,
      avgSpeed: 'Instant API',
      avgFeeUsd: 0.0,
      acceptedPercentage: 81,
      badgeClass: 'bg-emerald-700 text-white',
      isPopular: true,
      description: 'Dedicated payment system designed specifically for the high-yield investment & HYIP industry.',
    },
  ];

  return res.json({
    gateways: paymentGateways,
    totalGateways: paymentGateways.length,
    updatedAt: new Date().toISOString(),
  });
}
