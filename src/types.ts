export interface FileAttachment {
  name: string;
  type: string;
  size: number;
  content: string; // Base64 or plain content string
  ocrOutput?: string;
  isImage?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  files?: FileAttachment[];
  isStreaming?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  category: 'core' | 'technical' | 'creative' | 'study' | 'productivity' | 'custom';
  description: string;
  prompt: string;
  isCustom?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  dailyLimit: number;
  dailyUsed: number;
  role: 'admin' | 'user';
  referralCode: string;
  referredBy?: string;
  isBanned: boolean;
  createdAt: string;
}

export interface ChatFolder {
  id: string;
  name: string;
}

export interface ChatSession {
  id: string;
  title: string;
  agentId: string;
  folderId?: string | null;
  isPinned?: boolean;
  isFavorite?: boolean;
  messages: Message[];
  shareSlug?: string;
  createdAt: string;
}

export interface AdminSettings {
   groqKey: string;
   openRouterKey: string;
   globalPrompt: string;
   maintenanceMode: boolean;
   telegramGroup: string;
   telegramChannel: string;
   instagramLink: string;
   enableTelegramWidget: boolean;
   enableInstagramWidget: boolean;
}

export interface SystemAnnouncement {
  id: string;
  content: string;
  type: 'banner' | 'popup' | 'push';
  createdAt: string;
  active: boolean;
}

export interface UserFeedback {
  id: string;
  userEmail: string;
  type: 'bug' | 'feature' | 'general';
  text: string;
  createdAt: string;
}

export interface UsageAnalytics {
  totalChats: number;
  totalTokens: number;
  selectedProvider: 'Nova Core' | 'Groq Core' | 'OpenRouter Core';
  activeUsersCount: number;
}
