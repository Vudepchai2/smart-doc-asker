import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from './FileUpload';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSubmit: (message: string, files: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const ChatInput = ({ 
  onSubmit, 
  isLoading = false, 
  placeholder = "Ask a question about your documents..." 
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = () => {
    if (message.trim() || files.length > 0) {
      onSubmit(message.trim(), files);
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

  const isDisabled = isLoading || (!message.trim() && files.length === 0);

  return (
    <div className="space-y-4">
      {/* File Upload Section */}
      <FileUpload onFilesChange={setFiles} />
      
      {/* Message Input Section */}
      <div className="relative">
        <div className="flex space-x-3">
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
        
        {/* Character count / help text */}
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>
            {files.length > 0 && `${files.length} file(s) attached • `}
            Press Enter to send, Shift+Enter for new line
          </span>
          <span>{message.length}/2000</span>
        </div>
      </div>
    </div>
  );
};