import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  DollarSign,
  CheckCircle2,
  ShieldAlert,
  Send,
  Lock,
  ShieldCheck,
  PlusCircle,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const AdvertisePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [selectedSlot, setSelectedSlot] = useState('Top Homepage Header Banner (728x90)');
  const [copied, setCopied] = useState(false);

  const telegramAdmin = 'hyipmastertracker';
  const telegramLink = `https://t.me/${telegramAdmin}`;
  const whatsappNumber = '+1234567890';
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
    `Hello HyipMasterTracker Admin, I would like to book the advertising placement: ${selectedSlot}. Please provide payment address and banner specs.`
  )}`;

  const adSlots = [
    {
      title: 'Top Homepage Header Banner',
      size: '728 x 90 / Responsive',
      price: '$210 / month',
      description: 'Maximum visibility at the top of every homepage load and above main directory listings.',
      features: [
        'Over 120k monthly impressions',
        'Direct tracking link & click stats',
        'Sponsored badge compliance',
      ],
    },
    {
      title: 'Featured Directory Sticky Listing',
      size: 'Card Spotlight',
      price: '$150 / month',
      description: 'Pinned to the top 3 cards in the HYIP directory with Gold Sponsored border.',
      features: [
        'Highlighted gold badge',
        'Prioritized review moderation',
        'Instant payout telemetry badge',
      ],
    },
    {
      title: 'Sidebar Sponsor Slot',
      size: '300 x 250 Medium Rectangle',
      price: '$100 / month',
      description: 'Sticky placement across all project details, reviews, and event stream pages.',
      features: [
        'High contextual click-through',
        'Targeted investor audience',
        'Direct outbound link',
      ],
    },
  ];

  const copyTemplate = () => {
    const text = `Hi Admin, I'd like to book: ${selectedSlot}. Please send payment options (USDT/Crypto) and banner guidelines.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sponsorship & Traffic Solutions</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Advertise on HyipMasterTracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          No automated queues or delays. Connect directly with our admin team via Telegram and WhatsApp for instant banner deployment and custom invoicing.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {adSlots.map((slot) => {
          const isSelected = selectedSlot === slot.title;
          return (
            <div
              key={slot.title}
              onClick={() => setSelectedSlot(slot.title)}
              className={`bg-[#111827] border rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold uppercase">
                    {slot.size}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-600 text-white font-bold">
                      Selected
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base text-white">{slot.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{slot.description}</p>
                <div className="pt-2">
                  <span className="text-2xl font-black text-emerald-400">{slot.price}</span>
                </div>
                <ul className="space-y-1.5 pt-2 text-xs text-slate-300">
                  {slot.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSlot(slot.title)}
                  className={`w-full py-2.5 font-bold text-xs rounded-xl transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {isSelected ? '✓ Selected' : 'Choose Package'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Contact Only Booking Desk */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-lg font-black text-white">Direct Admin Contact Desk</h3>
            </div>
            <p className="text-xs text-slate-400">
              Selected Package: <strong className="text-blue-400">{selectedSlot}</strong>
            </p>
          </div>

          <button
            onClick={copyTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Template Copied!' : 'Copy Inquiry Template'}</span>
          </button>
        </div>

        {/* Telegram & WhatsApp Direct Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Telegram Channel Card */}
          <a
            href={telegramLink}
            target="_blank"
            rel="noreferrer"
            className="group p-5 rounded-xl bg-slate-900 border border-[#0088cc]/30 hover:border-[#0088cc] hover:bg-[#0088cc]/5 transition-all flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Send className="w-6 h-6 -rotate-45" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-white text-sm block">Contact via Telegram</span>
                <span className="text-xs text-[#0088cc] font-mono block">@{telegramAdmin}</span>
                <span className="text-[11px] text-slate-400 block">Instant reply within 15 minutes</span>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-[#0088cc] text-white text-xs font-bold group-hover:bg-[#0077b5] shrink-0">
              Open Chat →
            </span>
          </a>

          {/* WhatsApp Channel Card */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="group p-5 rounded-xl bg-slate-900 border border-[#25d366]/30 hover:border-[#25d366] hover:bg-[#25d366]/5 transition-all flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-white text-sm block">Contact via WhatsApp</span>
                <span className="text-xs text-[#25d366] font-mono block">Direct Admin Chat</span>
                <span className="text-[11px] text-slate-400 block">24/7 Fast message response</span>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-[#25d366] text-white text-xs font-bold group-hover:bg-[#1ebd5a] shrink-0">
              Chat on WA →
            </span>
          </a>
        </div>

        {/* Informative Note */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
          <p className="font-bold text-slate-200">How Direct Advertising Works:</p>
          <p>
            1. Tap on either <strong>Telegram</strong> or <strong>WhatsApp</strong> above.<br />
            2. Send your banner link, target URL, and preferred duration.<br />
            3. Our administrator verifies your banner within minutes and provides payment address (USDT / BTC / ETH / ePayCore).
          </p>
        </div>
      </div>
    </div>
  );
};

export const AddProjectPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { user, login, isAdmin } = useAuth();
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Admin Project Creation State
  const [form, setForm] = useState({
    name: '',
    domain: '',
    websiteUrl: '',
    category: 'Crypto Arbitrage',
    status: 'PAYING',
    riskScore: '7.5',
    minInvestment: '25',
    maxInvestment: '10000',
    advertisedReturn: '3.0% Daily for 30 Days (Principal Returned)',
    duration: '30 Days',
    referralPercentage: '7% - 2% - 1%',
    paymentMethods: 'USDT (TRC20), USDT (BEP20), Bitcoin, Ethereum, Tron, ePayCore',
    logo: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=600&auto=format&fit=crop&q=80',
    screenshot: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1000&auto=format&fit=crop&q=80',
    country: 'United Kingdom',
    scriptType: 'GoldCoders Licensed',
    sslIssuer: "Let's Encrypt Authority 4096-bit Extended",
    hostingProvider: 'Cloudflare / DDOS-Guard Protection',
    description: '',
  });

  const [createdProject, setCreatedProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      await login({ emailOrUsername: adminUsername, password: adminPassword });
    } catch (err: any) {
      setAuthError(err.message || 'Invalid administrator credentials');
    } finally {
      setAuthLoading(false);
    }
  };

  const fillAdminDefaults = () => {
    setAdminUsername('admin');
    setAdminPassword('admin12345@');
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanDomain = form.domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const finalWebsiteUrl = form.websiteUrl || `https://${cleanDomain}`;

      const res = await api.createProject({
        name: form.name.trim(),
        domain: cleanDomain,
        websiteUrl: finalWebsiteUrl,
        category: form.category,
        status: form.status,
        riskScore: parseFloat(form.riskScore) || 7.0,
        minInvestment: Number(form.minInvestment) || 10,
        maxInvestment: Number(form.maxInvestment) || 10000,
        referralPercentage: form.referralPercentage,
        paymentMethods: form.paymentMethods.split(',').map((s) => s.trim()),
        logo: form.logo,
        screenshot: form.screenshot,
        country: form.country,
        scriptType: form.scriptType,
        sslIssuer: form.sslIssuer,
        hostingProvider: form.hostingProvider,
        description: form.description || 'Verified investment program indexed by platform administration.',
        plans: [
          {
            name: 'Primary Tier',
            advertisedReturn: form.advertisedReturn,
            duration: form.duration,
            minInvestment: Number(form.minInvestment) || 10,
            maxInvestment: Number(form.maxInvestment) || 10000,
            type: 'Daily',
          },
        ],
      });

      setCreatedProject(res.project);
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  // If NOT authenticated as an Admin, display the Administrator Security Gate
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800 text-amber-400 text-[11px] font-bold">
            <ShieldAlert className="w-3 h-3" />
            <span>Admin-Only Restricted Access</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Add New HYIP Program
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Public users cannot add or submit projects. Only the verified platform administrator (<code className="text-blue-400 font-mono">admin</code>) is authorized to list and index new investment programs into the directory.
          </p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-slate-300">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Administrator Credentials Required</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sign in with the system administrator account (<span className="font-mono text-blue-300">admin</span> / <span className="font-mono text-blue-300">admin12345@</span>) to open the project creation and telemetry indexing suite.
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Admin Username</label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2.5 rounded-lg border border-slate-800 focus:outline-hidden focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Admin Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2.5 rounded-lg border border-slate-800 focus:outline-hidden focus:border-blue-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={fillAdminDefaults}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline underline-offset-2"
              >
                Auto-fill Admin Credentials
              </button>
              <button
                type="submit"
                disabled={authLoading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {authLoading ? 'Authenticating...' : 'Unlock & Access Project Creator'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // When Authenticated as Admin: Full Project Creation Suite
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Authorized</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Index New HYIP Project
          </h1>
          <p className="text-xs text-slate-400">
            Provision and publish a new investment platform directly to the live HyipMasterTracker directory.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer self-start sm:self-center"
        >
          Open Admin Dashboard
        </button>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {createdProject ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Project Published Successfully</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                <strong>{createdProject.name}</strong> has been created, indexed, and is now live in the directory with status <span className="font-bold text-emerald-400">{createdProject.status}</span>.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/hyips/${createdProject.slug}`)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Live Project Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setCreatedProject(null);
                  setForm({
                    name: '',
                    domain: '',
                    websiteUrl: '',
                    category: 'Crypto Arbitrage',
                    status: 'PAYING',
                    riskScore: '7.5',
                    minInvestment: '25',
                    maxInvestment: '10000',
                    advertisedReturn: '3.0% Daily for 30 Days (Principal Returned)',
                    duration: '30 Days',
                    referralPercentage: '7% - 2% - 1%',
                    paymentMethods: 'USDT (TRC20), USDT (BEP20), Bitcoin, Ethereum, Tron, ePayCore',
                    logo: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=600&auto=format&fit=crop&q=80',
                    screenshot: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1000&auto=format&fit=crop&q=80',
                    country: 'United Kingdom',
                    scriptType: 'GoldCoders Licensed',
                    sslIssuer: "Let's Encrypt Authority 4096-bit Extended",
                    hostingProvider: 'Cloudflare / DDOS-Guard Protection',
                    description: '',
                  });
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
              >
                Add Another Project
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateProject} className="space-y-5 text-xs">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Core Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
                1. Project Identity & Web Addresses
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Yield Fund"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Domain Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="apexyield.io"
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                    className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800 focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://apexyield.io"
                    value={form.websiteUrl}
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                    className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800 focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Status, Risk, and Category */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
                2. Status, Category & Risk Rating
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Initial Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800 font-bold"
                  >
                    <option value="PAYING">PAYING (Active / Verified)</option>
                    <option value="WAITING">WAITING (Pending First Payout)</option>
                    <option value="PROBLEM">PROBLEM (Delayed / Flagged)</option>
                    <option value="NOT PAID">NOT PAID (Failed / Scam)</option>
                    <option value="CLOSED">CLOSED (Completed Cycle)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Initial Risk Score (0.0 – 10.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={form.riskScore}
                    onChange={(e) => setForm({ ...form, riskScore: e.target.value })}
                    className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800"
                  >
                    <option>Crypto Arbitrage</option>
                    <option>AI Trading</option>
                    <option>Forex / Stocks</option>
                    <option>Real Estate Crowdfunding</option>
                    <option>Crypto Cloud Mining</option>
                    <option>High Yield Staking</option>
                    <option>Decentralized Yield</option>
                    <option>Other / General</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Parameters */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
                3. Financial Plans & Limits
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Min Investment ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.minInvestment}
                    onChange={(e) => setForm({ ...form, minInvestment: e.target.value })}
                    className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Max Investment ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.maxInvestment}
                    onChange={(e) => setForm({ ...form, maxInvestment: e.target.value })}
                    className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1 font-semibold">Advertised Return Terms</label>
                  <input
                    type="text"
                    placeholder="3% Daily for 30 Days"
                    value={form.advertisedReturn}
                    onChange={(e) => setForm({ ...form, advertisedReturn: e.target.value })}
                    className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Referral Commission</label>
                  <input
                    type="text"
                    placeholder="7% - 2% - 1%"
                    value={form.referralPercentage}
                    onChange={(e) => setForm({ ...form, referralPercentage: e.target.value })}
                    className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Payment Methods</label>
                  <input
                    type="text"
                    placeholder="USDT (TRC20), Bitcoin, Ethereum, Tron, ePayCore"
                    value={form.paymentMethods}
                    onChange={(e) => setForm({ ...form, paymentMethods: e.target.value })}
                    className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Project Overview & Background</label>
              <textarea
                rows={3}
                required
                placeholder="Detailed business model description, plan structures, payout rules..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{loading ? 'Publishing Program...' : 'Publish to Live Directory'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
