
import { Code2, Bot, Network } from 'lucide-react';

export const DocumentationHeader = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      <div className="flex items-center justify-center gap-3">
        <div className="p-3 bg-gradient-primary rounded-full">
          <Code2 className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary" />
          <Network className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Multi-Agent Coding Assistant
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Specialized AI agents for code analysis, documentation generation, and web research
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>📄</span>
          <span>File Analysis</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🔍</span>
          <span>Web Search</span>
        </div>
        <div className="flex items-center gap-1">
          <span>📝</span>
          <span>Docstring Generation</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🎯</span>
          <span>Multi-Agent Orchestration</span>
        </div>
      </div>
    </div>
  );
};
