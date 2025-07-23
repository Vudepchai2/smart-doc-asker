// Core types for the modular coding documentation system

export interface CodingTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'analysis' | 'documentation' | 'research' | 'evaluation';
  inputs: ToolInput[];
  outputs: ToolOutput[];
}

export interface ToolInput {
  id: string;
  name: string;
  type: 'file' | 'text' | 'url' | 'code';
  required: boolean;
}

export interface ToolOutput {
  id: string;
  name: string;
  type: 'documentation' | 'analysis' | 'report' | 'code';
}

export interface WorkflowNode {
  id: string;
  type: 'tool' | 'input' | 'output';
  position: { x: number; y: number };
  data: {
    toolId?: string;
    label?: string;
    config?: Record<string, any>;
  };
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface ChatMessage {
  message: string;
  files?: File[];
  selectedAgent?: string;
}

export interface ChatResponse {
  response: string;
  success: boolean;
  error?: string;
  agentUsed?: string;
  metadata?: {
    filesProcessed?: number;
    webSearchResults?: number;
    docstringsGenerated?: number;
  };
}

export interface AgentResult {
  agentId: string;
  result: string;
  metadata?: Record<string, any>;
  success: boolean;
  error?: string;
}