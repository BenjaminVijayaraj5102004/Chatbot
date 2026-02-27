# Chatbot AI Agent

This project contains:
- FastAPI backend (`backend`) with PostgreSQL persistence and AI agent service
- React web app (`web`)
- React Native mobile app with Expo (`mobile`)

## 1) Backend Setup (FastAPI + PostgreSQL)

### Prerequisites
- Python 3.13+
- PostgreSQL running locally on `localhost:5432` OR Docker Desktop

### Option A: Run Postgres with Docker
```bash
docker compose up -d postgres
```

### Option B: Run backend + Postgres with Docker
```bash
docker compose up --build
```

### Local backend run
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Local backend run (uv method)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
uv pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check:
- `http://localhost:8000/health`

## 2) Web Setup (React + Vite)

```bash
cd web
copy .env.example .env
npm.cmd install
npm.cmd run dev
```

Web app:
- `http://localhost:5173`

## 3) Mobile Setup (React Native + Expo)

```bash
cd mobile
copy .env.example .env
npm.cmd install
npx.cmd expo start
```

Tips:
- Android emulator API URL: `http://10.0.2.2:8000`
- iOS simulator API URL: `http://localhost:8000`
- Real device: set `EXPO_PUBLIC_API_BASE_URL` to your machine LAN IP

## API Endpoints
- `GET /health`
- `GET /api/chat/sessions`
- `GET /api/chat/sessions/{session_id}/messages`
- `POST /api/chat/message`

Example payload:
```json
{
  "session_id": null,
  "message": "Hello, can you help me build a plan?"
}
```

## Pydantic Schemas
Request/response schemas are defined with Pydantic in:
- `backend/app/schemas/chat.py`

## pydantic_ai + Groq Integration
Set in `backend/.env`:
- `GROQ_API_KEY=your_key`
- `GROQ_MODEL=llama-3.3-70b-versatile`

If no API key is set, the backend returns a local fallback response and still stores chat history.
