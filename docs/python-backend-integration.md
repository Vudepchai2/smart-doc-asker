# Python + LangGraph Backend Integration Guide

## Overview

This guide shows you how to integrate a Python + LangGraph backend with your React workflow UI. The UI sends workflow definitions to your Python backend, which executes them using LangGraph agents.

## Architecture

```
React UI → Supabase Edge Function → Python LangGraph Backend → AI Models
```

## Integration Options

### Option 1: Supabase Edge Function Proxy (Recommended)

The current implementation uses Supabase Edge Functions as a bridge:

1. **Frontend**: Sends workflow to Edge Function
2. **Edge Function**: Validates, logs to database, calls Python backend
3. **Python Backend**: Executes LangGraph workflow
4. **Results**: Stored in Supabase, displayed in UI

### Option 2: Direct Integration

For simpler setups, call Python backend directly from React:

```typescript
// Direct call to Python backend
const response = await fetch('https://your-python-backend.com/execute-workflow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nodes, edges, inputFiles })
});
```

## Python Backend Setup

### 1. Install Dependencies

```bash
pip install langgraph fastapi uvicorn python-multipart openai anthropic
```

### 2. Create FastAPI Server

```python
# main.py
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict, Any
import json

app = FastAPI()

# Enable CORS for your frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-lovable-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/execute-workflow")
async def execute_workflow(
    nodes: str = Form(...),
    edges: str = Form(...),
    inputFiles: str = Form(default="[]")
):
    try:
        # Parse the workflow data
        nodes_data = json.loads(nodes)
        edges_data = json.loads(edges)
        files_data = json.loads(inputFiles)
        
        # Execute the workflow using LangGraph
        results = await execute_langgraph_workflow(nodes_data, edges_data, files_data)
        
        return JSONResponse({
            "success": True,
            "results": results
        })
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

async def execute_langgraph_workflow(nodes, edges, files):
    # Your LangGraph implementation here
    pass
```

### 3. LangGraph Agent Implementation

```python
# agents.py
from langgraph import StateGraph, END
from typing import TypedDict, List, Dict, Any
import openai

class AgentState(TypedDict):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    files: List[Dict[str, Any]]
    current_node: str
    results: Dict[str, Any]
    execution_log: List[str]

# Define your agents
async def file_analyzer_agent(state: AgentState) -> AgentState:
    """Analyzes uploaded code files"""
    files = state["files"]
    results = {}
    
    for file in files:
        # Analyze code structure, functions, classes, etc.
        analysis = analyze_code_file(file["content"])
        results[file["name"]] = analysis
    
    state["results"]["file_analysis"] = results
    state["execution_log"].append("File analysis completed")
    return state

async def web_research_agent(state: AgentState) -> AgentState:
    """Searches for documentation and best practices"""
    # Implement web search for coding resources
    search_results = await search_coding_documentation(state)
    
    state["results"]["web_research"] = search_results
    state["execution_log"].append("Web research completed")
    return state

async def docstring_generator_agent(state: AgentState) -> AgentState:
    """Generates comprehensive docstrings"""
    files = state["files"]
    docstrings = {}
    
    for file in files:
        # Generate docstrings using AI
        generated_docs = await generate_docstrings(file["content"])
        docstrings[file["name"]] = generated_docs
    
    state["results"]["docstrings"] = docstrings
    state["execution_log"].append("Docstring generation completed")
    return state

async def quality_evaluator_agent(state: AgentState) -> AgentState:
    """Evaluates code quality and provides suggestions"""
    files = state["files"]
    quality_reports = {}
    
    for file in files:
        # Evaluate code quality
        quality_report = await evaluate_code_quality(file["content"])
        quality_reports[file["name"]] = quality_report
    
    state["results"]["quality_evaluation"] = quality_reports
    state["execution_log"].append("Quality evaluation completed")
    return state

# Create the workflow graph
def create_workflow():
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("file_analyzer", file_analyzer_agent)
    workflow.add_node("web_research", web_research_agent)
    workflow.add_node("docstring_generator", docstring_generator_agent)
    workflow.add_node("quality_evaluator", quality_evaluator_agent)
    
    # Define the flow
    workflow.set_entry_point("file_analyzer")
    workflow.add_edge("file_analyzer", "web_research")
    workflow.add_edge("web_research", "docstring_generator")
    workflow.add_edge("docstring_generator", "quality_evaluator")
    workflow.add_edge("quality_evaluator", END)
    
    return workflow.compile()

# Execute the workflow
async def execute_langgraph_workflow(nodes, edges, files):
    app = create_workflow()
    
    initial_state = {
        "nodes": nodes,
        "edges": edges,
        "files": files,
        "current_node": "",
        "results": {},
        "execution_log": []
    }
    
    final_state = await app.ainvoke(initial_state)
    return final_state["results"]
```

### 4. AI Integration Functions

```python
# ai_helpers.py
import openai
from typing import Dict, Any

async def analyze_code_file(content: str) -> Dict[str, Any]:
    """Analyze code structure using AI"""
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a code analyzer. Analyze the provided code and return structured information about functions, classes, imports, and complexity."},
            {"role": "user", "content": content}
        ]
    )
    
    # Parse and structure the response
    return {"analysis": response.choices[0].message.content}

async def generate_docstrings(content: str) -> Dict[str, Any]:
    """Generate docstrings for code"""
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Generate comprehensive docstrings for the provided code. Follow Google style docstring conventions."},
            {"role": "user", "content": content}
        ]
    )
    
    return {"docstrings": response.choices[0].message.content}

async def evaluate_code_quality(content: str) -> Dict[str, Any]:
    """Evaluate code quality and provide suggestions"""
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Evaluate the code quality, security, performance, and maintainability. Provide a score and specific improvement suggestions."},
            {"role": "user", "content": content}
        ]
    )
    
    return {"evaluation": response.choices[0].message.content}
```

### 5. Run the Server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Environment Setup

### 1. Set Python Backend URL

In your Supabase Edge Function environment, set:

```bash
# In Supabase Dashboard > Functions > Settings
PYTHON_BACKEND_URL=https://your-python-backend.com
```

### 2. Set AI API Keys

```bash
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key  # Optional
```

## Deployment Options

### Option 1: Railway
```bash
railway login
railway init
railway deploy
```

### Option 2: Render
```bash
# Create render.yaml in your Python project
services:
  - type: web
    name: langgraph-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Option 3: DigitalOcean App Platform
```bash
# Deploy directly from GitHub
```

## Testing

Test your backend integration:

```bash
curl -X POST "http://localhost:8000/execute-workflow" \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": [{"id": "1", "type": "tool", "data": {"toolId": "file-analyzer"}}],
    "edges": [],
    "inputFiles": [{"name": "test.py", "content": "def hello(): pass"}]
  }'
```

## Security Notes

1. **Authentication**: Implement proper API authentication
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Input Validation**: Validate all inputs thoroughly
4. **CORS**: Configure CORS properly for your domain
5. **API Keys**: Store API keys securely in environment variables

## Next Steps

1. Deploy your Python backend
2. Update the `PYTHON_BACKEND_URL` in Supabase Edge Functions
3. Test the workflow execution
4. Add authentication to your React app
5. Implement file upload functionality
6. Add real-time progress updates using WebSockets

The system is now ready to execute real Python + LangGraph workflows from your drag-and-drop UI!