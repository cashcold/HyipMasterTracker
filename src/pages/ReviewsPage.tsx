import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, ThumbsUp, Filter, Search, Flag } from 'lucide-react';
import { api } from '../services/api.ts';
import { IReview } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Pagination } from '../components/common/Pagination.tsx';
import { formatLiveReviewDate } from '../utils/dateUtils.ts';

export const ReviewsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .getReviews({
        category: category !== 'ALL' ? category : '',
        limit: '15',
      })
      .then((res) => {
        setReviews(res.reviews);
        setTotalPages(Math.ceil(res.total / 15) || 1);
      })
      .finally(() => setLoading(false));
  }, [category, page]);

  const handleVoteHelpful = async (id: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.voteHelpful(id);
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, helpfulCount: res.helpfulCount, helpfulVoters: res.helpfulVoters } : r
        )
      );
    } catch (err: any) {
      alert(err.message || 'Failed to vote');
    }
  };

  const categories = [
    'ALL',
    'Payment Experience',
    'Withdrawal Experience',
    'Technical Problem',
    'Support Experience',
    'Positive',
    'Negative',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Community Feedback Stream</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Community Reviews & Payment Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Unfiltered investor experiences, withdrawal confirmations, support evaluations, and technical issue reports.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              category === cat
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'All Reviews' : cat}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading community reviews...</div>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-md space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/hyips/${rev.projectSlug}`)}
                    className="font-bold text-sm text-blue-400 hover:underline cursor-pointer"
                  >
                    {rev.projectName}
                  </button>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
                    {rev.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {rev.rating}/10
                  </span>
                  <span className="text-[11px] font-semibold text-slate-300">
                    {formatLiveReviewDate(rev.createdAt)}
                  </span>
                </div>
              </div>

              <h4 className="font-bold text-slate-100 text-xs sm:text-sm">{rev.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{rev.content}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 text-[11px]">Submitted by {rev.userName}</span>
                <button
                  onClick={() => handleVoteHelpful(rev.id)}
                  className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({rev.helpfulCount || 0})</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-[#111827] border border-slate-800 rounded-xl">
            <p className="text-slate-400 text-xs">No reviews matching this category.</p>
          </div>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export const NotificationsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    api
      .getNotifications()
      .then((res) => setNotifications(res.notifications))
      .finally(() => setLoading(false));
  }, [user]);

  const handleMarkAllRead = async () => {
    await api.markNotificationRead('all');
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Notifications & Alerts</h1>
        <button
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-blue-400 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-xl divide-y divide-slate-800/60 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => n.projectSlug && navigate(`/hyips/${n.projectSlug}`)}
              className={`p-4 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-950/20 hover:bg-blue-950/30' : 'hover:bg-slate-800/40'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-200 text-xs">{n.title}</span>
                <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-300">{n.message}</p>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">You have no notifications yet.</div>
        )}
      </div>
    </div>
  );
};
