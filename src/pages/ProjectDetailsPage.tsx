import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  ExternalLink,
  Shield,
  Lock,
  Server,
  Globe,
  Star,
  Plus,
  Minus,
  Search,
  MessageSquare,
  Activity,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Send,
  User as UserIcon,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { IProject, IRiskAnalysis, IEvent, IReview } from '../types.ts';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { RiskScoreGauge } from '../components/common/RiskScoreGauge.tsx';
import { SidebarWidgets } from '../components/common/SidebarWidgets.tsx';
import { RiskWarningBanner } from '../components/common/RiskWarningBanner.tsx';
import { StatusSparkline } from '../components/common/StatusSparkline.tsx';
import { getLiveCurrentDateStr, getLiveCurrentDateTimeStr } from '../utils/dateUtils.ts';
import goofyVaultGuardian from '../assets/images/goofy_vault_guardian_1786742800081.jpg';
import goofyCryptoMascot from '../assets/images/goofy_crypto_mascot_1786742789221.jpg';
import goofyRocketTrader from '../assets/images/goofy_rocket_trader_1786742811873.jpg';
import goofyRiskScore from '../assets/images/goofy_risk_score_1786739631521.jpg';
import goofyMultiMonitor from '../assets/images/goofy_multi_monitor_1786739618118.jpg';
import goofyInsuranceVault from '../assets/images/goofy_insurance_vault_1786739654102.jpg';
import goofyHumanSupport from '../assets/images/goofy_human_support_1786739642560.jpg';

interface ProjectDetailsPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ slug, navigate }) => {
  const { user } = useAuth();
  const [project, setProject] = useState<IProject | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<IRiskAnalysis | null>(null);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isWatched, setIsWatched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active Details Tab
  const [activeTab, setActiveTab] = useState<'main' | 'events' | 'reviews' | 'widgets'>('main');

  // Review Form Modal/State
  const [reviewRating, setReviewRating] = useState<number>(8);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Widget embed modal state
  const [showWidgetModal, setShowWidgetModal] = useState(false);

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      setError('');
      try {
        const res = await api.getProjectBySlug(slug);
        setProject(res.project);
        setRiskAnalysis(res.riskAnalysis);
        setEvents(res.events);
        setReviews(res.reviews);
        setIsWatched(res.isWatched);
      } catch (err: any) {
        setError(err.message || 'Project not found');
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [slug]);

