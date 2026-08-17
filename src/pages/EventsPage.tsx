import React, { useState, useEffect } from 'react';
import { Activity, Filter, Clock, ExternalLink } from 'lucide-react';
import { api } from '../services/api.ts';
import { IEvent } from '../types.ts';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { Pagination } from '../components/common/Pagination.tsx';
import { formatLiveEventTime } from '../utils/dateUtils.ts';

export const EventsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .getEvents({
        type: type !== 'ALL' ? type : '',
        page: page.toString(),
        limit: '20',
      })
      .then((res) => {
        setEvents(res.events);
        setTotalPages(Math.ceil(res.total / 20) || 1);
      })
      .finally(() => setLoading(false));
  }, [type, page]);

  const eventTypes = [
    { label: 'All Events', value: 'ALL' },
    { label: 'Status Changes', value: 'STATUS_CHANGED' },
    { label: 'Payment Reports', value: 'PAYMENT_REPORTED' },
    { label: 'Problem Reports', value: 'PROBLEM_REPORTED' },
    { label: 'New Project Added', value: 'PROJECT_ADDED' },
    { label: 'Reviews', value: 'REVIEW_ADDED' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Real-Time Monitoring Activity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Live Events & Activity Feed
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Chronological stream of status changes, payout confirmations, risk score updates, and problem reports.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {eventTypes.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setType(opt.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              type === opt.value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl divide-y divide-slate-800/60 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading live events...</div>
        ) : events.length > 0 ? (
          events.map((evt) => (
            <div
              key={evt.id}
              onClick={() => navigate(`/hyips/${evt.projectSlug}`)}
              className="p-4 hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-4 cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-100 text-sm">{evt.projectName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-semibold uppercase">
                    {evt.type.replace(/_/g, ' ')}
                  </span>
                  {evt.newStatus && <StatusBadge status={evt.newStatus} size="sm" />}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{evt.message}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-400" />
                    <span className="font-semibold text-slate-200">{formatLiveEventTime(evt.createdAt)}</span>
                  </span>
                  {evt.monitorName && <span>Reported by: <strong className="text-slate-300">{evt.monitorName}</strong></span>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">No events recorded under this filter.</div>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};
