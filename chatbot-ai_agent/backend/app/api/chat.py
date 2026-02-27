from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import crud
from app.db.session import get_db
from app.schemas.chat import ChatMessageRead, ChatRequest, ChatResponse, ChatSessionRead
from app.services.ai_agent import generate_assistant_reply

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.get("/sessions", response_model=list[ChatSessionRead])
def get_sessions(db: Session = Depends(get_db)):
    return crud.list_sessions(db)



@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageRead])
def get_session_messages(session_id: int, db: Session = Depends(get_db)):
    session = crud.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return crud.list_messages(db, session_id)


@router.post("/message", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    session = crud.get_session(db, payload.session_id) if payload.session_id else None
    if payload.session_id and not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if not session:
        title = payload.message[:60] if payload.message else "New chat"
        session = crud.create_session(db, title=title)

    user_message = crud.create_message(db, session.id, "user", payload.message)

    history = [
        {"role": msg.role, "content": msg.content}
        for msg in crud.list_messages(db, session.id)
        if msg.id != user_message.id
    ]
    assistant_text = generate_assistant_reply(history, payload.message)
    assistant_message = crud.create_message(db, session.id, "assistant", assistant_text)

    return ChatResponse(
        session_id=session.id,
        user_message=user_message,
        assistant_message=assistant_message,
    )
