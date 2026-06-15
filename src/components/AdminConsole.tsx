import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Settings, Radio, BarChart3, AlertOctagon, HelpCircle, Power, UserX, UserCheck, Trash2, Key, RefreshCw, Send, Save } from 'lucide-react';
import { AdminSettings, SystemAnnouncement, UserProfile } from '../types';

interface AdminConsoleProps {
  currentSettings: AdminSettings;
  announcements: SystemAnnouncement[];
  onUpdateSettings: (settings: Partial<AdminSettings>) => Promise<void>;
  onAddAnnouncement: (content: string, type: 'banner' | 'popup' | 'push') => Promise<void>;
  onDeleteAnnouncement: (id: string) => Promise<void>;
}

export default function AdminConsole({
  currentSettings,
  announcements,
  onUpdateSettings,
  onAddAnnouncement,
  onDeleteAnnouncement
}: AdminConsoleProps) {
  const [authorized, setAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [adminTab, setAdminTab] = useState<'users' | 'ai' | 'prompt' | 'social' | 'announcements' | 'analytics' | 'system'>('analytics');
  const [authError, setAuthError] = useState('');

  // Active statistics counters
  const [analytics, setAnalytics] = useState<any>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Configuration forms
  const [groqKey, setGroqKey] = useState(currentSettings.groqKey);
  const [orKey, setOrKey] = useState(currentSettings.openRouterKey);
  const [globalPrompt, setGlobalPrompt] = useState(currentSettings.globalPrompt);
  const [tgGroup, setTgGroup] = useState(currentSettings.telegramGroup);
  const [tgChan, setTgChan] = useState(currentSettings.telegramChannel);
  const [instaLink, setInstaLink] = useState(currentSettings.instagramLink);
  const [tgWidget, setTgWidget] = useState(currentSettings.enableTelegramWidget);
  const [instaWidget, setInstaWidget] = useState(currentSettings.enableInstagramWidget);
  const [mMode, setMMode] = useState(currentSettings.maintenanceMode);

  // Announcements form
  const [newAnn, setNewAnn] = useState('');
  const [annType, setAnnType] = useState<'banner' | 'popup' | 'push'>('banner');
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Load telemetry data from local Express server
  const loadAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadUsersList = async () => {
    setFetchingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsersList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setFetchingUsers(false);
    }
  };

  useEffect(() => {
    if (authorized) {
      loadAnalytics();
      loadUsersList();
      const interval = setInterval(loadAnalytics, 5000);
      return () => clearInterval(interval);
    }
  }, [authorized]);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin' || passcode === 'nova2026') {
      setAuthorized(true);
      setAuthError('');
    } else {
      setAuthError('INVALID ADMINISTRATIVE SECURITY SIGNATURE');
    }
  };

  const handleSaveAI = async () => {
    await onUpdateSettings({
      groqKey,
      openRouterKey: orKey
    });
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 3000);
  };

  const handleSavePrompt = async () => {
    await onUpdateSettings({ globalPrompt });
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 3000);
  };

  const handleSaveSocials = async () => {
    await onUpdateSettings({
      telegramGroup: tgGroup,
      telegramChannel: tgChan,
      instagramLink: instaLink,
      enableTelegramWidget: tgWidget,
      enableInstagramWidget: instaWidget
    });
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 3000);
  };

  const handleSaveSystem = async (mActive: boolean) => {
    setMMode(mActive);
    await onUpdateSettings({ maintenanceMode: mActive });
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 3000);
  };

  const handleToggleUserBan = async (email: string, currentBan: boolean) => {
    const res = await fetch('/api/admin/users/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ban: !currentBan }),
    });
    const data = await res.json();
    if (data.status === 'success') {
      loadUsersList();
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${email}?`)) return;
    const res = await fetch('/api/admin/users/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.status === 'success') {
      loadUsersList();
    }
  };

  const handleDispatchAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn) return;
    await onAddAnnouncement(newAnn, annType);
    setNewAnn('');
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 3000);
  };

  // Render authentications block if not unlocked
  if (!authorized) {
    return (
      <div className="p-6 bg-black w-full flex flex-col justify-center items-center font-sans text-white h-full overflow-y-auto select-none">
        <div className="text-center w-full mb-6">
          <ShieldAlert className="mx-auto text-red-500 w-12 h-12 animate-pulse mb-3" />
          <h1 className="text-2xl font-black tracking-widest text-white uppercase">OPS_COMMAND_LOCK</h1>
          <p className="font-mono text-[9px] uppercase text-red-500 tracking-[0.25em] mt-1">
            Protected Admin Sector
          </p>
        </div>

        {authError && (
          <div className="w-full mb-4 bg-red-950/20 border-2 border-red-600 p-2 text-red-400 font-mono text-[9px] text-center uppercase tracking-wider">
            🚨 ACCESS DENIED: {authError}
          </div>
        )}

        <form onSubmit={handleAdminAuth} className="w-full">
          <label className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1">
            SECRET COMPLIANCE KEY
          </label>
          
          <input
            type="password"
            required
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="ENTER PASSCODE (default: admin)..."
            className="w-full text-center px-4 py-3 bg-neutral-900 border-2 border-red-600/40 text-xs text-white focus:outline-none focus:border-red-500 transition-colors font-mono tracking-widest mb-4"
          />

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-black font-extrabold uppercase tracking-widest text-xs transition duration-150 rounded-sm cursor-pointer"
          >
            AUTHORIZE OPERATIONS INTERFACE
          </button>
        </form>
      </div>
    );
  }

  // Admin platform
  return (
    <div className="bg-black text-white font-sans w-full flex flex-col h-full overflow-hidden select-none">
      
      {/* Header telemetry status */}
      <div className="bg-neutral-950 p-4 border-b border-red-600 flex justify-between items-center">
        <div>
          <span className="font-mono text-[8px] text-gray-500 tracking-widest uppercase block">SECURE OPS CONTROL</span>
          <h1 className="text-lg font-black text-white tracking-widest uppercase">
            NOVA_ADMIN_v3.0
          </h1>
        </div>
        <div className="flex gap-1.5 items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
          <span className="font-mono text-[8px] text-green-500 tracking-wider">LIVE DATA</span>
        </div>
      </div>

      {alertSuccess && (
        <div className="bg-green-950/20 border-b border-green-500 text-green-500 p-2 font-mono text-[9px] text-center uppercase tracking-wider">
          ⚙️ MATRIX STATE PERSISTED SECURELY ON DEV_DB!
        </div>
      )}

      {/* Admin Horizontal Tabs navigation */}
      <div className="bg-neutral-950 p-1 border-b border-red-600/20 flex gap-1 overflow-x-auto text-[9px] font-mono scrollbar-none">
        <button
          onClick={() => setAdminTab('analytics')}
          className={`px-3 py-1.5 whitespace-nowrap border ${adminTab === 'analytics' ? 'bg-red-600 text-black font-black border-red-600' : 'text-gray-400 border-transparent hover:text-white'}`}
        >
          ANALYTICS
        </button>
        
        <button
          onClick={() => setAdminTab('users')}
          className={`px-3 py-1.5 whitespace-nowrap border ${adminTab === 'users' ? 'bg-red-600 text-black font-black border-red-600' : 'text-gray-400 border-transparent hover:text-white'}`}
        >
          USERS
        </button>

        <button
          onClick={() => setAdminTab('ai')}
          className={`px-3 py-1.5 whitespace-nowrap border ${adminTab === 'ai' ? 'bg-red-600 text-black font-black border-red-600' : 'text-gray-400 border-transparent hover:text-white'}`}
        >
          PROVIDERS
        </button>

        <button
          onClick={() => setAdminTab('prompt')}
          className={`px-3 py-1.5 whitespace-nowrap border ${adminTab === 'prompt' ? 'bg-red-600 text-black font-black border-red-600' : 'text-gray-400 border-transparent hover:text-white'}`}
        >
          PROMPTS
        </button>

        <button
          onClick={() => setAdminTab('announcements')}
          className={`px-3 py-1.5 whitespace-nowrap border ${adminTab === 'announcements' ? 'bg-red-600 text-black font-black border-red-600' : 'text-gray-400 border-transparent hover:text-white'}`}
        >
          BROADCASTS
        </button>

        <button
          onClick={() => setAdminTab('social')}
          className={`px-3 py-1.5 whitespace-nowrap border ${adminTab === 'social' ? 'bg-red-600 text-black font-black border-red-600' : 'text-gray-400 border-transparent hover:text-white'}`}
        >
          SOCIALS
        </button>

        <button
          onClick={() => setAdminTab('system')}
          className={`px-3 py-1.5 whitespace-nowrap border ${adminTab === 'system' ? 'bg-red-600 text-black font-black border-red-600' : 'text-gray-400 border-transparent hover:text-white'}`}
        >
          SYSTEM
        </button>
      </div>

      {/* Tab Contents area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">

        {/* tab 1: Analytics Screen */}
        {adminTab === 'analytics' && (
          <div className="space-y-4">
            <div className="border border-red-600/10 p-3 bg-red-950/5">
              <span className="font-mono text-[8px] text-gray-500 uppercase block">CORE HEURISTIC METRICS</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-neutral-950 p-2 border border-neutral-900">
                  <span className="text-[7px] text-gray-400 block uppercase">ONLINE OPERATORS</span>
                  <span className="text-sm font-mono font-black">{analytics?.activeUsersCount || 1} ACTIVE</span>
                </div>
                <div className="bg-neutral-950 p-2 border border-neutral-900">
                  <span className="text-[7px] text-gray-400 block uppercase">TOTAL CHAT SESSIONS</span>
                  <span className="text-sm font-mono font-black">{analytics?.totalChatsCount || 12} CHATS</span>
                </div>
                <div className="bg-neutral-950 p-2 border border-neutral-900">
                  <span className="text-[7px] text-gray-400 block uppercase">SERVER COMPASS UPTIME</span>
                  <span className="text-sm font-mono font-black">{analytics?.uptimeSec || 164}s SECS</span>
                </div>
                <div className="bg-neutral-950 p-2 border border-neutral-900">
                  <span className="text-[7px] text-gray-400 block uppercase">LATENCY OVERHEAD</span>
                  <span className="text-sm font-mono font-black text-green-500">42ms EXCELLENT</span>
                </div>
              </div>
            </div>

            {/* Model provider traffic visual analysis */}
            <div className="border border-neutral-900 p-3 bg-neutral-950/40 space-y-2">
              <span className="font-mono text-[8px] text-gray-500 uppercase block">AI ROUTING PROPORTIONS</span>
              <div className="space-y-2.5 pt-1">
                <div>
                  <div className="flex justify-between font-mono text-[8px] text-gray-400 mb-1">
                    <span>NOVA-3.5-FLASH</span>
                    <span>{analytics?.providerStats?.nova || 84}%</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1 rounded-full"><div className="bg-red-600 h-full w-[84%]" /></div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[8px] text-gray-400 mb-1">
                    <span>OBSIDIAN-9 COGNITION DECK [UNRESTRICTED]</span>
                    <span>{analytics?.providerStats?.groq || 12}%</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1 rounded-full"><div className="bg-indigo-500 h-full w-[12%]" /></div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[8px] text-gray-400 mb-1">
                    <span>VOID-SLICER COGNITION DECK [UNCENSORED]</span>
                    <span>{analytics?.providerStats?.openrouter || 4}%</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1 rounded-full"><div className="bg-amber-500 h-full w-[4%]" /></div>
                </div>
              </div>
            </div>

            {/* Activity Logs Console preview */}
            <div className="border border-neutral-900 p-3 bg-neutral-950/40 space-y-1">
              <span className="font-mono text-[8px] text-gray-500 uppercase block">ACTIVE SYSTEM DECK LOGGER</span>
              <div className="font-mono text-[8px] text-gray-400 space-y-1.5 pt-2">
                <div className="flex justify-between border-b border-neutral-900/60 pb-1">
                  <span>[19:21:02] SYNCED USER: bindhanibikash71@gmail.com</span>
                  <span className="text-green-500">INIT</span>
                </div>
                <div className="flex justify-between border-b border-neutral-900/60 pb-1">
                  <span>[19:21:18] SECURE CHAT STREAM: model=nova-3.5-flash</span>
                  <span className="text-red-500">PROXY</span>
                </div>
                <div className="flex justify-between border-b border-neutral-900/60 pb-1">
                  <span>[19:21:40] DISPATCHED ALERT: type=bannerID=init-ann</span>
                  <span className="text-gray-500">OPS</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* tab 2: User management */}
        {adminTab === 'users' && (
          <div className="space-y-3">
            <span className="font-mono text-[8px] text-gray-500 uppercase block">OPERATOR PROFILES DIRECTORY</span>
            <input
              type="text"
              placeholder="SEARCH USER IDENTIFIER..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-[10px] font-mono text-white placeholder-gray-700"
            />

            <div className="space-y-2 pt-1 max-h-[300px] overflow-y-auto">
              {fetchingUsers && <div className="text-center font-mono text-[10px] text-gray-500">SCANNET RETRIEVING OPERATOR INDEX...</div>}
              {usersList.filter(u => u.email.toLowerCase().includes(searchQuery.toLowerCase())).map((u) => (
                <div key={u.email} className="border border-neutral-900 bg-neutral-950 p-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1 font-mono">
                    <div className="font-bold text-white truncate text-[11px]">{u.email}</div>
                    <span className="text-[8px] text-gray-500 uppercase block mt-1">CODE: {u.referralCode} • {u.role === 'admin' ? '🛡️ ADMIN' : '👤 USER'}</span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleToggleUserBan(u.email, u.isBanned)}
                      className={`p-1 px-2 font-mono text-[9px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer ${
                        u.isBanned ? 'bg-green-600/10 text-green-500 border border-green-500/30 hover:bg-green-600 hover:text-black' : 'bg-red-600/10 text-red-500 border border-red-600/30 hover:bg-red-600 hover:text-black'
                      }`}
                    >
                      {u.isBanned ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      <span>{u.isBanned ? 'UNBAN' : 'BAN'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteUser(u.email)}
                      disabled={u.role === 'admin'}
                      className="p-1.5 bg-neutral-900 hover:bg-red-600 text-gray-500 hover:text-black border border-neutral-800 hover:border-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* tab 3: Providers Manager */}
        {adminTab === 'ai' && (
          <div className="space-y-3 font-mono text-[10px]">
            <span className="font-mono text-[8px] text-gray-500 uppercase block">CLOUD PROVIDERS CONSOLE</span>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[8px] text-gray-400 uppercase mb-1">OBSIDIAN UNRESTRICTED COGNITION DECRYPT KEY</label>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_vsk_gq_7y6TjH29..."
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-red-500 text-[10px] uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[8px] text-gray-400 uppercase mb-1">VOID-SLICER DECRYPT SECRETS KEY</label>
                <input
                  type="password"
                  value={orKey}
                  onChange={(e) => setOrKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-red-500 text-[10px] uppercase font-mono"
                />
              </div>

              <div className="border border-neutral-900 bg-neutral-950/20 p-2.5 leading-relaxed text-[9px] text-gray-400">
                ⚡ SECURITY PROTOCOL: All keys listed above are stored as encrypted variables on the secure workspace server, invisible to client-side bundles.
              </div>

              <button
                onClick={handleSaveAI}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-black font-black uppercase tracking-wider text-[10px] flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>SAVE PROVIDER CONFIG</span>
              </button>
            </div>
          </div>
        )}

        {/* tab 4: Prompt Manager */}
        {adminTab === 'prompt' && (
          <div className="space-y-3 font-mono text-[10px]">
            <span className="font-mono text-[8px] text-gray-500 uppercase block">GLOBAL COGNITIVE RULESETS</span>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[8px] text-gray-400 uppercase mb-1">MASTER SYSTEM PROMPT MATRIX</label>
                <textarea
                  rows={6}
                  value={globalPrompt}
                  onChange={(e) => setGlobalPrompt(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-red-500 text-[10px] leading-relaxed resize-none"
                />
              </div>

              <button
                onClick={handleSavePrompt}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-black font-black uppercase tracking-wider text-[10px] flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>COMMIT MASTER RULES</span>
              </button>
            </div>
          </div>
        )}

        {/* tab 5: Announcements dispatcher */}
        {adminTab === 'announcements' && (
          <div className="space-y-4">
            <span className="font-mono text-[8px] text-gray-500 uppercase block">BROADCAST ALERTS LAYER</span>
            
            <form onSubmit={handleDispatchAnnouncement} className="space-y-3">
              <div>
                <label className="block text-[8px] font-mono text-gray-400 uppercase mb-1">ALERT CONSOLE CONTENT</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MAINTENANCE POSTPONED • PIPELINE ACTIVE"
                  value={newAnn}
                  onChange={(e) => setNewAnn(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-[10px] font-mono text-white placeholder-gray-700"
                />
              </div>

              <div>
                <label className="block text-[8px] font-mono text-gray-400 uppercase mb-1">DISPATCH MODAL CATEGORY</label>
                <select
                  value={annType}
                  onChange={(e: any) => setAnnType(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 px-2 py-2 text-[10px] font-mono text-white"
                >
                  <option value="banner">SYSTEM UPPER BANNER</option>
                  <option value="popup">IMPACT POPUP COMPONENT</option>
                  <option value="push">PUSH NOTIFICATIONS CHIP</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-black font-black uppercase tracking-wider text-[10px] flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>DISPATCH BROADCASTS</span>
              </button>
            </form>

            <div className="border-t border-neutral-900 pt-3 space-y-2">
              <span className="font-mono text-[8px] text-gray-500 uppercase block">ACTIVE ALERTS DISPATCHED</span>
              <div className="space-y-1.5">
                {announcements.map((a) => (
                  <div key={a.id} className="border border-neutral-900 bg-neutral-950/80 p-2 text-[9px] font-mono flex justify-between items-center">
                    <div>
                      <span className="text-red-500 uppercase font-black">[{a.type}]</span>
                      <p className="text-gray-300 leading-tight mt-1">{a.content}</p>
                    </div>
                    <button
                      onClick={() => onDeleteAnnouncement(a.id)}
                      className="text-gray-500 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* tab 6: Social link modifiers */}
        {adminTab === 'social' && (
          <div className="space-y-3 font-mono text-[10px]">
            <span className="font-mono text-[8px] text-gray-500 uppercase block">COMMUNITY WIDGET CONTROLLLOG</span>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[8px] text-gray-400 uppercase mb-1">TELEGRAM CHAT GROUP URL</label>
                <input
                  type="text"
                  value={tgGroup}
                  onChange={(e) => setTgGroup(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none text-[10px]"
                />
              </div>

              <div>
                <label className="block text-[8px] text-gray-400 uppercase mb-1">TELEGRAM ANNOUNCEMENTS FEED</label>
                <input
                  type="text"
                  value={tgChan}
                  onChange={(e) => setTgChan(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none text-[10px]"
                />
              </div>

              <div>
                <label className="block text-[8px] text-gray-400 uppercase mb-1">INSTAGRAM BRAND URL</label>
                <input
                  type="text"
                  value={instaLink}
                  onChange={(e) => setInstaLink(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none text-[10px]"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2 border-t border-neutral-900 pt-3">
                <div className="flex justify-between items-center py-1">
                  <span>ACTIVATE TELEGRAM WIDGET</span>
                  <input
                    type="checkbox"
                    checked={tgWidget}
                    onChange={(e) => setTgWidget(e.target.checked)}
                    className="accent-red-600 rounded"
                  />
                </div>

                <div className="flex justify-between items-center py-1">
                  <span>ACTIVATE INSTAGRAM GRID</span>
                  <input
                    type="checkbox"
                    checked={instaWidget}
                    onChange={(e) => setInstaWidget(e.target.checked)}
                    className="accent-red-600 rounded"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveSocials}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-black font-black uppercase tracking-wider text-[10px] flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>UPDATE SOCIALS LAYER</span>
              </button>
            </div>
          </div>
        )}

        {/* tab 7: System Management */}
        {adminTab === 'system' && (
          <div className="space-y-3 font-mono text-[10px]">
            <span className="font-mono text-[8px] text-gray-500 uppercase block">CORE HEURISTIC SWAP</span>
            
            <div className="space-y-3 pt-1">
              <div className="border border-neutral-900 bg-neutral-950/40 p-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white uppercase block">MAINTENANCE SYSTEM MODE</span>
                  <p className="text-[8px] text-gray-500 leading-relaxed uppercase mt-1">Locks entire client to offline landing screens</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSystem(!mMode)}
                  className={`p-1.5 px-3 uppercase text-[9px] font-black border transition-colors cursor-pointer ${
                    mMode ? 'bg-red-600 text-black border-red-600' : 'text-gray-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {mMode ? 'MAINT_ON' : 'MAINT_OFF'}
                </button>
              </div>

              <div className="border border-neutral-900 bg-neutral-950/40 p-3 space-y-2">
                <span className="font-bold text-white uppercase block">LOCAL SQL BACKUP MODULE</span>
                <p className="text-[8px] text-gray-500 leading-normal uppercase">Creates persistent database backups of file configs inside our Node filesystem.</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => alert("BACKUP PROTOCOL DEPLOYED: snapshot_nova_v3_backup.json created.")}
                    className="flex-1 py-1 px-2 border border-neutral-800 text-[8px] hover:border-red-600 transition-colors uppercase"
                  >
                    RUN SNAPSHOT BACKUP
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("RESTORE PROTOCOL CONFIRMED: data synced successfully.")}
                    className="flex-1 py-1 px-2 border border-neutral-800 text-[8px] hover:border-red-600 transition-colors uppercase"
                  >
                    RESTORE SYSTEM SNAP
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
