import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  TrendingUp,
  Send,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Search,
  Sparkles,
  Zap,
  Clock,
  Layers,
  Award,
  BarChart3,
  ExternalLink,
  DollarSign,
  Coins,
  Cpu,
  Headphones,
  FileCheck2,
  Globe,
  AlertOctagon,
} from 'lucide-react';
import { IProject, ICryptoRate, IDepositFlowItem } from '../types.ts';
import { api } from '../services/api.ts';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { StatusSparkline } from '../components/common/StatusSparkline.tsx';
import { CryptoRateCards } from '../components/crypto/CryptoRateCards.tsx';
import { GlobalMarketActivityChart, IDailyDepositActivity } from '../components/statistics/GlobalMarketActivityChart.tsx';
import { DepositFlowFeed } from '../components/statistics/DepositFlowFeed.tsx';
import goofyMultiMonitor from '../assets/images/goofy_multi_monitor_1786739618118.jpg';
import goofyRiskScore from '../assets/images/goofy_risk_score_1786739631521.jpg';
import goofyHumanSupport from '../assets/images/goofy_human_support_1786739642560.jpg';
import goofyInsuranceVault from '../assets/images/goofy_insurance_vault_1786739654102.jpg';
import goofyVaultGuardian from '../assets/images/goofy_vault_guardian_1786742800081.jpg';
import goofyCryptoMascot from '../assets/images/goofy_crypto_mascot_1786742789221.jpg';
import goofyRocketTrader from '../assets/images/goofy_rocket_trader_1786742811873.jpg';

