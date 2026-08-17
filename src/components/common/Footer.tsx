import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import goofyCryptoMascot from '../../assets/images/goofy_crypto_mascot_1786742789221.jpg';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-white border-t border-[#cbd5e1] text-[#475569] text-xs mt-8">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 goofy-img-animated-1 bg-[#1e293b] shrink-0">
                <img src={goofyCryptoMascot} alt="Goofy Mascot" className="w-full h-full object-cover" />
              </div>
              <span className="font-black text-base text-[#1e293b] flex items-center gap-1">
                <span>Hyip<span className="text-[#0284c7]">Master</span><span className="text-[#64748b]">Tracker</span></span>
                <span className="goofy-emoji-bounce text-sm">🛡️</span>
                <span className="goofy-emoji-pop text-sm">🤑</span>
              </span>
            </div>
            <p className="text-xs text-[#64748b] leading-relaxed max-w-sm">
              Independent HYIP monitoring, algorithmic risk assessment, multi-monitor payout verification, and high-yield investment program research platform.
            </p>

            {/* Goofy insurance guarantee footer stamp */}
            <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-bold flex items-center gap-2">
              <span className="goofy-emoji-bounce text-base">🛡️</span>
              <div>
                <span>HyipMasterTracker Insurance Active</span>
                <p className="text-[10px] font-normal text-amber-800">Your deposits are tracked and backed with our protection pool! 🚀</p>
              </div>
            </div>

            {/* Direct Contact Channels */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://t.me/hyipmastertracker"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0088cc] hover:bg-[#0077b5] text-white text-[11px] font-bold transition-colors"
                title="Telegram Support"
              >
                <span className="goofy-emoji-spin text-xs">💬</span>
                <span>Telegram Support</span>
              </a>
              <a
                href="https://wa.me/?text=Hello%20HyipMasterTracker%20Support"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#25d366] hover:bg-[#20bd5a] text-white text-[11px] font-bold transition-colors"
                title="WhatsApp Support"
              >
                <span className="goofy-emoji-bounce text-xs">📱</span>
                <span>WhatsApp Direct</span>
              </a>
            </div>
          </div>

          {/* Directory Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1e293b] uppercase tracking-wider text-xs">Directory</h4>
            <ul className="space-y-1 text-[#475569]">
              <li>
                <button onClick={() => navigate('/hyips')} className="hover:text-[#1e293b] hover:underline cursor-pointer">
                  All HYIPs Directory
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/new-projects')} className="hover:text-[#1e293b] hover:underline cursor-pointer">
                  New Project Submissions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/paying')} className="hover:text-emerald-700 hover:underline cursor-pointer">
                  Paying Programs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/problems')} className="hover:text-amber-700 hover:underline cursor-pointer">
                  Problem & Blacklist
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/monitors')} className="hover:text-[#1e293b] hover:underline cursor-pointer">
                  Monitors Ranking
                </button>
              </li>
            </ul>
          </div>

          {/* Research & Tools */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1e293b] uppercase tracking-wider text-xs">Research & Tools</h4>
            <ul className="space-y-1 text-[#475569]">
              <li>
                <button onClick={() => navigate('/events')} className="hover:text-[#1e293b] hover:underline cursor-pointer">
                  Live Event Stream
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/reviews')} className="hover:text-[#1e293b] hover:underline cursor-pointer">
                  Community Reviews
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/compare')} className="hover:text-[#1e293b] hover:underline cursor-pointer">
                  Side-by-Side Compare
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/statistics')} className="hover:text-[#1e293b] hover:underline cursor-pointer">
                  Platform Analytics
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/advertise')} className="hover:text-[#1e293b] hover:underline cursor-pointer">
                  Advertise With Us
                </button>
              </li>
            </ul>
          </div>

          {/* Information & Legal */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1e293b] uppercase tracking-wider text-xs">Information</h4>
            <ul className="space-y-1 text-[#475569]">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-[#1e293b] hover:underline cursor-pointer">
                  About Platform
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/disclaimer')} className="hover:text-amber-700 font-semibold hover:underline cursor-pointer">
                  Risk Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-[#1e293b] hover:underline cursor-pointer">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/add-project')} className="hover:text-[#1e293b] hover:underline cursor-pointer">
                  Submit HYIP
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Big Legal Warning Block */}
        <div className="p-3.5 rounded-sm bg-[#f8fafc] border border-[#cbd5e1] text-[11px] leading-relaxed text-[#64748b] space-y-1 mb-6">
          <div className="flex items-center gap-1.5 font-bold text-[#334155] uppercase tracking-wide">
            <ShieldAlert className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Important Monitoring & Legal Notice</span>
          </div>
          <p>
            HyipMasterTracker is an independent monitoring and information platform. Information displayed on this website may come from project submissions, third-party monitors, community reports, or internal analysis. We do not guarantee the accuracy, legitimacy, profitability, safety, or future performance of any listed project. HYIPs and similar programs can involve substantial risk, including total loss of invested capital.
          </p>
          <p>
            HyipMasterTracker is not an investment fund, does not accept deposits, does not hold customer funds, and does not provide financial advice.
          </p>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-3 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#64748b]">
          <p>© 2026 HyipMasterTracker. All rights reserved. Independent monitoring platform.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/disclaimer')} className="hover:underline cursor-pointer">
              Risk Disclosure
            </button>
            <button onClick={() => navigate('/about')} className="hover:underline cursor-pointer">
              Methodology
            </button>
            <button onClick={() => navigate('/contact')} className="hover:underline cursor-pointer">
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
