// Core types for the multi-agent coding system

export interface CodingAgentType {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  supportedLanguages: string[];
  icon: string;
  specialization: 'analysis' | 'documentation' | 'research' | 'coordination';
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