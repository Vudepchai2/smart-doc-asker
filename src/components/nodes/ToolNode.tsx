import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getToolById } from '@/services/agents/registry';

export const ToolNode = memo(({ data, selected }: NodeProps) => {
  const tool = getToolById(data.toolId as string);
  
  if (!tool) {
    return (
      <Card className="w-48 p-3 border-destructive">
        <div className="text-sm text-destructive">Tool not found</div>
      </Card>
    );
  }

  return (
    <Card className={`w-48 p-3 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{tool.icon}</span>
        <div className="text-sm font-medium text-foreground truncate">
          {tool.name}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-2">
        {tool.description}
      </div>
      
      <div className="flex gap-1">
        <Badge variant="secondary" className="text-xs">
          {tool.category}
        </Badge>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary"
      />
    </Card>
  );
});

ToolNode.displayName = 'ToolNode';