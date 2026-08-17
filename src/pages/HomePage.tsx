import React, { useState, useEffect } from 'react';
import {
  Info,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  AlertOctagon,
  Coins,
  X,
  Layers,
  CheckCircle2,
  Radio,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { IProject } from '../types.ts';
import { ProjectCard } from '../components/common/ProjectCard.tsx';
import { SidebarWidgets } from '../components/common/SidebarWidgets.tsx';
import { RiskWarningBanner } from '../components/common/RiskWarningBanner.tsx';
import { CryptoPaymentSection } from '../components/home/CryptoPaymentSection.tsx';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [selectedPayment, setSelectedPayment] = useState<string>('all');
  const [stats, setStats] = useState<{ total: number; paying: number; problem: number; notPaid: number; closed: number }>({
    total: 9,
    paying: 5,
    problem: 1,
    notPaid: 1,
    closed: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const params: Record<string, string> = {
          page: currentPage.toString(),
          limit: '10',
        };
        if (selectedPayment && selectedPayment !== 'all') {
          params.paymentMethod = selectedPayment;
        }
        const res = await api.getProjects(params);
        setProjects(res.projects || []);
        setTotalPages(res.pagination?.totalPages || 1);
        if (res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentPage, selectedPayment]);

  const handleSelectPayment = (paymentMethod: string) => {
    setSelectedPayment(paymentMethod);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-3 sm:px-4 py-3 space-y-4">
      {/* PROFESSIONAL LIVE TELEMETRY TICKER */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 shadow-xs hover:border-amber-400/50 transition-colors">
          <div className="space-y-0.5">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>Programs</span>
            </div>
            <div className="text-xl font-black text-amber-300 font-mono">{stats.total}</div>
            <div className="text-[10px] text-slate-500 font-medium">Active in Directory</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 shadow-xs hover:border-emerald-400/50 transition-colors">
          <div className="space-y-0.5">
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>Paying Consensus</span>
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono">{stats.paying}</div>
            <div className="text-[10px] text-slate-500 font-medium">Verified Payouts</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 shadow-xs hover:border-blue-400/50 transition-colors">
          <div className="space-y-0.5">
            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>Multi-Monitor Feeds</span>
            </div>
            <div className="text-xl font-black text-blue-300 font-mono">18+</div>
            <div className="text-[10px] text-slate-500 font-medium">Cross-Verified Sources</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-sm">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 shadow-xs hover:border-rose-400/50 transition-colors">
          <div className="space-y-0.5">
            <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>Scam Alerts Logged</span>
            </div>
            <div className="text-xl font-black text-rose-400 font-mono">{stats.problem + stats.notPaid}</div>
            <div className="text-[10px] text-slate-500 font-medium">Instant Flagging</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-sm">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 0. CRYPTO PAYMENT METHODS, GATEWAYS & LIVE CONVERSION CALCULATOR */}
      <CryptoPaymentSection
        selectedPayment={selectedPayment}
        onSelectPayment={handleSelectPayment}
      />

      {/* 2-Column Main Layout: Left = HYIPs table list, Right = Sidebar Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: HYIPs TABLE LIST */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-3">
          {/* Active Filter Notice if filtered */}
          {selectedPayment && selectedPayment !== 'all' && (
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-2 flex items-center justify-between text-xs text-blue-900 font-semibold">
              <div className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-blue-600" />
                <span>Filtering programs accepting payment: <strong className="text-blue-700">{selectedPayment}</strong></span>
              </div>
              <button
                onClick={() => handleSelectPayment('all')}
                className="text-blue-700 hover:text-blue-950 font-bold flex items-center gap-0.5 cursor-pointer underline text-[11px]"
              >
                <X className="w-3 h-3" /> Clear Filter
              </button>
            </div>
          )}

          {/* 1. TOP NAVY SECTION HEADER: (i) HYIPs & PAGINATION */}
          <div className="bg-[#1e293b] text-white px-3 py-2 rounded-t-sm flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-1.5 font-black text-sm uppercase tracking-wide">
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                i
              </div>
              <span>HYIPs {selectedPayment !== 'all' ? `(${selectedPayment})` : ''}</span>
            </div>

            {/* Pagination links: Prev 1 2 Next */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  currentPage <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:text-white hover:bg-slate-700'
                }`}
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentPage(1)}
                className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer ${
                  currentPage === 1 ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'
                }`}
              >
                1
              </button>
              <button
                onClick={() => setCurrentPage(2)}
                className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer ${
                  currentPage === 2 ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'
                }`}
              >
                2
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  currentPage >= totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:text-white hover:bg-slate-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>

          {/* 2. SUBHEADER COLUMN LABELS ROW */}
          <div className="bg-[#e2e8f0] border-x border-b border-[#cbd5e1] px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-[#475569] select-none">
            <div className="flex items-center gap-12 sm:gap-24">
              <span>#HYIP Program</span>
              <span className="hidden sm:inline">Monitor Status</span>
            </div>

            {/* 10 Low »Risk« 0 High Indicator */}
            <div className="flex items-center gap-1 font-semibold text-[10px]">
              <span className="text-[#16a34a] font-bold">10 Low</span>
              <span className="text-[#334155]">»Risk«</span>
              <span className="text-[#dc2626] font-bold">0 High</span>
            </div>
          </div>

          {/* 3. PROJECT LIST ROWS */}
          <div className="bg-white border-x border-b border-[#cbd5e1] rounded-b-sm shadow-xs divide-y divide-[#e2e8f0]">
            {loading ? (
              <div className="p-8 text-center text-xs text-[#64748b] space-y-2">
                <div className="w-6 h-6 border-2 border-[#1e293b] border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Loading verified programs and monitor consensus...</p>
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  navigate={navigate}
                />
              ))
            ) : (
              <div className="p-8 text-center text-xs text-[#64748b]">
                No investment programs listed currently.
              </div>
            )}
          </div>

          {/* 4. BOTTOM PAGINATION BAR */}
          <div className="bg-white border border-[#cbd5e1] rounded-sm p-2.5 flex items-center justify-between text-xs">
            <span className="text-[#64748b] text-[11px]">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1 font-bold">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded border border-[#cbd5e1] hover:bg-[#f8fafc] disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded bg-[#1e293b] text-white hover:bg-[#0f172a] disabled:opacity-40 cursor-pointer"
              >
                Next Page
              </button>
            </div>
          </div>

          {/* 5. RISK DISCLAIMER */}
          <RiskWarningBanner />
        </main>

        {/* RIGHT COLUMN: SIDEBAR WIDGETS */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <SidebarWidgets navigate={navigate} />
        </aside>
      </div>
    </div>
  );
};
