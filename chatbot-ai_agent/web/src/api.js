const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function sendMessage(sessionId, message) {
  const response = await fetch(`${API_BASE}/api/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function getSessions() {
  const response = await fetch(`${API_BASE}/api/chat/sessions`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export async function getMessages(sessionId) {
  const response = await fetch(`${API_BASE}/api/chat/sessions/${sessionId}/messages`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}