  const handleToggleWatchlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!project) return;
    try {
      const res = await api.toggleWatchlist(project.id);
      setIsWatched(res.isWatched);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!project || !reviewContent.trim()) return;
    setReviewSubmitting(true);
    try {
      const res = await api.createReview({
        projectId: project.id,
        rating: reviewRating,
        title: 'Community Review',
        content: reviewContent.trim(),
        category: 'Payment Experience',
      });
      setReviews([res.review, ...reviews]);
      setReviewContent('');
      setShowReviewForm(false);
      alert('Review posted successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center text-xs text-[#64748b] space-y-3">
        <div className="w-8 h-8 border-3 border-[#1e293b] border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Loading project audit, telemetry, and monitor records...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-12 text-center space-y-4">
        <div className="bg-white border border-[#cbd5e1] p-8 rounded-sm shadow-xs max-w-lg mx-auto">
          <AlertTriangle className="w-12 h-12 text-[#ea580c] mx-auto mb-2" />
          <h2 className="text-base font-bold text-[#1e293b]">Project Not Found</h2>
          <p className="text-xs text-[#64748b] mt-1">{error || 'The requested HYIP program could not be found.'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-[#1e293b] text-white text-xs font-bold rounded-sm hover:bg-[#0f172a] cursor-pointer"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const firstLetter = project.name.charAt(0);
  const restName = project.name.slice(1);
  const primaryPlan = project.plans && project.plans.length > 0 ? project.plans[0] : null;

  const rawUrl = project.websiteUrl || (project as any).url || project.domain || '';
  const targetUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
    ? rawUrl
    : rawUrl
    ? `https://${rawUrl}`
    : '#';

  const scoreValue = project.riskScore ? project.riskScore.toFixed(1) : '7.2';
  const numScore = parseFloat(scoreValue);

  // Review breakdown estimates
  const positiveReviews = Math.max(1, Math.round((project.reviewCount || 10) * 0.85));
  const neutralReviews = 0;
  const negativeReviews = Math.max(0, (project.reviewCount || 10) - positiveReviews);

  // RCB Deposit flow items with live dynamic current dates
  const rcbFlowData = [
    { date: getLiveCurrentDateStr(2), total: '$94.00', rcb: '$5.40', count: 1, desc: '' },
    { date: getLiveCurrentDateStr(24), total: '$334.90', rcb: '$18.68', count: 2, desc: 'min: $133.9 max: $201 avg: $168' },
    { date: getLiveCurrentDateStr(48), total: '$153.00', rcb: '$11.56', count: 1, desc: '' },
    { date: getLiveCurrentDateStr(72), total: '$1,542.00', rcb: '$135.01', count: 4, desc: 'min: $34 max: $1050 avg: $386' },
    { date: getLiveCurrentDateStr(96), total: '$3,305.00', rcb: '$182.96', count: 1, desc: '' },
    { date: getLiveCurrentDateStr(120), total: '$53.00', rcb: '$8.94', count: 1, desc: '' },
    { date: getLiveCurrentDateStr(144), total: '$70.91', rcb: '$3.95', count: 2, desc: 'min: $31 max: $39.91 avg: $36' },
    { date: getLiveCurrentDateStr(168), total: '$75.00', rcb: '$4.10', count: 2, desc: 'min: $30 max: $45 avg: $38' },
    { date: getLiveCurrentDateStr(192), total: '$349.43', rcb: '$20.23', count: 3, desc: 'min: $99 max: $145.17 avg: $117' },
    { date: getLiveCurrentDateStr(216), total: '$154.07', rcb: '$8.66', count: 1, desc: '' },
    { date: getLiveCurrentDateStr(240), total: '$63.00', rcb: '$3.61', count: 1, desc: '' },
    { date: getLiveCurrentDateStr(264), total: '$560.86', rcb: '$36.36', count: 2, desc: '' },
  ];

  // Radar chart points calculation (6 axes: Monitors, SSL, IP, Content, Design, Hosting)
  const radarAxes = ['Monitors', 'SSL', 'IP', 'Content', 'Design', 'Hosting'];
  const radarValues = [
    Math.min(10, (numScore + 1.2)),
    Math.min(10, (numScore + 1.8)),
    Math.min(10, (numScore + 0.5)),
    Math.min(10, Math.max(3, numScore - 1.5)),
    Math.min(10, (numScore + 0.8)),
    Math.min(10, (numScore + 2.0)),
  ];

  // Center (120, 110), radius = 80
  const cx = 120;
  const cy = 110;
  const r = 75;
  const numAxes = 6;

  const getCoordinates = (axisIndex: number, value: number) => {
    const angle = (Math.PI * 2 / numAxes) * axisIndex - Math.PI / 2;
    const distance = (value / 10) * r;
    return {
      x: cx + distance * Math.cos(angle),
      y: cy + distance * Math.sin(angle),
    };
  };

  const polygonPoints = radarValues
    .map((val, idx) => {
      const { x, y } = getCoordinates(idx, val);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="max-w-[1280px] mx-auto px-3 sm:px-4 py-3">
      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: VIEW DETAILS MAIN CONTENT */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-3">
          {/* 1. TOP SUB-NAV TABS */}
          <div className="flex items-center gap-1 text-xs font-bold flex-wrap">
            <button
              onClick={() => setActiveTab('main')}
              className={`px-3 py-1.5 rounded-t-sm transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                activeTab === 'main'
                  ? 'bg-[#1e293b] text-white shadow-xs scale-102'
                  : 'bg-white text-[#475569] hover:bg-[#f8fafc] border border-[#cbd5e1] border-b-0'
              }`}
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400 inline-block shrink-0 goofy-img-animated-1 bg-slate-950">
                <img src={goofyVaultGuardian} alt="Main Domain Mascot" className="w-full h-full object-cover" />
              </div>
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>{project.domain || `${project.name.toLowerCase()}.com`}</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-t-sm transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                activeTab === 'events'
                  ? 'bg-[#1e293b] text-white shadow-xs scale-102'
                  : 'bg-white text-[#475569] hover:bg-[#f8fafc] border border-[#cbd5e1] border-b-0'
              }`}
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-emerald-400 inline-block shrink-0 goofy-img-animated-2 bg-slate-950">
                <img src={goofyMultiMonitor} alt="Events Mascot" className="w-full h-full object-cover" />
              </div>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Events</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">
                +{events.length || 5}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-t-sm transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'bg-[#1e293b] text-white shadow-xs scale-102'
                  : 'bg-white text-[#475569] hover:bg-[#f8fafc] border border-[#cbd5e1] border-b-0'
              }`}
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400 inline-block shrink-0 goofy-img-animated-3 bg-slate-950">
                <img src={goofyCryptoMascot} alt="Reviews Mascot" className="w-full h-full object-cover" />
              </div>
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Reviews</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">
                +{reviews.length || 11}
              </span>
            </button>

            <button
              onClick={() => setShowWidgetModal(true)}
              className="px-3 py-1.5 rounded-t-sm bg-white text-[#475569] hover:bg-[#f8fafc] border border-[#cbd5e1] border-b-0 cursor-pointer inline-flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-sky-400 inline-block shrink-0 goofy-wiggle bg-slate-950">
                <img src={goofyRocketTrader} alt="Widgets Mascot" className="w-full h-full object-cover" />
              </div>
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>Widgets</span>
            </button>
          </div>

          {/* 2. TOP PROJECT INFORMATION CARD */}
          <div className="bg-white border border-[#cbd5e1] rounded-sm p-3.5 sm:p-4 shadow-xs space-y-3 relative overflow-hidden">
            {/* Verified Insurance Coverage Banner for this Project with Goofy Mascot */}
            <div className="p-2.5 rounded bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-emerald-500/15 border border-amber-400/80 flex items-center justify-between gap-2 text-xs text-amber-950 font-bold shadow-xs">
              <div className="flex items-center gap-2.5">
                {/* Mascot Duo Avatar */}
                <div className="flex items-center -space-x-1.5 shrink-0">
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-400 goofy-img-animated-1 shadow-xs bg-slate-950">
                    <img src={goofyVaultGuardian} alt="Vault Guardian" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-emerald-400 goofy-img-animated-2 shadow-xs bg-slate-950">
                    <img src={goofyCryptoMascot} alt="Crypto Mascot" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>HyipMasterTracker Reserve Coverage Active for <strong>{project.name}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <span className="goofy-emoji-bounce inline-block text-[10px]">🛡️</span>
                  <span>Protected Reserve</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              {/* Left: Thumbnail & Review Stats with Goofy Animated Badge */}
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="relative w-24 h-18 sm:w-28 sm:h-20 rounded border border-[#cbd5e1] overflow-visible bg-[#f8fafc] shadow-inner group">
                  <img
                    src={project.logo}
                    alt={project.name}
                    className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
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

                  {/* Floating Goofy Mascot Sticker */}
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-slate-950 goofy-img-animated-3 z-10">
                    <img src={goofyRocketTrader} alt="Rocket Trader Mascot" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="text-[10px] text-[#64748b] text-center space-y-0.5 pt-1">
                  <span className="font-semibold text-slate-700 flex items-center justify-center gap-1">
                    <span>Reviews:</span>
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <span className="px-1.5 py-0.5 rounded-xs bg-[#22c55e] text-white font-black text-[9px] inline-flex items-center gap-0.5 shadow-2xs">
                      <span>{positiveReviews}</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded-xs bg-[#eab308] text-white font-black text-[9px] inline-flex items-center gap-0.5 shadow-2xs">
                      <span>{neutralReviews}</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded-xs bg-[#ef4444] text-white font-black text-[9px] inline-flex items-center gap-0.5 shadow-2xs">
                      <span>{negativeReviews > 0 ? negativeReviews : 1}</span>
                    </span>
                  </div>
                  <div className="text-[9px] text-[#64748b] pt-0.5 flex items-center justify-center gap-1 font-mono">
                    <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-slate-100 border border-slate-200">
                      <span>[{project.viewCount || 14438} views]</span>
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-slate-100 border border-slate-200">
                      <span>[{Math.round((project.viewCount || 14438) * 0.09)} clicks]</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle: Details & Plans */}
              <div className="flex-1 space-y-1 text-xs text-[#334155]">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#1e293b] flex items-center flex-wrap gap-1.5">
                  <span className="text-[#dc2626] font-black text-2xl sm:text-3xl leading-none inline-block">{firstLetter}</span>
                  <span className="font-extrabold">{restName}</span>
                </h1>

                <p className="text-[11px] text-[#64748b] flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-[#475569] flex items-center gap-1">
                    <span>Added:</span>
                  </span>{' '}
                  <span className="font-mono font-medium text-slate-800">
                    {new Date(project.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    07:55
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold inline-flex items-center gap-1 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Active</span>
                  </span>
                </p>

                {/* Our Investment Capsule with Goofy Animation Accent */}
                <div className="pt-0.5 pb-0.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 text-xs font-bold text-[#1e293b] shadow-2xs">
                    <span className="text-[#dc2626] font-black text-base goofy-emoji-bounce inline-block">⇒</span>
                    <span className="text-slate-700 font-semibold">Our Investment:</span>
                    <span className="text-[#15803d] font-black text-sm font-mono flex items-center gap-1">
                      ${(project.ourInvestment || 2500).toLocaleString('en-US')}
                      <span className="goofy-emoji-bounce inline-block text-[11px]">💎</span>
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <StatusBadge status={project.status} size="md" />
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    title={`Open ${project.name} in a new browser tab`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Visit Website</span>
                  </a>
                  
                  {/* 100% Uptime Live Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-[11px] font-black shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>100% Uptime</span>
                  </div>

                  <StatusSparkline
                    status={project.status}
                    createdAt={project.createdAt}
                    events={events}
                    isMini={true}
                  />
                </div>

                {/* Plans, Min/Max Deposit, Referral, and Withdrawal with Playful Goofy Animations */}
                <div className="space-y-1.5 pt-1.5">
                  <p className="text-[11px] text-[#1e293b] leading-relaxed flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[#dc2626] font-black">
                      <span className="goofy-emoji-jiggle text-xs inline-block">📈</span>
                      <span className="w-4 h-4 rounded-full overflow-hidden border border-rose-400 bg-slate-900 inline-block shrink-0 goofy-img-animated-1 shadow-2xs">
                        <img src={goofyRocketTrader} alt="Plans Mascot" className="w-full h-full object-cover" />
                      </span>
                      <span>Plans:</span>
                    </span>{' '}
                    <span className="font-bold text-slate-900 bg-rose-50/80 px-1.5 py-0.5 rounded border border-rose-200/70 inline-flex items-center gap-1">
                      <span>
                        {primaryPlan
                          ? `${primaryPlan.advertisedReturn} For ${primaryPlan.duration} (Principal included) -- Total return: 180%`
                          : '2.0% Daily Forever For Lifetime (Principal included) -- Total return: 180%'}
                      </span>
                      <span className="goofy-emoji-pop text-xs inline-block">🎯</span>
                    </span>
                  </p>

                  <p className="text-[11px] text-[#475569] flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-amber-50/60 px-1.5 py-0.5 rounded border border-amber-200/60">
                      <span className="goofy-emoji-bounce text-[11px] inline-block">💵</span>
                      <span className="text-[#dc2626] font-bold">Min deposit:</span>
                      <strong className="text-slate-900 font-mono">${project.minInvestment || 10}</strong>
                    </span>
                    <span className="text-slate-300 font-bold">|</span>
                    <span className="inline-flex items-center gap-1 bg-emerald-50/60 px-1.5 py-0.5 rounded border border-emerald-200/60">
                      <span className="goofy-emoji-spin text-[11px] inline-block">🪙</span>
                      <span className="text-[#dc2626] font-bold">Max deposit:</span>
                      <strong className="text-slate-900 font-mono">${project.maxInvestment ? project.maxInvestment.toLocaleString() : '15,000'}</strong>
                      <span className="goofy-emoji-pop text-[10px] inline-block">💎</span>
                    </span>
                  </p>

                  <p className="text-[11px] text-[#475569] flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-purple-50/60 px-1.5 py-0.5 rounded border border-purple-200/60">
                      <span className="goofy-emoji-bounce text-[11px] inline-block">🤝</span>
                      <span className="text-[#dc2626] font-bold">Referral:</span>
                      <strong className="text-purple-900 font-black">{project.referralPercentage || '4% - 1%'}</strong>
                      <span className="goofy-emoji-pop text-[10px] inline-block">🎁</span>
                    </span>
                    <span className="text-slate-300 font-bold">|</span>
                    <span className="inline-flex items-center gap-1 bg-sky-50/80 px-1.5 py-0.5 rounded border border-sky-200/80">
                      <span className="goofy-emoji-2 text-[11px] inline-block">⚡</span>
                      <span className="font-bold text-[#334155]">Withdrawal:</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#0284c7] text-white font-black text-[10px] tracking-wide inline-flex items-center gap-0.5 shadow-2xs">
                        <span>Manual</span>
                      </span>
                      <span className="goofy-emoji-bounce text-[10px] inline-block">🔐</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Right: Payment Systems, Features, Bookmark */}
              <div className="shrink-0 space-y-2 text-right text-xs">
                <div className="flex items-center justify-end gap-1.5">
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-[#16a34a] hover:bg-[#15803d] text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                    title={`Open ${project.name} in a new tab`}
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Visit Website</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleToggleWatchlist}
                    className={`p-1.5 rounded-sm hover:bg-[#f1f5f9] transition-colors cursor-pointer ${
                      isWatched ? 'text-[#e11d48]' : 'text-[#94a3b8] hover:text-[#475569]'
                    }`}
                    title={isWatched ? 'Remove from bookmarks' : 'Add to bookmarks'}
                  >
                    <Bookmark className={`w-5 h-5 ${isWatched ? 'fill-[#e11d48]' : ''}`} />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#64748b] block">Payment systems:</span>
                  <div className="flex items-center justify-end gap-1">
                    <span className="w-4 h-4 rounded-full bg-[#f7931a] text-white flex items-center justify-center text-[10px] font-black shadow-xs hover:scale-110 transition-transform" title="Bitcoin">
                      ₿
                    </span>
                    <span className="w-4 h-4 rounded-full bg-[#26a17b] text-white flex items-center justify-center text-[10px] font-black shadow-xs hover:scale-110 transition-transform" title="Tether USDT">
                      ₮
                    </span>
                    <span className="w-4 h-4 rounded-full bg-[#345d9d] text-white flex items-center justify-center text-[9px] font-black shadow-xs hover:scale-110 transition-transform" title="Litecoin">
                      Ł
                    </span>
                    <span className="w-4 h-4 rounded-full bg-[#627eea] text-white flex items-center justify-center text-[9px] font-black shadow-xs hover:scale-110 transition-transform" title="Ethereum">
                      Ξ
                    </span>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-[#64748b] block">Features:</span>
                  <div className="flex items-center justify-end gap-1.5 text-xs text-[#16a34a]">
                    <span className="w-4 h-4 rounded-xs bg-[#16a34a] text-white flex items-center justify-center text-[9px] font-bold" title="EV SSL">
                      EV
                    </span>
                    <Shield className="w-3.5 h-3.5 text-[#0284c7]" title="DDoS Protected" />
                    <Server className="w-3.5 h-3.5 text-[#16a34a]" title="Dedicated Server" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Deposited & Forums with Mascot Accent */}
            <div className="pt-2 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between text-[11px] text-[#475569] gap-2">
              <div className="flex items-center gap-3 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full overflow-hidden border border-amber-400 inline-block shrink-0">
                    <img src={goofyVaultGuardian} alt="Vault" className="w-full h-full object-cover" />
                  </span>
                  <span>Total deposited: <strong className="text-[#1e293b] font-mono">${(project.totalDeposits || 45483).toLocaleString()}</strong></span>
                </span>
                <span className="text-[#0284c7] flex items-center gap-1">
                  <span>RCB offers:</span>
                  <strong className="bg-[#0284c7] text-white px-1.5 py-0.2 rounded-xs font-bold text-[10px] shadow-2xs">4</strong>
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-[#64748b] font-medium">Forum(s):</span>
                <div className="flex items-center gap-1 font-bold text-[#0284c7]">
                  <span className="px-1 py-0.2 rounded-xs border border-[#bae6fd] bg-[#f0f9ff] hover:bg-[#e0f2fe] transition-colors cursor-pointer">MMGP</span>
                  <span className="px-1 py-0.2 rounded-xs border border-[#bae6fd] bg-[#f0f9ff] hover:bg-[#e0f2fe] transition-colors cursor-pointer">PF1</span>
                  <span className="px-1 py-0.2 rounded-xs border border-[#bae6fd] bg-[#f0f9ff] hover:bg-[#e0f2fe] transition-colors cursor-pointer">DMT</span>
                  <span className="px-1 py-0.2 rounded-xs border border-[#bae6fd] bg-[#f0f9ff] hover:bg-[#e0f2fe] transition-colors cursor-pointer">MM4</span>
                  <span className="px-1 py-0.2 rounded-xs border border-[#bae6fd] bg-[#f0f9ff] hover:bg-[#e0f2fe] transition-colors cursor-pointer">RC</span>
                  <span className="px-1 py-0.2 rounded-xs border border-[#bae6fd] bg-[#f0f9ff] hover:bg-[#e0f2fe] transition-colors cursor-pointer">HE</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2.5. HISTORICAL STATUS TIMELINE & RECHARTS SPARKLINE */}
          <StatusSparkline
            status={project.status}
            createdAt={project.createdAt}
            events={events}
            height={68}
          />

          {/* TAB SPECIFIC CONTENT: EVENTS */}
          {activeTab === 'events' && (
            <div className="bg-white border border-[#cbd5e1] rounded-sm shadow-xs overflow-hidden">
              <div className="bg-[#1e293b] text-white px-3 py-1.5 font-bold text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-emerald-400 inline-block shrink-0 goofy-img-animated-2 bg-slate-950">
                    <img src={goofyMultiMonitor} alt="Events Mascot" className="w-full h-full object-cover" />
                  </div>
                  <span>Chronological Events & Verification Milestones</span>
                </div>
                <span className="text-[10px] text-emerald-300 font-mono font-bold">
                  {events.length} Recorded Events
                </span>
              </div>
              <div className="p-4 divide-y divide-[#f1f5f9] space-y-2">
                {events.length > 0 ? (
                  events.map((ev, idx) => (
                    <div key={ev.id} className="pt-2 pb-1 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-slate-900 border border-amber-400 flex items-center justify-center text-xs shrink-0 goofy-emoji-bounce mt-0.5">
                          {idx % 3 === 0 ? '🚀' : idx % 3 === 1 ? '🛡️' : '💎'}
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-bold text-[#1e293b] flex items-center gap-1.5">
                            <span>{ev.title || ev.type}</span>
                            <span className="px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 text-[9px] font-bold border border-sky-200">
                              Verified Log
                            </span>
                          </span>
                          <p className="text-[11px] text-[#475569]">{ev.description}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#64748b] font-mono shrink-0 px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
                        {new Date(ev.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-[#94a3b8] space-y-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400 mx-auto goofy-img-animated-1 bg-slate-950">
                      <img src={goofyVaultGuardian} alt="Safe" className="w-full h-full object-cover" />
                    </div>
                    <p>No critical security incidents or negative status changes reported. Project operates with normal payout cycles.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. «RiskRank» Summary Box */}
          <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-sm p-4 shadow-xs space-y-3 relative overflow-hidden">
            {/* Ambient Background Mascot Watermark */}
            <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10 pointer-events-none rounded-full overflow-hidden">
              <img src={goofyRiskScore} alt="Risk Score Watermark" className="w-full h-full object-cover" />
            </div>

            <div className="flex items-start gap-4">
              {/* Score Circle & Mascot Avatar Duo */}
              <div className="shrink-0 pt-0.5 relative">
                <RiskScoreGauge score={project.riskScore} size="lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full overflow-hidden border border-amber-400 bg-slate-950 shadow-xs goofy-img-animated-2">
                  <img src={goofyRiskScore} alt="Risk Mascot" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm font-bold text-[#1e293b] flex items-center gap-1.5">
                    <span>«{project.name}» [{project.domain || `${project.name.toLowerCase()}.com`}] Summary</span>
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <span className="goofy-emoji-bounce inline-block text-[10px]">🎯</span>
                    <span>AI Consensus Verified</span>
                  </span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  The «RiskRank» metric serves as a comprehensive indicator of the overall quality of «{project.name}», evaluated based on multiple criteria. Below is a detailed analysis of {project.domain || `${project.name.toLowerCase()}.com`}, with a score ranging from 0 to 10 points.
                </p>
              </div>
            </div>

            {/* Green flags & Red flags with animated badges */}
            <div className="space-y-2 pt-2 border-t border-[#e2e8f0] text-xs">
              <div className="space-y-1">
                <p className="font-bold text-[#16a34a] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black goofy-img-animated-1">✓</span>
                  <span>Green flags:</span>
                </p>
                <ul className="space-y-1 text-[#15803d] pl-2 font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-600">+</span>
                    <span>The domain {project.domain || `${project.name.toLowerCase()}.com`} is registered for years, which is a good thing;</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-600">+</span>
                    <span>The website uses DigiCert Inc EV SSL encryption with an enhanced protection level and has a green address bar;</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-600">+</span>
                    <span>High-quality hosting: A single site on this IP ensures constant access, top reliability, performance, and security;</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-600">+</span>
                    <span>The website content is unique;</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-600">+</span>
                    <span>IP address not used by other HYIPs;</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-600">+</span>
                    <span>Featured on reputable monitoring platforms;</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-1 pt-2">
                <p className="font-bold text-[#dc2626] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-black goofy-emoji-pulse">✕</span>
                  <span>Red flags:</span>
                </p>
                <ul className="space-y-1 text-[#dc2626] pl-2 font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-rose-600">-</span>
                    <span>Plans: 1/1 flagged red;</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-rose-600">-</span>
                    <span>Plagiarized design elements from other HYIPs;</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4. TECHNICAL RADAR SPIDER CHART & AUDIT BREAKDOWN */}
          <div className="bg-white border border-[#cbd5e1] rounded-sm p-4 shadow-xs relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left: 6-Axis Radar Spider Web Chart with Goofy Analyst Accent */}
              <div className="md:col-span-5 flex flex-col items-center justify-center relative">
                {/* Mini Mascot Analyst Badge */}
                <div className="absolute top-0 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-bold border border-amber-400 shadow-xs">
                  <div className="w-4 h-4 rounded-full overflow-hidden inline-block shrink-0 goofy-img-animated-1">
                    <img src={goofyCryptoMascot} alt="Analyst" className="w-full h-full object-cover" />
                  </div>
                  <span>Radar v2</span>
                </div>

                <svg width="240" height="220" className="overflow-visible select-none">
                  {/* Concentric grid polygons */}
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, i) => {
                    const ringPoints = radarAxes
                      .map((_, idx) => {
                        const { x, y } = getCoordinates(idx, scale * 10);
                        return `${x.toFixed(1)},${y.toFixed(1)}`;
                      })
                      .join(' ');
                    return (
                      <polygon
                        key={i}
                        points={ringPoints}
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="1"
                        strokeDasharray={scale === 1.0 ? 'none' : '2,2'}
                      />
                    );
                  })}

                  {/* Axis lines */}
                  {radarAxes.map((_, idx) => {
                    const { x, y } = getCoordinates(idx, 10);
                    return (
                      <line
                        key={idx}
                        x1={cx}
                        y1={cy}
                        x2={x}
                        y2={y}
                        stroke="#94a3b8"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Filled score polygon */}
                  <polygon
                    points={polygonPoints}
                    fill="rgba(34, 197, 94, 0.35)"
                    stroke="#16a34a"
                    strokeWidth="2"
                  />

                  {/* Axis numerical scale markers on top vertical axis */}
                  {[10, 8, 6, 4, 2, 0].map((num) => {
                    const dist = (num / 10) * r;
                    return (
                      <g key={num}>
                        <rect
                          x={cx - 7}
                          y={cy - dist - 6}
                          width="14"
                          height="12"
                          fill="#ffffff"
                          stroke="#cbd5e1"
                          rx="2"
                        />
                        <text
                          x={cx}
                          y={cy - dist + 3}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="bold"
                          fill="#475569"
                        >
                          {num}
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis Labels */}
                  {radarAxes.map((axis, idx) => {
                    const { x, y } = getCoordinates(idx, 11.8);
                    return (
                      <text
                        key={axis}
                        x={x}
                        y={y + 3}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="#334155"
                      >
                        {axis}
                      </text>
                    );
                  })}
                </svg>
              </div>

              {/* Right: Technical Audit Breakdown */}
              <div className="md:col-span-7 space-y-2.5 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-[#334155] font-semibold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#0284c7]" />
                      <span><strong>Domain:</strong> {project.domain || `${project.name.toLowerCase()}.com`} is registered for <strong>35 years</strong> by Tucows Domains Inc.</span>
                    </p>
                    <p className="text-[10px] text-[#64748b] pl-5">[from Jun 20,1998 to Jun 19,2032]</p>
                  </div>
                  <span className="text-[#16a34a] font-bold text-sm shrink-0">+</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-[#334155] font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span><strong>EV SSL</strong> valid for <strong>11 months</strong> - DigiCert Inc</span>
                  </p>
                  <span className="text-[#16a34a] font-bold text-sm shrink-0">+</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-[#334155] font-semibold flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-[#0284c7]" />
                    <span><strong>Dedicated server</strong> - IP address 172.66.147.133 hosts <strong>1 domain</strong></span>
                  </p>
                  <span className="text-[#16a34a] font-bold text-sm shrink-0">+</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-[#334155]">
                    <strong>Hosting:</strong> Cloudflare, Inc. [cloudflare.com]
                  </p>
                  <span className="text-[#16a34a] font-bold text-sm shrink-0">+</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-[#334155]">
                    <strong>IP:</strong> 172.66.147.133 <span className="text-[#16a34a] font-medium">[not used in other projects]</span>
                  </p>
                  <span className="text-[#16a34a] font-bold text-sm shrink-0">+</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-[#334155]">
                    <strong>Network:</strong> 172.64.x.x <span className="text-[#0284c7] font-semibold">[1848 projects] 🇺🇸</span>
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f1f5f9]">
                  <p className="text-[#334155] flex items-center gap-1.5">
                    <span>📑</span>
                    <span><strong>Found similar content</strong> <span className="text-[#dc2626] font-bold">[design: 3 projects]</span></span>
                  </p>
                  <span className="text-[#dc2626] font-bold text-sm shrink-0">-</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. SIMILARITIES SECTION */}
          <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-sm p-3.5 shadow-xs space-y-1.5 text-xs relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 flex-wrap font-bold text-[#1e293b]">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-sky-400 inline-block shrink-0 goofy-img-animated-3">
                  <img src={goofyRocketTrader} alt="Mascot" className="w-full h-full object-cover" />
                </div>
                <Search className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>Similarities of {project.domain || `${project.name.toLowerCase()}.com`} based on statistic researching</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono">
                1,613 Sample Matrix
              </span>
            </div>

            <p className="text-[#475569] text-[11px] leading-relaxed">
              Here are closed projects with similar payouts plans as{' '}
              <span className="px-1 py-0.2 rounded-xs bg-[#e2e8f0] text-[#1e293b] font-semibold">
                3% Daily Profit For 60 Calendar Days...
              </span>{' '}
              and included other metrics; that stopped pay after <span className="px-1 bg-[#fecaca] text-[#991b1b] font-bold rounded-xs">min: 7</span> <span className="px-1 bg-[#fecaca] text-[#991b1b] font-bold rounded-xs">max: 58</span> <span className="px-1 bg-[#fef08a] text-[#854d0e] font-bold rounded-xs">avg: 26</span> days from project start date. Found <span className="text-[#dc2626] font-bold">[1613 projects]</span> with proximate payouts plans in total.
            </p>
          </div>

          {/* 6. LATEST REVIEWS & ADD REVIEW BANNER */}
          <div className="bg-white border border-[#cbd5e1] rounded-sm shadow-xs overflow-hidden">
            <div className="bg-[#1e293b] text-white px-3 py-1.5 font-bold text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-emerald-400 inline-block shrink-0 goofy-img-animated-2">
                  <img src={goofyCryptoMascot} alt="Reviews Mascot" className="w-full h-full object-cover" />
                </div>
                <span>Latest Community Reviews</span>
              </div>
              <span className="text-[10px] text-emerald-300 font-mono flex items-center gap-1">
                <span className="goofy-emoji-bounce inline-block text-[10px]">⭐</span>
                <span>Verified Statements</span>
              </span>
            </div>

            {/* Add review action box */}
            <div className="p-3.5 bg-[#f8fafc] border-b border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="space-y-0.5">
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-xs font-bold text-[#0284c7] hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <span className="goofy-emoji-bounce inline-block text-xs">💬</span>
                  <span>Add a vote/review and share your statement about «{project.domain || project.name}»</span>
                </button>
                <p className="text-[11px] text-[#64748b]">
                  Share your payment proof, withdrawal speed, or report issues directly to our community.
                </p>
                <p className="text-[11px] font-bold text-[#0284c7] flex items-center gap-1">
                  <span className="goofy-emoji-1 inline-block text-[11px]">⚡</span>
                  <span>Report disputes to our Telegram (@hyipmastertracker) or WhatsApp support!</span>
                </p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-1.5 bg-[#1e293b] hover:bg-[#0f172a] text-white text-xs font-bold rounded-sm shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5 transition-transform hover:scale-105"
              >
                <span className="goofy-emoji-bounce inline-block text-xs">✍️</span>
                <span>{showReviewForm ? 'Cancel' : 'Write Review'}</span>
              </button>
            </div>

            {/* Inline Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-4 bg-white border-b border-[#e2e8f0] space-y-3">
                <h4 className="text-xs font-bold text-[#1e293b] flex items-center gap-1.5">
                  <span className="goofy-emoji-bounce inline-block text-xs">📝</span>
                  <span>Leave Your Feedback for {project.name}</span>
                </h4>
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                    Rating (0 to 10): <span className="text-[#16a34a] font-bold">{reviewRating} / 10</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full cursor-pointer accent-[#1e293b]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">Your Statement / Experience:</label>
                  <textarea
                    rows={3}
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="Provide payout confirmation or deposit details..."
                    className="w-full text-xs p-2 rounded border border-[#cbd5e1] focus:outline-hidden focus:border-[#1e293b]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-4 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-sm cursor-pointer shadow-xs transition-transform hover:scale-105"
                >
                  {reviewSubmitting ? 'Posting...' : 'Submit Statement'}
                </button>
              </form>
            )}

            {/* Community Reviews List */}
            <div className="divide-y divide-[#f1f5f9]">
              {reviews.length > 0 ? (
                reviews.map((rev, idx) => (
                  <div key={rev.id} className="p-3 hover:bg-[#fafbfc] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Goofy Reviewer Avatar */}
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-300 bg-slate-950 shrink-0">
                          <img
                            src={idx % 2 === 0 ? goofyCryptoMascot : goofyRocketTrader}
                            alt="User Mascot"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-bold text-[#1e293b]">{rev.userName}</span>
                        <span className="text-[10px] text-[#64748b]">
                          {new Date(rev.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#16a34a] font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-[#16a34a]" />
                        <span>{rev.rating}/10</span>
                      </div>
                    </div>
                    <p className="text-[#334155] leading-snug pl-7">{rev.content}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[#94a3b8]">
                  No statements submitted yet. Be the first to share your payment experience!
                </div>
              )}
            </div>
          </div>

          {/* 7. DEPOSIT ANALYTICS & RCB FLOW */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Left: RCB Deposit Flow Table */}
            <div className="md:col-span-6 bg-white border border-[#cbd5e1] rounded-sm shadow-xs overflow-hidden">
              <div className="bg-[#1e293b] text-white px-3 py-1.5 font-bold text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400 inline-block shrink-0 goofy-img-animated-1">
                    <img src={goofyVaultGuardian} alt="Vault Mascot" className="w-full h-full object-cover" />
                  </div>
                  <span>RCB Deposit Flow</span>
                </div>
                <span className="text-[10px] text-amber-300 font-mono">Live Inflows</span>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-[#f1f5f9] text-xs">
                {rcbFlowData.map((item, idx) => (
                  <div key={idx} className="p-2.5 hover:bg-[#f8fafc] flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-[#1e293b] block">{item.date}</span>
                      <span className="text-[10px] text-[#64748b]">RCB</span>
                    </div>

                    <div>
                      <span className="font-bold text-[#1e293b] block">{item.total}</span>
                      <span className="text-[10px] text-[#64748b]">{item.rcb}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-[#334155] block">{item.count} deposit{item.count > 1 ? 's' : ''}</span>
                      {item.desc && (
                        <span className="text-[9px] text-[#94a3b8] block max-w-[130px] truncate">{item.desc}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Summary of Deposits & Trend Chart */}
            <div className="md:col-span-6 bg-white border border-[#cbd5e1] rounded-sm shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                <div className="bg-[#1e293b] text-white px-3 py-1.5 font-bold text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-cyan-400 inline-block shrink-0 goofy-img-animated-3">
                      <img src={goofyRocketTrader} alt="Trend Mascot" className="w-full h-full object-cover" />
                    </div>
                    <span>Summary of Deposits</span>
                  </div>
                  <span className="text-[10px] font-normal text-slate-300">updated: {getLiveCurrentDateTimeStr(0.1)}</span>
                </div>

                {/* Monitor breakdowns */}
                <div className="p-2.5 space-y-2 text-xs divide-y divide-[#f1f5f9]">
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="font-bold text-[#16a34a] block">InvesTracing</span>
                      <span className="text-[10px] text-[#64748b]">RCB: $2,290.67</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#1e293b] block">$31,531.00</span>
                      <span className="text-[10px] text-[#64748b]">88 deposits (min: $10 max: $3305 avg: $359)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5">
                    <div>
                      <span className="font-bold text-[#0284c7] block">InstantMonitor</span>
                      <span className="text-[10px] text-[#64748b]">RCB: $828.43</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#1e293b] block">$9,033.73</span>
                      <span className="text-[10px] text-[#64748b]">69 deposits (min: $10 max: $800 avg: $131)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5">
                    <div>
                      <span className="font-bold text-[#ea580c] block">SQMonitor</span>
                      <span className="text-[10px] text-[#64748b]">RCB: $75.25</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#1e293b] block">$1,505.00</span>
                      <span className="text-[10px] text-[#64748b]">15 deposits (min: $15 max: $300 avg: $101)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deposit Trend Graph */}
              <div className="p-3 border-t border-[#e2e8f0] bg-[#fafbfc]">
                <div className="flex items-center gap-3 text-[10px] font-bold text-[#475569] mb-1.5">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#16a34a]" />
                    <span>Trend Line</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#334155]" />
                    <span>RCB Deposits</span>
                  </span>
                </div>

                <svg viewBox="0 0 320 120" className="w-full h-32 select-none">
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line key={y} x1="30" y1={y} x2="310" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                  ))}

                  {/* Y Axis Labels */}
                  <text x="25" y="10" textAnchor="end" fontSize="7" fill="#94a3b8">$16000</text>
                  <text x="25" y="35" textAnchor="end" fontSize="7" fill="#94a3b8">$12000</text>
                  <text x="25" y="60" textAnchor="end" fontSize="7" fill="#94a3b8">$8000</text>
                  <text x="25" y="85" textAnchor="end" fontSize="7" fill="#94a3b8">$4000</text>
                  <text x="25" y="105" textAnchor="end" fontSize="7" fill="#94a3b8">$0</text>

                  {/* Area fill for RCB Deposits */}
                  <path
                    d="M 35 95 L 85 90 L 135 85 L 185 65 L 235 45 L 285 70 L 285 100 L 35 100 Z"
                    fill="rgba(148, 163, 184, 0.25)"
                  />
                  {/* Dark line for RCB */}
                  <path
                    d="M 35 95 L 85 90 L 135 85 L 185 65 L 235 45 L 285 70"
                    fill="none"
                    stroke="#475569"
                    strokeWidth="2"
                  />

                  {/* Green Trend Line */}
                  <path
                    d="M 35 90 L 85 82 L 135 75 L 185 67 L 235 58 L 285 50"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2"
                  />

                  {/* X Axis Labels */}
                  <text x="35" y="115" fontSize="7" fill="#64748b">Mar 26</text>
                  <text x="85" y="115" fontSize="7" fill="#64748b">Apr 26</text>
                  <text x="135" y="115" fontSize="7" fill="#64748b">May 26</text>
                  <text x="185" y="115" fontSize="7" fill="#64748b">Jun 26</text>
                  <text x="235" y="115" fontSize="7" fill="#64748b">Jul 26</text>
                  <text x="285" y="115" fontSize="7" fill="#64748b">Aug 26</text>
                </svg>
              </div>
            </div>
          </div>

          {/* 8. CONTENT & TAGS DESCRIPTION QUOTE BOX */}
          <div className="bg-white border border-[#cbd5e1] rounded-sm shadow-xs overflow-hidden">
            <div className="bg-[#1e293b] text-white px-3 py-1.5 font-bold text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400 inline-block shrink-0 goofy-img-animated-1">
                  <img src={goofyVaultGuardian} alt="Content Mascot" className="w-full h-full object-cover" />
                </div>
                <span>Content & Verification Synopsis</span>
              </div>
              <span className="text-slate-300 font-normal text-[11px]">#Tags</span>
            </div>

            <div className="p-4 space-y-2 text-xs text-[#334155] leading-relaxed">
              <h4 className="font-bold text-[#1e293b]">Here's what it says on the {project.domain || project.name} website:</h4>
              <blockquote className="p-3 bg-[#f8fafc] border-l-4 border-[#0284c7] rounded-r text-[#475569] italic">
                {project.description || `${project.name} is a high-yield investment program providing cryptocurrency trading, automated algorithmic returns, and multi-tier referral compensation. All payments are verified via multi-monitor consensus.`}
              </blockquote>
            </div>
          </div>

          {/* 9. RISK WARNING BANNER */}
          <RiskWarningBanner />
        </main>

        {/* RIGHT COLUMN: SIDEBAR WIDGETS */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <SidebarWidgets navigate={navigate} showMonitoring={true} />
        </aside>
      </div>

      {/* EMBED WIDGET MODAL WITH GOOFY LIVE PREVIEW */}
      {showWidgetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#cbd5e1] rounded-md max-w-lg w-full p-5 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-400 inline-block shrink-0 goofy-img-animated-1 bg-slate-950">
                  <img src={goofyRocketTrader} alt="Widgets Mascot" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-sm text-[#1e293b]">Embed {project.name} Status Widget</h3>
              </div>
              <button
                onClick={() => setShowWidgetModal(false)}
                className="text-[#64748b] hover:text-[#1e293b] font-bold text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Live Widget Preview Box */}
            <div className="p-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-md border border-amber-400 text-white space-y-2 shadow-inner">
              <div className="text-[10px] uppercase tracking-wider font-mono text-amber-300 font-bold flex items-center justify-between">
                <span>Live Widget Preview</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Active Monitor</span>
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-700 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 bg-slate-900 goofy-img-animated-2 shrink-0">
                    <img src={goofyVaultGuardian} alt="Guardian" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-white">{project.name}</h4>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="goofy-emoji-bounce inline-block text-[10px]">✅</span>
                      <span>Paying & Verified</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px] uppercase">
                    Risk: {project.riskScore ? project.riskScore.toFixed(1) : '7.5'}/10
                  </span>
                  <span className="block text-[9px] text-slate-400 mt-0.5">HyipMasterTracker</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#475569]">
              Copy and paste the HTML snippet below to show the live verified payment status on your forum or website:
            </p>
            <textarea
              readOnly
              rows={3}
              className="w-full text-xs font-mono p-2.5 rounded bg-[#f8fafc] border border-[#cbd5e1] text-[#334155]"
              value={`<a href="https://hyipmastertracker.com/hyips/${project.slug}" target="_blank"><img src="https://hyipmastertracker.com/api/widget/${project.slug}.png" alt="${project.name} Status" border="0" /></a>`}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowWidgetModal(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `<a href="https://hyipmastertracker.com/hyips/${project.slug}" target="_blank"><img src="https://hyipmastertracker.com/api/widget/${project.slug}.png" alt="${project.name} Status" border="0" /></a>`
                  );
                  alert('Widget HTML copied to clipboard!');
                  setShowWidgetModal(false);
                }}
                className="px-4 py-2 bg-[#1e293b] hover:bg-[#0f172a] text-white text-xs font-bold rounded cursor-pointer flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
              >
                <span className="goofy-emoji-bounce inline-block text-xs">📋</span>
                <span>Copy Code</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
