import React, { useState } from 'react';
import { User, Shield, Share2, Clipboard, ChevronRight, Activity, Bug, Check, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

interface DashboardStatsProps {
  user: UserProfile;
  onSubmitBugReport: (text: string, type: 'bug' | 'feature') => Promise<void>;
}

export default function DashboardStats({ user, onSubmitBugReport }: DashboardStatsProps) {
  const [bugText, setBugText] = useState('');
  const [reportType, setReportType] = useState<'bug' | 'feature'>('bug');
  const [copiedLink, setCopiedLink] = useState(false);
  const [submittingBug, setSubmittingBug] = useState(false);
  const [bugSuccess, setBugSuccess] = useState(false);

  const referralUrl = `https://nova.ai/secure_signup?ref=${user.referralCode || 'NOVA-OPER'}`;

  const handleCopyLoc = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugText) return;
    setSubmittingBug(true);
    try {
      await onSubmitBugReport(bugText, reportType);
      setBugSuccess(true);
      setBugText('');
      setTimeout(() => setBugSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingBug(false);
    }
  };

  return (
    <div className="p-4 bg-black border-2 border-red-600/30 text-white font-sans space-y-5 rounded-sm select-none h-full overflow-y-auto">
      
      {/* Header Profile */}
      <div className="border-b border-red-600/30 pb-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-sm border-2 border-red-600 overflow-hidden bg-neutral-900">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-mono text-sm font-black text-white uppercase truncate tracking-wider">
            {user.name.toUpperCase()}
          </h2>
          <span className="font-mono text-[8px] bg-red-950/30 border border-red-600/30 text-red-500 px-1.5 py-0.5 uppercase">
            OPERATOR ROLE: {user.role.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Usage Analytics Grid */}
      <div className="border border-red-600/20 p-4 bg-red-950/5 rounded-sm space-y-3">
        <div className="flex items-center gap-1.5 border-b border-red-600/10 pb-2">
          <Activity className="w-4 h-4 text-red-500 animate-[pulse_2.5s_infinite]" />
          <h3 className="font-mono text-[10px] font-black uppercase tracking-widest text-white">SYSTEM_USAGE INDICATORS</h3>
        </div>

        <div className="space-y-2">
          {/* Daily limit tracker */}
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-gray-400 uppercase">DALY PROMPTING ALLOCATION</span>
            <span className="text-red-500 font-bold">{user.dailyUsed} / {user.dailyLimit} REQUESTS</span>
          </div>
          
          <div className="w-full bg-neutral-950 h-2 border border-neutral-900 relative rounded-sm">
            <div
              className="bg-red-600 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (user.dailyUsed / user.dailyLimit) * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center pt-2">
          <div className="bg-neutral-950/80 p-2.5 border border-neutral-900">
            <span className="text-[7px] text-gray-500 uppercase block font-mono">SESSION TOKENS</span>
            <span className="font-mono text-xs font-black text-white mt-1 block">ACTIVE JWT</span>
          </div>

          <div className="bg-neutral-950/80 p-2.5 border border-neutral-900">
            <span className="text-[7px] text-gray-500 uppercase block font-mono">STATUS STATE</span>
            <span className="font-mono text-xs font-black text-green-500 mt-1 block">STABLE</span>
          </div>
        </div>
      </div>

      {/* Invite & Referrals Block */}
      <div className="border border-neutral-900 p-4 bg-neutral-950/40 rounded-sm space-y-3.5">
        <div className="flex justify-between items-center">
          <h3 className="font-mono text-[10px] font-black uppercase tracking-widest text-red-500">
            REFERRAL_PROTOCOL (INVITES)
          </h3>
          <span className="font-mono text-[8px] text-gray-500">CODE: {user.referralCode}</span>
        </div>

        <p className="text-[10px] text-gray-400 leading-tight">
          Spread the cyberpunk matrix! Invite other operators. If they sign up with your code, you receive <b>+50</b> additional daily prompting credits.
        </p>

        {/* Copy referral links */}
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={referralUrl}
            className="flex-1 bg-neutral-950 border border-neutral-800 px-2 py-1.5 font-mono text-[9px] text-gray-400 select-all"
          />
          <button
            onClick={handleCopyLoc}
            className="px-2.5 bg-neutral-900 border border-neutral-800 hover:border-red-600 text-white hover:text-red-500 text-xs flex items-center justify-center transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Clipboard className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bug Report Submission Form */}
      <form onSubmit={handleBugSubmit} className="border border-neutral-900 p-4 bg-neutral-950/30 rounded-sm space-y-3">
        <div className="flex items-center gap-1.5">
          <Bug className="w-4 h-4 text-red-500" />
          <h3 className="font-mono text-[10px] font-black uppercase tracking-widest text-white">
            REPORT BUG / FEEDBACK UNIT
          </h3>
        </div>

        {bugSuccess && (
          <div className="p-2 bg-neutral-900 border border-green-500 text-green-500 text-[9px] font-mono uppercase">
            ⚡ TRANSMISSION INJECTED SUCCESSFULLY! Core Developers are monitoring.
          </div>
        )}

        {/* Categories selector */}
        <div className="flex gap-2 text-[9px] font-mono">
          <button
            type="button"
            onClick={() => setReportType('bug')}
            className={`px-3 py-1 flex-1 border transition-colors ${
              reportType === 'bug' ? 'bg-red-600 text-black border-red-600 font-bold' : 'text-gray-400 border-neutral-800 hover:text-white'
            }`}
          >
            SYSTEM BUG
          </button>
          
          <button
            type="button"
            onClick={() => setReportType('feature')}
            className={`px-3 py-1 flex-1 border transition-colors ${
              reportType === 'feature' ? 'bg-red-600 text-black border-red-600 font-bold' : 'text-gray-400 border-neutral-800 hover:text-white'
            }`}
          >
            FEATURE DEV
          </button>
        </div>

        <textarea
          rows={3}
          value={bugText}
          onChange={(e) => setBugText(e.target.value)}
          placeholder="State the observed behavior, matrix fault indexes or requested terminal assets..."
          className="w-full bg-neutral-950 border border-neutral-800 p-2 text-[10px] text-white focus:outline-none focus:border-red-500 font-mono resize-none leading-relaxed placeholder-gray-700"
        />

        <button
          type="submit"
          disabled={submittingBug || !bugText}
          className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-red-600 text-red-500 hover:text-white font-mono text-[10px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {submittingBug ? <RefreshCw className="animate-spin w-3.5 h-3.5" /> : <span>DISPATCH COMPLAINT</span>}
        </button>
      </form>
    </div>
  );
}
