import React, { useState, useRef, useEffect } from 'react';
import { Send, Pin, Heart, Share2, CornerDownLeft, Eye, FileText, Image, Search, ChevronRight, HelpCircle, HardDriveUpload, Check, Copy, FolderPlus, Sparkles, FolderClosed, Trash2 } from 'lucide-react';
import { Agent, ChatFolder, ChatSession, FileAttachment, Message, UserProfile } from '../types';

interface ChatConsoleProps {
  user: UserProfile;
  agent: Agent;
  folders: ChatFolder[];
  sessions: ChatSession[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onUpdateSessionMessages: (sessionId: string, messages: Message[]) => void;
  onAddFolder: (name: string) => void;
  onModifySession: (sessionId: string, updates: Partial<ChatSession>) => void;
  onDeleteSession: (sessionId: string) => void;
  onIncrementUsage: () => void;
}

export default function ChatConsole({
  user,
  agent,
  folders,
  sessions,
  selectedSessionId,
  onSelectSession,
  onNewSession,
  onUpdateSessionMessages,
  onAddFolder,
  onModifySession,
  onDeleteSession,
  onIncrementUsage
}: ChatConsoleProps) {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [folderName, setFolderName] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);
  
  // Media states
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [ocrActive, setOcrActive] = useState(false);

