from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict, Any
import json
from langgraph_backend.agent_executor import run_doc_agent
from langgraph_backend.tools import analyze_code, generate_docstrings, evaluate_quality

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
        nodes_data = json.loads(nodes)
        edges_data = json.loads(edges)
        files_data = json.loads(inputFiles)
        
        results = []
        for file in files_data:
            file_content = file["content"]
            file_name = file["name"]
            doc_result = await run_doc_agent(file_content, file_name)
            results.append(doc_result.dict())
        
        return JSONResponse({
            "success": True,
            "results": results
        })
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )