from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langgraph_backend.tools import analyze_code, generate_docstrings, evaluate_quality
from langgraph_backend.agent_executor import run_doc_agent

load_dotenv()

class DocAnalysisResponse(BaseModel):
    file: str
    analysis: str
    docstrings: str
    quality: str

llm = ChatOpenAI(model="gpt-4o-mini")
parser = PydanticOutputParser(pydantic_object=DocAnalysisResponse)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You are a documentation assistant. Use the available tools as appropriate:
            - Use 'analyze_code' to analyze code structure.
            - Use 'generate_docstrings' to generate docstrings.
            - Use 'evaluate_quality' to evaluate code quality.
            Wrap the output in this format and provide no other text\n{format_instructions}
            """,
        ),
        ("placeholder", "{chat_history}"),
        ("human", "{query}"),
        ("placeholder", "{agent_scratchpad}"),
    ]
).partial(format_instructions=parser.get_format_instructions())

tools = [analyze_code, generate_docstrings, evaluate_quality]
agent = create_tool_calling_agent(
    llm=llm,
    prompt=prompt,
    tools=tools
)

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

async def run_doc_agent(file_content: str, file_name: str):
    query = f"Analyze and document the following file: {file_name}\n{file_content}"
    raw_response = await agent_executor.ainvoke({"query": query})
    output = raw_response.get("output")
    if isinstance(output, str):
        return parser.parse(output)
    elif isinstance(output, list) and "text" in output[0]:
        return parser.parse(output[0]["text"])
    else:
        raise ValueError(f"Unexpected output format: {raw_response}") 