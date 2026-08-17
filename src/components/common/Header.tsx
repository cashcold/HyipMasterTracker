import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bookmark,
  Menu,
  X,
  Send,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Shield,
  Globe,
  Share2,
  MessageCircle,
  MessageSquare,
  Phone,
  Sparkles,
  Layers,
  TrendingUp,
  PlusCircle,
  Activity,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { IProject } from '../../types.ts';
import { ThemeSwitcher } from './ThemeSwitcher.tsx';
import { getLiveCurrentDateTimeStr } from '../../utils/dateUtils.ts';
import { CryptoTickerBar } from './CryptoTickerBar.tsx';
import { GoofyInsuranceBanner } from './GoofyInsuranceBanner.tsx';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { user, logout, isModerator } = useAuth();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IProject[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Time ticker
  const [serverTime, setServerTime] = useState<string>(() => getLiveCurrentDateTimeStr());
  const [lastUpdateTime, setLastUpdateTime] = useState<string>(() => getLiveCurrentDateTimeStr(0.1));
  const [staySignedIn, setStaySignedIn] = useState(true);

  // Mobile menu
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTimer = () => {
      setServerTime(getLiveCurrentDateTimeStr());
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Search autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await api.getProjects({ search: searchQuery.trim(), limit: '6' });
        setSearchResults(res.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-[#d1d5db] shadow-xs sticky top-0 z-50">
      {/* 0. GOOFY BLINKING EMOJIS & INSURANCE COVERAGE BANNER */}
      <GoofyInsuranceBanner navigate={navigate} />

      {/* 0.1. LIVE CRYPTO RATES TICKER */}
      <CryptoTickerBar onSelectCrypto={(sym) => {
        if (currentPath !== '/') {
          navigate('/');
        }
      }} />

      {/* 1. TOP NAVBAR ROW */}
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-13 gap-3 border-b border-[#e5e7eb]">
          {/* Left: Round Logo & Top Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer group"
              title="HyipMasterTracker Home"
            >
              <div className="w-9 h-9 rounded-full bg-[#1e293b] border-2 border-amber-400 flex items-center justify-center text-white shadow-xs group-hover:bg-[#0f172a] transition-all relative">
                <span className="font-black text-lg tracking-tighter">H</span>
              </div>
              <span className="hidden xl:inline-block font-black text-xs text-slate-800 uppercase tracking-wider">
                HyipMaster<span className="text-amber-500">Tracker</span>
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-4 text-xs font-semibold text-[#475569]">
              <button
                onClick={() => navigate('/')}
                className={`hover:text-[#1e293b] cursor-pointer transition-colors inline-flex items-center gap-1.5 ${currentPath === '/' ? 'text-[#1e293b] font-bold underline decoration-amber-500 underline-offset-4' : ''}`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <button
                onClick={() => navigate('/hyips')}
                className={`hover:text-[#1e293b] cursor-pointer transition-colors inline-flex items-center gap-1.5 ${currentPath === '/hyips' ? 'text-[#1e293b] font-bold underline decoration-amber-500 underline-offset-4' : ''}`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>HYIP Directory</span>
              </button>
              <button
                onClick={() => navigate('/add-project')}
                className={`hover:text-[#1e293b] cursor-pointer transition-colors inline-flex items-center gap-1.5 ${currentPath === '/add-project' ? 'text-[#1e293b] font-bold underline decoration-amber-500 underline-offset-4' : ''}`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
              <button
                onClick={() => navigate('/advertise')}
                className={`hover:text-[#1e293b] cursor-pointer transition-colors inline-flex items-center gap-1.5 ${currentPath === '/advertise' ? 'text-[#1e293b] font-bold underline decoration-amber-500 underline-offset-4' : ''}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Advertising</span>
              </button>
              <button
                onClick={() => navigate('/contact')}
                className={`hover:text-[#1e293b] cursor-pointer transition-colors inline-flex items-center gap-1.5 ${currentPath === '/contact' ? 'text-[#1e293b] font-bold underline decoration-amber-500 underline-offset-4' : ''}`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact</span>
              </button>
              {isModerator && (
                <button
                  onClick={() => navigate('/admin')}
                  className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100 cursor-pointer inline-flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right: Bookmarks, Theme Switcher & Search */}
          <div className="flex items-center gap-2.5">
            <ThemeSwitcher />

            <button
              onClick={() => navigate('/watchlist')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#475569] hover:text-[#1e293b] cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 fill-[#475569]" />
              <span>Bookmarks</span>
            </button>

            {/* Search Input Box */}
            <div ref={searchRef} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="w-44 sm:w-64 bg-[#f8fafc] text-xs text-[#1e293b] placeholder-[#94a3b8] pl-3 pr-8 py-1.5 rounded-full border border-[#cbd5e1] focus:outline-hidden focus:border-[#1e293b] focus:bg-white transition-all shadow-inner"
                />
                <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Autocomplete Dropdown */}
              {searchOpen && searchQuery.trim() && (
                <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white border border-[#cbd5e1] rounded-lg shadow-xl overflow-hidden z-50 p-2">
                  <div className="text-[11px] font-bold text-[#64748b] px-2 py-1 uppercase border-b border-[#e2e8f0] flex justify-between">
                    <span>Matches</span>
                    {searchLoading && <span className="text-blue-600">Searching...</span>}
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-[#f1f5f9]">
                    {searchResults.length > 0 ? (
                      searchResults.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            navigate(`/hyips/${p.slug}`);
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full p-2 flex items-center justify-between hover:bg-[#f8fafc] rounded text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <img src={p.logo} alt="" className="w-5 h-5 rounded object-cover" referrerPolicy="no-referrer" />
                            <div className="truncate">
                              <span className="text-xs font-bold text-[#1e293b] block truncate">{p.name}</span>
                              <span className="text-[10px] text-[#64748b] truncate">{p.domain}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {p.status}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-xs text-[#94a3b8]">No projects found.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Telegram & WhatsApp Contact Links */}
            <div className="flex items-center gap-1.5">
              <a
                href="https://t.me/hyipmastertracker"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded bg-[#0088cc] hover:bg-[#0077b5] text-white cursor-pointer transition-colors shadow-xs"
                title="Contact Support on Telegram"
              >
                <Send className="w-3 h-3 -rotate-45" />
                <span className="hidden sm:inline">Telegram</span>
              </a>
              <a
                href="https://wa.me/?text=Hello%20HyipMasterTracker%20Support%2C%20I%20have%20an%20inquiry"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded bg-[#25d366] hover:bg-[#20bd5a] text-white cursor-pointer transition-colors shadow-xs"
                title="Contact Support on WhatsApp"
              >
                <MessageCircle className="w-3 h-3" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>

            {/* Admin Profile if logged in */}
            {user && (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#1e293b] px-2 py-1 rounded bg-[#f1f5f9] hover:bg-[#e2e8f0] cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="max-w-[70px] truncate">{user.name}</span>
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-44 bg-white border border-[#cbd5e1] rounded-lg shadow-lg py-1 z-50 text-xs">
                    {isModerator && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-[#f8fafc] font-semibold text-blue-700"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#f8fafc] font-semibold text-red-600 flex items-center gap-1.5 border-t border-[#f1f5f9]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2. SECOND TOOLBAR ROW */}
        <div className="flex items-center justify-between py-2 gap-2 text-xs">
          {/* Left: Hamburger & Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="w-8 h-7 rounded bg-[#1e293b] hover:bg-[#0f172a] flex items-center justify-center text-white shrink-0 cursor-pointer shadow-xs"
              title="Navigation Menu"
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <button
              onClick={() => navigate('/hyips')}
              className={`px-3 py-1 rounded-sm border text-xs font-bold whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                currentPath === '/hyips'
                  ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-xs'
                  : 'bg-white text-[#334155] border-[#cbd5e1] hover:bg-[#f8fafc]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Directory</span>
            </button>

            <button
              onClick={() => navigate('/new-projects')}
              className={`px-3 py-1 rounded-sm border text-xs font-bold whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                currentPath === '/new-projects'
                  ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-xs'
                  : 'bg-white text-[#334155] border-[#cbd5e1] hover:bg-[#f8fafc]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>New</span>
              <span className="text-[#2563eb] text-[10px] font-black">+1</span>
            </button>

            <button
              onClick={() => navigate('/reviews')}
              className={`px-3 py-1 rounded-sm border text-xs font-bold whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                currentPath === '/reviews'
                  ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-xs'
                  : 'bg-white text-[#334155] border-[#cbd5e1] hover:bg-[#f8fafc]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reviews</span>
              <span className="text-[#2563eb] text-[10px] font-black">+11</span>
            </button>

            <button
              onClick={() => navigate('/events')}
              className={`px-3 py-1 rounded-sm border text-xs font-bold whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                currentPath === '/events'
                  ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-xs'
                  : 'bg-white text-[#334155] border-[#cbd5e1] hover:bg-[#f8fafc]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Events</span>
              <span className="text-[#2563eb] text-[10px] font-black">+5</span>
            </button>

            <button
              onClick={() => navigate('/problems')}
              className={`px-3 py-1 rounded-sm border text-xs font-bold whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                currentPath === '/problems'
                  ? 'bg-rose-700 text-white border-rose-700 shadow-xs status-badge-scam'
                  : 'bg-white text-[#991b1b] border-rose-300 hover:bg-rose-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Blacklist</span>
            </button>

            <button
              onClick={() => navigate('/monitors')}
              className={`px-3 py-1 rounded-sm border text-xs font-bold whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                currentPath === '/monitors'
                  ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-xs'
                  : 'bg-white text-[#334155] border-[#cbd5e1] hover:bg-[#f8fafc]'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Monitors</span>
            </button>
          </div>

          {/* Right: Server Time & Telegram Button */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-[#64748b] shrink-0 font-medium">
            <div>
              <span className="block font-semibold text-[#475569]">Server Time: {serverTime}</span>
              <span className="block text-[10px] text-[#94a3b8]">Last Update: {lastUpdateTime}</span>
            </div>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-full bg-[#0088cc] hover:bg-[#0077b5] flex items-center justify-center text-white transition-transform hover:scale-105"
              title="Official Telegram Channel"
            >
              <Send className="w-3.5 h-3.5 -rotate-45" />
            </a>
          </div>
        </div>

        {/* 3. DIRECT TELEGRAM & WHATSAPP SUPPORT CHANNELS & SHARE ROW (Hidden on mobile to save vertical screen space) */}
        <div className="hidden sm:flex flex-wrap items-center justify-between py-2 border-t border-[#f1f5f9] gap-3 text-xs">
          {/* Direct Contact Notice */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#1e293b] font-bold text-[11px] flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#25d366]" />
              <span>Direct Admin & Support Contact:</span>
            </span>

            <div className="flex items-center gap-2">
              <a
                href="https://t.me/hyipmastertracker"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/30 text-[11px] font-bold transition-colors"
                title="Chat with Admin on Telegram"
              >
                <Send className="w-2.5 h-2.5 -rotate-45" />
                <span>Telegram: @hyipmastertracker</span>
              </a>

              <a
                href="https://wa.me/?text=Hello%20HyipMasterTracker%20Support%2C%20I%20would%20like%20to%20inquire%20about%20your%20services"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#16a34a] border border-[#25d366]/30 text-[11px] font-bold transition-colors"
                title="Chat with Admin on WhatsApp"
              >
                <MessageCircle className="w-2.5 h-2.5" />
                <span>WhatsApp: Direct Chat</span>
              </a>
            </div>
          </div>

          {/* Social Share Round Circles */}
          <div className="flex items-center gap-1.5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-5 h-5 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-[10px] font-bold hover:opacity-90"
              title="Share on Facebook"
            >
              f
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-5 h-5 rounded-full bg-[#1da1f2] text-white flex items-center justify-center text-[10px] font-bold hover:opacity-90"
              title="Share on Twitter"
            >
              t
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-5 h-5 rounded-full bg-[#0a66c2] text-white flex items-center justify-center text-[10px] font-bold hover:opacity-90"
              title="Share on LinkedIn"
            >
              in
            </a>
            <a
              href="https://messenger.com"
              target="_blank"
              rel="noreferrer"
              className="w-5 h-5 rounded-full bg-[#0084ff] text-white flex items-center justify-center text-[10px] font-bold hover:opacity-90"
              title="Share on Messenger"
            >
              m
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="w-5 h-5 rounded-full bg-[#25d366] text-white flex items-center justify-center text-[10px] font-bold hover:opacity-90"
              title="Share on WhatsApp"
            >
              w
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              className="w-5 h-5 rounded-full bg-[#e60023] text-white flex items-center justify-center text-[10px] font-bold hover:opacity-90"
              title="Share on Pinterest"
            >
              p
            </a>
            <a
              href="https://getpocket.com"
              target="_blank"
              rel="noreferrer"
              className="w-5 h-5 rounded-full bg-[#ee4056] text-white flex items-center justify-center text-[10px] font-bold hover:opacity-90"
              title="Save to Pocket"
            >
              v
            </a>
            <a
              href="https://reddit.com"
              target="_blank"
              rel="noreferrer"
              className="w-5 h-5 rounded-full bg-[#ff4500] text-white flex items-center justify-center text-[10px] font-bold hover:opacity-90"
              title="Share on Reddit"
            >
              r
            </a>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div className="py-3 border-t border-[#e2e8f0] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => {
                navigate('/hyips');
                setMobileNavOpen(false);
              }}
              className="p-2 rounded bg-[#f8fafc] text-left font-bold text-[#1e293b] hover:bg-[#f1f5f9]"
            >
              All HYIPs Directory
            </button>
            <button
              onClick={() => {
                navigate('/new-projects');
                setMobileNavOpen(false);
              }}
              className="p-2 rounded bg-[#f8fafc] text-left font-bold text-[#1e293b] hover:bg-[#f1f5f9]"
            >
              New Programs
            </button>
            <button
              onClick={() => {
                navigate('/paying');
                setMobileNavOpen(false);
              }}
              className="p-2 rounded bg-[#f8fafc] text-left font-bold text-emerald-700 hover:bg-[#f1f5f9]"
            >
              Paying Programs
            </button>
            <button
              onClick={() => {
                navigate('/problems');
                setMobileNavOpen(false);
              }}
              className="p-2 rounded bg-[#f8fafc] text-left font-bold text-amber-700 hover:bg-[#f1f5f9]"
            >
              Problematic HYIPs
            </button>
            <button
              onClick={() => {
                navigate('/compare');
                setMobileNavOpen(false);
              }}
              className="p-2 rounded bg-[#f8fafc] text-left font-bold text-[#1e293b] hover:bg-[#f1f5f9]"
            >
              Compare Programs
            </button>
            <button
              onClick={() => {
                navigate('/statistics');
                setMobileNavOpen(false);
              }}
              className="p-2 rounded bg-[#f8fafc] text-left font-bold text-[#1e293b] hover:bg-[#f1f5f9]"
            >
              Industry Statistics
            </button>
            <button
              onClick={() => {
                navigate('/watchlist');
                setMobileNavOpen(false);
              }}
              className="p-2 rounded bg-[#f8fafc] text-left font-bold text-[#1e293b] hover:bg-[#f1f5f9]"
            >
              My Bookmarks
            </button>
            <button
              onClick={() => {
                navigate('/about');
                setMobileNavOpen(false);
              }}
              className="p-2 rounded bg-[#f8fafc] text-left font-bold text-[#1e293b] hover:bg-[#f1f5f9]"
            >
              About & Methodology
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
