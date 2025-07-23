import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CODING_TOOLS, getToolsByCategory } from '@/services/agents/registry';

interface ToolboxPanelProps {
  onAddTool: (toolId: string, toolName: string, toolIcon: string) => void;
}

export const ToolboxPanel = ({ onAddTool }: ToolboxPanelProps) => {
  const categories = ['analysis', 'research', 'documentation', 'evaluation'] as const;

  return (
    <div className="w-80 bg-card border-r flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Toolbox</h3>
        <p className="text-sm text-muted-foreground">Drag tools to build your workflow</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {categories.map((category) => {
            const tools = getToolsByCategory(category);
            return (
              <div key={category} className="space-y-3">
                <h4 className="text-sm font-medium text-foreground capitalize flex items-center gap-2">
                  {category}
                  <Badge variant="secondary" className="text-xs">
                    {tools.length}
                  </Badge>
                </h4>
                
                <div className="space-y-2">
                  {tools.map((tool) => (
                    <Card
                      key={tool.id}
                      className="p-3 cursor-grab hover:shadow-md transition-all duration-200 border border-border hover:border-primary/50"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/reactflow', 'tool');
                        e.dataTransfer.setData('tool-id', tool.id);
                        e.dataTransfer.setData('tool-name', tool.name);
                        e.dataTransfer.setData('tool-icon', tool.icon);
                      }}
                      onClick={() => onAddTool(tool.id, tool.name, tool.icon)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{tool.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">
                            {tool.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {tool.description}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {tool.inputs.length} inputs
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {tool.outputs.length} outputs
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};