  // Layout states
  const [showSidebar, setShowSidebar] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharingSlug, setSharingSlug] = useState<string | null>(null);

  // Thread scroll controllers
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Session computation
  const activeSession = sessions.find((s) => s.id === selectedSessionId) || null;

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, ocrActive]);

  // OCR Processing Simulations
  const processAttachedFiles = (files: FileList) => {
    setOcrActive(true);
    
    // Process list profiles
    const processed: FileAttachment[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const isImg = file.type.startsWith('image/');
      
      reader.onload = (e) => {
        processed.push({
          name: file.name,
          type: file.type,
          size: file.size,
          content: String(e.target?.result || ''),
          isImage: isImg,
          ocrOutput: isImg 
            ? `✦ OCR COMPLETE: Extracted visual node metadata. Label: [Cyber Silicon Core], OCR Conf: 98.4%.`
            : `✦ OCR COMPLETE: Read structured document entries. Found: 14 operator columns.`
        });
        
        if (processed.length === files.length) {
          setAttachments([...attachments, ...processed]);
          setOcrActive(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      processAttachedFiles(e.dataTransfer.files);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && attachments.length === 0) return;

    if (user.dailyUsed >= user.dailyLimit) {
      alert("🚨 MATRIX OVERFLOW: Your daily operator prompt allocation is completely used.");
      return;
    }

    // Initialize session automatically if none active
    let currentSessionId = selectedSessionId;
    if (!currentSessionId) {
      const newSId = 'sess-' + Math.random().toString(36).substring(2, 9);
      const newS: ChatSession = {
        id: newSId,
        title: inputText.substring(0, 24) || 'Cyber Channel Operation',
        agentId: agent.id,
        messages: [],
        createdAt: new Date().toISOString()
      };
      sessions.push(newS);
      currentSessionId = newSId;
      onSelectSession(newSId);
    }

    const sessionObj = sessions.find((s) => s.id === currentSessionId)!;

    const userMsg: Message = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: inputText,
      timestamp: new Date().toLocaleTimeString(),
      files: attachments.length > 0 ? [...attachments] : undefined
    };

    const updatedMsgs = [...sessionObj.messages, userMsg];
    onUpdateSessionMessages(currentSessionId, updatedMsgs);
    setInputText('');
    setAttachments([]);
    onIncrementUsage();

    // Trigger AI response stream proxy on the server
    const aiMsgId = 'msg-' + Math.random().toString(36).substring(2, 9);
    const aiMsgPlaceholder: Message = {
      id: aiMsgId,
      role: 'assistant',
      content: '📡 CONNECTING VIA NOVA NEURAL NETWORKS...',
      timestamp: new Date().toLocaleTimeString(),
      isStreaming: true
    };

    onUpdateSessionMessages(currentSessionId, [...updatedMsgs, aiMsgPlaceholder]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMsgs,
          agentPrompt: agent.prompt,
          fileOutputs: userMsg.files
        })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulator = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const bodyStr = line.substring(6).trim();
              if (bodyStr === '[DONE]') {
                // Done writing chunks
              } else {
                try {
                  const payload = JSON.parse(bodyStr);
                  accumulator += payload.text;
                  onUpdateSessionMessages(currentSessionId, [
                    ...updatedMsgs,
                    {
                      ...aiMsgPlaceholder,
                      content: accumulator,
                      isStreaming: true
                    }
                  ]);
                } catch (pe) {
                  // Ignore parsing failures
                }
              }
            }
          }
        }
      }

      // Finalize audio synthesized readings and clean state
      onUpdateSessionMessages(currentSessionId, [
        ...updatedMsgs,
        {
          ...aiMsgPlaceholder,
          content: accumulator || "Simulated neural grid stabilized.",
          isStreaming: false
        }
      ]);

    } catch (err: any) {
      console.error(err);
      onUpdateSessionMessages(currentSessionId, [
        ...updatedMsgs,
        {
          id: aiMsgId,
          role: 'assistant',
          content: `❌ SYSTEM TIMEOUT ERROR: ${err.message || err}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  };

  const copyText = (txt: string, msgId: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const createFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    onAddFolder(folderName);
    setFolderName('');
    setShowFolderModal(false);
  };

  const handleShareSession = (sess: ChatSession) => {
    const slug = `https://nova.ai/shared/${sess.id}`;
    onModifySession(sess.id, { shareSlug: slug });
    setSharingSlug(slug);
    setTimeout(() => setSharingSlug(null), 4000);
  };

  // Filtered session sets matching search inputs
  const filteredSessions = sessions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="bg-black text-white font-sans w-full flex flex-col h-full overflow-hidden relative">
      
      {/* Top action header */}
      <div className="p-3 bg-neutral-950 border-b border-red-600/30 flex items-center justify-between select-none">
        <button
          onClick={() => setShowSidebar(true)}
          className="p-1.5 border border-red-600 bg-red-950/15 text-red-500 hover:text-black hover:bg-red-600 font-mono text-[9px] font-black uppercase transition-colors rounded-sm cursor-pointer"
        >
          [ CHANNELS ]
        </button>
        
        <div className="text-center">
          <span className="font-mono text-[8px] text-red-500 uppercase tracking-widest block">ACTIVE EMISSION CHANNEL</span>
          <h1 className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-1 justify-center">
            ✦ {agent.name.toUpperCase()} ✦
          </h1>
        </div>

        <div className="font-mono text-[8px] text-green-500 border border-green-500/30 px-1.5 py-0.5 rounded-xs select-none">
          AES_256 SECURE
        </div>
      </div>

      {/* Slideout Workspace Drawer (Chat history, pin state, folder management) */}
      {showSidebar && (
        <div className="absolute inset-0 bg-black/95 z-50 flex flex-col font-mono select-none">
          <div className="p-3 bg-neutral-950 border-b border-red-600 flex justify-between items-center">
            <span className="text-xs font-black tracking-widest uppercase">OPERATOR CONSOLES</span>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-[10px] text-red-500 uppercase hover:text-white"
            >
              [ CLOSE ]
            </button>
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            {/* Search chat */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-red-500" />
              <input
                type="text"
                placeholder="SEARCH OPERATIONS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-neutral-900 border border-neutral-800 text-[9px] text-white focus:outline-none focus:border-red-600 font-mono"
              />
            </div>

            {/* Folder action creators */}
            <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
              <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest">CHAT FOLDERS</span>
              <button
                onClick={() => setShowFolderModal(true)}
                className="text-[9px] text-red-500 hover:text-white flex items-center gap-1"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>NEW</span>
              </button>
            </div>

            {/* Folders List */}
            <div className="space-y-1.5 pt-1">
              {folders.map((f) => (
                <div key={f.id} className="flex items-center gap-2 text-[10px] text-gray-400 p-1.5 bg-neutral-900 border border-neutral-800/40">
                  <FolderClosed className="w-3.5 h-3.5 text-amber-500" />
                  <span>{f.name.toUpperCase()}</span>
                </div>
              ))}
            </div>

            {/* Sessions list */}
            <div className="pt-3 border-t border-neutral-900">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest">ACTIVE TERMINALS</span>
                <button
                  onClick={() => {
                    onNewSession();
                    setShowSidebar(false);
                  }}
                  className="px-2 py-0.5 bg-red-600 text-black font-black text-[9px] uppercase tracking-wider"
                >
                  NEW SESSION
                </button>
              </div>

              <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                {filteredSessions.map((s) => {
                  const isActive = s.id === selectedSessionId;
                  return (
                    <div
                      key={s.id}
                      className={`p-2 border relative group flex flex-col justify-between cursor-pointer transition-colors ${
                        isActive ? 'bg-red-950/20 border-red-500' : 'bg-neutral-950 border-neutral-900/60 hover:border-red-600/40'
                      }`}
                    >
                      <div className="flex justify-between items-start" onClick={() => {
                        onSelectSession(s.id);
                        setShowSidebar(false);
                      }}>
                        <div className="min-w-0 flex-1 pr-4">
                          <div className="flex items-center gap-1">
                            {s.isPinned && <Pin className="w-2.5 h-2.5 text-red-500" />}
                            {s.isFavorite && <Heart className="w-2.5 h-2.5 text-purple-400" />}
                            <span className="text-[10px] font-bold text-white truncate uppercase">{s.title}</span>
                          </div>
                          <span className="text-[7px] text-gray-500 uppercase mt-0.5 block">{s.messages.length} EMISSIONS</span>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end mt-1.5 pt-1 border-t border-neutral-900/20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onModifySession(s.id, { isPinned: !s.isPinned });
                          }}
                          className={`text-[8px] ${s.isPinned ? 'text-red-500' : 'text-gray-500'}`}
                        >
                          PIN
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onModifySession(s.id, { isFavorite: !s.isFavorite });
                          }}
                          className={`text-[8px] ${s.isFavorite ? 'text-purple-400' : 'text-gray-500'}`}
                        >
                          FAV
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(s.id);
                          }}
                          className="text-[8px] text-red-600 hover:text-red-500"
                        >
                          DEL
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Create custom folders popup */}
      {showFolderModal && (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <form onSubmit={createFolder} className="bg-black border-2 border-red-600 p-4 w-full max-w-xs font-mono text-white">
            <h3 className="font-bold text-xs uppercase text-red-500 mb-3 tracking-widest">✦ NEW DIRECTORY CLASS</h3>
            <input
              type="text"
              required
              placeholder="FOLDER_NAME..."
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 tracking-wider mb-4"
            />
            <div className="flex gap-2 text-[10px]">
              <button
                type="submit"
                className="flex-1 py-1.5 bg-red-600 text-black font-black uppercase text-center"
              >
                CREATE
              </button>
              <button
                type="button"
                onClick={() => setShowFolderModal(false)}
                className="px-3 bg-neutral-900 border border-neutral-800 text-gray-400 uppercase text-center"
              >
                CLOSE
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chat Thread Messages Stream Viewports */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 font-mono select-none"
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleFileDrop}
      >
        {dragActive && (
          <div className="absolute inset-4 border-2 border-dashed border-red-600 bg-black/90 flex flex-col justify-center items-center z-40 p-4 text-center">
            <HardDriveUpload className="w-10 h-10 text-red-500 animate-bounce mb-3" />
            <h4 className="font-bold text-sm tracking-wide text-white uppercase">DROP NEURAL ATTACHMENTS</h4>
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">PDF, IMAGE, DOCX OR DATA_LOGS FOR AUTOMATION OCR SCANNING</p>
          </div>
        )}

        {ocrActive && (
          <div className="p-3 bg-neutral-900 border border-red-600 text-center animate-pulse">
            <span className="text-[9px] text-red-500 tracking-[0.2em] font-black uppercase block">
              ⚡ SCANNING OCR: COGNITIVE EXTRACTION PENDING...
            </span>
          </div>
        )}

        {/* Display share settings details */}
        {sharingSlug && (
          <div className="p-2.5 bg-green-950/20 border border-green-500 text-green-500 text-[9px] uppercase tracking-wider text-center">
            🔗 PUBLIC CHANNEL LINK COPIED: {sharingSlug}
          </div>
        )}

        {(!activeSession || activeSession.messages.length === 0) ? (
          <div className="h-full flex flex-col justify-center items-center text-center py-10 space-y-5">
            <div className="border border-red-600/30 p-4 bg-red-950/5 text-center max-w-xs rounded-sm">
              <span className="font-mono text-[8px] text-red-500 uppercase tracking-widest block mb-2">INTERFACE SECURED BY JWT</span>
              <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                Provide prompt requests, custom files, or vocal dictates above to run simulations. Or load other specialized agents using parameters controls.
              </p>
            </div>
          </div>
        ) : (
          activeSession.messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col max-w-[85%] space-y-1.5 ${
                  isUser ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                {/* Meta details */}
                <span className="text-[8px] text-gray-500 uppercase">
                  {isUser ? 'OPERATOR' : agent.name.toUpperCase()} • {m.timestamp}
                </span>

                {/* Body message */}
                <div
                  className={`p-3 text-[10px] sm:text-xs leading-relaxed border select-text ${
                    isUser
                      ? 'bg-neutral-950 border-neutral-900 text-red-50 font-sans rounded-bl-sm rounded-t-sm'
                      : 'bg-red-950/5 border-red-600/30 text-white font-mono rounded-br-sm rounded-t-sm shadow-[0_0_10px_rgba(255,26,26,0.02)]'
                  }`}
                >
                  {m.content}

                  {/* Render files in user message */}
                  {m.files && m.files.map((f, fi) => (
                    <div key={fi} className="mt-2.5 border-t border-neutral-900/60 pt-2 flex items-start gap-2.5">
                      {f.isImage ? <Image className="w-4 h-4 text-red-500 mt-0.5" /> : <FileText className="w-4 h-4 text-indigo-400 mt-0.5" />}
                      <div className="min-w-0">
                        <span className="text-[9px] text-gray-300 font-mono block font-black truncate max-w-[140px]">{f.name}</span>
                        {f.ocrOutput && (
                          <p className="text-[8px] text-gray-500 leading-tight bg-neutral-900 p-1 border border-neutral-900 uppercase mt-1">
                            {f.ocrOutput}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Micro Actions row (Copy, Share etc) */}
                <div className="flex gap-2 text-[8px] text-gray-500 uppercase select-none font-sans">
                  <button
                    onClick={() => copyText(m.content, m.id)}
                    className="hover:text-red-500 transition-colors flex items-center gap-0.5"
                  >
                    {copiedId === m.id ? 'COPIED!' : 'COPY'}
                  </button>
                  <span className="text-gray-800">|</span>
                  <button
                    onClick={() => handleShareSession(activeSession)}
                    className="hover:text-red-500 transition-colors"
                  >
                    SHARE
                  </button>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Custom drag file visual list */}
      {attachments.length > 0 && (
        <div className="bg-neutral-950 px-3 py-2 border-t border-neutral-900 flex gap-1.5 overflow-x-auto select-none">
          {attachments.map((file, i) => (
            <div key={i} className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 text-[8px] font-mono text-gray-400 whitespace-nowrap">
              <span>{file.name.substring(0, 10)}...</span>
              <button
                type="button"
                onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                className="text-red-500 font-bold ml-1 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Master dynamic Input bar Form */}
      <form onSubmit={handleSendMessage} className="p-3 bg-neutral-950 border-t border-red-600/30 flex items-center gap-2.5 select-none">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 border border-neutral-800 hover:border-red-600 text-gray-500 hover:text-red-500 transition-colors bg-neutral-950/80 rounded-sm cursor-pointer"
          title="Upload image, document or transcript"
        >
          <HardDriveUpload className="w-4 h-4" />
        </button>
        
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={(e) => e.target.files && processAttachedFiles(e.target.files)}
          className="hidden"
          accept="image/*,.pdf,.docx,.doc,.xlsx,.xls,.txt"
        />

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="SEND DIRECT PROMPT SIGNAL..."
          className="flex-1 bg-neutral-950 border-2 border-red-600/30 text-xs px-3.5 py-3 text-red-50 focus:outline-none focus:border-red-500 font-mono tracking-wide placeholder-gray-600"
        />

        <button
          type="submit"
          className="p-3 bg-red-600 hover:bg-red-700 text-black font-black flex items-center justify-center transition-colors rounded-sm cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
