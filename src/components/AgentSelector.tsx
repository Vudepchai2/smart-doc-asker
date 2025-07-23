
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CodingAgentType } from '@/services/api';

interface AgentSelectorProps {
  agents: CodingAgentType[];
  selectedAgent: string;
  onAgentSelect: (agentId: string) => void;
}

export const AgentSelector = ({ agents, selectedAgent, onAgentSelect }: AgentSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentAgent = agents.find(agent => agent.id === selectedAgent);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Select Agent</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          {isExpanded ? 'Less' : 'More'}
        </Button>
      </div>

      {/* Current Agent Display */}
      {currentAgent && (
        <Card className="p-3 bg-gradient-accent border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{currentAgent.icon}</span>
            <span className="text-sm font-medium text-foreground">{currentAgent.name}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{currentAgent.description}</p>
          <div className="flex flex-wrap gap-1">
            {currentAgent.capabilities.slice(0, 2).map((capability, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {capability}
              </Badge>
            ))}
            {currentAgent.capabilities.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{currentAgent.capabilities.length - 2} more
              </Badge>
            )}
          </div>
        </Card>
      )}

      {/* Agent Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className={cn(
                "p-3 cursor-pointer transition-all duration-200 hover:shadow-md",
                agent.id === selectedAgent
                  ? "bg-gradient-accent border-primary/50"
                  : "bg-card hover:bg-gradient-accent/50"
              )}
              onClick={() => onAgentSelect(agent.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{agent.icon}</span>
                <span className="text-sm font-medium text-foreground">{agent.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{agent.description}</p>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 2).map((capability, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {capability}
                  </Badge>
                ))}
                {agent.capabilities.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{agent.capabilities.length - 2}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
