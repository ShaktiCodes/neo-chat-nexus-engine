import { Brain, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface ChatHeaderProps {
  onClearHistory: () => void;
  messageCount: number;
}

export const ChatHeader = ({ onClearHistory, messageCount }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-card border-b border-border shadow-glow">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Brain className="h-8 w-8 text-neon-blue animate-glow-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-cyan rounded-full animate-pulse"></div>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            NEO-CHAT ENGINE
          </h1>
          <p className="text-xs text-muted-foreground">
            AI-Powered Assistant with Plugin Support
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          {messageCount} messages
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearHistory}
          className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
          disabled={messageCount === 0}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};