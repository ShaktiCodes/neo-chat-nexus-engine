import { useState, KeyboardEvent } from 'react';
import { Send, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '../lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  availableCommands: string[];
}

export const ChatInput = ({ onSendMessage, isLoading, availableCommands }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [showCommands, setShowCommands] = useState(false);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      setShowCommands(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (value: string) => {
    setMessage(value);
    setShowCommands(value.startsWith('/') && value.length > 1);
  };

  const selectCommand = (command: string) => {
    setMessage(command + ' ');
    setShowCommands(false);
  };

  const filteredCommands = availableCommands.filter(cmd => 
    cmd.toLowerCase().includes(message.toLowerCase().slice(1))
  );

  return (
    <div className="relative">
      {showCommands && filteredCommands.length > 0 && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-card border border-border rounded-lg shadow-glow max-h-40 overflow-y-auto">
          <div className="p-2 text-xs text-muted-foreground border-b border-border">
            Available Commands:
          </div>
          {filteredCommands.map((command, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 hover:bg-muted transition-colors text-sm"
              onClick={() => selectCommand(command)}
            >
              <code className="text-neon-blue">{command}</code>
            </button>
          ))}
        </div>
      )}
      
      <div className="flex gap-2 p-4 bg-card border-t border-border">
        <div className="relative flex-1">
          <Input
            value={message}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message or use /weather, /calc, /define..."
            disabled={isLoading}
            className={cn(
              "pr-12 bg-background border-border focus:border-neon-blue focus:ring-neon-blue/20",
              message.startsWith('/') && "border-neon-purple focus:border-neon-purple"
            )}
          />
          {message.startsWith('/') && (
            <Zap className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neon-purple" />
          )}
        </div>
        <Button 
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="bg-gradient-primary hover:shadow-neon transition-all duration-300"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};