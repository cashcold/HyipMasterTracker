import React, { useState } from 'react';
import {
  Bookmark,
  Shield,
  Lock,
  Server,
  ExternalLink,
  Eye,
  MousePointer,
  Sparkles,
  Zap,
} from 'lucide-react';
import { IProject } from '../../types.ts';
import { StatusBadge } from './StatusBadge.tsx';
import { RiskScoreGauge } from './RiskScoreGauge.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import goofyRocketTrader from '../../assets/images/goofy_rocket_trader_1786742811873.jpg';
import goofyCryptoMascot from '../../assets/images/goofy_crypto_mascot_1786742789221.jpg';
import goofyVaultGuardian from '../../assets/images/goofy_vault_guardian_1786742800081.jpg';
import goofyRiskScore from '../../assets/images/goofy_risk_score_1786739631521.jpg';

interface ProjectCardProps {
  project: IProject;
  navigate: (path: string) => void;
  isWatched?: boolean;
  onWatchToggle?: (id: string, isWatched: boolean) => void;
  onCompareAdd?: (project: IProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  navigate,
  isWatched = false,
  onWatchToggle,
}) => {
  const { user } = useAuth();
  const [watched, setWatched] = useState(isWatched);
  const [watchLoading, setWatchLoading] = useState(false);

  const handleWatchToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setWatchLoading(true);
    try {
      const res = await api.toggleWatchlist(project.id);
      setWatched(res.isWatched);
      if (onWatchToggle) onWatchToggle(project.id, res.isWatched);
    } catch (err) {
      console.error(err);
    } finally {
      setWatchLoading(false);
    }
  };

  const handleVisit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.website) {
      window.open(project.website, '_blank');
    } else {
      navigate(`/hyips/${project.slug}`);
    }
  };

  const primaryPlan = project.plans && project.plans.length > 0 ? project.plans[0] : null;

  // Split name for stylized initial letter
  const firstLetter = project.name.charAt(0);
  const restName = project.name.slice(1);

  // Review breakdown estimates
  const positiveReviews = Math.max(1, Math.round((project.reviewCount || 10) * 0.85));
  const neutralReviews = 0;
  const negativeReviews = Math.max(0, (project.reviewCount || 10) - positiveReviews);

  // Views & clicks count
  const viewsCount = project.views || 14438;
  const clicksCount = project.clicks || 1299;

  // Added date formatting
  const addedDate = new Date(project.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Pick mascot based on project status
  const mascotImg =
    project.status === 'PAYING'
      ? goofyRocketTrader
      : project.status === 'PROBLEM' || project.status === 'NOT PAID'
      ? goofyRiskScore
      : goofyCryptoMascot;

  return (
    <div
      onClick={() => navigate(`/hyips/${project.slug}`)}
      className="bg-white hover:bg-[#fafbfc] border-b border-[#e2e8f0] p-3 sm:p-4 transition-all cursor-pointer flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs font-normal relative group"
    >
      {/* 1. LEFT COLUMN: EV BADGE, THUMBNAIL WITH GOOFY MASCOT BADGE, REVIEWS, STATS */}
      <div className="flex items-start gap-3 shrink-0">
        {/* EV / SSL / DDoS Vertical Stack */}
        <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
          <span className="px-1 py-0.2 bg-[#22c55e] text-white font-black text-[9px] rounded-xs">
            EV
          </span>
          <Lock className="w-3 h-3 text-[#22c55e]" />
          <Shield className="w-3 h-3 text-[#0284c7]" />
        </div>

        {/* Thumbnail with score circle overlay + Goofy Mascot Sticker */}
        <div className="relative w-16 h-14 rounded border border-[#cbd5e1] overflow-visible shrink-0 bg-[#f8fafc]">
          <img
            src={project.logo}
            alt={project.name}
            className="w-full h-full object-cover rounded"
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
          <div className="absolute top-0 right-0">
            <RiskScoreGauge score={project.riskScore} size="circle" />
          </div>

          {/* Animated Goofy Mascot Image Sticker */}
          <div className="absolute -bottom-2 -left-2 w-7 h-7 rounded-full overflow-hidden border-2 border-amber-400 goofy-img-animated-1 shadow-md bg-slate-950 z-10">
            <img
              src={mascotImg}
              alt="Goofy Mascot"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Reviews pill count & views/clicks */}
        <div className="hidden sm:flex flex-col text-[10px] text-[#64748b] min-w-[95px]">
          <span className="font-semibold flex items-center gap-1">
            <span>Reviews:</span>
            <span className="goofy-emoji-bounce text-[9px]">💬</span>
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="px-1 py-0.2 rounded-xs bg-[#22c55e] text-white font-bold inline-flex items-center gap-0.5">
              <span>{positiveReviews}</span>
              <span className="goofy-emoji-spin text-[8px]">✨</span>
            </span>
            <span className="px-1 py-0.2 rounded-xs bg-[#eab308] text-white font-bold">
              {neutralReviews}
            </span>
            <span className="px-1 py-0.2 rounded-xs bg-[#ef4444] text-white font-bold inline-flex items-center gap-0.5">
              <span>{negativeReviews > 0 ? negativeReviews : 1}</span>
              <span className="goofy-emoji-1 text-[8px]">⚠️</span>
            </span>
          </div>

          {/* Views & Clicks */}
          <div className="flex flex-col gap-0.5 mt-1 text-[9px] font-mono text-slate-500">
            <span className="flex items-center gap-0.5" title="Total Views">
              <span>👀</span>
              <span>[{viewsCount.toLocaleString()} views]</span>
            </span>
            <span className="flex items-center gap-0.5" title="Total Direct Clicks">
              <span>🖱️</span>
              <span>[{clicksCount.toLocaleString()} clicks]</span>
            </span>
          </div>
        </div>

        {/* Name, Added, Investment, Visit Website */}
        <div className="min-w-[150px] space-y-1">
          <h3 className="text-sm font-bold tracking-tight text-[#1e293b] flex items-center gap-1.5 flex-wrap">
            <span className="text-[#dc2626] font-black text-base leading-none">{firstLetter}</span>
            <span className="font-bold">{restName}</span>
            <span className="goofy-emoji-bounce text-xs">🚀</span>
            <span className="goofy-emoji-spin text-xs">💎</span>
            <span className="goofy-emoji-pop text-xs">✨</span>
          </h3>

          <p className="text-[11px] text-[#64748b] flex items-center gap-1">
            <span>📅</span>
            <span className="font-semibold text-[#475569]">Added:</span> {addedDate} 07:55
            <span className="px-1 py-0.2 rounded-xs bg-emerald-100 text-emerald-800 text-[9px] font-black">Active</span>
          </p>

          <p className="text-[11px] text-[#1e293b] font-bold flex items-center gap-1">
            <span className="text-slate-400">⇒</span>
            <span>Our Investment:</span>
            <span className="text-[#15803d] font-mono font-black">${(project.ourInvestment || 2500).toLocaleString('en-US')}</span>
            <span className="goofy-emoji-jiggle text-[10px]">💰</span>
            <span className="goofy-emoji-spin text-[10px]">✨</span>
          </p>

          <div className="flex items-center gap-2 pt-0.5">
            <button
              onClick={handleVisit}
              className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-xs flex items-center gap-1 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Visit Website</span>
              <span className="goofy-emoji-bounce text-[9px]">🚀</span>
              <span className="text-[9px] font-mono text-cyan-200">100% Uptime</span>
              <span className="goofy-emoji-spin text-[8px]">⚡</span>
            </button>

            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300 inline-flex items-center gap-0.5">
              <span className="goofy-emoji-spin text-[9px]">🛡️</span>
              <span>Insured</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. CENTER COLUMN: MONITOR STATUS, INVESTED, RCB OFFERS */}
      <div className="shrink-0 min-w-[130px] space-y-1">
        <div>
          <StatusBadge status={project.status} size="md" />
        </div>
        <p className="text-[11px] text-[#475569] font-medium flex items-center gap-1">
          <span>Invested:</span>
          <span className="font-bold text-[#1e293b] font-mono">${(project.totalDeposits || 45483).toLocaleString()}</span>
          <span className="goofy-emoji-spin text-[10px]">💸</span>
        </p>
        <p className="text-[10px] text-[#64748b] flex items-center gap-1">
          <span>RCB offers:</span>
          <span className="px-1 py-0.2 rounded-xs bg-[#0284c7] text-white font-bold inline-flex items-center gap-0.5">
            <span>4</span>
            <span className="goofy-emoji-pop text-[8px]">💎</span>
          </span>
        </p>
      </div>

      {/* 3. RIGHT COLUMN: PLANS, MIN/MAX DEPOSIT, REFERRAL, WITHDRAWAL, COINS */}
      <div className="flex-1 min-w-[220px] space-y-1 text-[11px]">
        <p className="text-[#334155] font-semibold flex items-center gap-1 flex-wrap">
          <span className="goofy-emoji-jiggle text-xs inline-block">📈</span>
          <span className="w-3.5 h-3.5 rounded-full overflow-hidden border border-rose-400 bg-slate-900 inline-block shrink-0 goofy-img-animated-1 shadow-2xs">
            <img src={goofyRocketTrader} alt="Plans Mascot" className="w-full h-full object-cover" />
          </span>
          <span className="text-[#dc2626] font-bold">Plans:</span>{' '}
          <span className="font-semibold text-slate-800">
            {primaryPlan
              ? `${primaryPlan.advertisedReturn} For ${primaryPlan.duration} (Principal included) -- Total return: 180%`
              : '2.0% Daily Forever For Lifetime (Principal included) -- Total return: 180%'}
          </span>
          <span className="goofy-emoji-pop text-xs inline-block">🎯</span>
        </p>

        <p className="text-[#475569] flex items-center gap-1 flex-wrap">
          <span className="font-medium">Min deposit:</span>{' '}
          <strong className="text-slate-900 font-mono">${project.minInvestment || 10}</strong>
          <span className="goofy-emoji-bounce text-[10px] inline-block">💵</span>
          <span className="text-slate-300 font-bold">|</span>
          <span className="font-medium">Max deposit:</span>{' '}
          <strong className="text-slate-900 font-mono">${project.maxInvestment ? project.maxInvestment.toLocaleString() : '15,000'}</strong>
          <span className="goofy-emoji-spin text-[10px] inline-block">🪙</span>
        </p>

        <p className="text-[#475569] flex items-center gap-1 flex-wrap">
          <span className="goofy-emoji-bounce text-[10px] inline-block">🤝</span>
          <span className="font-medium">Referral:</span>{' '}
          <strong className="text-slate-900 font-bold">{project.referralPercentage || '4% - 1%'}</strong>
          <span className="goofy-emoji-pop text-[10px] inline-block">🎁</span>
          <span className="text-slate-300 font-bold">|</span>
          <span className="goofy-emoji-2 text-[10px] inline-block">⚡</span>
          <span className="font-medium">Withdrawal:</span>{' '}
          <span className="px-1 py-0.2 rounded-xs bg-[#0284c7] text-white font-bold text-[10px]">Manual</span>
          <span className="goofy-emoji-bounce text-[10px] inline-block">🔐</span>
        </p>

        {/* Crypto Coin icons & Accepted Payments */}
        <div className="flex flex-wrap items-center gap-1 pt-1">
          {project.paymentMethods && project.paymentMethods.length > 0 ? (
            project.paymentMethods.map((method, idx) => {
              const m = method.toLowerCase();
              let icon = '🪙';
              let bg = '#64748b';
              let title = method;

              if (m.includes('btc') || m.includes('bitcoin')) {
                icon = '₿';
                bg = '#f7931a';
              } else if (m.includes('trc20') || (m.includes('usdt') && !m.includes('erc20') && !m.includes('bep20'))) {
                icon = '₮';
                bg = '#26a17b';
                title = 'USDT (TRC20)';
              } else if (m.includes('bep20') || (m.includes('usdt') && m.includes('bep20'))) {
                icon = '₮';
                bg = '#f3ba2f';
                title = 'USDT (BEP20)';
              } else if (m.includes('erc20') || (m.includes('usdt') && m.includes('erc20'))) {
                icon = '₮';
                bg = '#627eea';
                title = 'USDT (ERC20)';
              } else if (m.includes('eth') || m.includes('ethereum')) {
                icon = 'Ξ';
                bg = '#627eea';
              } else if (m.includes('ltc') || m.includes('litecoin')) {
                icon = 'Ł';
                bg = '#345d9d';
              } else if (m.includes('trx') || m.includes('tron')) {
                icon = 'TRX';
                bg = '#eb0029';
              } else if (m.includes('bnb')) {
                icon = 'BNB';
                bg = '#f3ba2f';
              } else if (m.includes('sol') || m.includes('solana')) {
                icon = '◎';
                bg = '#14f195';
              } else if (m.includes('doge') || m.includes('dogecoin')) {
                icon = 'Ð';
                bg = '#c2a633';
              } else if (m.includes('ton')) {
                icon = 'TON';
                bg = '#0088cc';
              } else if (m.includes('xmr') || m.includes('monero')) {
                icon = 'ɱ';
                bg = '#ff6600';
              } else if (m.includes('epay') || m.includes('epaycore')) {
                icon = 'EP';
                bg = '#10b981';
              } else if (m.includes('dash')) {
                icon = 'D';
                bg = '#008ce6';
              }

              return (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1 shadow-2xs"
                  style={{ backgroundColor: bg }}
                  title={`Accepted Payment: ${title}`}
                >
                  <span className="font-mono text-[9px]">{icon}</span>
                  <span className="text-[9px] hidden sm:inline">{method.split(' ')[0]}</span>
                </span>
              );
            })
          ) : (
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-[#f7931a] text-white flex items-center justify-center text-[10px] font-black" title="Bitcoin">
                ₿
              </span>
              <span className="w-4 h-4 rounded-full bg-[#26a17b] text-white flex items-center justify-center text-[10px] font-black" title="Tether USDT TRC20">
                ₮
              </span>
              <span className="w-4 h-4 rounded-full bg-[#345d9d] text-white flex items-center justify-center text-[9px] font-black" title="Litecoin">
                Ł
              </span>
              <span className="w-4 h-4 rounded-full bg-[#627eea] text-white flex items-center justify-center text-[9px] font-black" title="Ethereum">
                Ξ
              </span>
              <span className="w-4 h-4 rounded-full bg-[#eb0029] text-white flex items-center justify-center text-[8px] font-black" title="TRON">
                TRX
              </span>
            </div>
          )}
        </div>

        {/* Forum badges */}
        <div className="flex flex-wrap items-center gap-1 text-[9px] text-[#0284c7] font-bold pt-0.5">
          <span className="px-1 py-0.2 rounded-xs border border-[#bae6fd] bg-[#f0f9ff]">MMGP</span>
          <span className="px-1 py-0.2 rounded-xs border border-[#bae6fd] bg-[#f0f9ff]">PF1</span>
          <span className="px-1 py-0.2 rounded-xs border border-[#bae6fd] bg-[#f0f9ff]">DMT</span>
          <span className="px-1 py-0.2 rounded-xs border border-[#bae6fd] bg-[#f0f9ff]">MM4</span>
          <span className="px-1 py-0.2 rounded-xs border border-[#bae6fd] bg-[#f0f9ff]">RC</span>
        </div>
      </div>

      {/* 4. BOOKMARK BUTTON */}
      <div className="shrink-0">
        <button
          type="button"
          onClick={handleWatchToggle}
          disabled={watchLoading}
          className={`p-1.5 rounded-sm hover:bg-[#f1f5f9] transition-colors cursor-pointer ${
            watched ? 'text-[#e11d48]' : 'text-[#94a3b8] hover:text-[#475569]'
          }`}
          title={watched ? 'Remove bookmark' : 'Bookmark this project'}
        >
          <Bookmark className={`w-4 h-4 ${watched ? 'fill-[#e11d48]' : ''}`} />
        </button>
      </div>
    </div>
  );
};
