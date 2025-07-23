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
import { Play, Save, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const [executionResults, setExecutionResults] = useState<any>(null);

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
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please sign in to execute workflows');
        return;
      }

      // Prepare workflow data
      const workflowData = {
        workflowId: `temp-${Date.now()}`, // For now, using temp ID
        nodes: nodes,
        edges: edges,
        inputFiles: [] // Could be populated from file upload nodes
      };

      toast.info('Executing workflow...', {
        description: 'Your Python LangGraph agents are processing the workflow'
      });

      // Call the edge function to execute workflow
      const { data, error } = await supabase.functions.invoke('execute-workflow', {
        body: workflowData,
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setExecutionResults(data.results);
      toast.success('Workflow executed successfully!', {
        description: 'Check the results panel for detailed output'
      });

    } catch (error) {
      console.error('Workflow execution error:', error);
      toast.error('Workflow execution failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const saveWorkflow = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please sign in to save workflows');
        return;
      }

      const workflowData = {
        name: `Workflow ${new Date().toLocaleDateString()}`,
        description: 'Custom documentation workflow',
        workflow_data: JSON.parse(JSON.stringify({ nodes, edges })) as any,
        user_id: session.user.id
      };

      const { error } = await supabase
        .from('workflows')
        .insert(workflowData);

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Workflow saved successfully!');
    } catch (error) {
      toast.error('Failed to save workflow', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const downloadResults = () => {
    if (!executionResults) {
      toast.error('No results to download');
      return;
    }

    const blob = new Blob([JSON.stringify(executionResults, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-results-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Results downloaded!');
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
            {executionResults && (
              <Button 
                onClick={downloadResults} 
                variant="outline" 
                size="sm"
                className="gap-2"
              >
                <Download size={16} />
                Results
              </Button>
            )}
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

        <div className="flex-1 flex">
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
          
          {/* Results Panel */}
          {executionResults && (
            <div className="w-96 bg-card border-l p-4 overflow-auto">
              <h3 className="font-semibold mb-4">Execution Results</h3>
              <div className="space-y-4">
                <div className="text-sm">
                  <div className="font-medium">Summary</div>
                  <div className="text-muted-foreground">{executionResults.summary}</div>
                </div>
                
                {Object.entries(executionResults.outputs || {}).map(([nodeId, output]: [string, any]) => (
                  <div key={nodeId} className="border rounded p-3">
                    <div className="font-medium text-sm mb-2">Tool Output</div>
                    <div className="text-xs text-muted-foreground mb-2">Type: {output.type}</div>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                      {JSON.stringify(output.data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};