import { useEffect, useRef } from 'react';
import { Message } from '../types/chat';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ScrollArea } from './ui/scroll-area';

interface ChatContainerProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ChatContainer = ({ messages, isLoading }: ChatContainerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div ref={scrollRef} className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold text-neon-cyan mb-2">
              Welcome to NEO-CHAT ENGINE
            </h2>
            <p className="text-muted-foreground mb-4 max-w-md">
              I'm your AI assistant with plugin capabilities. Try these commands:
            </p>
            <div className="space-y-2 text-sm">
              <div className="bg-muted/20 px-3 py-2 rounded-lg">
                <code className="text-neon-blue">/weather Tokyo</code> - Get weather information
              </div>
              <div className="bg-muted/20 px-3 py-2 rounded-lg">
                <code className="text-neon-purple">/calc 2 + 2 * 3</code> - Calculate expressions
              </div>
              <div className="bg-muted/20 px-3 py-2 rounded-lg">
                <code className="text-neon-cyan">/define artificial</code> - Look up word definitions
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Or just ask naturally: "What's the weather in Paris?"
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
          </>
        )}
      </div>
    </ScrollArea>
  );
};