
import { useState } from 'react';
import { Bot, User, Copy, CheckCircle, Code2, Search, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  files?: File[];
  timestamp: Date;
  agentUsed?: string;
  metadata?: {
    filesProcessed?: number;
    webSearchResults?: number;
    docstringsGenerated?: number;
  };
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

  const getAgentIcon = (agentId?: string) => {
    switch (agentId) {
      case 'file-reader': return <FileText className="w-4 h-4" />;
      case 'web-search': return <Search className="w-4 h-4" />;
      case 'docstring-generator': return <Code2 className="w-4 h-4" />;
      case 'code-analyzer': return <Zap className="w-4 h-4" />;
      case 'orchestrator': return <Bot className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getAgentName = (agentId?: string) => {
    switch (agentId) {
      case 'file-reader': return 'File Reader Agent';
      case 'web-search': return 'Web Search Agent';
      case 'docstring-generator': return 'Docstring Generator';
      case 'code-analyzer': return 'Code Analyzer';
      case 'orchestrator': return 'Orchestrator';
      default: return 'Multi-Agent AI';
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'py': return '🐍';
      case 'js': case 'jsx': return '💛';
      case 'ts': case 'tsx': return '🔷';
      case 'java': return '☕';
      case 'cpp': case 'c': return '⚡';
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'json': return '📋';
      case 'md': return '📝';
      default: return '📄';
    }
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <div className="p-6 bg-gradient-accent rounded-full w-fit mx-auto">
            <Code2 className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Multi-Agent Coding Assistant Ready
            </h3>
            <p className="text-muted-foreground">
              Upload your code files and get comprehensive analysis, documentation, and insights
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <Badge variant="secondary">📄 File Analysis</Badge>
            <Badge variant="secondary">🔍 Web Search</Badge>
            <Badge variant="secondary">📝 Docstring Generation</Badge>
            <Badge variant="secondary">🎯 Code Review</Badge>
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
              getAgentIcon(message.agentUsed)
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {message.type === 'user' ? 'You' : getAgentName(message.agentUsed)}
                </span>
                {message.agentUsed && message.type === 'assistant' && (
                  <Badge variant="outline" className="text-xs">
                    {message.agentUsed}
                  </Badge>
                )}
              </div>
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
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 border border-primary/20 rounded text-primary"
                  >
                    <span>{getFileIcon(file.name)}</span>
                    {file.name}
                  </span>
                ))}
              </div>
            )}

            {/* Agent metadata */}
            {message.metadata && message.type === 'assistant' && (
              <div className="flex flex-wrap gap-2 text-xs">
                {message.metadata.filesProcessed && (
                  <Badge variant="secondary">
                    📄 {message.metadata.filesProcessed} files analyzed
                  </Badge>
                )}
                {message.metadata.webSearchResults && (
                  <Badge variant="secondary">
                    🔍 {message.metadata.webSearchResults} search results
                  </Badge>
                )}
                {message.metadata.docstringsGenerated && (
                  <Badge variant="secondary">
                    📝 {message.metadata.docstringsGenerated} docstrings generated
                  </Badge>
                )}
              </div>
            )}

            {/* Message content */}
            <div className="prose prose-sm max-w-none text-foreground">
              <pre className="whitespace-pre-wrap leading-relaxed font-sans">
                {message.content}
              </pre>
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
