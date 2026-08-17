import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import goofyRiskScore from '../../assets/images/goofy_risk_score_1786739631521.jpg';

export const RiskWarningBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (compact) {
    return (
      <div className="bg-[#fffbeb] border-y border-[#fde68a] px-3 py-1.5 text-xs text-[#92400e] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 max-w-[1280px] mx-auto w-full">
          <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400 goofy-emoji-pulse shrink-0 bg-slate-950">
            <img src={goofyRiskScore} alt="Risk Warning Mascot" className="w-full h-full object-cover" />
          </div>
          <AlertTriangle className="w-3.5 h-3.5 text-[#d97706] shrink-0" />
          <p className="truncate text-[11px]">
            <strong className="font-bold">High Risk Disclosure:</strong> HYIPs are speculative. Status data is informational monitoring and never a guarantee of legitimacy or payout safety.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fffbeb] border border-[#fde68a] rounded-sm p-3 shadow-xs text-xs text-[#92400e] relative overflow-hidden">
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-500 goofy-img-animated-2 shrink-0 bg-slate-950 shadow-sm mt-0.5">
          <img src={goofyRiskScore} alt="Goofy Alert Mascot" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-1 text-[11px] leading-relaxed">
          <div className="flex items-center justify-between">
            <h4 className="font-bold uppercase tracking-wide text-xs text-[#b45309] flex items-center gap-1.5">
              <span className="goofy-emoji-bounce inline-block text-xs">⚠️</span>
              <span>Important Risk Warning & Monitoring Notice</span>
            </h4>
            <button
              onClick={() => setDismissed(true)}
              className="text-[#92400e] hover:text-[#78350f] p-0.5 cursor-pointer"
              aria-label="Dismiss warning"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p>
            High-Yield Investment Programs (HYIPs) are extremely high-risk speculative programs with substantial probability of sudden capital loss. <strong>HyipMasterTracker does not accept deposits, hold funds, or guarantee investment returns.</strong>
          </p>
          <p className="text-[#a16207]">
            All indicators, status reports, and scores are for informational & research purposes only. Always conduct your own independent due diligence.
          </p>
        </div>
      </div>
    </div>
  );
};

