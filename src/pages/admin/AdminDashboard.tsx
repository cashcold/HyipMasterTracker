import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  FileCheck2,
  MessageSquare,
  ShieldCheck,
  Megaphone,
  Users,
  ScrollText,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Search,
  ExternalLink,
  ShieldAlert,
  Save,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { IProject, IProjectSubmission, IReview, IAuditLog, IUser, ISiteSettings, IMonitor, IAdvertisement } from '../../types.ts';
import { StatusBadge } from '../../components/common/StatusBadge.tsx';
import { RiskScoreGauge } from '../../components/common/RiskScoreGauge.tsx';

export const AdminDashboard: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'submissions' | 'reviews' | 'monitors' | 'ads' | 'users' | 'audit' | 'settings'>('overview');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Projects Tab State
  const [projects, setProjects] = useState<IProject[]>([]);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');

  // Submissions Tab State
  const [submissions, setSubmissions] = useState<IProjectSubmission[]>([]);

  // Reviews Tab State
  const [reviews, setReviews] = useState<IReview[]>([]);

  // Monitors Tab State
  const [monitors, setMonitors] = useState<IMonitor[]>([]);
  const [showNewMonitorModal, setShowNewMonitorModal] = useState(false);
  const [newMonitor, setNewMonitor] = useState({ name: '', website: '', trustScore: 8.5, description: '' });

  // Ads Tab State
  const [ads, setAds] = useState<IAdvertisement[]>([]);
  const [showNewAdModal, setShowNewAdModal] = useState(false);
  const [newAd, setNewAd] = useState({
    title: '',
    imageUrl: '',
    targetUrl: '',
    position: 'TOP_BANNER',
    sponsorName: '',
    isActive: true,
  });

  // Users Tab State
  const [usersList, setUsersList] = useState<IUser[]>([]);

  // Audit Logs Tab State
  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);

  // Settings Tab State
  const [settings, setSettings] = useState<ISiteSettings | null>(null);

  // Status/Risk Quick Edit Modal
  const [statusModalProject, setStatusModalProject] = useState<IProject | null>(null);
  const [newStatus, setNewStatus] = useState('PAYING');
  const [statusReason, setStatusReason] = useState('');
  const [newRiskScore, setNewRiskScore] = useState(7.0);

  // Guard check
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin' && user.role !== 'moderator') {
      navigate('/');
    }
  }, [user]);

  // Load Dashboard Data
  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await api.getProjects({ limit: '100', search: projectSearch });
      setProjects(res.projects);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSubmissions = async () => {
    try {
      const res = await api.getSubmissions();
      setSubmissions(res.submissions);
    } catch (err) {
      console.error(err);
    }
  };

  const loadReviews = async () => {
    try {
      const res = await api.getReviews({ limit: '100' });
      setReviews(res.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMonitors = async () => {
    try {
      const res = await api.getMonitors();
      setMonitors(res.monitors);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAds = async () => {
    try {
      const res = await api.adminGetAllAds();
      setAds(res.advertisements);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.getUsers({ limit: '100' });
      setUsersList(res.users);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAudit = async () => {
    try {
      const res = await api.getAuditLogs({ limit: '100' });
      setAuditLogs(res.auditLogs);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await api.getSettings();
      setSettings(res.settings);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') loadDashboard();
    if (activeTab === 'projects') loadProjects();
    if (activeTab === 'submissions') loadSubmissions();
    if (activeTab === 'reviews') loadReviews();
    if (activeTab === 'monitors') loadMonitors();
    if (activeTab === 'ads') loadAds();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'audit') loadAudit();
    if (activeTab === 'settings') loadSettings();
  }, [activeTab]);

  // Handle Project Status Update
  const handleUpdateStatusAndRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalProject) return;
    try {
      await api.updateProjectStatus(statusModalProject.id, {
        status: newStatus,
        reason: statusReason,
      });
      await api.updateProjectRisk(statusModalProject.id, {
        riskScore: newRiskScore,
        reason: `Admin updated risk to ${newRiskScore}/10. ${statusReason}`,
      });
      setStatusModalProject(null);
      loadProjects();
      if (activeTab === 'overview') loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Handle Delete Project
  const handleDeleteProject = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      try {
        await api.deleteProject(id);
        loadProjects();
      } catch (err: any) {
        alert(err.message || 'Failed to delete project');
      }
    }
  };

  // Handle Submissions
  const handleReviewSubmission = async (id: string, action: 'approve' | 'reject') => {
    const notes = prompt(`Enter optional admin note for ${action}:`) || '';
    try {
      await api.reviewSubmission(id, action, notes);
      loadSubmissions();
      if (activeTab === 'overview') loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to process submission');
    }
  };

  // Handle Review Moderation
  const handleModerateReview = async (id: string, status: string) => {
    try {
      await api.updateReviewStatus(id, status);
      loadReviews();
    } catch (err: any) {
      alert(err.message || 'Failed to update review status');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (window.confirm('Delete this review?')) {
      try {
        await api.deleteReview(id);
        loadReviews();
      } catch (err: any) {
        alert(err.message || 'Failed to delete review');
      }
    }
  };

  // Handle Add Monitor
  const handleCreateMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createMonitor(newMonitor);
      setShowNewMonitorModal(false);
      setNewMonitor({ name: '', website: '', trustScore: 8.5, description: '' });
      loadMonitors();
    } catch (err: any) {
      alert(err.message || 'Failed to create monitor');
    }
  };

  // Handle Add Ad
  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.adminCreateAd(newAd);
      setShowNewAdModal(false);
      setNewAd({ title: '', imageUrl: '', targetUrl: '', position: 'TOP_BANNER', sponsorName: '', isActive: true });
      loadAds();
    } catch (err: any) {
      alert(err.message || 'Failed to create advertisement');
    }
  };

  // Handle User Suspension / Role change
  const handleToggleSuspendUser = async (id: string) => {
    try {
      await api.toggleUserSuspension(id);
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to change user suspension');
    }
  };

  const handleChangeUserRole = async (id: string, role: string) => {
    try {
      await api.updateUserRole(id, role);
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user role');
    }
  };

  // Handle Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.updateSettings(settings);
      alert('Platform settings saved successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    }
  };

  // Handle Reset DB
  const handleResetDatabase = async () => {
    if (window.confirm('WARNING: Reset database to initial seed data? All new submissions and created items will revert.')) {
      try {
        await api.resetDatabase();
        alert('Database restored to initial state.');
        window.location.reload();
      } catch (err: any) {
        alert(err.message || 'Failed to reset database');
      }
    }
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'HYIP Listings', icon: FolderKanban },
    { id: 'submissions', label: 'Submissions Queue', icon: FileCheck2 },
    { id: 'reviews', label: 'Review Moderation', icon: MessageSquare },
    { id: 'monitors', label: 'Monitors & Sources', icon: ShieldCheck },
    { id: 'ads', label: 'Banner Ads & Sponsors', icon: Megaphone },
    { id: 'users', label: 'User Accounts', icon: Users },
    { id: 'audit', label: 'Audit Trail', icon: ScrollText },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800 font-bold uppercase tracking-wider">
              {user?.role} Access
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Admin & Moderation Control Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <button
              onClick={handleResetDatabase}
              className="px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database</span>
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Exit to Public Site
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar border-b border-slate-800/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-[#111827] text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading admin metrics...</div>
          ) : (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total HYIPs</span>
                  <span className="text-2xl font-black text-white block">
                    {dashboardData?.metrics?.totalProjects || 0}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Paying Rate</span>
                  <span className="text-2xl font-black text-emerald-300 block">
                    {dashboardData?.metrics?.payingPercentage || '0%'}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400">Problems Flagged</span>
                  <span className="text-2xl font-black text-amber-300 block">
                    {dashboardData?.metrics?.problemCount || 0}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-purple-400">Pending Queue</span>
                  <span className="text-2xl font-black text-purple-300 block">
                    {dashboardData?.metrics?.pendingSubmissions || 0}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-blue-400">Total Users</span>
                  <span className="text-2xl font-black text-blue-300 block">
                    {dashboardData?.metrics?.totalUsers || 0}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Active Ads</span>
                  <span className="text-2xl font-black text-white block">
                    {dashboardData?.metrics?.activeAds || 0}
                  </span>
                </div>
              </div>

              {/* Action Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Submissions */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-purple-400" />
                      Pending Submissions for Approval
                    </h3>
                    <button
                      onClick={() => setActiveTab('submissions')}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-2">
                    {dashboardData?.pendingSubmissionsList?.length > 0 ? (
                      dashboardData.pendingSubmissionsList.map((sub: IProjectSubmission) => (
                        <div
                          key={sub.id}
                          className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-100 block">{sub.projectData?.name}</span>
                            <span className="text-[11px] text-slate-400">{sub.projectData?.websiteUrl}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleReviewSubmission(sub.id, 'approve')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[11px] cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewSubmission(sub.id, 'reject')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-[11px] cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 p-4 text-center">No pending submissions awaiting review.</p>
                    )}
                  </div>
                </div>

                {/* Recent Audit Logs */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ScrollText className="w-4 h-4 text-blue-400" />
                      Recent Admin Operations
                    </h3>
                    <button
                      onClick={() => setActiveTab('audit')}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Full Audit
                    </button>
                  </div>

                  <div className="space-y-2">
                    {dashboardData?.recentAuditLogs?.length > 0 ? (
                      dashboardData.recentAuditLogs.slice(0, 5).map((log: IAuditLog) => (
                        <div
                          key={log.id}
                          className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200">{log.action.replace(/_/g, ' ')}</span>
                            <span className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{(log as any).details || `${log.entity} ID: ${log.entityId}`}</p>
                          <span className="text-[10px] text-slate-500">By {(log as any).userName || log.userEmail || 'System'}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 p-4 text-center">No audit logs recorded yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB CONTENT: PROJECTS MANAGEMENT */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadProjects()}
                className="w-full bg-slate-900 text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg border border-slate-800"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => navigate('/add-project')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Program</span>
            </button>
          </div>

          {/* Table of projects */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Project Name</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Risk Score</th>
                    <th className="p-3.5">Age</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Monitors</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <img src={p.logo} alt="" className="w-6 h-6 rounded bg-slate-800" referrerPolicy="no-referrer" />
                          <div>
                            <span>{p.name}</span>
                            <span className="block text-[10px] text-slate-400 font-normal">{p.domain}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={p.status} size="sm" />
                      </td>
                      <td className="p-3.5 font-bold">
                        <span className={p.riskScore >= 7 ? 'text-emerald-400' : p.riskScore >= 4 ? 'text-amber-400' : 'text-rose-400'}>
                          {p.riskScore.toFixed(1)} / 10
                        </span>
                      </td>
                      <td className="p-3.5">{p.lifetimeDays}d</td>
                      <td className="p-3.5">{p.category}</td>
                      <td className="p-3.5">{p.monitorStatuses?.length || 0} srcs</td>
                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setStatusModalProject(p);
                            setNewStatus(p.status);
                            setNewRiskScore(p.riskScore);
                            setStatusReason('');
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded font-bold text-[11px] cursor-pointer"
                        >
                          Status / Risk
                        </button>
                        <button
                          onClick={() => navigate(`/hyips/${p.slug}`)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                        >
                          View
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteProject(p.id, p.name)}
                            className="px-2 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded text-[11px]"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SUBMISSIONS QUEUE */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Pending HYIP Listings Queue</h2>
          <div className="bg-[#111827] border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden shadow-xl">
            {submissions.length > 0 ? (
              submissions.map((sub) => (
                <div key={sub.id} className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-black text-base text-white">{sub.projectData?.name}</h3>
                      <a
                        href={sub.projectData?.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>{sub.projectData?.websiteUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase ${
                        sub.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : sub.status === 'REJECTED'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {sub.projectData?.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-400">
                    <div>Category: <strong className="text-slate-200">{sub.projectData?.category}</strong></div>
                    <div>Min/Max: <strong className="text-slate-200">${sub.projectData?.minInvestment} - ${sub.projectData?.maxInvestment}</strong></div>
                    <div>Submitter: <strong className="text-slate-200">{sub.submitterEmail}</strong></div>
                    <div>Submitted: <strong className="text-slate-200">{new Date(sub.createdAt).toLocaleDateString()}</strong></div>
                  </div>

                  {sub.status === 'PENDING' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleReviewSubmission(sub.id, 'approve')}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        Approve & Publish to Directory
                      </button>
                      <button
                        onClick={() => handleReviewSubmission(sub.id, 'reject')}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        Reject Listing
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">No submissions in queue.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: REVIEW MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Community Reviews Moderation</h2>
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-[#111827] border border-slate-800 rounded-xl p-4 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{rev.projectName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-bold">
                      {rev.category}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        rev.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">Rating: {rev.rating}/10</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rev.content}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>By {rev.userName} • {new Date(rev.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1.5">
                    {rev.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleModerateReview(rev.id, 'APPROVED')}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold"
                      >
                        Approve
                      </button>
                    )}
                    {rev.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleModerateReview(rev.id, 'REJECTED')}
                        className="px-2.5 py-1 bg-amber-600 text-white rounded text-[11px] font-bold"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="px-2.5 py-1 bg-rose-950 text-rose-300 rounded text-[11px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MONITORS */}
      {activeTab === 'monitors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Aggregated Monitor Data Sources</h2>
            <button
              onClick={() => setShowNewMonitorModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Monitor Source</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monitors.map((m) => (
              <div key={m.id} className="bg-[#111827] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{m.name}</h3>
                  <span className="text-xs text-emerald-400 font-black">{m.trustScore.toFixed(1)}/10</span>
                </div>
                <p className="text-xs text-slate-400">{m.website}</p>
                <p className="text-xs text-slate-300">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: BANNER ADS */}
      {activeTab === 'ads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Sponsorship Banners & Placements</h2>
            <button
              onClick={() => setShowNewAdModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Ad Placement</span>
            </button>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden shadow-xl">
            {ads.map((ad) => (
              <div key={ad.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{ad.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold uppercase">
                      {ad.position}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${ad.isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-900 text-slate-400'}`}>
                      {ad.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <p className="text-slate-400">Target: {ad.targetUrl} • Sponsor: {ad.sponsorName}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-200 block text-sm">{ad.clicksCount || 0} Clicks</span>
                  <span className="text-[10px] text-slate-500">{ad.impressionsCount || 0} Impressions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Registered Users & Role Management</h2>
          <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Joined</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5">
                      <span className="font-bold text-white block">{u.name}</span>
                      <span className="text-[10px] text-slate-400">@{u.username} • {u.email}</span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-xs rounded p-1 text-slate-200"
                        disabled={user?.role !== 'admin'}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${u.isSuspended ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'}`}>
                        {u.isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-3.5">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5 text-right">
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleToggleSuspendUser(u.id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold ${u.isSuspended ? 'bg-emerald-600 text-white' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}
                        >
                          {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Full Security & Modification Audit Trail</h2>
          <div className="bg-[#111827] border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden shadow-xl">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 text-xs flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-400">{log.action}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {log.entity}: {log.entityId}
                    </span>
                  </div>
                  <p className="text-slate-300">{(log as any).details || `${log.action} performed on ${log.entity}`}</p>
                </div>
                <div className="text-right text-[11px] text-slate-500 whitespace-nowrap">
                  <span className="font-bold text-slate-400 block">by {(log as any).userName || log.userEmail || 'Admin'}</span>
                  <span>{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SITE SETTINGS */}
      {activeTab === 'settings' && settings && (
        <div className="max-w-2xl bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white">Global Platform Configuration</h2>
          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Site Title</label>
              <input
                type="text"
                value={settings.websiteName}
                onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Tagline & Motto</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowUserRegistrations}
                  onChange={(e) => setSettings({ ...settings, allowUserRegistrations: e.target.checked })}
                  className="rounded border-slate-700"
                />
                <span>Allow Public User Registrations</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireReviewApproval}
                  onChange={(e) => setSettings({ ...settings, requireReviewApproval: e.target.checked })}
                  className="rounded border-slate-700"
                />
                <span>Require Moderator Approval for Community Reviews</span>
              </label>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Site Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QUICK STATUS & RISK MODAL */}
      {statusModalProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">
                Update Status & Risk: {statusModalProject.name}
              </h3>
              <button
                onClick={() => setStatusModalProject(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusAndRisk} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Status Verification Badge</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800"
                >
                  <option value="PAYING">PAYING (Active Multi-Monitor Verification)</option>
                  <option value="WAITING">WAITING (Pending Initial Payout / Buffer)</option>
                  <option value="PROBLEM">PROBLEM (Delayed Withdrawals / High Risk Alert)</option>
                  <option value="NOT PAID">NOT PAID (Confirmed Insolvent / Scam Flag)</option>
                  <option value="CLOSED">CLOSED (Domain Offline / Program Terminated)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Risk Score Indicator: <strong className="text-white">{newRiskScore} / 10</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={newRiskScore}
                  onChange={(e) => setNewRiskScore(parseFloat(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Reason / Telemetry Log Entry</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why status or risk changed (e.g. 3 monitors confirmed pending withdrawals > 48h)..."
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusModalProject(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg"
                >
                  Save Status & Broadcast Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MONITOR MODAL */}
      {showNewMonitorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Add New Monitor Source</h3>
              <button onClick={() => setShowNewMonitorModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateMonitor} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Monitor Name</label>
                <input
                  type="text"
                  required
                  value={newMonitor.name}
                  onChange={(e) => setNewMonitor({ ...newMonitor, name: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-lg border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Website URL</label>
                <input
                  type="url"
                  required
                  value={newMonitor.website}
                  onChange={(e) => setNewMonitor({ ...newMonitor, website: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-lg border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Trust Score (1-10)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={newMonitor.trustScore}
                  onChange={(e) => setNewMonitor({ ...newMonitor, trustScore: parseFloat(e.target.value) })}
                  className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-lg border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newMonitor.description}
                  onChange={(e) => setNewMonitor({ ...newMonitor, description: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-lg border border-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewMonitorModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg"
                >
                  Add Monitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE AD MODAL */}
      {showNewAdModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Add Sponsor Banner</h3>
              <button onClick={() => setShowNewAdModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAd} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Banner Title</label>
                <input
                  type="text"
                  required
                  value={newAd.title}
                  onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-lg border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Target Click URL</label>
                <input
                  type="url"
                  required
                  value={newAd.targetUrl}
                  onChange={(e) => setNewAd({ ...newAd, targetUrl: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-lg border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newAd.imageUrl}
                  onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-lg border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Placement Position</label>
                <select
                  value={newAd.position}
                  onChange={(e) => setNewAd({ ...newAd, position: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-lg border border-slate-800"
                >
                  <option value="TOP_BANNER">Top Header Banner</option>
                  <option value="SIDEBAR">Sidebar Rectangle</option>
                  <option value="INLINE">Inline Directory Sponsor</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Sponsor Brand Name</label>
                <input
                  type="text"
                  required
                  value={newAd.sponsorName}
                  onChange={(e) => setNewAd({ ...newAd, sponsorName: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-lg border border-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAdModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
