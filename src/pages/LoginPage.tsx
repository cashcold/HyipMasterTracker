import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const LoginPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ identifier, password });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/20">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-white">Log in to HyipMasterTracker</h1>
        <p className="text-xs text-slate-400">Access personalized watchlists, review submissions, and alert notifications.</p>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Email or Username</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="admin@hyipmastertracker.com or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-slate-900 text-xs text-slate-200 pl-8 pr-3 py-2.5 rounded-lg border border-slate-800 focus:outline-hidden focus:border-blue-500"
              />
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 text-xs text-slate-200 pl-8 pr-3 py-2.5 rounded-lg border border-slate-800 focus:outline-hidden focus:border-blue-500"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-blue-400 font-bold hover:underline">
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ name, username, email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-white">Create Investor Account</h1>
        <p className="text-xs text-slate-400">Join HyipMasterTracker to save watchlists, post reviews, and configure alerts.</p>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Username</label>
            <input
              type="text"
              required
              placeholder="e.g. cryptohunter"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-400 font-bold hover:underline">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProfilePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { user, refreshMe } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      const { api } = await import('../services/api.ts');
      await api.updateProfile({ name, avatar });
      await refreshMe();
      setSuccess('Profile updated successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-white">Account Settings & Profile</h1>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
            alt={user.name}
            className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700"
          />
          <div>
            <h3 className="font-bold text-lg text-white">{user.name}</h3>
            <p className="text-xs text-slate-400">@{user.username} • {user.email}</p>
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold uppercase">
              {user.role}
            </span>
          </div>
        </div>

        {success && (
          <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Avatar URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-800"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl"
            >
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
