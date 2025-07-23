
// Modular coding documentation API service

// Re-export types from modular structure
export type { CodingTool, ChatMessage, ChatResponse } from './agents/types';
export { CODING_TOOLS, getToolById, getToolsByCategory } from './agents/registry';

import type { CodingTool, ChatResponse } from './agents/types';
import { CODING_TOOLS } from './agents/registry';

export class MultiAgentCodingAI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async sendMessage(message: string, files: File[], selectedAgent?: string): Promise<ChatResponse> {
    try {
      // Create FormData to handle both text and files
      const formData = new FormData();
      formData.append('message', message);
      formData.append('selectedAgent', selectedAgent || 'orchestrator');
      
      // Attach code files to the request
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      // Make API call to backend
      const response = await fetch(`${this.baseUrl}/multi-agent-chat`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

      /* 
      BACKEND MULTI-AGENT AI INTEGRATION (Python LangGraph):
      
      The backend endpoint '/api/multi-agent-chat' would be built using Python LangGraph:

      1. LANGGRAPH AGENT SETUP:
         ```python
         from langgraph import StateGraph, END
         from typing import TypedDict, List
         
         class AgentState(TypedDict):
             message: str
             files: List[str]
             selected_agent: str
             file_analysis: dict
             web_search_results: dict
             docstrings: dict
             final_response: str
         
         # Define individual agents
         async def file_reader_agent(state: AgentState):
             # Process uploaded code files
             # Extract functions, classes, imports
             # Analyze code structure
             pass
         
         async def web_search_agent(state: AgentState):
             # Search documentation and coding resources
             # Use APIs like Google, Bing, or specialized dev tools
             pass
         
         async def docstring_generator_agent(state: AgentState):
             # Generate comprehensive docstrings
             # Add type hints and documentation
             pass
         
         async def orchestrator_agent(state: AgentState):
             # Coordinate multiple agents
             # Decide which agents to use based on request
             pass
         ```

      2. LANGGRAPH WORKFLOW:
         ```python
         # Create the graph
         workflow = StateGraph(AgentState)
         
         # Add nodes
         workflow.add_node("file_reader", file_reader_agent)
         workflow.add_node("web_search", web_search_agent)
         workflow.add_node("docstring_generator", docstring_generator_agent)
         workflow.add_node("orchestrator", orchestrator_agent)
         
         # Add edges and conditional routing
         workflow.add_conditional_edges(
             "orchestrator",
             decide_next_agent,
             {
                 "file_reader": "file_reader",
                 "web_search": "web_search",
                 "docstring_generator": "docstring_generator",
                 "end": END
             }
         )
         
         # Set entry point
         workflow.set_entry_point("orchestrator")
         
         # Compile the graph
         app = workflow.compile()
         ```

      3. FASTAPI ENDPOINT:
         ```python
         from fastapi import FastAPI, File, UploadFile, Form
         from fastapi.responses import JSONResponse
         
         app = FastAPI()
         
         @app.post("/api/multi-agent-chat")
         async def multi_agent_chat(
             message: str = Form(...),
             selected_agent: str = Form(default="orchestrator"),
             files: List[UploadFile] = File(default=[])
         ):
             # Process uploaded files
             file_contents = []
             for file in files:
                 content = await file.read()
                 file_contents.append({
                     "name": file.filename,
                     "content": content.decode("utf-8")
                 })
             
             # Initialize state
             initial_state = {
                 "message": message,
                 "files": file_contents,
                 "selected_agent": selected_agent,
                 "file_analysis": {},
                 "web_search_results": {},
                 "docstrings": {},
                 "final_response": ""
             }
             
             # Run the multi-agent workflow
             result = await app.ainvoke(initial_state)
             
             return JSONResponse({
                 "response": result["final_response"],
                 "success": True,
                 "agentUsed": selected_agent,
                 "metadata": {
                     "filesProcessed": len(file_contents),
                     "webSearchResults": len(result.get("web_search_results", {})),
                     "docstringsGenerated": len(result.get("docstrings", {}))
                 }
             })
         ```

      4. REQUIRED DEPENDENCIES:
         - langgraph (multi-agent orchestration)
         - fastapi (API framework)
         - python-multipart (file upload handling)
         - openai or anthropic (LLM integration)
         - beautifulsoup4 (web scraping)
         - ast (Python code parsing)
         - tree-sitter (multi-language parsing)
         - requests (web search APIs)
      */

    } catch (error) {
      console.error('Multi-Agent API Error:', error);
      return {
        response: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  getAvailableTools(): CodingTool[] {
    return CODING_TOOLS;
  }
}

// Export singleton instance
export const multiAgentCodingAI = new MultiAgentCodingAI();
