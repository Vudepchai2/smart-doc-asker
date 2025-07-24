from langchain.tools import tool
from langgraph_backend.ai_helpers import analyze_code_file, generate_docstrings, evaluate_code_quality

@tool
async def analyze_code(content: str) -> str:
    result = await analyze_code_file(content)
    return str(result)

@tool
async def generate_docstrings(content: str) -> str:
    result = await generate_docstrings(content)
    return str(result)

@tool
async def evaluate_quality(content: str) -> str:
    result = await evaluate_code_quality(content)
    return str(result) 