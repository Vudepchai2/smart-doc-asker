import { useState } from 'react';
import { DocumentationHeader } from '@/components/DocumentationHeader';
import { ChatInput } from '@/components/ChatInput';
import { ResponseArea } from '@/components/ResponseArea';
import { toast } from '@/hooks/use-toast';
import { documentationAI } from '@/services/api';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  files?: File[];
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (message: string, files: File[]) => {
    if (!message.trim() && files.length === 0) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      files: files.length > 0 ? files : undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI processing
    try {
      // Show loading toast
      toast({
        title: "Processing your request...",
        description: `Analyzing ${files.length > 0 ? `${files.length} file(s) and ` : ''}your question.`,
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock response
      const responseContent = generateMockResponse(message, files);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Response generated!",
        description: "Your documentation analysis is complete.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (message: string, files: File[]): string => {
    if (files.length > 0) {
      return `I've analyzed your ${files.length} document(s): ${files.map(f => f.name).join(', ')}.

Based on your question "${message}", here's what I found:

• The documents contain relevant information that directly addresses your query
• Key concepts and definitions are clearly outlined in the provided materials
• There are several actionable insights that can help guide your next steps

This is a demonstration of how the Documentation AI would analyze your files and provide intelligent responses. In a real implementation, this would connect to an AI service that processes your documents and generates contextual answers.

Would you like me to dive deeper into any specific aspect of the documentation?`;
    }

    return `Thank you for your question: "${message}"

This is a demonstration response from the Documentation AI. In a real implementation, this system would:

• Process and understand your uploaded documents
• Use advanced AI to analyze the content
• Provide precise, contextual answers based on your materials
• Cite relevant sections from your documents

To get the full experience, try uploading some documents along with your questions!

Is there anything specific you'd like to know about how this documentation system works?`;
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <DocumentationHeader />

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* Response/Chat Area */}
          <div className="min-h-[400px] bg-background/30 backdrop-blur-sm rounded-xl border border-border p-6 shadow-elegant">
            <ResponseArea messages={messages} />
          </div>

          {/* Input Area */}
          <div className="bg-background/50 backdrop-blur-sm rounded-xl border border-border p-6 shadow-elegant">
            <ChatInput
              onSubmit={handleSubmit}
              isLoading={isLoading}
              placeholder="Upload documents and ask questions about their content..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Powered by AI • Supports PDF, DOC, TXT, and MD files • 
            <span className="text-primary"> Secure & Private</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;