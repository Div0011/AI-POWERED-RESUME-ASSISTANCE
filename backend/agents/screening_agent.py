from typing import Annotated, TypedDict, List, Dict
from langgraph.graph import StateGraph, END
from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Use a dummy key if not set to prevent crash on startup
client = Groq(api_key=os.getenv("GROQ_API_KEY", "gsk_dummy_key_for_local_testing"))

import yaml

# Load prompts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROMPTS_PATH = os.path.join(BASE_DIR, "..", "prompts", "v1_screening.yaml")

def load_prompts():
    try:
        with open(PROMPTS_PATH, "r") as f:
            return yaml.safe_load(f)
    except Exception as e:
        print(f"Error loading prompts: {e}")
        return {}

prompts = load_prompts()

class AgentState(TypedDict):
    job_description: str
    resume_text: str
    analysis: Dict
    confidence_score: str # "High", "Medium", "Low"
    explanation: str
    logs: List[str]

def screening_node(state: AgentState):
    """
    Initial screening using Groq to extract skills and match against JD.
    """
    new_logs = state.get("logs", [])
    new_logs.append("🔍 Agent is starting initial screening...")
    new_logs.append("📄 Extracting skills and experience from resume...")
    
    prompt_template = prompts.get("screening_prompt", "")
    prompt = prompt_template.format(
        job_description=state['job_description'],
        resume_text=state['resume_text']
    )
    
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"}
    )
    
    analysis = json.loads(response.choices[0].message.content)
    new_logs.append(f"✅ Extracted {len(analysis.get('matching_skills', []))} matching skills.")
    return {**state, "analysis": analysis, "logs": new_logs}

def reasoning_node(state: AgentState):
    """
    Deep reasoning to detect "Low Confidence" claims.
    Rule: If a skill is claimed but no project evidence is found, flag as Low Confidence.
    """
    new_logs = state.get("logs", [])
    new_logs.append("🧠 Agent is now performing deep reasoning...")
    new_logs.append("⚖️ Verifying skill claims against project evidence...")
    
    prompt_template = prompts.get("reasoning_prompt", "")
    prompt = prompt_template.format(
        analysis=json.dumps(state['analysis']),
        resume_text=state['resume_text']
    )
    
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"}
    )
    
    reasoning = json.loads(response.choices[0].message.content)
    new_logs.append(f"🎯 Reasoning complete. Confidence Score: {reasoning['confidence_score']}")
    
    return {
        **state, 
        "confidence_score": reasoning["confidence_score"],
        "explanation": reasoning["explanation"],
        "logs": new_logs
    }

def create_screening_graph():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("screen", screening_node)
    workflow.add_node("reason", reasoning_node)
    
    workflow.set_entry_point("screen")
    workflow.add_edge("screen", "reason")
    workflow.add_edge("reason", END)
    
    return workflow.compile()

# Helper to run the agent
def run_screening_agent(jd: str, resume: str):
    graph = create_screening_graph()
    initial_state = {
        "job_description": jd,
        "resume_text": resume,
        "analysis": {},
        "confidence_score": "",
        "explanation": "",
        "logs": []
    }
    return graph.invoke(initial_state)
