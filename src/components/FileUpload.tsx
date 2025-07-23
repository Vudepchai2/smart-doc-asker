import { useState, useRef, DragEvent } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  acceptedTypes?: string;
  maxFiles?: number;
}

export const FileUpload = ({ 
  onFilesChange, 
  acceptedTypes = ".pdf,.doc,.docx,.txt,.md", 
  maxFiles = 5 
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const fileArray = Array.from(newFiles).slice(0, maxFiles);
    setFiles(prev => {
      const updated = [...prev, ...fileArray].slice(0, maxFiles);
      onFilesChange(updated);
      return updated;
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      onFilesChange(updated);
      return updated;
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-all duration-300",
          "hover:border-primary/50 hover:bg-gradient-accent",
          isDragOver ? "border-primary bg-gradient-accent scale-105" : "border-border",
          "cursor-pointer group"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 rounded-full bg-gradient-primary">
            <Upload className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-medium">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports PDF, DOC, TXT, MD files (Max {maxFiles} files)
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Attached Files:</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-card rounded-md border border-border"
            >
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};