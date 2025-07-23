// Agent registry for the multi-agent coding system
import { CodingAgentType } from './types';

export const CODING_AGENTS: CodingAgentType[] = [
  {
    id: 'file-reader',
    name: 'Code File Analyzer',
    description: 'Deep analysis of source code files, extracts structure, dependencies, and patterns',
    capabilities: ['Parse AST', 'Extract functions/classes', 'Analyze imports', 'Detect patterns'],
    supportedLanguages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust'],
    specialization: 'analysis',
    icon: '📄'
  },
  {
    id: 'web-search',
    name: 'Developer Research Agent',
    description: 'Searches coding documentation, GitHub, Stack Overflow, and technical resources',
    capabilities: ['API documentation search', 'Code examples', 'Best practices', 'Library research'],
    supportedLanguages: ['All programming languages'],
    specialization: 'research',
    icon: '🔍'
  },
  {
    id: 'docstring-generator',
    name: 'Documentation Generator',
    description: 'Generates professional docstrings, type hints, and comprehensive code documentation',
    capabilities: ['Generate docstrings', 'Type annotations', 'Inline comments', 'README creation'],
    supportedLanguages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C#'],
    specialization: 'documentation',
    icon: '📝'
  },
  {
    id: 'code-analyzer',
    name: 'Code Quality Auditor',
    description: 'Comprehensive code review, security analysis, and performance optimization',
    capabilities: ['Static analysis', 'Security scanning', 'Performance review', 'Code metrics'],
    supportedLanguages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go'],
    specialization: 'analysis',
    icon: '🔍'
  },
  {
    id: 'orchestrator',
    name: 'Multi-Agent Coordinator',
    description: 'Intelligently coordinates specialist agents for comprehensive code analysis',
    capabilities: ['Agent coordination', 'Task planning', 'Result synthesis', 'Workflow optimization'],
    supportedLanguages: ['All programming languages'],
    specialization: 'coordination',
    icon: '🎯'
  }
];

export const getAgentById = (id: string): CodingAgentType | undefined => {
  return CODING_AGENTS.find(agent => agent.id === id);
};

export const getAgentsBySpecialization = (specialization: CodingAgentType['specialization']): CodingAgentType[] => {
  return CODING_AGENTS.filter(agent => agent.specialization === specialization);
};