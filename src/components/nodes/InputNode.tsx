import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export const InputNode = memo(({ data, selected }: NodeProps) => {
  return (
    <Card className={`w-48 p-3 bg-primary/5 border-primary/20 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <Upload size={16} className="text-primary" />
        <div className="text-sm font-medium text-foreground">
          {(data.label as string) || 'Input'}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Upload files or provide input data
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary"
      />
    </Card>
  );
});

InputNode.displayName = 'InputNode';