import React, { useState, useEffect } from 'react';
import { Bot, Users, ShieldAlert, Settings, Terminal, Radio, HelpCircle, User, MessageCircle, AlertTriangle } from 'lucide-react';
import { Agent, ChatFolder, ChatSession, Message, UserProfile, AdminSettings, SystemAnnouncement } from './types';
import AuthScreen from './components/AuthScreen';
import ChatConsole from './components/ChatConsole';
import AgentSelector from './components/AgentSelector';
import CommunitySection from './components/CommunitySection';
import DashboardStats from './components/DashboardStats';
import AdminConsole from './components/AdminConsole';
import LivePlayground from './components/LivePlayground';
import DeployGuide from './components/DeployGuide';
import { CloudLightning } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('nova_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('nova_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('nova_user_session');
    }
  }, [user]);

  const [activeTab, setActiveTab] = useState<'chat' | 'agents' | 'community' | 'deploy' | 'dashboard' | 'admin'>('chat');
  
  // Base settings & announcements syncing
  const [settings, setSettings] = useState<AdminSettings>({
    groqKey: '',
    openRouterKey: '',
    globalPrompt: 'You are Nova AI...',
    maintenanceMode: false,
    telegramGroup: 'https://t.me/nova_ai_matrix_group',
    telegramChannel: 'https://t.me/nova_ai_matrix_channel',
    instagramLink: 'https://instagram.com/nova_ai_cyber',
    enableTelegramWidget: true,
    enableInstagramWidget: true,
  });
  
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>([]);
  const [dismissedAnns, setDismissedAnns] = useState<string[]>([]);

  // Core folders and session lists
  const [folders, setFolders] = useState<ChatFolder[]>([
    { id: 'fld-gen', name: 'Neural Archives' }
  ]);

  const [agents, setAgents] = useState<Agent[]>([
    { id: 'nova-core', name: 'Nova Core', avatar: 'bot', category: 'core', description: 'Supreme futuristic AI terminal specializing in pristine general reasoning.', prompt: 'You are Nova AI, operating on recipes matrix. Be distinct, cyberpunk, clean, and write markdown.' },
    { id: 'nova-coding', name: 'Coding Nexus', avatar: 'code', category: 'technical', description: 'Deep technical coder creating clean HTML, CSS, JAVASCRIPT scripts.', prompt: 'You are Coding Nexus. Pack complete executable code in HTML markdown blocks.' },
    { id: 'nova-research', name: 'Deep Research', avatar: 'globe', category: 'creative', description: 'Search agent specializing in dense papers, summarizations, and web context.', prompt: 'You are Deep Research. Structure answers cleanly with data blocks.' },
    { id: 'nova-writing', name: 'Writing Prose', avatar: 'writing', category: 'creative', description: 'Creative model crafting articles, copywriting, and synthetic scripts.', prompt: 'You are the creative writer agent.' },
    { id: 'nova-study', name: 'Study Tutor', avatar: 'study', category: 'study', description: 'Math helper and logic tutor deconstructing formulations.', prompt: 'You are the academic tutor module.' },
    { id: 'nova-prod', name: 'Matrix Planner', avatar: 'prod', category: 'productivity', description: 'Heuristic productivity assistant mapping optimized schedules.', prompt: 'You are the productivity planner agent.' }
  ]);

  const [selectedAgentId, setSelectedAgentId] = useState<string>('nova-core');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Synchronize base configurations from Express backend
  const loadPlatformConfig = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
      if (data.announcements) setAnnouncements(data.announcements);
    } catch (e) {
      console.error("Could not sync platform config:", e);
    }
  };

  useEffect(() => {
    loadPlatformConfig();
  }, []);

  // Initialize standard chat session if first-time load
  useEffect(() => {
    if (user && sessions.length === 0) {
      const initId = 'sess-initial';
      const initS: ChatSession = {
        id: initId,
        title: '✦ Initializing Core ✦',
        agentId: 'nova-core',
        messages: [
          {
            id: 'welcome',
            role: 'assistant',
            content: `⚡ **WELCOME MASTER OPERATOR.** ⚡\n\nI am Nova AI, a professional-grade brutalist platform assembled to process query directives.\n\n- Write prompts directly inside our mobile chassis.\n- Load customized agents.\n- Check settings to submit system bugs or view statistics.\n- Access secure administrative console using passcode \`admin\`.`,
            timestamp: new Date().toLocaleTimeString()
          }
        ],
        createdAt: new Date().toISOString()
      };
      setSessions([initS]);
      setSelectedSessionId(initId);
    }
  }, [user]);

  // Manage platform configurations
  const handleUpdateSettings = async (updates: Partial<AdminSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAnnouncement = async (content: string, type: 'banner' | 'popup' | 'push') => {
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type }),
      });
      const data = await res.json();
      if (data.announcements) setAnnouncements(data.announcements);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const res = await fetch('/api/admin/announcements/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.announcements) setAnnouncements(data.announcements);
    } catch (e) {
      console.error(e);
    }
  };

  // Submit bug report directly from user settings
  const handleSubmissionBug = async (text: string, type: 'bug' | 'feature') => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user?.email,
          type,
          text
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Chat session modifiers
  const handleUpdateMessages = (sessId: string, msgs: Message[]) => {
    setSessions(prev => prev.map(s => s.id === sessId ? { ...s, messages: msgs } : s));
  };

  const handleNewSession = () => {
    const nSId = 'sess-' + Math.random().toString(36).substring(2, 9);
    const nS: ChatSession = {
      id: nSId,
      title: 'Session Operation',
      agentId: selectedAgentId,
      messages: [],
      createdAt: new Date().toISOString()
    };
    setSessions([nS, ...sessions]);
    setSelectedSessionId(nSId);
  };

  const handleDeleteSession = (sessId: string) => {
    const updated = sessions.filter(s => s.id !== sessId);
    setSessions(updated);
    if (selectedSessionId === sessId) {
      setSelectedSessionId(updated[0]?.id || null);
    }
  };

  const handleModifySession = (sessId: string, updates: Partial<ChatSession>) => {
    setSessions(prev => prev.map(s => s.id === sessId ? { ...s, ...updates } : s));
  };

  const handleCreateCustomAgent = (item: Agent) => {
    setAgents([...agents, item]);
  };

  const handleIncrementLimitCounter = () => {
    if (user) {
      setUser({
        ...user,
        dailyUsed: user.dailyUsed + 1
      });
    }
  };

  // Sniff active chat thread for executable code outputs
  const getActiveThreadCodeAndRender = (): string => {
    const sess = sessions.find(s => s.id === selectedSessionId);
    if (!sess) return '';
    const lastAssistantMessage = [...sess.messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistantMessage) return '';
    return lastAssistantMessage.content;
  };

  const parsedCodeToRunLive = getActiveThreadCodeAndRender();
  const containsRunnableCode = parsedCodeToRunLive.includes('```html') || parsedCodeToRunLive.includes('<!DOCTYPE html>');

  // Show locked maintenance screen if toggled from admin panel
  if (settings.maintenanceMode && user?.role !== 'admin') {
    return (
      <div className="bg-[#050505] text-white min-h-screen flex flex-col justify-center items-center font-mono p-6">
        <div className="border-4 border-red-600 p-8 max-w-sm text-center bg-red-950/20 select-none shadow-[0_0_30px_rgba(255,26,26,0.2)]">
          <AlertTriangle className="mx-auto text-red-500 w-12 h-12 mb-3 animate-pulse" />
          <h1 className="text-2xl font-black text-white uppercase tracking-widest leading-none mb-1">MAINTENANCE_LOG</h1>
          <span className="text-[10px] text-red-500 tracking-[0.2em] uppercase font-bold block mb-4">Sectors offline</span>
          <p className="text-[11px] text-gray-400 leading-relaxed uppercase">
            Administrators have loaded a maintenance protocol. System is temporarily routing signals back to central nodes during restoration cycles.
          </p>
          <div className="border-t border-red-600/20 pt-4 mt-6 text-[8px] text-gray-600 uppercase tracking-widest">
            nova platform database sync stable
          </div>
        </div>
      </div>
    );
  }

  // Render authentication screens if not logged in
  if (!user) {
    return (
      <div className="bg-[#000000] min-h-screen flex items-center justify-center p-4">
        <AuthScreen onLoginSuccess={(profile) => setUser(profile)} />
      </div>
    );
  }

  // Check active popups
  const activePopupAnnouncements = announcements.filter(
    (a) => a.type === 'popup' && !dismissedAnns.includes(a.id)
  );

  return (
    <div className="h-screen md:min-h-screen bg-[#050505] text-white flex flex-col md:flex-row justify-center items-stretch overflow-hidden font-sans select-none relative">
      
      {/* Background radial pixel grids matching brutality */}
      <div className="absolute inset-0 pixel-grid pointer-events-none z-0 opacity-40" />

      {/* Pop-up announcements modal overlay */}
      {activePopupAnnouncements.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-[#050505] border-3 border-red-600 p-5 max-w-sm w-full font-mono text-white relative shadow-[0_0_30px_rgba(255,26,26,0.2)]">
            <h3 className="font-extrabold text-xs text-red-500 tracking-wider mb-2.5">✦ COGNITIVE BROADCAST POPUP</h3>
            <p className="text-[10.5px] text-gray-300 leading-relaxed uppercase">{activePopupAnnouncements[0].content}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setDismissedAnns([...dismissedAnns, activePopupAnnouncements[0].id])}
                className="px-3 py-1 bg-red-600 text-black font-black text-[9px] uppercase tracking-wider"
              >
                Acknowledge Directive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Core Full-Stack Page Frame (Simulator) */}
      <div className="flex-1 max-w-[1300px] mx-auto p-0 md:p-8 flex flex-col md:flex-row md:gap-6 items-stretch z-10 w-full h-full md:h-auto overflow-hidden">
        
        {/* Device Frame Centering Container */}
        <div className="flex justify-center items-center flex-1 md:max-w-md w-full h-full">
          {/* Brutalist smartphone chassis wrap */}
          <div className="w-full h-full md:max-w-sm md:h-[750px] bg-black border-0 md:border-4 border-red-600 md:shadow-[0_0_50px_rgba(255,26,26,0.15)] md:rounded-2xl flex flex-col overflow-hidden relative">
            
            {/* Upper Device status notches */}
            <div className="h-6 bg-neutral-950 px-4 flex items-center justify-between text-[8px] font-mono text-gray-500 select-none relative border-b border-neutral-900/40">
              <span>NOVA_NET v3.0</span>
              {/* Device Notch center spacer */}
              <div className="absolute top-0 right-1/2 translate-x-1/2 w-20 h-3.5 bg-black rounded-b-xl border-x border-b border-red-600/30" />
              <div className="flex items-center gap-1.5">
                <span>100% [🔋]</span>
                <span>LTE</span>
              </div>
            </div>

            {/* upper top notification banner alert if present */}
            {announcements.filter((a) => a.type === 'banner' && !dismissedAnns.includes(a.id)).map((a) => (
              <div key={a.id} className="bg-red-600 text-black px-3 py-1 text-[8px] font-mono font-black flex justify-between items-center z-20">
                <span className="truncate">{a.content}</span>
                <button
                  onClick={() => setDismissedAnns([...dismissedAnns, a.id])}
                  className="px-1 text-black font-bold font-mono text-[9px] hover:text-white"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Primary active visual frame panel rendering */}
            <div className="flex-1 min-h-0">
              {activeTab === 'chat' && (
                <ChatConsole
                  user={user}
                  agent={agents.find(a => a.id === selectedAgentId) || agents[0]}
                  folders={folders}
                  sessions={sessions}
                  selectedSessionId={selectedSessionId}
                  onSelectSession={(id) => setSelectedSessionId(id)}
                  onNewSession={handleNewSession}
                  onUpdateSessionMessages={handleUpdateMessages}
                  onAddFolder={(name) => setFolders([...folders, { id: 'f-' + Math.random().toString(), name }])}
                  onModifySession={handleModifySession}
                  onDeleteSession={handleDeleteSession}
                  onIncrementUsage={handleIncrementLimitCounter}
                />
              )}

              {activeTab === 'agents' && (
                <AgentSelector
                  selectedAgentId={selectedAgentId}
                  onSelectAgent={(id) => {
                    setSelectedAgentId(id);
                    setActiveTab('chat');
                  }}
                  agents={agents}
                  onCreateCustomAgent={handleCreateCustomAgent}
                />
              )}

              {activeTab === 'community' && (
                <CommunitySection
                  user={user}
                  telegramGroup={settings.telegramGroup}
                  telegramChannel={settings.telegramChannel}
                  instagramLink={settings.instagramLink}
                  showTelegramWidget={settings.enableTelegramWidget}
                  showInstagramWidget={settings.enableInstagramWidget}
                />
              )}

              {activeTab === 'deploy' && (
                <DeployGuide userEmail={user?.email} />
              )}

              {activeTab === 'dashboard' && (
                <DashboardStats
                  user={user}
                  onSubmitBugReport={handleSubmissionBug}
                />
              )}

              {activeTab === 'admin' && (
                <AdminConsole
                  currentSettings={settings}
                  announcements={announcements}
                  onUpdateSettings={handleUpdateSettings}
                  onAddAnnouncement={handleAddAnnouncement}
                  onDeleteAnnouncement={handleDeleteAnnouncement}
                />
              )}
            </div>

            {/* Bottom device task bar bottom-navigation controls */}
            <div className="h-14 bg-neutral-950 border-t-2 border-red-600 flex justify-around items-center px-2 select-none">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'chat' ? 'text-red-500' : 'text-gray-500 hover:text-white'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span className="text-[7px] font-mono uppercase tracking-widest">CONSOLE</span>
              </button>

              <button
                onClick={() => setActiveTab('agents')}
                className={`flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'agents' ? 'text-red-500' : 'text-gray-500 hover:text-white'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span className="text-[7px] font-mono uppercase tracking-widest">AGENTS</span>
              </button>

              <button
                onClick={() => setActiveTab('community')}
                className={`flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'community' ? 'text-red-500' : 'text-gray-500 hover:text-white'
                }`}
              >
                <Radio className="w-4 h-4 text-xs" />
                <span className="text-[7px] font-mono uppercase tracking-widest">NETS</span>
              </button>

              <button
                onClick={() => setActiveTab('deploy')}
                className={`flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'deploy' ? 'text-red-500' : 'text-gray-500 hover:text-white'
                }`}
                id="btn-nav-deploy"
              >
                <CloudLightning className="w-4 h-4" />
                <span className="text-[7px] font-mono uppercase tracking-widest">DEPLOY</span>
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'dashboard' ? 'text-red-500' : 'text-gray-500 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-[7px] font-mono uppercase tracking-widest">ACCOUNT</span>
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'admin' ? 'text-red-500' : 'text-gray-500 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span className="text-[7px] font-mono uppercase tracking-widest">SEC_OPS</span>
              </button>
            </div>

            {/* Virtual bottom slider bar indicator representing smartphone layout */}
            <div className="h-3.5 bg-neutral-950 flex justify-center items-center">
              <div className="w-24 h-1 bg-red-600/40 rounded-full" />
            </div>

          </div>
        </div>

        {/* Desktop Split Dashboard Side: Live compilation sandbox and code executor */}
        <div className="hidden md:flex flex-1 flex-col justify-stretch min-h-[400px]">
          {containsRunnableCode ? (
            <div className="h-full flex flex-col justify-stretch">
              <LivePlayground initialCode={parsedCodeToRunLive} />
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-red-600/20 bg-neutral-950/20 rounded-sm flex flex-col justify-center items-center p-6 text-center space-y-4 select-none">
              <div className="p-3 bg-neutral-950 border border-neutral-900 rounded-sm">
                <Bot className="w-8 h-8 text-neutral-600 animate-[pulse_3s_infinite]" />
              </div>
              <div className="max-w-sm">
                <h3 className="font-mono text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">LIVE_PREVIEW CHAMBER</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
                  The real-time compiler is listening. Code outputs matching **html** or **css** formats compiled inside the phone console will render interactive sandbox displays live here.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
