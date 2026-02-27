from datetime import datetime

from pydantic import BaseModel, Field


class ChatMessageCreate(BaseModel):
    role: str = Field(pattern="^(user|assistant|system)$")
    content: str = Field(min_length=1)


class ChatMessageRead(BaseModel):
    id: int
    session_id: int
    role: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatSessionCreate(BaseModel):
    title: str = Field(default="New chat", min_length=1, max_length=150)


class ChatSessionRead(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    session_id: int | None = None


class ChatResponse(BaseModel):
    session_id: int
    user_message: ChatMessageRead
    assistant_message: ChatMessageRead
