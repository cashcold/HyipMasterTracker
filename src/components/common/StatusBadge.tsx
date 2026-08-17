import React from 'react';
import { ProjectStatus } from '../../types.ts';

interface StatusBadgeProps {
  status: ProjectStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  count?: number;
  disableBlink?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  count,
  disableBlink = false,
}) => {
  const normalized = (status || 'UNKNOWN').toUpperCase();

  let bgClass = 'bg-slate-600 text-white border border-slate-500/50';
  let animationClass = disableBlink ? '' : 'status-badge-closed';
  let dotBg = 'bg-slate-300';
  let dotPingBg = 'bg-slate-400';
  let label = normalized;

  switch (normalized) {
    case 'PAYING':
      bgClass = 'bg-[#16a34a] text-white border border-emerald-400/50';
      animationClass = disableBlink ? '' : 'status-badge-paying';
      dotBg = 'bg-emerald-200';
      dotPingBg = 'bg-emerald-300';
      label = 'PAYING';
      break;

    case 'WAITING':
      bgClass = 'bg-[#0284c7] text-white border border-sky-400/50';
      animationClass = disableBlink ? '' : 'status-badge-waiting';
      dotBg = 'bg-sky-200';
      dotPingBg = 'bg-sky-300';
      label = 'WAITING';
      break;

    case 'PROBLEM':
    case 'PROBLEMATIC':
      bgClass = 'bg-[#ea580c] text-white border border-orange-400/60 font-black';
      animationClass = disableBlink ? '' : 'status-badge-problem';
      dotBg = 'bg-amber-200';
      dotPingBg = 'bg-amber-400';
      label = 'PROBLEM';
      break;

    case 'NOT PAID':
    case 'NOT_PAID':
    case 'SCAM':
      bgClass = 'bg-[#dc2626] text-white border border-rose-400/70 font-black';
      animationClass = disableBlink ? '' : 'status-badge-scam';
      dotBg = 'bg-rose-100';
      dotPingBg = 'bg-rose-400';
      label = normalized === 'SCAM' ? 'SCAM' : 'NOT PAID';
      break;

    case 'CLOSED':
      bgClass = 'bg-[#475569] text-slate-200 border border-slate-600/50';
      animationClass = disableBlink ? '' : 'status-badge-closed';
      dotBg = 'bg-slate-400';
      dotPingBg = 'bg-slate-500';
      label = 'CLOSED';
      break;

    default:
      bgClass = 'bg-slate-600 text-white border border-slate-500/40';
      animationClass = disableBlink ? '' : 'status-badge-closed';
      dotBg = 'bg-slate-300';
      dotPingBg = 'bg-slate-400';
      label = normalized;
  }

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1 font-bold',
    md: 'text-[11px] px-2 py-0.5 gap-1.5 font-bold',
    lg: 'text-xs px-2.5 py-1 gap-1.5 font-black',
  }[size];

  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-sm tracking-wider uppercase select-none transition-all duration-300 ${bgClass} ${animationClass} ${sizeClasses}`}
    >
      {/* Blinking / Pulsing Live Beacon Dot */}
      <span className="relative flex items-center justify-center shrink-0">
        {!disableBlink && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 status-dot-ping ${dotPingBg}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${dotSize} ${dotBg}`} />
      </span>

      <span className="w-3.5 h-3.5 rounded-full bg-white/25 flex items-center justify-center text-[9px] font-black leading-none shrink-0">
        H
      </span>

      <span className="truncate">{label}</span>

      {count !== undefined && count > 0 && (
        <span className="ml-0.5 px-1 py-0.2 bg-black/25 rounded text-[9px] font-bold">
          {count}
        </span>
      )}
    </span>
  );
};

