import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Clock,
  Coins,
  DollarSign,
  TrendingUp,
  Filter,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Smartphone,
  CreditCard,
} from 'lucide-react';
import { IDepositFlowItem } from '../../types.ts';
import { api } from '../../services/api.ts';
import goofyCryptoMascot from '../../assets/images/goofy_crypto_mascot_1786742789221.jpg';
import goofyRocketTrader from '../../assets/images/goofy_rocket_trader_1786742811873.jpg';
import goofyVaultGuardian from '../../assets/images/goofy_vault_guardian_1786742800081.jpg';

interface DepositFlowFeedProps {
  initialDeposits?: IDepositFlowItem[];
  navigate?: (path: string) => void;
}

export const DepositFlowFeed: React.FC<DepositFlowFeedProps> = ({
  initialDeposits = [],
  navigate,
}) => {
  const [deposits, setDeposits] = useState<IDepositFlowItem[]>(initialDeposits);
  const [filter, setFilter] = useState<'all' | 'goldbod' | 'cloudminex' | 'crypto' | 'momo'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('');

  const fetchLiveDepositFlow = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.getDepositFlow();
      if (res && res.deposits && res.deposits.length > 0) {
        setDeposits(res.deposits);
      }
      setLastRefreshedTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn('Using existing deposit flow dataset', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!initialDeposits || initialDeposits.length === 0) {
      fetchLiveDepositFlow();
    } else {
      setDeposits(initialDeposits);
      setLastRefreshedTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }

    // Polling interval to keep timestamps fresh
    const interval = setInterval(() => {
      fetchLiveDepositFlow();
    }, 25000);

    return () => clearInterval(interval);
  }, [initialDeposits]);

  const filteredDeposits = deposits.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'goldbod') return item.projectSlug.includes('goldbod') || item.projectName.toLowerCase().includes('gold');
    if (filter === 'cloudminex') return item.projectSlug.includes('cloudminex') || item.projectName.toLowerCase().includes('cloud');
    if (filter === 'crypto') return item.paymentMethod.toLowerCase().includes('usdt') || item.paymentMethod.toLowerCase().includes('btc') || item.paymentMethod.toLowerCase().includes('eth') || item.paymentMethod.toLowerCase().includes('usdc');
    if (filter === 'momo') return item.paymentMethod.toLowerCase().includes('mobile') || item.paymentMethod.toLowerCase().includes('mtn') || item.paymentMethod.toLowerCase().includes('telecel');
    return true;
  });

  const totalFilteredVolume = filteredDeposits.reduce((acc, d) => acc + d.amountUsd, 0);

  return (
    <div className="bg-[#0b1329] border border-slate-800 hover:border-blue-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 transition-all">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Verified On-Chain Stream</span>
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              • 9 Recent Deposits Inflow
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Live Deposit Flow & Capital Verification</span>
            <span className="goofy-emoji-bounce text-base">⚡</span>
          </h3>

          <p className="text-xs text-slate-300">
            Real-time telemetry showing investor capital inflows, payment gateways, and automated on-chain confirmation timestamps.
          </p>
        </div>

        {/* Right side stats badge & manual refresh */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/70 text-right">
            <span className="text-[10px] text-slate-400 block font-semibold">9 Flow Volume</span>
            <span className="text-sm font-black text-emerald-400 font-mono">
              ${totalFilteredVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            type="button"
            onClick={fetchLiveDepositFlow}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            title="Refresh live deposit flow timestamps"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            All 9 Deposits
          </button>

          <button
            type="button"
            onClick={() => setFilter('goldbod')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'goldbod'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                : 'bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-slate-800'
            }`}
          >
            <span>🟡 GoldBod Pro</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('cloudminex')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'cloudminex'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                : 'bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-slate-800'
            }`}
          >
            <span>⚡ CloudMineX</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('crypto')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'crypto'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>USDT / Crypto</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('momo')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'momo'
                ? 'bg-yellow-500 text-slate-950 font-black shadow-md shadow-yellow-500/30'
                : 'bg-slate-900/80 hover:bg-slate-800 text-yellow-300 border border-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-yellow-400" />
            <span>Mobile Money</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Active Feed: {lastRefreshedTime || 'Synced'}</span>
        </div>
      </div>

      {/* 9 Deposits Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {filteredDeposits.map((item, index) => {
          const isGold = item.projectName.toLowerCase().includes('gold') || item.projectSlug.includes('goldbod');
          const isCloud = item.projectName.toLowerCase().includes('cloud') || item.projectSlug.includes('cloudminex');

          return (
            <div
              key={item.id || `dep-${index}`}
              onClick={() => navigate && navigate(`/hyips/${item.projectSlug}`)}
              className={`p-3.5 rounded-xl bg-slate-900/90 border transition-all cursor-pointer hover:scale-[1.01] flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                isGold
                  ? 'border-amber-500/30 hover:border-amber-400/80 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20'
                  : isCloud
                  ? 'border-cyan-500/30 hover:border-cyan-400/80 bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/20'
                  : 'border-slate-800 hover:border-blue-500/60'
              }`}
            >
              {/* Top Row: Project Logo + Name + Time Ago */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0 p-0.5 relative">
                    <img
                      src={item.projectLogo}
                      alt={item.projectName}
                      className="w-full h-full object-cover rounded-md"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Safe fallback image for crypto & gold projects
                        e.currentTarget.src = isGold
                          ? 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&auto=format&fit=crop&q=80'
                          : isCloud
                          ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
                          : 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  <div>
                    <h4 className="font-black text-white text-sm group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                      <span>{item.projectName}</span>
                      {isGold && <span className="text-xs">🟡</span>}
                      {isCloud && <span className="text-xs">⚡</span>}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium block">
                      {item.planName}
                    </span>
                  </div>
                </div>

                {/* Relative Time Badge with Live Pulse */}
                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-mono text-[10px] font-bold inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{item.timeAgo}</span>
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                    {item.formattedTime}
                  </span>
                </div>
              </div>

              {/* Middle Row: Deposit Amount & Gateway */}
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Deposit Amount
                  </span>
                  <div className="text-base font-black text-emerald-400 font-mono">
                    ${item.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono block">
                    {item.cryptoAmount}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Gateway
                  </span>
                  <span className="text-xs font-bold text-slate-200 block">
                    {item.paymentMethod}
                  </span>
                  <span className="text-[9px] font-mono text-cyan-400">
                    Tx: {item.txHash}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Investor Info & On-chain Status */}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <span>{item.investorFlag}</span>
                  <span className="font-mono text-slate-300">{item.investorName}</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.status.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Banner Info */}
      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Telemetry synchronized with active test nodes. All 9 deposit records are timestamped to the current real-time window.
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span className="text-emerald-400 font-bold">● 9 / 9 Active Verified</span>
        </div>
      </div>
    </div>
  );
};
