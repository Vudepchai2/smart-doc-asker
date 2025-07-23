
import { useState, useRef } from 'react';
import { Send, Loader2, Plus, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSubmit: (message: string, files: File[], selectedAgent?: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  selectedAgent?: string;
}

export const ChatInput = ({ 
  onSubmit, 
  isLoading = false, 
  placeholder = "Ask about your code, generate docstrings, or request analysis...",
  selectedAgent
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (message.trim() || files.length > 0) {
      onSubmit(message.trim(), files, selectedAgent);
      setMessage('');
      setFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const fileArray = Array.from(newFiles).slice(0, 10); // Max 10 files for coding projects
    setFiles(prev => [...prev, ...fileArray].slice(0, 10));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const isDisabled = isLoading || (!message.trim() && files.length === 0);

  return (
    <div className="space-y-3">
      {/* Attached Files Display */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Code files attached:</div>
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border text-sm"
              >
                <span className="text-base">{getFileIcon(file.name)}</span>
                <span className="text-foreground font-medium truncate max-w-[120px]">
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-auto p-1 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Message Input Section */}
      <div className="relative">
        <div className="flex space-x-2">
          {/* File Attachment Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={cn(
              "h-20 px-3 border-border hover:border-primary/50",
              "transition-all duration-300"
            )}
          >
            <Plus className="w-5 h-5" />
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".py,.js,.jsx,.ts,.tsx,.java,.cpp,.c,.h,.html,.css,.json,.md,.txt,.yaml,.yml,.xml,.sql,.sh,.bat,.go,.rs,.php,.rb,.swift,.kt,.scala,.r,.m,.pl,.lua,.dart,.elm,.ex,.exs,.clj,.fs,.hs,.ml,.pas,.vb,.cs,.asp,.jsp,.erb,.vue,.svelte"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className={cn(
                "min-h-[80px] pr-12 resize-none",
                "bg-card border-border focus:border-primary",
                "placeholder:text-muted-foreground",
                "transition-all duration-300"
              )}
              disabled={isLoading}
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className={cn(
              "h-20 px-6 bg-gradient-primary hover:shadow-glow",
              "transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        
        {/* Help text */}
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>
            Press Enter to send, Shift+Enter for new line
          </span>
          <span>{message.length}/4000</span>
        </div>
      </div>
    </div>
  );
};
