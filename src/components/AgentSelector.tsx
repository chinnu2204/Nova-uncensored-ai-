import React, { useState } from 'react';
import { Bot, Code, Globe, PenTool, BookOpen, Settings, Zap, Plus, UserCheck } from 'lucide-react';
import { Agent } from '../types';

interface AgentSelectorProps {
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  agents: Agent[];
  onCreateCustomAgent: (agent: Agent) => void;
}

export default function AgentSelector({
  selectedAgentId,
  onSelectAgent,
  agents,
  onCreateCustomAgent
}: AgentSelectorProps) {
  const [showCreator, setShowCreator] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newCategory, setNewCategory] = useState<'custom'>('custom');

  const getIcon = (avatar: string) => {
    switch (avatar) {
      case 'code':
        return <Code className="w-5 h-5 text-red-500" />;
      case 'globe':
        return <Globe className="w-5 h-5 text-red-500" />;
      case 'writing':
        return <PenTool className="w-5 h-5 text-red-500" />;
      case 'study':
        return <BookOpen className="w-5 h-5 text-red-500" />;
      case 'prod':
        return <Zap className="w-5 h-5 text-red-500" />;
      default:
        return <Bot className="w-5 h-5 text-red-500" />;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrompt) return;

    const customAgent: Agent = {
      id: 'agent-' + Math.random().toString(36).substring(2, 9),
      name: newName,
      description: newDesc || 'Operator assembled neural module',
      prompt: newPrompt,
      avatar: 'bot',
      category: 'custom',
      isCustom: true
    };

    onCreateCustomAgent(customAgent);
    onSelectAgent(customAgent.id);
    setNewName('');
    setNewDesc('');
    setNewPrompt('');
    setShowCreator(false);
  };

  return (
    <div className="p-4 bg-black border-2 border-red-600/30 font-sans text-white h-full overflow-y-auto select-none">
      
      {/* Title */}
      <div className="border-b border-red-600/30 pb-3 mb-4 flex justify-between items-center">
        <div>
          <h2 className="font-mono text-sm font-black tracking-widest text-red-500 uppercase">NEURAL_AGENTS.DB</h2>
          <p className="text-[9px] font-mono text-gray-500 uppercase">Load operational intent matrix</p>
        </div>
        <button
          onClick={() => setShowCreator(!showCreator)}
          className="p-1 px-2.5 bg-red-600/10 hover:bg-red-600 border border-red-600 text-red-500 hover:text-black font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors rounded-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ASSEMBLE AGENT</span>
        </button>
      </div>

      {/* Wizard for creating Custom Agents */}
      {showCreator && (
        <form onSubmit={handleCreate} className="mb-6 p-3 bg-neutral-950 border-2 border-red-600/50 rounded-sm">
          <h3 className="font-mono text-[10px] text-red-400 font-bold uppercase mb-3 tracking-widest">✦ CUSTOM AGENT CREATOR</h3>
          
          <div className="mb-2">
            <label className="block text-[8px] font-mono text-gray-400 uppercase mb-1">AGENT NAME</label>
            <input
              type="text"
              required
              placeholder="e.g. SEO_NEXUS"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-2 py-1.5 bg-neutral-900 border border-red-600/30 text-[10px] text-white focus:outline-none focus:border-red-500 font-mono"
            />
          </div>

          <div className="mb-2">
            <label className="block text-[8px] font-mono text-gray-400 uppercase mb-1">DESCRIPTION</label>
            <input
              type="text"
              placeholder="Primary directive of this custom module"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-2 py-1.5 bg-neutral-900 border border-red-600/30 text-[10px] text-white focus:outline-none focus:border-red-500 font-mono"
            />
          </div>

          <div className="mb-3">
            <label className="block text-[8px] font-mono text-gray-400 uppercase mb-1">SYSTEM INSTRUCTION PROMPT</label>
            <textarea
              required
              rows={3}
              placeholder="Define behavioral rules, style of prose, constraints, and system identity directives..."
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              className="w-full px-2 py-1.5 bg-neutral-900 border border-red-600/30 text-[10px] text-white focus:outline-none focus:border-red-500 font-mono resize-none leading-relaxed"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-black font-black text-[9px] uppercase tracking-wider"
            >
              DEPLOY TRANS-MODULE
            </button>
            <button
              type="button"
              onClick={() => setShowCreator(false)}
              className="px-3 py-1.5 bg-neutral-900 text-gray-400 border border-neutral-700 hover:text-white font-mono text-[9px] uppercase"
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      {/* Agents Grid List */}
      <div className="grid grid-cols-1 gap-2.5">
        {agents.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={`w-full text-left p-3 border-2 transition-all flex items-start gap-3 rounded-sm ${
                isSelected
                  ? 'bg-red-950/25 border-red-600 hover:border-red-500 shadow-[0_0_15px_rgba(255,26,26,0.1)]'
                  : 'bg-neutral-950 border-neutral-900 hover:border-red-600/40'
              }`}
            >
              <div className={`p-2 border rounded-sm ${
                isSelected ? 'border-red-500 bg-red-950/20' : 'border-neutral-800 bg-neutral-900'
              }`}>
                {getIcon(agent.avatar)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className={`font-mono text-xs font-black tracking-wider uppercase truncate ${
                    isSelected ? 'text-red-500' : 'text-white'
                  }`}>
                    {agent.name}
                  </span>
                  <span className="font-mono text-[8px] px-1 bg-neutral-900 text-gray-500 border border-neutral-800 uppercase scale-90">
                    {agent.category}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight mt-1 line-clamp-2">
                  {agent.description}
                </p>
                {isSelected && (
                  <div className="mt-2 pt-2 border-t border-red-900/40">
                    <span className="font-mono text-[8px] text-red-400 uppercase tracking-widest block mb-1">
                      ACTIVE DIRECTIVE MATRICES:
                    </span>
                    <p className="font-mono text-[9px] text-gray-500 leading-normal line-clamp-2 bg-neutral-900/50 p-1.5 border border-neutral-900">
                      {agent.prompt}
                    </p>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
