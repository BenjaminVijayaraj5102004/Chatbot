import { useEffect, useState } from "react";
import { getMessages, getSessions, sendMessage } from "./api";

function App() {
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const data = await getSessions();
      setSessions(data);
      if (data.length > 0 && !sessionId) {
        setSessionId(data[0].id);
        await loadMessages(data[0].id);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadMessages(id) {
    try {
      const data = await getMessages(id);
      setMessages(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await sendMessage(sessionId, input.trim());
      setInput("");
      setSessionId(data.session_id);
      setMessages((prev) => [...prev, data.user_message, data.assistant_message]);
      await loadSessions();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function selectSession(id) {
    setSessionId(id);
    await loadMessages(id);
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Sessions</h2>
        <button onClick={() => { setSessionId(null); setMessages([]); }}>
          New Chat
        </button>
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              <button
                className={session.id === sessionId ? "active" : ""}
                onClick={() => selectSession(session.id)}
              >
                {session.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat">
        <h1>Chatbot AI Agent</h1>
        <div className="messages">
          {messages.length === 0 && <p className="empty">Start the conversation.</p>}
          {messages.map((msg) => (
            <div key={msg.id} className={`msg ${msg.role}`}>
              <strong>{msg.role}:</strong> {msg.content}
            </div>
          ))}
        </div>

        <form className="composer" onSubmit={handleSend}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </main>
    </div>
  );
}

export default App;
