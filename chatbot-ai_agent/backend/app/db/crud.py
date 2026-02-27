from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.chat import ChatMessage, ChatSession


def create_session(db: Session, title: str = "New chat") -> ChatSession:
    session = ChatSession(title=title)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_session(db: Session, session_id: int) -> ChatSession | None:
    return db.get(ChatSession, session_id)


def list_sessions(db: Session) -> list[ChatSession]:
    stmt = select(ChatSession).order_by(ChatSession.updated_at.desc())
    return list(db.scalars(stmt).all())


def list_messages(db: Session, session_id: int) -> list[ChatMessage]:
    stmt = (
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
    )
    return list(db.scalars(stmt).all())


def create_message(db: Session, session_id: int, role: str, content: str) -> ChatMessage:
    message = ChatMessage(session_id=session_id, role=role, content=content)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message
