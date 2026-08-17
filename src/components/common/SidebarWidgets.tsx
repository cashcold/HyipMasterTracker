import React, { useState, useEffect } from 'react';
import {
  Headphones,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Activity,
  MessageSquare,
  Sparkles,
  BarChart3,
  Zap,
  Shield,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { IProject, IReview, IEvent } from '../../types.ts';
import { RiskScoreGauge } from './RiskScoreGauge.tsx';
import { StatusBadge } from './StatusBadge.tsx';
import {
  formatLiveEventTime,
  formatLiveReviewDate,
  formatLiveProjectAge,
} from '../../utils/dateUtils.ts';
import goofyVaultGuardian from '../../assets/images/goofy_vault_guardian_1786742800081.jpg';
import goofyCryptoMascot from '../../assets/images/goofy_crypto_mascot_1786742789221.jpg';
import goofyRocketTrader from '../../assets/images/goofy_rocket_trader_1786742811873.jpg';
import goofyRiskScore from '../../assets/images/goofy_risk_score_1786739631521.jpg';

interface SidebarWidgetsProps {
  navigate: (path: string) => void;
  showMonitoring?: boolean;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({
  navigate,
  showMonitoring = false,
}) => {
  const [newProjects, setNewProjects] = useState<IProject[]>([]);
  const [latestReviews, setLatestReviews] = useState<IReview[]>([]);
  const [latestEvents, setLatestEvents] = useState<IEvent[]>([]);
  const [problemProjects, setProblemProjects] = useState<IProject[]>([]);
  const [monitoringProjects, setMonitoringProjects] = useState<IProject[]>([]);
  const [, setTick] = useState(0);

  const fetchWidgetsData = () => {
    // New Projects (natural top order)
    api
      .getProjects({ limit: '7' })
      .then((res) => {
        setNewProjects(res.projects);
        setMonitoringProjects(res.projects.slice(0, 3));
      })
      .catch(() => {});

    // Latest Reviews
    api
      .getReviews({ limit: '5' })
      .then((res) => setLatestReviews(res.reviews))
      .catch(() => {});

    // Latest Events
    api
      .getEvents({ limit: '6' })
      .then((res) => setLatestEvents(res.events))
      .catch(() => {});

    // Problem / Scam Projects
    api
      .getProjects({ status: 'PROBLEMATIC', limit: '6' })
      .then((res) => setProblemProjects(res.projects))
      .catch(() => {});
  };

  useEffect(() => {
    fetchWidgetsData();

    // Auto update clock tick and refresh data periodically
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 w-full text-xs">
      {/* 1. INVEST-TRACING SPONSOR AD BANNER WITH GOOFY MASCOT */}
      <div className="bg-white border border-[#cbd5e1] rounded-sm p-3 shadow-xs text-center relative overflow-hidden">
        <div className="border border-[#e2e8f0] p-3 rounded bg-gradient-to-b from-[#f8fafc] to-[#eef2f6]">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black tracking-wider text-[#0284c7] uppercase">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>INVEST-TRACING</span>
          </div>

          <div className="my-2.5 flex justify-center relative">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 goofy-img-animated-1 shadow-md bg-slate-950">
              <img src={goofyVaultGuardian} alt="Guardian Sponsor" className="w-full h-full object-cover" />
            </div>
          </div>

          <p className="text-[11px] font-black text-[#1e293b] uppercase tracking-wide flex items-center justify-center gap-1">
            <span>CAPITAL ASSURANCE</span>
          </p>
          <p className="text-[10px] font-semibold text-[#0284c7] flex items-center justify-center gap-1">
            <span className="goofy-emoji-bounce inline-block text-[10px]">🛡️</span>
            <span>24/7 Verified Support & Escrow</span>
          </p>
        </div>
      </div>

      {/* 2. MONITORING WIDGET (when shown on details page or home) */}
      {showMonitoring && monitoringProjects.length > 0 && (
        <div className="bg-white border border-[#cbd5e1] rounded-sm shadow-xs overflow-hidden">
          <div className="bg-[#1e293b] text-white px-3 py-1.5 font-bold text-xs uppercase tracking-wide text-center flex items-center justify-center gap-1.5">
            <div className="w-4 h-4 rounded-full overflow-hidden border border-sky-400 inline-block shrink-0 goofy-img-animated-3">
              <img src={goofyRocketTrader} alt="Monitoring" className="w-full h-full object-cover" />
            </div>
            <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
            <span>Active Monitoring</span>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {monitoringProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/hyips/${p.slug}`)}
                className="p-2.5 hover:bg-[#f8fafc] transition-colors cursor-pointer flex items-center justify-between gap-2"
              >
                <div>
                  <span className="font-bold text-[#1e293b] block truncate">{p.name}</span>
                  <span className="text-[10px] text-[#64748b]">Invested: ${(p.ourInvestment || 2500).toLocaleString('en-US')}</span>
                </div>
                <StatusBadge status="PAYING" size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. NEW HYIPs WIDGET */}
      <div className="bg-white border border-[#cbd5e1] rounded-sm shadow-xs overflow-hidden">
        <div className="bg-[#1e293b] text-white px-3 py-1.5 font-bold text-xs uppercase tracking-wide text-center flex items-center justify-center gap-1.5">
          <div className="w-4 h-4 rounded-full overflow-hidden border border-amber-400 inline-block shrink-0 goofy-img-animated-1">
            <img src={goofyCryptoMascot} alt="New Mascot" className="w-full h-full object-cover" />
          </div>
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>New Opportunities</span>
        </div>
        <div className="divide-y divide-[#f1f5f9]">
          {newProjects.length > 0 ? (
            newProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/hyips/${p.slug}`)}
                className="p-2 hover:bg-[#f8fafc] transition-colors cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="truncate">
                  <span className="font-bold text-[#1e293b] block truncate">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-[#64748b]">
                    {formatLiveProjectAge(p.lifetimeDays, p.dateAdded || p.createdAt)}
                  </span>
                </div>
                <RiskScoreGauge score={p.riskScore} size="circle" />
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-[11px] text-[#94a3b8]">Loading listings...</div>
          )}
        </div>
      </div>

      {/* 4. LATEST REVIEWS WIDGET */}
      <div className="bg-white border border-[#cbd5e1] rounded-sm shadow-xs overflow-hidden">
        <div className="bg-[#1e293b] text-white px-3 py-1.5 font-bold text-xs uppercase tracking-wide text-center flex items-center justify-center gap-1.5">
          <div className="w-4 h-4 rounded-full overflow-hidden border border-emerald-400 inline-block shrink-0 goofy-img-animated-2">
            <img src={goofyVaultGuardian} alt="Feedback Mascot" className="w-full h-full object-cover" />
          </div>
          <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
          <span>Investor Feedback</span>
        </div>
        <div className="divide-y divide-[#f1f5f9]">
          {latestReviews.length > 0 ? (
            latestReviews.map((rev) => (
              <div
                key={rev.id}
                onClick={() => navigate(`/hyips/${rev.projectSlug}`)}
                className="p-2 hover:bg-[#f8fafc] transition-colors cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="truncate">
                  <span className="font-bold text-[#1e293b] block truncate">{rev.projectName}</span>
                  <span className="text-[10px] text-[#64748b]">
                    {formatLiveReviewDate(rev.createdAt)}
                  </span>
                </div>
                <RiskScoreGauge score={rev.rating} size="circle" />
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-[11px] text-[#94a3b8]">No recent reviews.</div>
          )}
        </div>
      </div>

      {/* 5. LATEST EVENTS WIDGET */}
      <div className="bg-white border border-[#cbd5e1] rounded-sm shadow-xs overflow-hidden">
        <div className="bg-[#1e293b] text-white px-3 py-1.5 font-bold text-xs uppercase tracking-wide text-center flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Latest Ledger Events</span>
        </div>
        <div className="divide-y divide-[#f1f5f9]">
          {latestEvents.length > 0 ? (
            latestEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => navigate(`/hyips/${evt.projectSlug}`)}
                className="p-2 hover:bg-[#f8fafc] transition-colors cursor-pointer text-[11px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0284c7] truncate">
                    {evt.projectName}
                  </span>
                </div>
                <div className="text-[10px] text-[#64748b] flex items-center gap-1 mt-0.5 flex-wrap">
                  <span>Monitor:</span>
                  <span className="font-semibold text-[#334155]">{evt.monitorName || evt.source || 'HyipHome'}</span>
                  <span>• {formatLiveEventTime(evt.createdAt)}</span>
                </div>
                {evt.newStatus && (
                  <div className="mt-1 flex items-center gap-1.5 text-[9px]">
                    <span className="text-[#64748b]">changed</span>
                    {evt.oldStatus && (
                      <StatusBadge status={evt.oldStatus} size="sm" />
                    )}
                    <span className="text-[#64748b]">»</span>
                    <StatusBadge status={evt.newStatus} size="sm" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-[11px] text-[#94a3b8]">No recent events.</div>
          )}
        </div>
      </div>

      {/* 6. PROBLEMATIC HYIP & SCAM WIDGET */}
      <div className="bg-white border border-rose-300/80 rounded-sm shadow-xs overflow-hidden">
        <div className="bg-rose-50 text-[#991b1b] border-b border-rose-200 px-3 py-1.5 font-bold text-xs uppercase tracking-wide flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full overflow-hidden border border-rose-400 inline-block shrink-0 goofy-emoji-pulse">
              <img src={goofyRiskScore} alt="Scam Mascot" className="w-full h-full object-cover" />
            </div>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>High Risk & Scam Alerts</span>
          </div>
          <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider">
            FLAGGED
          </span>
        </div>
        <div className="divide-y divide-[#f1f5f9]">
          {problemProjects.length > 0 ? (
            problemProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/hyips/${p.slug}`)}
                className="p-2 hover:bg-[#fef2f2] transition-colors cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="truncate flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#991b1b] block truncate">{p.name}</span>
                  </div>
                  <span className="text-[10px] text-[#64748b]">
                    Status: <strong className="text-rose-600 font-bold">{p.status || 'PROBLEM'}</strong>
                  </span>
                </div>
                <StatusBadge status={p.status || 'PROBLEM'} size="sm" />
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-[11px] text-[#94a3b8]">No reported scams today.</div>
          )}
        </div>
      </div>
    </div>
  );
};
