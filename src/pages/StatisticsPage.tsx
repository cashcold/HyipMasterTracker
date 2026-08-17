import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  PieChart,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Radio,
  MessageSquare,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { GlobalMarketActivityChart } from '../components/statistics/GlobalMarketActivityChart.tsx';
import { DepositFlowFeed } from '../components/statistics/DepositFlowFeed.tsx';

export const StatisticsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getStatistics()
      .then((res) => setStats(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-400 text-xs">
        Loading analytics engine...
      </div>
    );
  }

  const summary = {
    totalProjects: Number(stats?.summary?.totalProjects ?? 0),
    payingProjects: Number(stats?.summary?.payingProjects ?? stats?.summary?.paying ?? 0),
    problemProjects: Number(stats?.summary?.problemProjects ?? stats?.summary?.problem ?? 0),
    notPaidProjects: Number(stats?.summary?.notPaidProjects ?? stats?.summary?.notPaid ?? 0),
    totalReviews: Number(stats?.summary?.totalReviews ?? 0),
    totalMonitors: Number(stats?.summary?.totalMonitors ?? 0),
  };
  const statusDist = Array.isArray(stats?.statusDistribution) ? stats.statusDistribution : [];
  const riskDist = Array.isArray(stats?.riskDistribution) ? stats.riskDistribution : [];
  const categoryStats = Array.isArray(stats?.categoryStats) ? stats.categoryStats : [];
  const dailyDepositActivity = Array.isArray(stats?.dailyDepositActivity) ? stats.dailyDepositActivity : [];

  const payingRate = summary.totalProjects > 0 ? ((summary.payingProjects / summary.totalProjects) * 100).toFixed(1) : '0.0';
  const alertsCount = (summary.problemProjects || 0) + (summary.notPaidProjects || 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-semibold">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Platform Analytics & Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Platform Statistics & Industry Insights
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Aggregated quantitative data covering HYIP solvency ratios, risk distribution curves, and program lifespan averages.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 text-center space-y-1 hover:border-slate-700 transition-all group">
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
            <Layers className="w-3 h-3 text-slate-400" />
            <span>Programs</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-2xl font-black text-white block group-hover:scale-105 transition-transform">
              {summary.totalProjects}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-center space-y-1 hover:border-emerald-500/50 transition-all group">
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-emerald-400">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Paying Rate</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-2xl font-black text-emerald-300 block group-hover:scale-105 transition-transform">
              {payingRate}%
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-center space-y-1 hover:border-amber-500/50 transition-all group">
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-amber-400">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Alerts Logged</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-2xl font-black text-amber-300 block group-hover:scale-105 transition-transform">
              {alertsCount}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 text-center space-y-1 hover:border-purple-500/40 transition-all group">
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
            <MessageSquare className="w-3 h-3 text-purple-400" />
            <span>Reviews</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-2xl font-black text-purple-400 block group-hover:scale-105 transition-transform">
              {summary.totalReviews}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 text-center space-y-1 hover:border-blue-500/40 transition-all group">
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
            <Radio className="w-3 h-3 text-blue-400" />
            <span>Monitors</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-2xl font-black text-blue-400 block group-hover:scale-105 transition-transform">
              {summary.totalMonitors}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 text-center space-y-1 hover:border-emerald-500/40 transition-all group">
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Avg Risk</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-2xl font-black text-emerald-400 block group-hover:scale-105 transition-transform">
              6.8 <span className="text-xs text-slate-400 font-normal">/ 10</span>
            </span>
          </div>
        </div>
      </div>

      {/* D3 DYNAMIC GLOBAL HYIP MARKET ACTIVITY LINE CHART */}
      <GlobalMarketActivityChart
        data={dailyDepositActivity}
        summary={summary}
      />

      {/* 9 VERIFIED LIVE DEPOSIT FLOW STREAM */}
      <DepositFlowFeed
        initialDeposits={stats?.depositFlow}
        navigate={navigate}
      />

      {/* Visual Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-400" />
              <span>HYIP Status Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Consensus</span>
          </div>

          <div className="space-y-3">
            {statusDist.map((s: any, idx: number) => {
              const statusName = s.status || s.name || `Status-${idx}`;
              const count = Number(s.count || 0);
              const pct = summary.totalProjects > 0 ? (count / summary.totalProjects) * 100 : 0;
              let barColor = 'bg-slate-500';
              let dotColor = 'bg-slate-400';
              if (statusName === 'PAYING') { barColor = 'bg-emerald-500'; dotColor = 'bg-emerald-400'; }
              if (statusName === 'WAITING') { barColor = 'bg-sky-500'; dotColor = 'bg-sky-400'; }
              if (statusName === 'PROBLEM') { barColor = 'bg-amber-500'; dotColor = 'bg-amber-400'; }
              if (statusName === 'NOT PAID') { barColor = 'bg-rose-500'; dotColor = 'bg-rose-400'; }
              if (statusName === 'CLOSED') { barColor = 'bg-zinc-600'; dotColor = 'bg-zinc-500'; }

              return (
                <div key={statusName} className="space-y-1 text-xs group">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-300 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                      <span>{statusName}</span>
                    </span>
                    <span className="text-slate-400 font-mono">
                      {count} <strong className="text-slate-200 font-semibold">({pct.toFixed(1)}%)</strong>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Score Distribution */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Risk Score Distribution</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Algorithmic</span>
          </div>

          <div className="space-y-3">
            {riskDist.map((r: any, idx: number) => {
              const rangeKey = r.range || r.label || r.name || `Risk-${idx}`;
              const label = r.label || r.name || 'Risk Tier';
              const range = r.range ? `(${r.range})` : '';
              const count = Number(r.count || 0);
              const pct = summary.totalProjects > 0 ? (count / summary.totalProjects) * 100 : 0;
              return (
                <div key={rangeKey} className="space-y-1 text-xs group">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-300 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-blue-400" />
                      <span>{label} {range}</span>
                    </span>
                    <span className="text-slate-400 font-mono">
                      {count} <strong className="text-slate-200 font-semibold">({pct.toFixed(1)}%)</strong>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Top Program Categories Monitored</span>
          </h3>
          <span className="text-[11px] text-slate-400">Live Monitored Directory</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryStats.map((c: any, idx: number) => {
            const categoryName = c.category || `Category-${idx}`;
            const count = Number(c.count || c.totalProjects || 0);
            return (
              <div key={categoryName} className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-center hover:border-slate-700 transition-colors group">
                <span className="text-xs font-bold text-slate-200 block truncate">
                  {categoryName}
                </span>
                <span className="text-sm font-black text-blue-400 mt-1 block group-hover:scale-105 transition-transform">
                  {count} Listings
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
