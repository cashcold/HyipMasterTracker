import React, { useState, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  Shield,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { IProject } from '../types.ts';
import { ProjectCard } from '../components/common/ProjectCard.tsx';
import { SidebarWidgets } from '../components/common/SidebarWidgets.tsx';
import { RiskWarningBanner } from '../components/common/RiskWarningBanner.tsx';

interface HyipsPageProps {
  navigate: (path: string) => void;
  initialStatus?: string;
}

export const HyipsPage: React.FC<HyipsPageProps> = ({ navigate, initialStatus }) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [status, setStatus] = useState(initialStatus || 'ALL');
  const [risk, setRisk] = useState('all');
  const [investment, setInvestment] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.getProjects({
        status: status !== 'ALL' ? status : '',
        risk: risk !== 'all' ? risk : '',
        investment: investment !== 'all' ? investment : '',
        search: search.trim(),
        sort,
        page: page.toString(),
        limit: '15',
      });
      setProjects(res.projects);
      setTotalPages(res.pagination.totalPages);
      setTotalCount(res.pagination.total);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [status, risk, investment, sort, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  const handleResetFilters = () => {
    setStatus('ALL');
    setRisk('all');
    setInvestment('all');
    setSearch('');
    setSort('default');
    setPage(1);
  };

  const statusOptions = [
    { label: 'All Programs', value: 'ALL' },
    { label: 'PAYING', value: 'PAYING' },
    { label: 'WAITING', value: 'WAITING' },
    { label: 'PROBLEM', value: 'PROBLEM' },
    { label: 'NOT PAID', value: 'NOT PAID' },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-3 sm:px-4 py-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: FILTER PANEL & HYIP LISTINGS */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-3">
          {/* Filter & Search Bar */}
          <div className="bg-white border border-[#cbd5e1] rounded-sm p-3 shadow-xs space-y-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {statusOptions.map((opt) => {
                const isSelected = status === opt.value;
                let dotColor = '';
                let dotPingColor = '';
                let hasBlink = false;

                if (opt.value === 'PAYING') {
                  dotColor = 'bg-emerald-500';
                  dotPingColor = 'bg-emerald-400';
                  hasBlink = true;
                } else if (opt.value === 'WAITING') {
                  dotColor = 'bg-sky-500';
                  dotPingColor = 'bg-sky-400';
                  hasBlink = true;
                } else if (opt.value === 'PROBLEM') {
                  dotColor = 'bg-amber-500';
                  dotPingColor = 'bg-amber-400';
                  hasBlink = true;
                } else if (opt.value === 'NOT PAID') {
                  dotColor = 'bg-rose-500';
                  dotPingColor = 'bg-rose-400';
                  hasBlink = true;
                }

                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setStatus(opt.value);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-sm text-xs font-bold whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                      isSelected
                        ? opt.value === 'PAYING'
                          ? 'bg-emerald-700 text-white shadow-xs status-badge-paying'
                          : opt.value === 'PROBLEM'
                          ? 'bg-amber-700 text-white shadow-xs status-badge-problem'
                          : opt.value === 'NOT PAID'
                          ? 'bg-rose-700 text-white shadow-xs status-badge-scam'
                          : opt.value === 'WAITING'
                          ? 'bg-sky-700 text-white shadow-xs status-badge-waiting'
                          : 'bg-[#1e293b] text-white shadow-xs'
                        : 'bg-[#f8fafc] text-[#475569] hover:bg-[#e2e8f0] border border-[#cbd5e1]'
                    }`}
                  >
                    {hasBlink && (
                      <span className="relative flex h-2 w-2">
                        <span className={`status-dot-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotPingColor}`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
                      </span>
                    )}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search and Secondary filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <form onSubmit={handleSearchSubmit} className="relative sm:col-span-1">
                <input
                  type="text"
                  placeholder="Search HYIPs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#f8fafc] text-xs text-[#1e293b] placeholder-[#94a3b8] pl-7 pr-2 py-1.5 rounded-sm border border-[#cbd5e1] focus:outline-hidden focus:border-[#1e293b]"
                />
                <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-2 top-1/2 -translate-y-1/2" />
              </form>

              <div>
                <select
                  value={risk}
                  onChange={(e) => {
                    setRisk(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#f8fafc] text-xs text-[#334155] py-1.5 px-2 rounded-sm border border-[#cbd5e1] cursor-pointer"
                >
                  <option value="all">All Risk Tiers</option>
                  <option value="very_high">High Confidence (8-10)</option>
                  <option value="moderate">Moderate Risk (5-7.9)</option>
                  <option value="critical">High/Critical Risk (&lt;5)</option>
                </select>
              </div>

              <div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full bg-[#f8fafc] text-xs text-[#334155] py-1.5 px-2 rounded-sm border border-[#cbd5e1] cursor-pointer"
                >
                  <option value="default">Directory Order (FIFO)</option>
                  <option value="newest">Newest Added</option>
                  <option value="highest-risk-score">Highest Score</option>
                  <option value="longest-lifetime">Longest Lifetime</option>
                  <option value="most-reviews">Most Reviews</option>
                </select>
              </div>
            </div>

            {/* Results count & reset */}
            <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-[11px] text-[#64748b]">
              <span>
                Found <strong className="text-[#1e293b]">{totalCount}</strong> investment programs
              </span>
              {(status !== 'ALL' || risk !== 'all' || search) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[#dc2626] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Table Header Bar */}
          <div className="bg-[#1e293b] text-white px-3 py-2 rounded-t-sm flex items-center justify-between shadow-xs">
            <div className="font-black text-sm uppercase tracking-wide flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Directory Listings</span>
            </div>
            <span className="text-[11px] text-slate-300 flex items-center gap-1 font-mono">
              <span>Page {page} of {totalPages}</span>
            </span>
          </div>

          {/* Subheader Column Labels */}
          <div className="bg-[#e2e8f0] border-x border-b border-[#cbd5e1] px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-[#475569] select-none">
            <div className="flex items-center gap-12 sm:gap-24">
              <span>#HYIP Program</span>
              <span className="hidden sm:inline">Monitor Status</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-[10px]">
              <span className="text-[#16a34a] font-bold">10 Low</span>
              <span className="text-[#334155]">»Risk«</span>
              <span className="text-[#dc2626] font-bold">0 High</span>
            </div>
          </div>

          {/* Listings */}
          <div className="bg-white border-x border-b border-[#cbd5e1] rounded-b-sm shadow-xs divide-y divide-[#e2e8f0]">
            {loading ? (
              <div className="p-8 text-center text-xs text-[#64748b]">Loading programs...</div>
            ) : projects.length > 0 ? (
              projects.map((p) => (
                <ProjectCard key={p.id} project={p} navigate={navigate} />
              ))
            ) : (
              <div className="p-8 text-center text-xs text-[#64748b]">
                No projects matched your criteria.
              </div>
            )}
          </div>

          {/* Pagination bar */}
          <div className="bg-white border border-[#cbd5e1] rounded-sm p-2.5 flex items-center justify-between text-xs">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-[#cbd5e1] hover:bg-[#f8fafc] disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <span className="text-[#64748b] text-[11px]">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded bg-[#1e293b] text-white hover:bg-[#0f172a] disabled:opacity-40 cursor-pointer"
            >
              Next Page
            </button>
          </div>

          <RiskWarningBanner />
        </main>

        {/* RIGHT COLUMN: SIDEBAR */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <SidebarWidgets navigate={navigate} />
        </aside>
      </div>
    </div>
  );
};
