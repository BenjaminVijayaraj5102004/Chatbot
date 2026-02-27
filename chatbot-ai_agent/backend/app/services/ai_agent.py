import os

from pydantic import BaseModel
from pydantic_ai import Agent

from app.core.config import settings


SYSTEM_PROMPT = (
    "You are a helpful AI agent for a chatbot app. "
    "Answer clearly, briefly, and help users complete tasks."
)


class AssistantOutput(BaseModel):
    reply: str


def build_prompt(history: list[dict[str, str]], user_message: str) -> str:
    history_text = "\n".join(
        [f"{message['role']}: {message['content']}" for message in history]
    )
    if not history_text:
        history_text = "No previous conversation."
    return (
        f"Conversation history:\n{history_text}\n\n"
        f"User message:\n{user_message}\n\n"
        "Return only the assistant reply."
    )


def generate_assistant_reply(history: list[dict[str, str]], user_message: str) -> str:
    if not settings.groq_api_key:
        return (
            "GROQ API key is not configured yet. "
            "I saved your message and this is a local fallback response."
        )

    os.environ["GROQ_API_KEY"] = settings.groq_api_key
    agent = Agent(
        f"groq:{settings.groq_model}",
        output_type=str,
        instructions=SYSTEM_PROMPT,
    )

    try:
        result = agent.run_sync(build_prompt(history, user_message))
        validated = AssistantOutput.model_validate({"reply": result.output})
        text = validated.reply
        return text.strip() if text else "I could not generate a response."
    except Exception as exc:
        return f"I could not generate a response from Groq: {exc}"
