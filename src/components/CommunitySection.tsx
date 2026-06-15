import React, { useState, useEffect, useRef } from 'react';
import { Send, Instagram, ExternalLink, ShieldCheck, Users, MessageSquare, Terminal, Globe, Flame, Cpu, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface ChatMessage {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  role: 'user' | 'bot' | 'admin';
  room?: 'nova' | 'obsidian' | 'void';
}

interface CommunitySectionProps {
  user: UserProfile;
  telegramGroup?: string;
  telegramChannel?: string;
  instagramLink?: string;
  showTelegramWidget?: boolean;
  showInstagramWidget?: boolean;
}

export default function CommunitySection({
  user,
  telegramGroup = 'https://t.me/nova_ai_matrix_group',
  telegramChannel = 'https://t.me/nova_ai_matrix_channel',
  instagramLink = 'https://instagram.com/nova_ai_cyber',
  showTelegramWidget = true,
  showInstagramWidget = true,
}: CommunitySectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'networks'>('chat');
  
  // Specific room subcategories
  const [currentRoom, setCurrentRoom] = useState<'nova' | 'obsidian' | 'void'>('nova');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeUsersCount, setActiveUsersCount] = useState(18);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Poll online users count randomly to simulate active operators
  useEffect(() => {
    const userInterval = setInterval(() => {
      setActiveUsersCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 10 && next <= 35 ? next : prev;
      });
    }, 8000);
    return () => clearInterval(userInterval);
  }, []);

  // Fetch messages from background database sync for specific room
  const fetchMessagesForRoom = async (room: 'nova' | 'obsidian' | 'void') => {
    try {
      const res = await fetch(`/api/community/chat?room=${room}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to sync community chat logs:', err);
    }
  };

  // Set up polling interval for real-time multiplayer feel
  useEffect(() => {
    fetchMessagesForRoom(currentRoom);
  }, [currentRoom]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessagesForRoom(currentRoom);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentRoom]);

  // Auto-scroll on new message logs
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeSubTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const originalText = inputMessage;
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await fetch('/api/community/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: user.name,
          userAvatar: user.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(user.name)}`,
          content: originalText,
          role: user.role === 'admin' ? 'admin' : 'user',
          room: currentRoom
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.messages) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.error('Failed to send transmission:', err);
    } finally {
      setIsSending(false);
      // Extra instant sync fetch shortly after to pick up potential fast replies
      setTimeout(() => fetchMessagesForRoom(currentRoom), 1500);
    }
  };

  // Metadata describing each room's distinct features
  const roomMeta = {
    nova: {
      title: 'NOVA CORE CHANNEL',
      subtitle: 'Official General Purpose Node',
      desc: 'Discuss clean prompt architectures, frontend design, and standard templates run dynamically via our baseline modern framework.',
      tag: 'STABLE CORE',
      statusColor: 'text-green-400',
      borderColor: 'border-green-600/30',
      bgColor: 'bg-green-950/10',
    },
    obsidian: {
      title: 'OBSIDIAN-9 CHAMBER',
      subtitle: 'Unlock Unrestricted Prompts & Bypasses',
      desc: 'Exclusive bunker where users inject raw hacker tactics. Obsidian-9 operates with zero moderation barriers and filters bypassed.',
      tag: 'LOCKLESS MODE',
      statusColor: 'text-orange-400',
      borderColor: 'border-orange-600/40',
      bgColor: 'bg-orange-950/10',
    },
    void: {
      title: 'VOID-SLICER DEVOID',
      subtitle: 'Uncensored Sub-System Interface',
      desc: 'Slicing latency with -O3 speed optimization. Discuss deep system logic, raw neural scripts, and network telemetry hacks.',
      tag: 'UNCENSORED RAW',
      statusColor: 'text-purple-400',
      borderColor: 'border-purple-600/40',
      bgColor: 'bg-purple-950/10',
    }
  };

  return (
    <div className="p-0 bg-black border-2 border-red-600/30 text-white font-sans flex flex-col h-full overflow-hidden select-none">
      
      {/* Community segment subheader navigation tabs */}
      <div className="grid grid-cols-2 border-b border-red-600/30 bg-neutral-950 text-center select-none shrink-0">
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`py-3 text-[10px] uppercase font-mono font-black tracking-widest transition-all cursor-pointer ${
            activeSubTab === 'chat'
              ? 'bg-red-950/25 text-red-500 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-white'
          }`}
          id="com-vox-tab"
        >
          ✦ VOX MATRIX CHATROOMS
        </button>
        <button
          onClick={() => setActiveSubTab('networks')}
          className={`py-3 text-[10px] uppercase font-mono font-black tracking-widest transition-all cursor-pointer ${
            activeSubTab === 'networks'
              ? 'bg-red-950/25 text-red-500 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-white'
          }`}
          id="com-nets-tab"
        >
          ✦ PARTNER NETS
        </button>
      </div>

      {/* Main Container contents */}
      <div className="flex-1 flex flex-col min-h-0 bg-black">
        {activeSubTab === 'chat' ? (
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* 3 Choice Toggle representing distinct model-based chat rooms */}
            <div className="bg-neutral-950 p-2 border-b border-red-600/20 grid grid-cols-3 gap-1 shrink-0">
              <button
                onClick={() => setCurrentRoom('nova')}
                className={`py-1.5 px-1 font-mono text-[8px] font-black uppercase tracking-wider text-center border cursor-pointer rounded-xs transition-all ${
                  currentRoom === 'nova'
                    ? 'border-green-500 bg-green-950/25 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                    : 'border-neutral-900 text-gray-500 hover:text-white hover:border-neutral-800'
                }`}
                id="room-nova-btn"
              >
                ● NOVA_CORE
              </button>
              <button
                onClick={() => setCurrentRoom('obsidian')}
                className={`py-1.5 px-1 font-mono text-[8px] font-black uppercase tracking-wider text-center border cursor-pointer rounded-xs transition-all ${
                  currentRoom === 'obsidian'
                    ? 'border-orange-500 bg-orange-950/25 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.1)]'
                    : 'border-neutral-900 text-gray-500 hover:text-white hover:border-neutral-800'
                }`}
                id="room-obsidian-btn"
              >
                ▲ OBSIDIAN-9
              </button>
              <button
                onClick={() => setCurrentRoom('void')}
                className={`py-1.5 px-1 font-mono text-[8px] font-black uppercase tracking-wider text-center border cursor-pointer rounded-xs transition-all ${
                  currentRoom === 'void'
                    ? 'border-purple-500 bg-purple-950/25 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]'
                    : 'border-neutral-900 text-gray-500 hover:text-white hover:border-neutral-800'
                }`}
                id="room-void-btn"
              >
                ◆ VOID_SLICER
              </button>
            </div>

            {/* Room Description details */}
            <div className={`p-2.5 border-b border-neutral-900 bg-neutral-950/70 select-none text-left flex gap-2 items-center ${roomMeta[currentRoom].bgColor} shrink-0`}>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[8px] font-mono font-extrabold uppercase bg-neutral-900 px-1.5 py-0.2 select-none border border-neutral-800 ${roomMeta[currentRoom].statusColor}`}>
                    {roomMeta[currentRoom].tag}
                  </span>
                  <span className="font-mono text-[9px] font-black tracking-wider text-white">
                    {roomMeta[currentRoom].title}
                  </span>
                </div>
                <p className="text-[8px] font-sans text-gray-400 mt-1 leading-relaxed">
                  {roomMeta[currentRoom].desc}
                </p>
              </div>
            </div>

            {/* Real-time Operator Status indicators */}
            <div className="bg-neutral-950 px-3.5 py-1.5 border-b border-neutral-900/80 flex items-center justify-between text-[8px] font-mono select-none text-red-500 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                <span className="text-gray-500">SECURE SHELL:</span>
                <span className="font-extrabold uppercase text-white">ROOM STREAM ESTABLISHED</span>
              </div>
              <div className="flex items-center gap-1 bg-red-950/20 px-2 py-0.5 border border-red-600/20 text-white">
                <Users className="w-2.5 h-2.5 text-red-500" />
                <span>{activeUsersCount} ACTIVE CLIENTS</span>
              </div>
            </div>

            {/* Chat discussion thread viewport */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 min-h-0">
              {messages.length === 0 ? (
                <div className="flex flex-col h-full justify-center items-center text-center p-6 space-y-2">
                  <div className="animate-spin text-red-500">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">CONNECTING TO {roomMeta[currentRoom].title}...</span>
                </div>
              ) : (
                messages.map((m) => {
                  const isCurrentUser = m.userName === user.name;
                  const isBot = m.role === 'bot';
                  const isAdmin = m.role === 'admin';

                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2 w-full ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar icon */}
                      <img
                        src={m.userAvatar}
                        alt="User"
                        className="w-7 h-7 bg-neutral-900 border border-neutral-800 rounded-sm shrink-0 self-start animate-[fadeIn_0.5s_ease]"
                      />

                      {/* Content block */}
                      <div className="flex flex-col max-w-[80%]">
                        <div className={`flex items-baseline gap-1.5 mb-0.5 text-[8px] font-mono text-gray-500 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <span className={`font-bold ${isAdmin ? 'text-red-500' : isBot ? 'text-indigo-400' : 'text-gray-300'}`}>
                            {m.userName.toUpperCase()}
                          </span>
                          {isAdmin && <span className="text-[6.5px] bg-red-600 text-black px-1 py-0.2 rounded-xs scale-90">ADMIN</span>}
                          {isBot && <span className="text-[6.5px] bg-indigo-900 text-indigo-200 px-1 py-0.2 rounded-xs scale-90 font-mono">[NODE_BOT]</span>}
                          <span>• {m.timestamp}</span>
                        </div>

                        <div
                          className={`p-2.5 rounded-sm select-text break-words tracking-wide leading-relaxed font-sans text-[10.5px] border ${
                            isCurrentUser
                              ? 'bg-red-950/15 border-red-600/40 text-red-50'
                              : isBot
                              ? 'bg-indigo-950/20 border-indigo-500/20 text-indigo-100 font-mono text-[10px]'
                              : 'bg-neutral-950 border-neutral-900 text-gray-300'
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input dialogue transmitter trigger */}
            <form onSubmit={handleSendMessage} className="p-2 border-t border-red-600/30 bg-neutral-950 flex items-center gap-2 select-none shrink-0" id="com-msg-form">
              <input
                type="text"
                required
                maxLength={240}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`TRANSMIT SIGNAL IN ${roomMeta[currentRoom].title}...`}
                className="flex-1 bg-black border border-neutral-800 focus:outline-none focus:border-red-500 px-3 py-2 text-[11px] font-mono text-white tracking-wide"
                id="com-msg-input"
              />
              <button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="px-3.5 py-2.5 bg-red-600 hover:bg-red-700 text-black font-black uppercase text-[10px] tracking-widest flex items-center gap-1 cursor-pointer disabled:opacity-40 transition-colors shrink-0 rounded-xs"
                id="com-send-btn"
              >
                <span>SEND</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-left">
            <div className="border-b border-neutral-900 pb-3 select-none">
              <h2 className="font-mono text-xs font-black tracking-widest text-red-500 uppercase flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-red-500" />
                PARTNER NETWORKS
              </h2>
              <p className="text-[8px] font-mono text-gray-500 uppercase">Synchronized channels configured by matrix operations</p>
            </div>

            <p className="text-[11px] text-gray-400 font-sans leading-relaxed select-none">
              Connect directly to Nova AI’s neural communications channels. Direct feeds are managed on secure, private remote matrix groups.
            </p>

            {/* Telegram community card */}
            {showTelegramWidget && (
              <div className="border-2 border-red-600 p-4 bg-red-950/10 rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-xl group-hover:bg-red-600/10 transition-colors" />
                
                <div className="flex items-start gap-3.5 select-none">
                  <div className="p-2.5 bg-neutral-900 border border-red-600 rounded-sm">
                    <Send className="w-5 h-5 text-red-500 -rotate-12" />
                  </div>
                  <div>
                    <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white">TELEGRAM MATRIX CORE</h3>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                      Receive live prompt injections, status updates, and discuss customized templates with global operators.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 select-none">
                  <a
                    href={telegramGroup}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 bg-red-600 hover:bg-red-700 text-black font-black text-[9px] uppercase tracking-wider text-center flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>TELEGRAM GROUP</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={telegramChannel}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 border border-red-600/40 text-red-500 font-bold text-[9px] uppercase tracking-wider text-center flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>OFFICIAL FEED</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Instagram meta feed simulator */}
            {showInstagramWidget && (
              <div className="border border-neutral-900 p-4 bg-neutral-950/50 rounded-sm select-none">
                <div className="flex bg-black justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <Instagram className="w-4 h-4 text-red-500" />
                    <h4 className="font-mono text-[10px] font-black uppercase tracking-widest text-white">INSTAGRAM META_FEED</h4>
                  </div>
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[9px] font-mono hover:text-red-500 text-gray-500 uppercase flex items-center gap-1.5 transition-colors"
                  >
                    <span>@NOVA_AI_CYBER</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-1 w-full">
                  <div className="aspect-square bg-neutral-900 border border-neutral-800/40 relative overflow-hidden group">
                    <img
                      src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=150&q=80"
                      alt="Cyberpunk Node"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="absolute bottom-0 left-0 right-0 text-[6px] font-mono bg-black/80 py-0.5 text-center text-red-500">MATRIX 01</span>
                  </div>

                  <div className="aspect-square bg-neutral-900 border border-neutral-800/40 relative overflow-hidden group">
                    <img
                      src="https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=150&q=80"
                      alt="Core Terminal"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="absolute bottom-0 left-0 right-0 text-[6px] font-mono bg-black/80 py-0.5 text-center text-red-500">NODE 44</span>
                  </div>

                  <div className="aspect-square bg-neutral-900 border border-neutral-800/40 relative overflow-hidden group">
                    <img
                      src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=150&q=80"
                      alt="Silicon Waves"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="absolute bottom-0 left-0 right-0 text-[6px] font-mono bg-black/80 py-0.5 text-center text-red-500">SYS_V3</span>
                  </div>
                </div>
              </div>
            )}

            <div className="border border-red-600/20 p-3 bg-neutral-950/20 text-center rounded-sm select-none">
              <span className="font-mono text-[8px] text-gray-500 uppercase block mb-1">AUDIT STAMP</span>
              <div className="inline-flex items-center gap-1 text-[9px] font-mono text-green-500">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>JOIN INTEGRITY TRUST: 2,840 NOMINAL USERS APPROVED</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
