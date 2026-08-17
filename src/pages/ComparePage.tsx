import React, { useState, useEffect } from 'react';
import { Layers, Plus, X, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../services/api.ts';
import { IProject } from '../types.ts';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { RiskScoreGauge } from '../components/common/RiskScoreGauge.tsx';

export const ComparePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [allProjects, setAllProjects] = useState<IProject[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [comparedProjects, setComparedProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPicker, setSearchPicker] = useState('');

  // Initial load
  useEffect(() => {
    api.getProjects({ limit: '50' }).then((res) => {
      setAllProjects(res.projects);
      if (res.projects.length >= 2) {
        setSelectedSlugs([res.projects[0].slug, res.projects[1].slug]);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedSlugs.length === 0) {
      setComparedProjects([]);
      return;
    }
    setLoading(true);
    api
      .compareProjects(selectedSlugs)
      .then((res) => setComparedProjects(res.projects))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedSlugs]);

  const addProject = (slug: string) => {
    if (selectedSlugs.length < 4 && !selectedSlugs.includes(slug)) {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
  };

  const removeProject = (slug: string) => {
    setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Side-by-Side Comparison Matrix</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Compare Monitored HYIPs
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Evaluate up to 4 investment programs side-by-side across payout status, risk scores, lifetime age, deposit thresholds, and monitor consensus.
        </p>
      </div>

      {/* Project Selector Bar */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-300">Comparing ({selectedSlugs.length}/4):</span>
          {comparedProjects.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-slate-200"
            >
              <span>{p.name}</span>
              <button
                onClick={() => removeProject(p.slug)}
                className="text-slate-400 hover:text-rose-400 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        {selectedSlugs.length < 4 && (
          <div className="flex items-center gap-2">
            <select
              value=""
              onChange={(e) => e.target.value && addProject(e.target.value)}
              className="bg-slate-900 text-xs text-slate-200 py-1.5 px-3 rounded-lg border border-slate-800 cursor-pointer"
            >
              <option value="">+ Add Project to Compare</option>
              {allProjects
                .filter((p) => !selectedSlugs.includes(p.slug))
                .map((p) => (
                  <option key={p.id} value={p.slug}>
                    {p.name} ({p.status})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Matrix Table */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs">Loading comparison matrix...</div>
      ) : comparedProjects.length > 0 ? (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800">
                  <th className="p-4 w-48 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                    Parameter
                  </th>
                  {comparedProjects.map((p) => (
                    <th key={p.id} className="p-4 min-w-[200px] border-l border-slate-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.logo}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-cover bg-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-black text-sm text-white block">{p.name}</span>
                            <span className="text-[10px] text-slate-400">{p.domain}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeProject(p.slug)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {/* Status */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Payout Status</td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-800">
                      <StatusBadge status={p.status} size="md" />
                    </td>
                  ))}
                </tr>

                {/* Risk Score */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Risk Indicator</td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-800">
                      <RiskScoreGauge score={p.riskScore} level={p.riskLevel} size="md" />
                    </td>
                  ))}
                </tr>

                {/* Lifetime */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Lifetime</td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-800 font-bold text-slate-200">
                      {p.lifetimeDays} Days Online
                    </td>
                  ))}
                </tr>

                {/* Advertised Plan */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Advertised Plan</td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-800 text-blue-400 font-bold">
                      {p.plans?.[0]?.advertisedReturn || 'Custom'} ({p.plans?.[0]?.duration || 'Standard'})
                    </td>
                  ))}
                </tr>

                {/* Min / Max Deposit */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Min - Max Investment</td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-800 font-semibold">
                      ${p.minInvestment} - ${p.maxInvestment?.toLocaleString()}
                    </td>
                  ))}
                </tr>

                {/* Referral */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Referral Commission</td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-800 font-semibold">
                      {p.referralPercentage || '5%'}
                    </td>
                  ))}
                </tr>

                {/* Withdrawal Type */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Withdrawals</td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-800">
                      {p.withdrawalMethods || 'Instant'}
                    </td>
                  ))}
                </tr>

                {/* Active Monitors */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Monitors Reporting</td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-800 font-bold text-emerald-400">
                      {p.monitorStatuses?.length || 0} Sources
                    </td>
                  ))}
                </tr>

                {/* Community Rating */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Community Rating</td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-800">
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {p.rating?.toFixed(1) || '7.0'} / 10 ({p.reviewCount || 0} reviews)
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Full Profile</td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-800">
                      <button
                        onClick={() => navigate(`/hyips/${p.slug}`)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center bg-[#111827] border border-slate-800 rounded-xl space-y-3">
          <p className="text-sm font-bold text-slate-300">Select projects to compare</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Use the dropdown selector above to choose 2 or more projects to compare side-by-side.
          </p>
        </div>
      )}
    </div>
  );
};
