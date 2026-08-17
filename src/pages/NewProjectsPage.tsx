import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertOctagon, Filter } from 'lucide-react';
import { api } from '../services/api.ts';
import { IProject } from '../types.ts';
import { ProjectCard } from '../components/common/ProjectCard.tsx';
import { RiskWarningBanner } from '../components/common/RiskWarningBanner.tsx';
import { CardSkeleton, Pagination } from '../components/common/Pagination.tsx';

export const NewProjectsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .getProjects({ page: page.toString(), limit: '12' })
      .then((res) => {
        setProjects(res.projects);
        setTotalPages(res.pagination.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Recently Listed Programs</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          New HYIP Submissions & Additions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Newly registered and monitored programs added to the HyipMasterTracker index.
        </p>
      </div>

      <RiskWarningBanner compact />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} navigate={navigate} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#111827] border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-xs">No newly added projects found.</p>
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export const PayingProjectsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .getProjects({ status: 'PAYING', page: page.toString(), limit: '12' })
      .then((res) => {
        setProjects(res.projects);
        setTotalPages(res.pagination.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Active Payout Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Paying HYIP Programs
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Programs with current positive multi-monitor payout confirmations. Remember that past payments never guarantee future solvency.
        </p>
      </div>

      <RiskWarningBanner compact />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} navigate={navigate} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#111827] border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-xs">No paying projects found.</p>
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export const ProblemProjectsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .getProjects({ status: 'PROBLEMATIC', page: page.toString(), limit: '12' })
      .then((res) => {
        setProjects(res.projects);
        setTotalPages(res.pagination.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-semibold">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>High Caution / Scam Warnings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Problem & Not Paid Programs
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Programs experiencing withdrawal delays, selective payouts, or reported as insolvent by community telemetry and verified monitors. DO NOT DEPOSIT.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-200 leading-relaxed font-medium">
        <strong>Warning:</strong> The projects listed below have confirmed payment issues or have ceased paying investors. Deposits to these websites will almost certainly result in complete loss.
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} navigate={navigate} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#111827] border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-xs">No problem projects currently flagged.</p>
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};
