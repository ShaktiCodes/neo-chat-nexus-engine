import { Message } from '../types/chat';
import { PluginCard } from './PluginCard';
import { cn } from '../lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={cn(
      'flex w-full mb-4 animate-slide-up',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'max-w-[80%] rounded-lg p-4 shadow-md',
        isUser 
          ? 'bg-gradient-primary text-primary-foreground ml-auto' 
          : 'bg-gradient-card text-card-foreground mr-auto border border-border'
      )}>
        {message.type === 'plugin' && message.pluginData ? (
          <PluginCard 
            pluginName={message.pluginName!}
            data={message.pluginData}
          />
        ) : (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        )}
        
        <div className={cn(
          'text-xs mt-2 opacity-70',
          isUser ? 'text-right' : 'text-left'
        )}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};