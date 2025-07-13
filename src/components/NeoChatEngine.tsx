import { useState, useEffect } from 'react';
import { useConversations } from '../hooks/useConversations';
import { pluginManager } from '../utils/pluginManager';
import { ChatHeader } from './ChatHeader';
import { ChatContainer } from './ChatContainer';
import { ChatInput } from './ChatInput';
import { ConversationSidebar } from './ConversationSidebar';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { useToast } from '../hooks/use-toast';

export const NeoChatEngine = () => {
  const {
    conversations,
    activeConversationId,
    activeConversation,
    createNewConversation,
    deleteConversation,
    updateConversationTitle,
    addMessageToConversation,
    clearConversation,
    selectConversation
  } = useConversations();
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize with first conversation if none exist
  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation();
    }
  }, [conversations.length, createNewConversation]);

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) return;

    // Add user message
    const userMessageId = addMessageToConversation(activeConversationId, {
      sender: 'user',
      content,
      type: 'text'
    });

    setIsLoading(true);

    try {
      // Check if it's a plugin command
      const pluginResult = await pluginManager.parseAndExecute(content);

      if (pluginResult) {
        const { plugin, response } = pluginResult;
        
        if (response.success) {
          // Add plugin response message
          addMessageToConversation(activeConversationId, {
            sender: 'assistant',
            content: `Successfully executed ${plugin.name} plugin`,
            type: 'plugin',
            pluginName: plugin.name,
            pluginData: response.data
          });
        } else {
          // Add error message
          addMessageToConversation(activeConversationId, {
            sender: 'assistant',
            content: response.error || 'Plugin execution failed',
            type: 'text'
          });
        }
      } else {
        // Regular AI response simulation
        const responses = [
          "I understand you're asking about something. Try using one of my plugin commands like /weather, /calc, or /define for specific functionality!",
          "That's an interesting question! I can help you with weather information, calculations, or word definitions using my plugins.",
          "I'm here to help! Use /weather [city] for weather, /calc [expression] for math, or /define [word] for definitions.",
          "For the best experience, try my plugin commands. Type / to see available options!",
          "I can assist you with various tasks through my plugin system. What would you like to explore?"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Simulate thinking delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        addMessageToConversation(activeConversationId, {
          sender: 'assistant',
          content: randomResponse,
          type: 'text'
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
      addMessageToConversation(activeConversationId, {
        sender: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        type: 'text'
      });
      
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (activeConversationId) {
      clearConversation(activeConversationId);
      toast({
        title: "Chat Cleared",
        description: "Current conversation has been cleared.",
      });
    }
  };

  const handleNewChat = () => {
    createNewConversation();
    toast({
      title: "New Chat Created",
      description: "Started a new conversation.",
    });
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-background">
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onCreateNew={handleNewChat}
          onSelectConversation={selectConversation}
          onDeleteConversation={deleteConversation}
          onUpdateTitle={updateConversationTitle}
        />
        
        <div className="flex flex-col flex-1">
          <ChatHeader 
            onClearHistory={handleClearHistory}
            messageCount={activeConversation?.messages.length || 0}
          />
          
          <ChatContainer 
            messages={activeConversation?.messages || []}
            isLoading={isLoading}
          />
          
          <ChatInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            availableCommands={pluginManager.getAvailableCommands()}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};