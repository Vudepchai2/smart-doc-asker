// Tool registry for the modular coding documentation system
import { CodingTool } from './types';

export const CODING_TOOLS: CodingTool[] = [
  {
    id: 'file-analyzer',
    name: 'Code File Analyzer',
    description: 'Deep analysis of source code files, extracts structure, dependencies, and patterns',
    icon: '📄',
    category: 'analysis',
    inputs: [
      { id: 'files', name: 'Source Files', type: 'file', required: true },
      { id: 'language', name: 'Programming Language', type: 'text', required: false }
    ],
    outputs: [
      { id: 'analysis', name: 'Code Analysis', type: 'analysis' },
      { id: 'structure', name: 'Code Structure', type: 'report' }
    ]
  },
  {
    id: 'web-researcher',
    name: 'Documentation Researcher',
    description: 'Searches coding documentation, APIs, and best practices from the web',
    icon: '🔍',
    category: 'research',
    inputs: [
      { id: 'query', name: 'Search Query', type: 'text', required: true },
      { id: 'context', name: 'Code Context', type: 'code', required: false }
    ],
    outputs: [
      { id: 'research', name: 'Research Results', type: 'report' },
      { id: 'references', name: 'Documentation Links', type: 'report' }
    ]
  },
  {
    id: 'docstring-generator',
    name: 'Documentation Generator',
    description: 'Generates comprehensive docstrings, comments, and API documentation',
    icon: '📝',
    category: 'documentation',
    inputs: [
      { id: 'code', name: 'Source Code', type: 'code', required: true },
      { id: 'style', name: 'Documentation Style', type: 'text', required: false }
    ],
    outputs: [
      { id: 'docstrings', name: 'Generated Docstrings', type: 'documentation' },
      { id: 'api-docs', name: 'API Documentation', type: 'documentation' }
    ]
  },
  {
    id: 'quality-evaluator',
    name: 'Code Quality Evaluator',
    description: 'Evaluates code quality, security, and provides improvement suggestions',
    icon: '🔍',
    category: 'evaluation',
    inputs: [
      { id: 'code', name: 'Source Code', type: 'code', required: true },
      { id: 'metrics', name: 'Quality Metrics', type: 'text', required: false }
    ],
    outputs: [
      { id: 'quality-report', name: 'Quality Report', type: 'report' },
      { id: 'suggestions', name: 'Improvement Suggestions', type: 'report' }
    ]
  }
];

export const getToolById = (id: string): CodingTool | undefined => {
  return CODING_TOOLS.find(tool => tool.id === id);
};

export const getToolsByCategory = (category: CodingTool['category']): CodingTool[] => {
  return CODING_TOOLS.filter(tool => tool.category === category);
};