import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Send,
  MessageCircle,
  HelpCircle,
  FileText,
  Clock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Zap,
  TrendingUp,
  BarChart3,
  Lock,
  Search,
  Activity,
  Award,
} from 'lucide-react';
import goofyInsuranceVault from '../assets/images/goofy_insurance_vault_1786739654102.jpg';
import goofyHumanSupport from '../assets/images/goofy_human_support_1786739642560.jpg';
import goofyVaultGuardian from '../assets/images/goofy_vault_guardian_1786742800081.jpg';
import goofyCryptoMascot from '../assets/images/goofy_crypto_mascot_1786742789221.jpg';

export const AboutPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Independent Verification Platform</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <span>About HyipMasterTracker</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Independent HYIP monitoring, algorithmic risk assessment, multi-monitor payout verification, and institutional-grade telemetry intelligence.
        </p>
      </div>

      {/* Visual Professional Financial Banner Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="relative aspect-video sm:aspect-auto overflow-hidden bg-slate-950">
            <img
              src={goofyInsuranceVault}
              alt="Cryptocurrency Capital Security & Reserve Vault"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-transparent via-transparent to-[#111827] opacity-90 sm:opacity-100" />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/90 border border-amber-400 text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>$75,000+ Active Reserve Pool</span>
            </div>
            {/* Mascot Accent */}
            <div className="absolute bottom-3 left-3 w-9 h-9 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-slate-950">
              <img src={goofyVaultGuardian} alt="Guardian" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-center space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Independent & Community-First</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Why Disciplined Investors Rely On Us
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              We bridge the gap between deceptive marketing and raw telemetry. Every project is continuously audited by automated multi-monitor cross-verification and experienced compliance analysts.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <div>
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Our Mission & Purpose</span>
          </h3>
          <p>
            HyipMasterTracker was established to bring transparency, algorithmic telemetry, and objective aggregation to the High-Yield Investment Program (HYIP) industry. The online investment landscape is filled with opaque claims, selective payout behaviors, and unverified promises. We operate purely as an independent analytical dashboard.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>How We Evaluate & Monitor HYIPs</span>
          </h3>
          <p className="mb-3">
            Our platform evaluates projects based on a combination of quantitative metrics and verified multi-source data:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span>Multi-Monitor Feed</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Aggregates signals from 18+ recognized global monitor hubs.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Algorithmic Risk Engine</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grades sustainability, domain lifespan, SSL, and script origin.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Instant Scam Alerts</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Automated problem downgrades on first verified withdrawal failure.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <h4 className="font-bold text-amber-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Clear Operational Boundaries
          </h4>
          <p className="text-xs text-slate-400">
            HyipMasterTracker is strictly an information, tracking, and review platform. We do not accept deposits, hold client money, manage investment portfolios, or guarantee financial returns.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const telegramAdmin = 'hyipmastertracker';
  const telegramLink = `https://t.me/${telegramAdmin}`;
  const whatsappLink = `https://wa.me/?text=Hello%20HyipMasterTracker%20Support%2C%20I%20have%20an%20inquiry%20regarding%20a%20project%20or%20advertising`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-semibold">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Direct Institutional Support Desk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <span>Contact HyipMasterTracker Team</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          No automated robot replies or ticket delays. Contact our administrators and editorial desk directly via Telegram or WhatsApp.
        </p>
      </div>

      {/* Visual Support Desk Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="relative aspect-video sm:aspect-auto overflow-hidden bg-slate-950">
            <img
              src={goofyHumanSupport}
              alt="Direct Human Support Desk"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-transparent via-transparent to-[#111827] opacity-90 sm:opacity-100" />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/90 border border-emerald-400 text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>24/7 Verified Support</span>
            </div>
            {/* Mascot Accent */}
            <div className="absolute bottom-3 left-3 w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-400 shadow-md bg-slate-950">
              <img src={goofyCryptoMascot} alt="Mascot" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-center space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Senior Staff • Dedicated Attention</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Direct Dispute & Verification Desk
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Whether you need to report a selective payment, verify a new program, or book high-visibility listings, our editors answer swiftly on Telegram & WhatsApp.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Telegram Direct Card */}
        <div className="bg-[#111827] border border-[#0088cc]/40 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 hover:border-[#0088cc] transition-colors">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0088cc] text-white flex items-center justify-center shadow-lg shadow-[#0088cc]/20">
              <Send className="w-7 h-7 -rotate-45" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#0088cc] uppercase tracking-wider block">
                Primary Instant Channel
              </span>
              <h3 className="text-xl font-black text-white mt-1">Telegram Support</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Connect with our head moderator and listing admin on Telegram for instant project status updates, banner ads, and scam disputes.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400">Direct Handle:</div>
              <div className="text-sm font-mono font-bold text-white">@{telegramAdmin}</div>
            </div>
          </div>

          <a
            href={telegramLink}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4 -rotate-45" />
            <span>Open Telegram Chat</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        {/* WhatsApp Direct Card */}
        <div className="bg-[#111827] border border-[#25d366]/40 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 hover:border-[#25d366] transition-colors">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#25d366] text-white flex items-center justify-center shadow-lg shadow-[#25d366]/20">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#25d366] uppercase tracking-wider block">
                Direct Messaging Support
              </span>
              <h3 className="text-xl font-black text-white mt-1">WhatsApp Chat</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Send messages directly to our editorial and compliance team on WhatsApp for immediate feedback on listings and payout verification.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400">Response Speed:</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Typically under 15 minutes</span>
              </div>
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open WhatsApp Chat</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Support FAQ details */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 text-xs text-slate-300 space-y-3">
        <h4 className="font-bold text-white text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Direct Contact Guidelines
        </h4>
        <p className="text-slate-400 leading-relaxed">
          When contacting our team regarding a specific project, please include the project name, domain URL, and any transaction batch hash or screenshot evidence for the quickest review.
        </p>
      </div>
    </div>
  );
};

export const DisclaimerPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-amber-400" />
          High-Yield Investment Risk Disclaimer
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Last Updated: 2026. Please read this statement carefully before using our platform.
        </p>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 font-semibold text-xs leading-relaxed">
          High-Yield Investment Programs (HYIPs) are extremely high-risk speculative programs with substantial probability of total loss. HyipMasterTracker is an independent monitoring and informational directory only. We do not accept deposits, hold funds, or guarantee investment returns.
        </div>

        <div>
          <h3 className="text-base font-bold text-white mb-2">1. Informational & Research Purpose</h3>
          <p>
            All information published on HyipMasterTracker, including status tags (PAYING, WAITING, PROBLEM, NOT PAID, CLOSED), the "HyipMasterTracker Risk Indicator", payout timestamps, and review scores, is compiled for informational and historical research purposes only. Nothing on this website constitutes financial, investment, legal, or tax advice.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-white mb-2">2. Payout Status & Historical Performance</h3>
          <p>
            A status badge marked as "PAYING" only indicates that payments were reported as received at the recorded time by third-party monitors or user submissions. <strong>Past payouts are not an indicator of future solvency.</strong> Programs may delay, selectively payout, or completely stop withdrawals at any moment without prior notice.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-white mb-2">3. No Endorsement or Liability</h3>
          <p>
            HyipMasterTracker and its operators assume zero responsibility or legal liability for any financial losses, damages, or disputes arising from your interaction with any third-party website listed on our platform. Never invest funds that you cannot afford to lose entirely.
          </p>
        </div>
      </div>
    </div>
  );
};
