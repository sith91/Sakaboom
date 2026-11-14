'use client';

import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck, LogOut, KeyRound, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/auth', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        setAuthenticated(Boolean(data.authenticated));
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.authenticated) {
        throw new Error(data.error || 'Invalid admin password');
      }
      setAuthenticated(true);
      setPassword('');
      toast({
        title: '🔓 Admin Console Unlocked',
        description: 'Authenticated with secure HttpOnly admin session.',
      });
    } catch (err: any) {
      toast({
        title: 'Access Denied',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setAuthenticated(false);
    toast({
      title: '🔒 Admin Session Locked',
      description: 'You have been signed out of the Admin Portal.',
    });
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center text-xs font-bold">
        Verifying Admin Session...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-8 space-y-6 shadow-[0_0_60px_-15px_rgba(99,102,241,0.4)]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight">
                SAKABOOM ADMIN GATE
              </h1>
              <p className="text-xs text-slate-400">
                Protected Operator Console (/admin)
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" /> Admin Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter ADMIN_PASSWORD (default: sakaboom-admin)"
                autoFocus
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Set <code className="text-indigo-300">ADMIN_PASSWORD</code> in your production environment variables (<code className="text-slate-400">.env.local</code>). Default dev password: <code className="text-emerald-400">sakaboom-admin</code>
              </p>
            </div>

            <Button
              type="submit"
              disabled={submitting || !password.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs rounded-xl h-10"
            >
              {submitting ? 'Verifying...' : 'Unlock Admin Platform'}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Security Status Bar */}
      <div className="bg-indigo-950/80 border-b border-indigo-500/20 px-6 py-1.5 text-[11px] flex items-center justify-between text-indigo-200">
        <span className="flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Authenticated Admin Session (HttpOnly Protected)
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-slate-300 hover:text-white font-bold transition-colors"
        >
          <LogOut className="w-3 h-3" /> Lock Admin Session
        </button>
      </div>
      {children}
    </div>
  );
}

