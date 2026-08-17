import React, { useState, useEffect } from 'react';
import { Heart, AlertTriangle, ShieldCheck, ArrowRight, Trash2 } from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { IProject } from '../types.ts';
import { ProjectCard } from '../components/common/ProjectCard.tsx';
import { CardSkeleton } from '../components/common/Pagination.tsx';

export const WatchlistPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    api
      .getWatchlist()
      .then((res) => setWatchlist(res.watchlist))
      .finally(() => setLoading(false));
  }, [user]);

  const handleWatchToggle = (projectId: string, isWatched: boolean) => {
    if (!isWatched) {
      setWatchlist((prev) => prev.filter((p) => p.id !== projectId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-rose-400" />
          <span>My Tracked Programs</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Personal HYIP Watchlist
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Projects you are monitoring. If any program on your watchlist is downgraded to PROBLEM or NOT PAID, you receive automated alerts.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : watchlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {watchlist.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              navigate={navigate}
              isWatched={true}
              onWatchToggle={handleWatchToggle}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-[#111827] border border-slate-800 rounded-xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Your watchlist is currently empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the heart icon on any project card in the directory to bookmark and receive real-time status alerts.
          </p>
          <button
            onClick={() => navigate('/hyips')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer"
          >
            Explore Directory
          </button>
        </div>
      )}
    </div>
  );
};
