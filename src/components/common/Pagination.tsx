import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxButtons = 5;
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + maxButtons - 1);

  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - maxButtons + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`min-w-[36px] h-9 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            p === currentPage
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-800 rounded w-1/2" />
          <div className="h-3 bg-slate-800 rounded w-1/3" />
        </div>
      </div>
      <div className="h-10 bg-slate-800 rounded-lg" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-8 bg-slate-800 rounded" />
        <div className="h-8 bg-slate-800 rounded" />
        <div className="h-8 bg-slate-800 rounded" />
      </div>
      <div className="h-9 bg-slate-800 rounded-lg" />
    </div>
  );
};
