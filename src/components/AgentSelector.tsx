
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CodingTool } from '@/services/api';

interface ToolSelectorProps {
  tools: CodingTool[];
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

export const AgentSelector = ({ tools, selectedTool, onToolSelect }: ToolSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentTool = tools.find(tool => tool.id === selectedTool);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Select Tool</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          {isExpanded ? 'Less' : 'More'}
        </Button>
      </div>

      {/* Current Tool Display */}
      {currentTool && (
        <Card className="p-3 bg-gradient-accent border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{currentTool.icon}</span>
            <span className="text-sm font-medium text-foreground">{currentTool.name}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{currentTool.description}</p>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {currentTool.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {currentTool.inputs.length} inputs
            </Badge>
            <Badge variant="outline" className="text-xs">
              {currentTool.outputs.length} outputs
            </Badge>
          </div>
        </Card>
      )}

      {/* Tool Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className={cn(
                "p-3 cursor-pointer transition-all duration-200 hover:shadow-md",
                tool.id === selectedTool
                  ? "bg-gradient-accent border-primary/50"
                  : "bg-card hover:bg-gradient-accent/50"
              )}
              onClick={() => onToolSelect(tool.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{tool.icon}</span>
                <span className="text-sm font-medium text-foreground">{tool.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{tool.description}</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  {tool.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {tool.inputs.length}I / {tool.outputs.length}O
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
