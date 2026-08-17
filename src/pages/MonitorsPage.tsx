import React, { useState, useEffect } from 'react';
import { ShieldCheck, ExternalLink, Activity, Star, Layers } from 'lucide-react';
import { api } from '../services/api.ts';
import { IMonitor } from '../types.ts';

export const MonitorsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [monitors, setMonitors] = useState<IMonitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMonitors()
      .then((res) => setMonitors(res.monitors))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Independent Data Aggregation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Third-Party Monitors & Trust Index
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          HyipMasterTracker aggregates status data and payout proofs from recognized independent HYIP monitoring platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs">Loading monitor sources...</div>
        ) : (
          monitors.map((m) => (
            <div key={m.id} className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-base">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{m.name}</h3>
                    <p className="text-[11px] text-slate-400">{m.website}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  {m.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{m.description}</p>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Trust Index</span>
                  <span className="text-base font-black text-emerald-400">{m.trustScore.toFixed(1)} / 10.0</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Projects Monitored</span>
                  <span className="text-base font-black text-slate-200">{m.projectsReported}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
