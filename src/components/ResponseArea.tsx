import { useState } from 'react';
import { Bot, User, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  files?: File[];
  timestamp: Date;
}

interface ResponseAreaProps {
  messages: Message[];
}

export const ResponseArea = ({ messages }: ResponseAreaProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <div className="p-6 bg-gradient-accent rounded-full w-fit mx-auto">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Ready to help with your documents
            </h3>
            <p className="text-muted-foreground">
              Upload files and ask questions to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-4 p-6 rounded-lg",
            message.type === 'user' 
              ? "bg-gradient-accent border border-border" 
              : "bg-card border border-border"
          )}
        >
          {/* Avatar */}
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            message.type === 'user'
              ? "bg-gradient-primary"
              : "bg-secondary"
          )}>
            {message.type === 'user' ? (
              <User className="w-5 h-5 text-primary-foreground" />
            ) : (
              <Bot className="w-5 h-5 text-secondary-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {message.type === 'user' ? 'You' : 'Documentation AI'}
              </span>
              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>

            {/* Files attached (for user messages) */}
            {message.files && message.files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {message.files.map((file, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-primary/10 border border-primary/20 rounded text-primary"
                  >
                    📄 {file.name}
                  </span>
                ))}
              </div>
            )}

            {/* Message content */}
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            </div>

            {/* Copy button for assistant messages */}
            {message.type === 'assistant' && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(message.content, message.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copiedId === message.id ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};