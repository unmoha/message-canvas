import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useStore } from '@/store/use-store';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user, addMessage, setOnlineUsers, setTyping, updateMessageStatus } = useStore();

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem('token') },
      query: { userId: user.id }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket');
    });

    socket.on('new_message', ({ chatId, message }) => {
      addMessage(chatId, message);
      // Automatically mark as seen if it's the active chat
      // socket.emit('mark_seen', { chatId, messageId: message.id });
    });

    socket.on('user_status', ({ userIds }) => {
      setOnlineUsers(userIds);
    });

    socket.on('typing_status', ({ chatId, username, isTyping }) => {
      setTyping(chatId, username, isTyping);
    });

    socket.on('message_status_update', ({ chatId, messageId, status }) => {
      updateMessageStatus(chatId, messageId, status);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const sendMessage = (chatId: string, content: string, type: 'text' | 'image' | 'file' = 'text', mediaUrl?: string) => {
    if (!socketRef.current || !user) return;

    socketRef.current.emit('send_message', {
      chatId,
      content,
      type,
      mediaUrl,
      senderId: user.id
    });
  };

  const sendTyping = (chatId: string, isTyping: boolean) => {
    if (!socketRef.current || !user) return;
    socketRef.current.emit('typing', { chatId, username: user.username, isTyping });
  };

  return { sendMessage, sendTyping };
};