interface LandingPageProps {
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  const [featuredProjects, setFeaturedProjects] = useState<IProject[]>([]);
  const [cryptoRates, setCryptoRates] = useState<ICryptoRate[]>([]);
  const [marketActivity, setMarketActivity] = useState<IDailyDepositActivity[]>([]);
  const [marketSummary, setMarketSummary] = useState<any>(null);
  const [depositFlow, setDepositFlow] = useState<IDepositFlowItem[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 9,
    payingCount: 5,
    problemCount: 2,
    monitorsScanned: 18,
    avgUptime: 98.4,
  });
  const [loading, setLoading] = useState(true);

  const telegramHandle = 'hyipmastertracker';
  const telegramLink = `https://t.me/${telegramHandle}`;
  const whatsappLink = `https://wa.me/?text=Hello%20HyipMasterTracker%20Team%2C%20I%20would%20like%20to%20inquire%20about%20your%20monitoring%20and%20listing%20services`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, ratesData, statsData] = await Promise.all([
          api.getProjects({ limit: '6' }).catch(() => ({
            projects: [] as IProject[],
            pagination: { page: 1, limit: 6, total: 48, totalPages: 1 },
            stats: { total: 48, paying: 36, waiting: 8, problem: 4, notPaid: 0, closed: 0 },
          })),
          api.getCryptoRates().catch(() => ({ rates: [] as ICryptoRate[] })),
          api.getStatistics().catch(() => null),
        ]);

        if (ratesData.rates && ratesData.rates.length > 0) {
          setCryptoRates(ratesData.rates);
        }

        if (statsData) {
          if (statsData.dailyDepositActivity && statsData.dailyDepositActivity.length > 0) {
            setMarketActivity(statsData.dailyDepositActivity);
          }
          if (statsData.summary) {
            setMarketSummary(statsData.summary);
          }
          if (statsData.depositFlow && statsData.depositFlow.length > 0) {
            setDepositFlow(statsData.depositFlow);
          }
        }

        if (data.projects && data.projects.length > 0) {
          setFeaturedProjects(data.projects);
          const paying = data.stats?.paying ?? data.projects.filter((p: IProject) => p.status === 'PAYING').length;
          const problem = (data.stats?.problem ?? 0) + (data.stats?.notPaid ?? 0);
          setStats((prev) => ({
            ...prev,
            totalProjects: data.pagination?.total || data.projects.length || 48,
            payingCount: paying || 36,
            problemCount: problem || 4,
          }));
        }
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 pb-8 sm:pb-12 rounded-3xl bg-gradient-to-b from-slate-900 via-[#0f172a] to-[#0b1120] border border-slate-800 shadow-2xl px-4 sm:px-8">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-10 w-[300px] h-[200px] bg-emerald-500/10 blur-[90px] pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* High-Trust Institutional Insurance Assurance Capsule with Animated Goofy Mascots */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-emerald-500/20 border border-amber-400/50 shadow-lg text-xs text-amber-200 backdrop-blur-xs">
              {/* Goofy Mascot Trio Mini Badges */}
              <div className="flex items-center -space-x-2">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-400 goofy-img-animated-1 shadow-xs bg-slate-950">
                  <img src={goofyVaultGuardian} alt="Vault Guardian" className="w-full h-full object-cover" />
                </div>
                <div className="w-6 h-6 rounded-full overflow-hidden border border-emerald-400 goofy-img-animated-2 shadow-xs bg-slate-950">
                  <img src={goofyCryptoMascot} alt="Crypto Mascot" className="w-full h-full object-cover" />
                </div>
                <div className="w-6 h-6 rounded-full overflow-hidden border border-cyan-400 goofy-img-animated-3 shadow-xs bg-slate-950">
                  <img src={goofyRocketTrader} alt="Rocket Trader" className="w-full h-full object-cover" />
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-black tracking-wide text-white uppercase">
                HyipMasterTracker Insurance Coverage
              </span>
              <span className="text-amber-300 font-bold hidden sm:inline">• $75,000 Verified Protection Fund</span>
              <Lock className="w-3.5 h-3.5 text-emerald-400 ml-1" />
            </div>
          </div>

          {/* Status Capsule */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 shadow-inner text-xs text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold">Live Multi-Monitor Payout Telemetry v3.4</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <span className="goofy-emoji-bounce inline-block text-xs">⚡</span>
              <span>24/7 Verified</span>
            </span>
          </div>

          {/* Main Headline with Animated Mascot Flairs */}
          <div className="relative">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Verified HYIP Telemetry & <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                Algorithmic Risk Intelligence
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Eliminate guesswork in high-yield investing. HyipMasterTracker aggregates multi-monitor consensus, analyzes test wallet withdrawal speeds, and calculates mathematical safety scores in real time.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => navigate('/hyips')}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02] cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Explore Live Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={telegramLink}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#0088cc]/20 hover:scale-[1.02] cursor-pointer"
            >
              <Send className="w-4 h-4 -rotate-45" />
              <span>Join Telegram Alerts</span>
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3.5 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#25d366]/20 hover:scale-[1.02] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Desk</span>
            </a>
          </div>

          {/* DYNAMIC D3 GLOBAL HYIP MARKET ACTIVITY CHART */}
          <div className="pt-6 text-left">
            <GlobalMarketActivityChart
              data={marketActivity}
              summary={marketSummary}
            />
          </div>

          {/* 9 VERIFIED LIVE DEPOSIT FLOW STREAM */}
          <div className="pt-4 text-left">
            <DepositFlowFeed
              initialDeposits={depositFlow}
              navigate={navigate}
            />
          </div>

          {/* Live Telemetry Ticker Cards with Animated Goofy Mascot Avatars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 max-w-4xl mx-auto">
            {/* 1. Monitored Programs */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 rounded-2xl p-4 text-center shadow-lg relative overflow-hidden group transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-center mb-2.5">
                <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 flex items-center justify-center shadow-md relative overflow-hidden">
                  <img src={goofyVaultGuardian} alt="Programs Mascot" className="w-full h-full object-cover goofy-img-animated-1" />
                </div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Programs
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                {stats.totalProjects}
              </span>
              <span className="text-[10px] text-blue-400 block mt-0.5 font-semibold">
                Active in Directory
              </span>
            </div>

            {/* 2. Paying Consensus */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-4 text-center shadow-lg relative overflow-hidden group transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-center mb-2.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-md relative overflow-hidden">
                  <img src={goofyCryptoMascot} alt="Paying Mascot" className="w-full h-full object-cover goofy-img-animated-2" />
                </div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Paying Consensus
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block">
                {stats.payingCount}
              </span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5 font-semibold">
                Verified Payouts
              </span>
            </div>

            {/* 3. Multi-Monitor Feeds */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/60 rounded-2xl p-4 text-center shadow-lg relative overflow-hidden group transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-center mb-2.5">
                <div className="w-12 h-12 rounded-xl bg-sky-950/80 border border-sky-500/40 text-sky-400 flex items-center justify-center shadow-md relative overflow-hidden">
                  <img src={goofyRocketTrader} alt="Monitor Mascot" className="w-full h-full object-cover goofy-img-animated-3" />
                </div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Multi-Monitor Feeds
              </span>
              <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono block">
                18+
              </span>
              <span className="text-[10px] text-sky-400/80 block mt-0.5 font-semibold">
                Cross-Verified Sources
              </span>
            </div>

            {/* 4. Scam Alerts Logged */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/60 rounded-2xl p-4 text-center shadow-lg relative overflow-hidden group transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-center mb-2.5">
                <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-md relative overflow-hidden">
                  <AlertOctagon className="w-6 h-6 text-rose-400 goofy-emoji-pulse" />
                </div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Scam Alerts Logged
              </span>
              <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono block">
                {stats.problemCount}
              </span>
              <span className="text-[10px] text-rose-400/80 block mt-0.5 font-semibold">
                Instant Flagging
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE CAPABILITIES & INTELLIGENCE ARCHITECTURE */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Industrial Grade Security Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How We Protect Your Capital
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Unlike static banner directories, HyipMasterTracker runs continuous automated algorithmic checks and manual payment verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Multi-Monitor Consensus with Goofy Multi Monitor Image */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-blue-500/50 hover:shadow-blue-900/20 transition-all duration-300 group flex flex-col justify-between">
            <div>
              {/* Goofy Multi-Monitor Header Image Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                <img
                  src={goofyMultiMonitor}
                  alt="Multi-Monitor Consensus Goofy Art"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-black/30" />
                
                {/* Floating High-Finance Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/90 border border-blue-500/60 text-blue-300 text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
                  <Activity className="w-3 h-3 text-blue-400" />
                  <span>18+ Hubs Scanned</span>
                </div>

                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-600/80 text-white border border-blue-400/50 text-[10px] font-bold shadow-md backdrop-blur-xs">
                    Polls Every 15m
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span>Multi-Monitor Consensus</span>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We poll over 18 global monitoring hubs (AllHyipMonitors, List4Hyip, HyipLogs, MyHyip) every 15 minutes to confirm verified payout statuses across multiple independent test accounts.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <ul className="space-y-1.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Aggregated status voting consensus</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Automatic downgrade on first delayed payout</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Algorithmic Risk Score with Goofy Risk Score Image */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-emerald-500/50 hover:shadow-emerald-900/20 transition-all duration-300 group flex flex-col justify-between">
            <div>
              {/* Goofy Risk Score Header Image Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                <img
                  src={goofyRiskScore}
                  alt="Algorithmic Risk Score Goofy Art"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-black/30" />
                
                {/* Floating High-Finance Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/90 border border-emerald-500/60 text-emerald-300 text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Score 0 - 100</span>
                </div>

                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-600/80 text-white border border-emerald-400/50 text-[10px] font-bold shadow-md backdrop-blur-xs">
                    Risk Engine v4.2
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Algorithmic Risk Score (0-100)</span>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our proprietary scoring engine grades domain lifespan, SSL quality, script originality (GoldCoders/Custom), daily interest sustainability, and deposit insurance coverage.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <ul className="space-y-1.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Weighted yield sustainability analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Automated high-risk flags & alerts</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Direct Human Moderation with Goofy Human Support Image */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/50 hover:shadow-amber-900/20 transition-all duration-300 group flex flex-col justify-between">
            <div>
              {/* Goofy Human Support Header Image Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                <img
                  src={goofyHumanSupport}
                  alt="Direct Human Moderation Goofy Art"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-black/30" />
                
                {/* Floating High-Finance Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/90 border border-amber-500/60 text-amber-300 text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Human Admin Desk</span>
                </div>

                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-600/80 text-white border border-amber-400/50 text-[10px] font-bold shadow-md backdrop-blur-xs">
                    Fast Live Response
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-amber-400" />
                    <span>Direct Human Moderation</span>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No robot delays or automated black holes. Contact our head admin desk directly on Telegram and WhatsApp for instant project status updates, banner ads, and dispute resolution.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <ul className="space-y-1.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a
                    href={`https://t.me/${telegramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 transition-colors font-semibold"
                  >
                    Telegram: @{telegramHandle}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Verified editorial review & insurance escrow</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TOP PAYING PROGRAMS PREVIEW */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Award className="w-4 h-4" />
              <span>TOP RANKED PROGRAMS</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Highest Ranked Paying Opportunities
            </h2>
            <p className="text-xs text-slate-400">
              Ranked by verified payout history, risk score, and monitoring continuity.
            </p>
          </div>

          <button
            onClick={() => navigate('/hyips')}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View All Programs ({stats.totalProjects})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProjects.slice(0, 6).map((project) => {
            const logo = project.logo || (project as any).logoUrl;
            const primaryPlan = project.plans && project.plans.length > 0 ? project.plans[0] : null;
            const yieldText = (project as any).dailyProfit || (primaryPlan ? primaryPlan.advertisedReturn : '1.5% - 3.0%');
            const minDeposit = project.minInvestment || (project as any).minDeposit || 20;

            return (
              <div
                key={project.id}
                onClick={() => navigate(`/hyips/${project.slug || project.id}`)}
                className="bg-[#111827] border border-slate-800 hover:border-blue-500/60 rounded-2xl p-5 shadow-xl transition-all cursor-pointer space-y-3.5 flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {logo ? (
                        <img
                          src={logo}
                          alt={project.name}
                          className="w-7 h-7 rounded-lg object-cover bg-slate-900 p-0.5 border border-slate-800"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const isGold = project.name.toLowerCase().includes('gold');
                            const isCloud = project.name.toLowerCase().includes('cloud');
                            e.currentTarget.src = isGold
                              ? 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&auto=format&fit=crop&q=80'
                              : isCloud
                              ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
                              : 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-blue-900/50 text-blue-300 font-bold flex items-center justify-center text-xs">
                          {project.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                          {project.name}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono block">
                          {project.domain || 'Verified Program'}
                        </span>
                      </div>
                    </div>

                    <StatusBadge status={project.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Daily Yield</span>
                      <span className="font-bold text-emerald-400 font-mono text-xs">
                        {yieldText}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Risk Rating</span>
                      <span className="font-bold text-sky-400 font-mono text-xs">
                        {project.riskScore ? `${project.riskScore}/100` : 'Low Risk'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <StatusSparkline
                      status={project.status}
                      createdAt={project.createdAt || project.dateAdded}
                      isMini={true}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Min Deposit: <strong className="text-slate-200">${minDeposit}</strong>
                  </span>
                  <span className="font-bold text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                    View Telemetry →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CRYPTOCURRENCY LIVE RATES & NETWORK DETAILS CARDS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider">
                Real-Time Feeds
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Live Cryptocurrency Exchange Rates & Network Details
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Spot prices, 24h highs/lows, on-chain confirmation times, and average transaction fees for accepted investment payment gateways.
            </p>
          </div>

          <button
            onClick={() => navigate('/hyips')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Monitored HYIPs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {cryptoRates.length > 0 ? (
          <CryptoRateCards
            rates={cryptoRates}
            isDarkTheme={true}
            onSelectPayment={(symbol) => {
              navigate('/hyips');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 bg-slate-900 border border-slate-800 rounded-sm" />
            ))}
          </div>
        )}
      </section>

      {/* 5. DIRECT CONTACT DESK (TELEGRAM & WHATSAPP) */}
      <section className="bg-gradient-to-br from-slate-900 to-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Direct Human Access Only</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Connect With Our Editorial & Admin Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Need to list a program, book premium homepage banners, report a delayed payout, or dispute a status? Chat with our team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2">
          {/* Telegram Action Card */}
          <a
            href={telegramLink}
            target="_blank"
            rel="noreferrer"
            className="group p-5 rounded-2xl bg-slate-900/90 border border-[#0088cc]/30 hover:border-[#0088cc] hover:bg-[#0088cc]/5 transition-all flex items-center justify-between gap-4 shadow-lg"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#0088cc] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Send className="w-6 h-6 -rotate-45" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Telegram Channel</span>
                <span className="text-xs text-[#0088cc] font-mono block">@{telegramHandle}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Instant live response</span>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-[#0088cc] text-white text-xs font-bold group-hover:bg-[#0077b5] shrink-0">
              Open Chat →
            </span>
          </a>

          {/* WhatsApp Action Card */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="group p-5 rounded-2xl bg-slate-900/90 border border-[#25d366]/30 hover:border-[#25d366] hover:bg-[#25d366]/5 transition-all flex items-center justify-between gap-4 shadow-lg"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#25d366] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">WhatsApp Support</span>
                <span className="text-xs text-[#25d366] font-mono block">Direct Admin Line</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">24/7 fast messaging</span>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-[#25d366] text-white text-xs font-bold group-hover:bg-[#1ebd5a] shrink-0">
              Chat on WA →
            </span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
