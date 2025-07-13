import { useState } from 'react';
import { useChatHistory } from '../hooks/useChatHistory';
import { pluginManager } from '../utils/pluginManager';
import { ChatHeader } from './ChatHeader';
import { ChatContainer } from './ChatContainer';
import { ChatInput } from './ChatInput';
import { useToast } from '../hooks/use-toast';

export const NeoChatEngine = () => {
  const { messages, addMessage, updateMessage, clearHistory } = useChatHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessageId = addMessage({
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
          addMessage({
            sender: 'assistant',
            content: `Successfully executed ${plugin.name} plugin`,
            type: 'plugin',
            pluginName: plugin.name,
            pluginData: response.data
          });
        } else {
          // Add error message
          addMessage({
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
        
        addMessage({
          sender: 'assistant',
          content: randomResponse,
          type: 'text'
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage({
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
    clearHistory();
    toast({
      title: "Chat Cleared",
      description: "Your chat history has been cleared.",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <ChatHeader 
        onClearHistory={handleClearHistory}
        messageCount={messages.length}
      />
      
      <ChatContainer 
        messages={messages}
        isLoading={isLoading}
      />
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        availableCommands={pluginManager.getAvailableCommands()}
      />
    </div>
  );
};