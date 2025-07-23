
import { useState } from 'react';
import { DocumentationHeader } from '@/components/DocumentationHeader';
import { ChatInput } from '@/components/ChatInput';
import { ResponseArea } from '@/components/ResponseArea';
import { AgentSelector } from '@/components/AgentSelector';
import { toast } from '@/hooks/use-toast';
import { multiAgentCodingAI } from '@/services/api';

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

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('orchestrator');

  const handleSubmit = async (message: string, files: File[], agentId?: string) => {
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

    try {
      // Show loading toast
      toast({
        title: "Processing your request...",
        description: `${getAgentName(agentId || selectedAgent)} is analyzing your ${files.length > 0 ? `${files.length} file(s) and ` : ''}request.`,
      });

      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate mock response based on agent and request
      const responseContent = generateMockResponse(message, files, agentId || selectedAgent);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        agentUsed: agentId || selectedAgent,
        metadata: {
          filesProcessed: files.length,
          webSearchResults: message.toLowerCase().includes('search') ? 5 : 0,
          docstringsGenerated: message.toLowerCase().includes('docstring') ? 3 : 0,
        },
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Analysis complete!",
        description: `${getAgentName(agentId || selectedAgent)} has processed your request.`,
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

  const getAgentName = (agentId: string) => {
    const agent = multiAgentCodingAI.getAvailableAgents().find(a => a.id === agentId);
    return agent?.name || 'Multi-Agent AI';
  };

  const generateMockResponse = (message: string, files: File[], agentId: string): string => {
    const fileNames = files.map(f => f.name).join(', ');
    
    switch (agentId) {
      case 'file-reader':
        return `📄 **File Analysis Results**

I've analyzed ${files.length} file(s): ${fileNames}

**Code Structure:**
- Functions detected: 12
- Classes found: 3
- Import statements: 8
- Dependencies identified: react, typescript, tailwindcss

**Key Insights:**
- The code follows React functional component patterns
- TypeScript is properly implemented with type definitions
- Tailwind CSS is used for styling
- Component structure is well-organized

**Recommendations:**
- Consider adding more type annotations for better type safety
- Some functions could benefit from JSDoc comments
- Performance optimization opportunities identified in rendering logic

This analysis was performed by the File Reader Agent specialized in code structure analysis.`;

      case 'web-search':
        return `🔍 **Web Search Results**

I searched for information related to: "${message}"

**Documentation Found:**
- React Official Documentation: Best practices for ${message}
- TypeScript Handbook: Advanced type patterns
- MDN Web Docs: JavaScript fundamentals
- Stack Overflow: 15 relevant solutions found

**Latest Updates:**
- React 18.3.1 features and improvements
- TypeScript 5.0 new capabilities
- Tailwind CSS 3.4 utility classes

**Code Examples:**
Found 8 relevant code examples from GitHub repositories and documentation sites.

**Recommendations:**
Based on current documentation and community best practices, I recommend exploring the React Server Components pattern for better performance.

This search was performed by the Web Search Agent with access to real-time documentation and coding resources.`;

      case 'docstring-generator':
        return `📝 **Docstring Generation Complete**

I've generated comprehensive docstrings for your code files: ${fileNames}

**Generated Documentation:**

\`\`\`python
def analyze_code(file_path: str, options: Dict[str, Any]) -> CodeAnalysis:
    """
    Analyze code file and extract structural information.
    
    Args:
        file_path (str): Path to the code file to analyze
        options (Dict[str, Any]): Configuration options for analysis
            - include_comments (bool): Whether to include comment analysis
            - depth (int): Analysis depth level (1-5)
            - format (str): Output format ('json', 'yaml', 'text')
    
    Returns:
        CodeAnalysis: Object containing analysis results with attributes:
            - functions (List[Function]): List of detected functions
            - classes (List[Class]): List of detected classes
            - imports (List[Import]): List of import statements
            - metrics (Dict[str, int]): Code metrics and statistics
    
    Raises:
        FileNotFoundError: If the specified file doesn't exist
        ValueError: If file format is not supported
        
    Example:
        >>> result = analyze_code('app.py', {'depth': 3})
        >>> print(f"Found {len(result.functions)} functions")
    """
\`\`\`

**Statistics:**
- 12 functions documented
- 3 classes documented  
- 8 methods documented
- Type hints added to 95% of parameters

This documentation was generated by the Docstring Generator Agent following PEP 257 and Google docstring conventions.`;

      case 'code-analyzer':
        return `🔍 **Code Analysis Report**

I've performed a comprehensive analysis of your code: ${fileNames}

**Code Quality Score: 8.5/10**

**Strengths:**
✅ Consistent code formatting
✅ Proper TypeScript usage
✅ Good component structure
✅ Effective use of React hooks

**Areas for Improvement:**
⚠️ Missing error boundaries in 2 components
⚠️ Some functions exceed recommended complexity
⚠️ Missing unit tests for utility functions

**Security Analysis:**
🔒 No security vulnerabilities detected
🔒 Input validation properly implemented
🔒 No hardcoded secrets found

**Performance Insights:**
⚡ Potential memo optimization in 3 components
⚡ Bundle size could be reduced by 15%
⚡ Consider lazy loading for 2 routes

**Recommendations:**
1. Add error boundaries for better error handling
2. Implement unit tests for critical functions
3. Consider code splitting for better performance

This analysis was performed by the Code Analyzer Agent using advanced static analysis techniques.`;

      case 'orchestrator':
      default:
        return `🎯 **Multi-Agent Analysis Complete**

I've coordinated multiple specialized agents to provide comprehensive insights:

**File Reader Agent** analyzed your code structure:
- ${files.length} files processed
- Clean architecture detected
- TypeScript best practices followed

**Web Search Agent** found relevant documentation:
- Latest React patterns discovered
- Performance optimization techniques
- Security best practices identified

**Code Analyzer** performed quality assessment:
- Code quality score: 8.5/10
- No critical issues found
- Performance optimization opportunities identified

**Docstring Generator** created documentation:
- 12 functions documented
- Type hints added
- Examples provided

**Coordinated Recommendations:**
1. Implement the performance optimizations suggested
2. Add the generated docstrings to improve maintainability
3. Consider the latest React patterns found in documentation
4. Address the minor code quality issues identified

This comprehensive analysis was orchestrated across multiple specialized agents to provide you with the most complete insights possible.

Would you like me to dive deeper into any specific area or have a particular agent focus on a specific aspect?`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <DocumentationHeader />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Agent Selector Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-background/50 backdrop-blur-sm rounded-xl border border-border p-4 shadow-elegant sticky top-4">
              <AgentSelector
                agents={multiAgentCodingAI.getAvailableAgents()}
                selectedAgent={selectedAgent}
                onAgentSelect={setSelectedAgent}
              />
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Response/Chat Area */}
            <div className="min-h-[500px] bg-background/30 backdrop-blur-sm rounded-xl border border-border p-6 shadow-elegant">
              <ResponseArea messages={messages} />
            </div>

            {/* Input Area */}
            <div className="bg-background/50 backdrop-blur-sm rounded-xl border border-border p-6 shadow-elegant">
              <ChatInput
                onSubmit={handleSubmit}
                isLoading={isLoading}
                placeholder="Analyze my code, generate docstrings, search for best practices, or ask for code review..."
                selectedAgent={selectedAgent}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Multi-Agent Coding Assistant • Python LangGraph Backend • 
            <span className="text-primary"> Secure & Specialized</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
