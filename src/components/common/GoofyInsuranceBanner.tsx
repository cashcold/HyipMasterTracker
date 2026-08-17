import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, X, CheckCircle, ExternalLink, HelpCircle, AlertCircle, Shield, Coins, DollarSign, Zap, Lock } from 'lucide-react';
import goofyVaultGuardian from '../../assets/images/goofy_vault_guardian_1786742800081.jpg';
import goofyCryptoMascot from '../../assets/images/goofy_crypto_mascot_1786742789221.jpg';
import goofyInsuranceVault from '../../assets/images/goofy_insurance_vault_1786739654102.jpg';
import goofyRocketTrader from '../../assets/images/goofy_rocket_trader_1786742811873.jpg';

interface GoofyInsuranceBannerProps {
  navigate?: (path: string) => void;
}

export const GoofyInsuranceBanner: React.FC<GoofyInsuranceBannerProps> = ({ navigate }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleClaim = () => {
    const text = encodeURIComponent('Hello HyipMasterTracker Support, I would like to submit a deposit insurance compensation claim for a problem project.');
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (dismissed) {
    return (
      <div className="bg-[#0f172a] text-white border-b border-amber-400/60 py-1 px-3 text-center text-[11px] flex items-center justify-between">
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 w-full hover:underline font-bold text-amber-300 cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400 goofy-img-animated-1 shrink-0">
            <img src={goofyVaultGuardian} alt="Guardian" className="w-full h-full object-cover" />
          </div>
          <span>HyipMasterTracker Official Deposit Insurance ($75,000+ Active Reserve)</span>
        </button>
        <button
          onClick={() => setDismissed(false)}
          className="text-[10px] text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700 cursor-pointer shrink-0 ml-2"
        >
          Expand
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Top Insurance Banner */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white border-b border-amber-500/40 shadow-xs relative overflow-hidden z-40 select-none">
        {/* Mobile View: Compact Row */}
        <div className="sm:hidden flex items-center justify-between px-2.5 py-1.5 gap-1.5 text-[11px] relative z-10">
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-1.5 truncate text-left cursor-pointer flex-1"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-400 goofy-img-animated-1 shrink-0 bg-slate-950">
              <img src={goofyVaultGuardian} alt="Vault Guardian" className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-amber-400 uppercase tracking-tight text-[10px] truncate">
              HyipMasterTracker
            </span>
            <span className="font-bold text-white text-[10px] uppercase truncate">
              • Insured $75K
            </span>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleOpenModal}
              className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs cursor-pointer"
            >
              Vault
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              title="Minimize banner"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Desktop View: Full Rich Banner */}
        <div className="hidden sm:flex max-w-[1280px] mx-auto px-4 py-2 items-center justify-between gap-3 text-xs relative z-10">
          {/* Left / Center: Mascots + Shield + Slogan */}
          <div
            onClick={handleOpenModal}
            className="flex items-center gap-3 cursor-pointer group hover:opacity-95 transition-all"
            title="Click to view HyipMasterTracker Insurance Coverage & Protection Fund"
          >
            {/* Animated Goofy Mascot Duo */}
            <div className="flex items-center -space-x-2 shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-400 goofy-img-animated-1 shadow-md bg-slate-950 z-10">
                <img src={goofyVaultGuardian} alt="Vault Guardian" className="w-full h-full object-cover" />
              </div>
              <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-emerald-400 goofy-img-animated-2 shadow-md bg-slate-950">
                <img src={goofyCryptoMascot} alt="Crypto Mascot" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                <span>HyipMasterTracker</span>
              </span>

              <span className="font-black text-xs uppercase tracking-wide text-slate-100 flex items-center gap-1.5">
                <span>OFFICIAL PROTECTION RESERVE</span>
                <span className="text-amber-400 font-extrabold text-[11px] tracking-normal">
                  ($75,000+ Active Liquidity Pool)
                </span>
              </span>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenModal}
              className="px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-slate-900" />
              <span>Coverage Details</span>
            </button>

            <button
              onClick={handleClaim}
              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Claim compensation or refund via 24/7 direct support"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Claim Coverage</span>
            </button>
          </div>
        </div>
      </div>

      {/* Insurance Protection & Guarantee Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#0f172a] text-white border border-amber-400/60 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Close */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Image with Goofy Insurance Vault */}
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-700 shadow-md">
              <img
                src={goofyInsuranceVault}
                alt="Institutional Reserve Vault"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-black/30 to-transparent" />
              
              {/* Top Floating Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-400 text-amber-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>$75,000+ Verified Reserve Pool</span>
              </div>

              {/* Floating Mascot Badges with Clear Labels */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 goofy-img-animated-1 shadow-2xl bg-slate-950">
                    <img src={goofyVaultGuardian} alt="Guardian" className="w-full h-full object-cover" />
                  </div>
                  <span className="mt-0.5 px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs">
                    Guardian
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400 goofy-img-animated-2 shadow-2xl bg-slate-950">
                    <img src={goofyCryptoMascot} alt="Mascot" className="w-full h-full object-cover" />
                  </div>
                  <span className="mt-0.5 px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs">
                    Mascot
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2 pt-1">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
                HyipMasterTracker Official Protection Guarantee
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                HyipMasterTracker Insurance Covers You
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Invest with institutional confidence. Our community deposit insurance reserve compensates verified participants in case of sudden program insolvency or selective payouts.
              </p>
            </div>

            {/* Key Pillars of Coverage with Goofy Mascot Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-lg bg-slate-900 border border-amber-400/30 space-y-1.5 relative overflow-hidden group">
                <div className="flex justify-center pb-0.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400/60 shadow-xs">
                    <img src={goofyVaultGuardian} alt="Guardian" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="font-bold text-amber-400 text-xs uppercase">Insurance Pool</div>
                <div className="font-black text-white text-base font-mono">$75,000+</div>
                <div className="text-[10px] text-slate-400">Active liquid reserve</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-emerald-400/30 space-y-1.5 relative overflow-hidden group">
                <div className="flex justify-center pb-0.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-400/60 shadow-xs">
                    <img src={goofyCryptoMascot} alt="Mascot" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="font-bold text-emerald-400 text-xs uppercase">Payout Speed</div>
                <div className="font-black text-white text-base font-mono">24 Hours</div>
                <div className="text-[10px] text-slate-400">Fast refund claim review</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-sky-400/30 space-y-1.5 relative overflow-hidden group">
                <div className="flex justify-center pb-0.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-sky-400/60 shadow-xs">
                    <img src={goofyRocketTrader} alt="Rocket Trader" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="font-bold text-sky-400 text-xs uppercase">RCB Bonus</div>
                <div className="font-black text-white text-base font-mono">Up to 100%</div>
                <div className="text-[10px] text-slate-400">Referral commission back</div>
              </div>
            </div>

            {/* How It Works Steps */}
            <div className="space-y-2.5 bg-slate-900/90 p-4 rounded-lg border border-slate-800 text-xs">
              <h4 className="font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>How HyipMasterTracker Insurance Protects You:</span>
              </h4>

              <ul className="space-y-2.5 text-slate-300 text-left">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-black flex items-center justify-center shrink-0 text-xs border border-amber-400/40">1</span>
                  <span><strong>Register under our Ref Link:</strong> Join any monitored program using the verified referral link provided on our platform.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-black flex items-center justify-center shrink-0 text-xs border border-amber-400/40">2</span>
                  <span><strong>Automated Insurance Allocation:</strong> Up to $2,500 per insured project is locked in the community protection vault.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-black flex items-center justify-center shrink-0 text-xs border border-amber-400/40">3</span>
                  <span><strong>Instant Compensation:</strong> If a project stops paying or enters PROBLEM / SCAM status, submit your deposit proof within 48 hours for pro-rata compensation.</span>
                </li>
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleClaim}
                className="w-full sm:w-auto px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" />
                <span>Submit Refund Claim</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
