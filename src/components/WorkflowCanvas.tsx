import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ToolNode } from './nodes/ToolNode';
import { InputNode } from './nodes/InputNode';
import { OutputNode } from './nodes/OutputNode';
import { ToolboxPanel } from './ToolboxPanel';
import { Button } from '@/components/ui/button';
import { Play, Save } from 'lucide-react';
import { toast } from 'sonner';

const nodeTypes: NodeTypes = {
  tool: ToolNode,
  input: InputNode,
  output: OutputNode,
};

const initialNodes: Node[] = [
  {
    id: 'input-1',
    type: 'input',
    position: { x: 100, y: 100 },
    data: { label: 'Upload Files' },
  },
  {
    id: 'output-1',
    type: 'output',
    position: { x: 600, y: 200 },
    data: { label: 'Documentation Output' },
  },
];

const initialEdges: Edge[] = [];

export const WorkflowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isExecuting, setIsExecuting] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addToolNode = useCallback((toolId: string, toolName: string, toolIcon: string) => {
    const newNode: Node = {
      id: `tool-${Date.now()}`,
      type: 'tool',
      position: { x: Math.random() * 400 + 200, y: Math.random() * 300 + 150 },
      data: { 
        toolId, 
        label: toolName,
        icon: toolIcon
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const executeWorkflow = async () => {
    setIsExecuting(true);
    try {
      // Simulate workflow execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Workflow executed successfully!');
    } catch (error) {
      toast.error('Workflow execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const saveWorkflow = () => {
    const workflow = { nodes, edges };
    localStorage.setItem('coding-workflow', JSON.stringify(workflow));
    toast.success('Workflow saved!');
  };

  return (
    <div className="h-screen flex">
      <ToolboxPanel onAddTool={addToolNode} />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-background border-b p-4 flex items-center gap-4">
          <h2 className="text-lg font-semibold">Code Documentation Workflow</h2>
          <div className="flex gap-2 ml-auto">
            <Button 
              onClick={saveWorkflow} 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Save size={16} />
              Save
            </Button>
            <Button 
              onClick={executeWorkflow} 
              disabled={isExecuting}
              size="sm"
              className="gap-2"
            >
              <Play size={16} />
              {isExecuting ? 'Executing...' : 'Execute'}
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
          >
            <Background />
            <Controls />
            <MiniMap 
              nodeColor="#8b5cf6"
              maskColor="rgb(240, 240, 240, 0.6)"
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};