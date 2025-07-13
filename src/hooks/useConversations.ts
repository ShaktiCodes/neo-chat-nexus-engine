import { useState, useEffect } from 'react';
import { Conversation } from '../types/conversation';
import { Message } from '../types/chat';

const STORAGE_KEY = 'neo-conversations';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed.conversations || []);
        setActiveConversationId(parsed.activeConversationId || null);
      } catch (error) {
        console.error('Failed to parse saved conversations:', error);
      }
    }
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    const data = {
      conversations,
      activeConversationId
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [conversations, activeConversationId]);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    return newConversation.id;
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter(conv => conv.id !== id);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const updateConversationTitle = (id: string, title: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { ...conv, title, updatedAt: new Date().toISOString() }
          : conv
      )
    );
  };

  const addMessageToConversation = (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === conversationId) {
          const updatedConv = {
            ...conv,
            messages: [...conv.messages, newMessage],
            updatedAt: new Date().toISOString()
          };

          // Auto-generate title from first user message
          if (conv.title === 'New Chat' && message.sender === 'user') {
            updatedConv.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
          }

          return updatedConv;
        }
        return conv;
      })
    );

    return newMessage.id;
  };

  const clearConversation = (id: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { ...conv, messages: [], title: 'New Chat', updatedAt: new Date().toISOString() }
          : conv
      )
    );
  };

  const getActiveConversation = () => {
    return conversations.find(conv => conv.id === activeConversationId) || null;
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  return {
    conversations,
    activeConversationId,
    activeConversation: getActiveConversation(),
    createNewConversation,
    deleteConversation,
    updateConversationTitle,
    addMessageToConversation,
    clearConversation,
    selectConversation
  };
};