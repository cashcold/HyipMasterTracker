import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  Clock,
  Fuel,
  DollarSign,
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info,
  Zap,
} from 'lucide-react';
import { ICryptoRate } from '../../types.ts';

interface CryptoRateCardsProps {
  rates: ICryptoRate[];
  selectedPayment?: string;
  onSelectPayment: (symbol: string) => void;
  isDarkTheme?: boolean;
}

export const CryptoRateCards: React.FC<CryptoRateCardsProps> = ({
  rates,
  selectedPayment,
  onSelectPayment,
  isDarkTheme = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'STABLE' | 'L1' | 'PRIVACY' | 'POPULAR'>('ALL');
  const [selectedCoinDetail, setSelectedCoinDetail] = useState<ICryptoRate | null>(null);

  // Helper to format currency numbers
  const formatMoney = (val: number) => {
    if (val >= 1_000_000_000_000) return `$${(val / 1_000_000_000_000).toFixed(2)}T`;
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  // Filter rates based on category & search
  const filteredRates = rates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.network.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'STABLE') {
      return ['USDT', 'USDC'].includes(c.symbol);
    }
    if (activeCategory === 'L1') {
      return ['BTC', 'ETH', 'SOL', 'BNB', 'TRX', 'LTC', 'ADA', 'TON', 'BCH'].includes(c.symbol);
    }
    if (activeCategory === 'PRIVACY') {
      return ['XMR'].includes(c.symbol);
    }
    if (activeCategory === 'POPULAR') {
      return c.popularityRank <= 6;
    }
    return true;
  });

  // Calculate range percentage for 24h High/Low bar
  const getRangePercentage = (price: number, low: number, high: number) => {
    if (high <= low) return 50;
    const pct = ((price - low) / (high - low)) * 100;
    return Math.min(Math.max(pct, 5), 95);
  };

  // Generate SVG path for sparkline
  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 110;
    const height = 32;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const strokeColor = isPositive ? '#10b981' : '#f43f5e';
    const fillColor = isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`grad-${points[0]}-${isPositive}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords.join(' ')}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-3">
      {/* SECTION HEADER & CONTROLS */}
      <div className="bg-[#1e293b] text-white p-3 rounded-t-sm shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-black">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase tracking-wide text-white">
                Live Cryptocurrency Market Rates & Network Details
              </h3>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-black uppercase tracking-wider">
                Live Feeds
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Real-time prices, 24h volatility, network gas fees, and transfer speeds for all accepted HYIP cryptos.
            </p>
          </div>
        </div>

        {/* Search & Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search coin or network..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded pl-8 pr-2.5 py-1 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded border border-slate-700 text-[10px] font-bold">
            {(['ALL', 'POPULAR', 'STABLE', 'L1', 'PRIVACY'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredRates.map((coin) => {
          const isPositive = coin.change24h >= 0;
          const rangePct = getRangePercentage(coin.priceUsd, coin.low24h, coin.high24h);
          const isSelected = selectedPayment && selectedPayment.toLowerCase().includes(coin.symbol.toLowerCase());

          return (
            <div
              key={coin.id}
              className={`${
                isDarkTheme
                  ? 'bg-[#111827] border-slate-800 text-white hover:border-blue-500/60'
                  : 'bg-white border-[#cbd5e1] hover:border-blue-400'
              } border rounded-sm p-3.5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20'
                  : ''
              }`}
            >
              {/* Card Top: Identity & 24h Badge */}
              <div>
                <div className={`flex items-start justify-between gap-2 mb-2 pb-2 border-b ${isDarkTheme ? 'border-slate-800' : 'border-[#e2e8f0]'}`}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white shadow-xs shrink-0"
                      style={{ backgroundColor: coin.iconColor }}
                    >
                      {coin.iconSymbol}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-black text-sm leading-tight ${isDarkTheme ? 'text-white' : 'text-[#1e293b]'}`}>
                          {coin.name}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${isDarkTheme ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {coin.symbol}
                        </span>
                      </div>
                      <span className={`text-[10px] block truncate max-w-[130px] ${isDarkTheme ? 'text-slate-400' : 'text-[#64748b]'}`} title={coin.network}>
                        {coin.network}
                      </span>
                    </div>
                  </div>

                  {/* Rank & 24h Change */}
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                        isPositive
                          ? isDarkTheme ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isDarkTheme ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isPositive ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
                      {isPositive ? '+' : ''}{coin.change24h}%
                    </span>
                    <span className="block text-[9px] font-mono text-slate-400 mt-0.5">
                      Rank #{coin.popularityRank}
                    </span>
                  </div>
                </div>

                {/* Price & Sparkline Row */}
                <div className="flex items-end justify-between gap-2 my-2.5">
                  <div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider block ${isDarkTheme ? 'text-slate-400' : 'text-[#64748b]'}`}>
                      Spot Price
                    </span>
                    <div className={`font-mono font-black text-lg leading-none ${isDarkTheme ? 'text-white' : 'text-[#0f172a]'}`}>
                      ${coin.priceUsd >= 1000 ? coin.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : coin.priceUsd >= 1 ? coin.priceUsd.toFixed(2) : coin.priceUsd.toFixed(4)}
                    </div>
                  </div>

                  {/* Mini Sparkline Chart */}
                  <div className="shrink-0 pt-1" title="7-Day Historical Trend">
                    {renderSparkline(coin.sparkline, isPositive)}
                  </div>
                </div>

                {/* 24h High / Low Range Indicator Bar */}
                <div className={`space-y-1 my-2 p-1.5 rounded border ${isDarkTheme ? 'bg-slate-900/90 border-slate-800' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                  <div className={`flex justify-between text-[10px] font-mono ${isDarkTheme ? 'text-slate-400' : 'text-[#64748b]'}`}>
                    <span>24h L: ${coin.low24h >= 1000 ? coin.low24h.toLocaleString() : coin.low24h}</span>
                    <span>24h H: ${coin.high24h >= 1000 ? coin.high24h.toLocaleString() : coin.high24h}</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden relative ${isDarkTheme ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div
                      className={`h-full rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${rangePct}%` }}
                    />
                  </div>
                </div>

                {/* Network & Transfer Details Grid */}
                <div className="grid grid-cols-2 gap-1.5 my-2.5 text-[11px]">
                  <div className={`p-1.5 rounded border ${isDarkTheme ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-[#f1f5f9] border-[#e2e8f0]'}`}>
                    <div className={`flex items-center gap-1 text-[10px] ${isDarkTheme ? 'text-slate-400' : 'text-[#64748b]'}`}>
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span>Confirm Speed</span>
                    </div>
                    <span className={`font-semibold text-[10px] block truncate ${isDarkTheme ? 'text-slate-100' : 'text-[#1e293b]'}`} title={coin.confirmationTime}>
                      {coin.confirmationTime}
                    </span>
                  </div>

                  <div className={`p-1.5 rounded border ${isDarkTheme ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-[#f1f5f9] border-[#e2e8f0]'}`}>
                    <div className={`flex items-center gap-1 text-[10px] ${isDarkTheme ? 'text-slate-400' : 'text-[#64748b]'}`}>
                      <Fuel className="w-3 h-3 text-amber-500" />
                      <span>Avg Transfer Fee</span>
                    </div>
                    <span className="font-semibold text-emerald-400 text-[10px] block truncate">
                      {coin.avgFee}
                    </span>
                  </div>

                  <div className={`p-1.5 rounded border ${isDarkTheme ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-[#f1f5f9] border-[#e2e8f0]'}`}>
                    <div className={`flex items-center gap-1 text-[10px] ${isDarkTheme ? 'text-slate-400' : 'text-[#64748b]'}`}>
                      <BarChart3 className="w-3 h-3 text-indigo-500" />
                      <span>24h Volume</span>
                    </div>
                    <span className={`font-mono font-bold text-[10px] ${isDarkTheme ? 'text-slate-100' : 'text-[#1e293b]'}`}>
                      {formatMoney(coin.volume24h)}
                    </span>
                  </div>

                  <div className={`p-1.5 rounded border ${isDarkTheme ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-[#f1f5f9] border-[#e2e8f0]'}`}>
                    <div className={`flex items-center gap-1 text-[10px] ${isDarkTheme ? 'text-slate-400' : 'text-[#64748b]'}`}>
                      <Layers className="w-3 h-3 text-purple-500" />
                      <span>Market Cap</span>
                    </div>
                    <span className={`font-mono font-bold text-[10px] ${isDarkTheme ? 'text-slate-100' : 'text-[#1e293b]'}`}>
                      {formatMoney(coin.marketCap)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`pt-2 border-t flex items-center gap-1.5 ${isDarkTheme ? 'border-slate-800' : 'border-[#e2e8f0]'}`}>
                <button
                  type="button"
                  onClick={() => onSelectPayment(coin.symbol)}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isDarkTheme ? 'bg-blue-600/90 hover:bg-blue-600 text-white' : 'bg-[#1e293b] text-white hover:bg-[#334155]'
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{isSelected ? 'Filtering HYIPs' : `Filter ${coin.symbol}`}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCoinDetail(coin)}
                  className={`p-1.5 rounded border cursor-pointer ${
                    isDarkTheme
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
                      : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] border-[#cbd5e1] text-[#475569] hover:text-[#1e293b]'
                  }`}
                  title="View Deep Network & Gateway Details"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED CRYPTO MODAL / POPUP */}
      {selectedCoinDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-lg w-full p-5 border border-slate-300 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg text-white shadow-md"
                  style={{ backgroundColor: selectedCoinDetail.iconColor }}
                >
                  {selectedCoinDetail.iconSymbol}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#1e293b] flex items-center gap-2">
                    <span>{selectedCoinDetail.name}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border">
                      {selectedCoinDetail.symbol}
                    </span>
                  </h3>
                  <p className="text-xs text-[#64748b]">{selectedCoinDetail.network}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCoinDetail(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Spot Price</span>
                <span className="text-sm font-mono font-black text-slate-900">
                  ${selectedCoinDetail.priceUsd.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">24h Change</span>
                <span className={`text-sm font-mono font-bold ${selectedCoinDetail.change24h >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {selectedCoinDetail.change24h >= 0 ? '+' : ''}{selectedCoinDetail.change24h}%
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Avg Speed</span>
                <span className="text-xs font-semibold text-slate-800">
                  {selectedCoinDetail.confirmationTime}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Typical Fee</span>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {selectedCoinDetail.avgFee}
                </span>
              </div>
            </div>

            {/* In-depth investment notes */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-blue-950">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>HYIP Cashier Compatibility:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-800">
                {selectedCoinDetail.symbol === 'BTC' && 'Universal acceptance across all investment platforms. High liquidity with automated node verification.'}
                {selectedCoinDetail.symbol === 'USDT' && 'Top recommended coin for zero exchange volatility and instant cashier processing on TRC20/BEP20.'}
                {selectedCoinDetail.symbol === 'ETH' && 'Standard for ERC-20 smart-contract automated payout gateways and decentralized liquidity pools.'}
                {selectedCoinDetail.symbol === 'TRX' && 'Lowest transfer fees (<$0.02) with 3-second block finality. Ideal for frequent dividend withdrawals.'}
                {selectedCoinDetail.symbol === 'LTC' && 'Low miner fees and high legacy script support across veteran HYIP operators.'}
                {selectedCoinDetail.symbol === 'SOL' && 'Sub-second finality with negligible fractions of a cent per deposit/payout transaction.'}
                {selectedCoinDetail.symbol === 'XMR' && 'Maximum privacy with untraceable ring signatures and stealth addresses for private portfolio holders.'}
                {!['BTC', 'USDT', 'ETH', 'TRX', 'LTC', 'SOL', 'XMR'].includes(selectedCoinDetail.symbol) && 'Widely supported across standard automated payment gateways and merchant APIs.'}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  onSelectPayment(selectedCoinDetail.symbol);
                  setSelectedCoinDetail(null);
                }}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Filter HYIPs Accepting {selectedCoinDetail.symbol}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
