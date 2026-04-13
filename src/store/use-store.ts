import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  avatar?: string;
  status: 'online' | 'offline';
  bio?: string;
  lastSeen?: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen';
  type: 'text' | 'image' | 'file';
  mediaUrl?: string;
  reactions?: Record<string, string[]>; // emoji -> userIds
}

interface Chat {
  id: string;
  type: 'private' | 'group' | 'channel';
  name: string;
  avatar?: string;
  lastMessage?: Message;
  members?: User[];
  unreadCount: number;
}

interface AppState {
  user: User | null;
  chats: Chat[];
  activeChat: Chat | null;
  messages: Record<string, Message[]>; // chatId -> messages
  onlineUsers: string[];
  typingUsers: Record<string, string[]>; // chatId -> usernames
  
  setUser: (user: User | null) => void;
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chat: Chat | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  setOnlineUsers: (userIds: string[]) => void;
  setTyping: (chatId: string, username: string, isTyping: boolean) => void;
  updateMessageStatus: (chatId: string, messageId: string, status: 'delivered' | 'seen') => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  chats: [],
  activeChat: null,
  messages: {},
  onlineUsers: [],
  typingUsers: {},

  setUser: (user) => set({ user }),
  setChats: (chats) => set({ chats }),
  setActiveChat: (activeChat) => set({ activeChat }),
  addMessage: (chatId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: [...(state.messages[chatId] || []), message]
    }
  })),
  setMessages: (chatId, messages) => set((state) => ({
    messages: { ...state.messages, [chatId]: messages }
  })),
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
  setTyping: (chatId, username, isTyping) => set((state) => {
    const chatTyping = state.typingUsers[chatId] || [];
    const newTyping = isTyping 
      ? Array.from(new Set([...chatTyping, username]))
      : chatTyping.filter(u => u !== username);
    return {
      typingUsers: { ...state.typingUsers, [chatId]: newTyping }
    };
  }),
  updateMessageStatus: (chatId, messageId, status) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: (state.messages[chatId] || []).map(m => 
        m.id === messageId ? { ...m, status } : m
      )
    }
  }))
}));