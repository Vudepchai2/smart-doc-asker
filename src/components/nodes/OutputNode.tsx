import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';

export const OutputNode = memo(({ data, selected }: NodeProps) => {
  return (
    <Card className={`w-48 p-3 bg-secondary/20 border-secondary ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <Download size={16} className="text-secondary-foreground" />
        <div className="text-sm font-medium text-foreground">
          {(data.label as string) || 'Output'}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Generated documentation and results
      </div>
    </Card>
  );
});

OutputNode.displayName = 'OutputNode';