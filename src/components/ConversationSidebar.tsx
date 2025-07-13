import { MessageSquare, Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from './ui/sidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Conversation } from '../types/conversation';
import { cn } from '../lib/utils';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onCreateNew: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
}

export const ConversationSidebar = ({
  conversations,
  activeConversationId,
  onCreateNew,
  onSelectConversation,
  onDeleteConversation,
  onUpdateTitle
}: ConversationSidebarProps) => {
  const { state } = useSidebar();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  const isCollapsed = state === "collapsed";

  const handleStartEdit = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      onUpdateTitle(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Sidebar
      className="border-r border-border bg-card/50 backdrop-blur-sm"
      collapsible="icon"
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-neon-cyan">Chat History</h2>
          )}
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        </div>
        
        {!isCollapsed && (
          <Button 
            onClick={onCreateNew}
            className="w-full mt-3 bg-gradient-primary hover:opacity-90 transition-opacity"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        )}
        
        {isCollapsed && (
          <Button 
            onClick={onCreateNew}
            size="sm"
            className="w-full mt-2 bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      <SidebarContent className="p-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((conversation) => (
                <SidebarMenuItem key={conversation.id}>
                  <div className={cn(
                    "group relative",
                    activeConversationId === conversation.id && "bg-muted/50"
                  )}>
                    <SidebarMenuButton
                      onClick={() => onSelectConversation(conversation.id)}
                      className={cn(
                        "w-full justify-start px-3 py-2 h-auto",
                        activeConversationId === conversation.id && "bg-gradient-subtle text-primary-foreground"
                      )}
                    >
                      <MessageSquare className="h-4 w-4 mr-3 flex-shrink-0" />
                      
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          {editingId === conversation.id ? (
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onBlur={handleSaveEdit}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              className="h-6 text-sm bg-transparent border-none p-0 focus:ring-0"
                              autoFocus
                            />
                          ) : (
                            <div>
                              <p className="text-sm font-medium truncate">
                                {conversation.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(conversation.updatedAt)} • {conversation.messages.length} messages
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </SidebarMenuButton>

                    {!isCollapsed && activeConversationId === conversation.id && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(conversation);
                          }}
                          className="h-6 w-6 p-0 hover:bg-muted"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};