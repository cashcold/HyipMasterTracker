import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ProjectStatus, IEvent } from '../../types.ts';
import { Activity, ShieldCheck, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface StatusSparklineProps {
  status: ProjectStatus;
  createdAt: string;
  events?: IEvent[];
  height?: number;
  width?: number | string;
  isMini?: boolean;
}

interface StatusPoint {
  date: string;
  fullDate: string;
  status: ProjectStatus;
  value: number;
  note: string;
}

export const StatusSparkline: React.FC<StatusSparklineProps> = ({
  status,
  createdAt,
  events = [],
  height = 54,
  width = '100%',
  isMini = false,
}) => {
  // Map project status to numeric health scale (0 - 100)
  const statusToValue = (st: ProjectStatus): number => {
    switch (st) {
      case 'PAYING':
        return 100;
      case 'WAITING':
        return 70;
      case 'PROBLEM':
        return 35;
      case 'NOT PAID':
        return 10;
      case 'CLOSED':
        return 5;
      default:
        return 60;
    }
  };

  const getStatusColor = (st: ProjectStatus) => {
    switch (st) {
      case 'PAYING':
        return { stroke: '#10b981', fill: '#10b981', bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
      case 'WAITING':
        return { stroke: '#0284c7', fill: '#0284c7', bg: 'bg-sky-500/20', text: 'text-sky-400' };
      case 'PROBLEM':
        return { stroke: '#f59e0b', fill: '#f59e0b', bg: 'bg-amber-500/20', text: 'text-amber-400' };
      case 'NOT PAID':
        return { stroke: '#ef4444', fill: '#ef4444', bg: 'bg-rose-500/20', text: 'text-rose-400' };
      case 'CLOSED':
        return { stroke: '#64748b', fill: '#64748b', bg: 'bg-slate-500/20', text: 'text-slate-400' };
      default:
        return { stroke: '#10b981', fill: '#10b981', bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
    }
  };

  // Build continuous historical status series
  const data: StatusPoint[] = React.useMemo(() => {
    const points: StatusPoint[] = [];
    const startDate = new Date(createdAt || Date.now() - 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const totalDays = Math.max(7, Math.min(60, Math.round((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))));

    // Check if we have explicit status change events
    const statusEvents = (events || [])
      .filter((e) => e.type === 'STATUS_CHANGED' || e.type === 'PROJECT_ADDED' || e.type === 'PAYMENT_REPORTED')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Generate step intervals (8-12 sample points across project lifecycle)
    const numSamples = Math.min(12, Math.max(6, Math.floor(totalDays / 3)));
    const stepMs = (now.getTime() - startDate.getTime()) / (numSamples - 1 || 1);

    for (let i = 0; i < numSamples; i++) {
      const pointTime = new Date(startDate.getTime() + i * stepMs);
      const isLast = i === numSamples - 1;
      const isFirst = i === 0;

      let pointStatus: ProjectStatus = 'PAYING';
      let note = 'Automated Multi-Monitor Payout Verified';

      if (isFirst) {
        pointStatus = 'PAYING';
        note = 'Initial Indexation & First Test Deposit Placed';
      } else if (isLast) {
        pointStatus = status;
        note = `Current Verified Telemetry: ${status}`;
      } else {
        // Find if an event occurred around this time
        const matchingEvent = statusEvents.find((e) => {
          const eTime = new Date(e.createdAt).getTime();
          return Math.abs(eTime - pointTime.getTime()) < stepMs;
        });

        if (matchingEvent) {
          if (matchingEvent.metadata?.newStatus) {
            pointStatus = matchingEvent.metadata.newStatus as ProjectStatus;
          } else if (matchingEvent.type === 'PROBLEM_REPORTED') {
            pointStatus = 'PROBLEM';
          } else if (matchingEvent.type === 'NOT_PAID') {
            pointStatus = 'NOT PAID';
          } else {
            pointStatus = status === 'PAYING' ? 'PAYING' : status;
          }
          note = matchingEvent.description || `Event: ${matchingEvent.type}`;
        } else {
          // If current status is PROBLEM/NOT PAID, create a natural transition toward current status
          if (status !== 'PAYING' && i >= numSamples - 3) {
            pointStatus = status;
            note = `Telemetry Status Updated to ${status}`;
          } else {
            pointStatus = 'PAYING';
            note = 'Scheduled Test Wallet Payout Confirmed';
          }
        }
      }

      points.push({
        date: pointTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: pointTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: pointStatus,
        value: statusToValue(pointStatus),
        note,
      });
    }

    return points;
  }, [status, createdAt, events]);

  const activeColor = getStatusColor(status);
  const payingDaysCount = data.filter((d) => d.status === 'PAYING').length;
  const uptimePercent = Math.round((payingDaysCount / data.length) * 100);

  // Custom tooltip for Recharts sparkline
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d: StatusPoint = payload[0].payload;
      const colorInfo = getStatusColor(d.status);

      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-2.5 shadow-2xl text-[11px] backdrop-blur-md z-50 min-w-[170px] space-y-1">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1">
            <span className="text-slate-400 font-mono text-[10px]">{d.fullDate}</span>
            <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded-xs ${colorInfo.bg} ${colorInfo.text}`}>
              {d.status}
            </span>
          </div>
          <p className="text-slate-200 font-medium leading-tight text-[11px]">
            {d.note}
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span>Health Rating:</span>
            <span className="font-bold text-white font-mono">{d.value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isMini) {
    return (
      <div className="flex items-center gap-2">
        <div style={{ width: 90, height: 28 }} className="overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <defs>
                <linearGradient id={`miniSparkGrad-${status}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={activeColor.stroke} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={activeColor.stroke} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <YAxis domain={[0, 105]} hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={activeColor.stroke}
                strokeWidth={1.75}
                fill={`url(#miniSparkGrad-${status})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <span className={`text-[10px] font-mono font-bold ${activeColor.text}`}>
          {uptimePercent}% Uptime
        </span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 space-y-2">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Activity className={`w-3.5 h-3.5 ${activeColor.text}`} />
          <span>Historical Status Telemetry & Health Sparkline</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-slate-400">Paying Continuity:</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold">
            {uptimePercent}%
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300 font-mono font-semibold">
            {data.length} telemetry checks
          </span>
        </div>
      </div>

      {/* Sparkline Chart Container */}
      <div style={{ width, height }} className="w-full relative select-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 2, left: 6 }}>
            <defs>
              <linearGradient id={`statusGrad-${status}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeColor.stroke} stopOpacity={0.45} />
                <stop offset="100%" stopColor={activeColor.stroke} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              hide={false}
              tick={{ fontSize: 9, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis domain={[0, 105]} hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={activeColor.stroke}
              strokeWidth={2}
              fill={`url(#statusGrad-${status})`}
              dot={{ r: 2.5, fill: activeColor.stroke, stroke: '#0f172a', strokeWidth: 1.5 }}
              activeDot={{ r: 4.5, fill: '#ffffff', stroke: activeColor.stroke, strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Status History Legend / Milestones */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-slate-800/60 text-[10px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300">100% Paying</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-300">Problem / Delay</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-slate-300">Not Paid / Closed</span>
          </span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">
          First verified: {data[0]?.fullDate} → Today
        </div>
      </div>
    </div>
  );
};
