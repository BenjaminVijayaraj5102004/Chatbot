import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || "http://10.0.2.2:8000";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!text.trim() || loading) {
      return;
    }

    setLoading(true);
    const pendingText = text.trim();
    setText("");

    try {
      const response = await fetch(`${API_BASE}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: pendingText,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setSessionId(data.session_id);
      setMessages((prev) => [...prev, data.user_message, data.assistant_message]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: `Error: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Chatbot AI Agent</Text>

        <FlatList
          data={messages}
          keyExtractor={(item, index) => `${item.id || index}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === "user" ? styles.user : styles.assistant]}>
              <Text style={styles.role}>{item.role}</Text>
              <Text>{item.content}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Start a new chat.</Text>}
        />

        <View style={styles.composer}>
          <TextInput
            value={text}
            onChangeText={setText}
            style={styles.input}
            placeholder="Type your message"
          />
          <TouchableOpacity style={styles.button} onPress={sendMessage}>
            {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Send</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  list: {
    gap: 8,
    paddingBottom: 8,
  },
  bubble: {
    borderRadius: 12,
    padding: 10,
  },
  user: {
    backgroundColor: "#dbeafe",
  },
  assistant: {
    backgroundColor: "#ede9fe",
  },
  role: {
    textTransform: "capitalize",
    fontWeight: "700",
    marginBottom: 4,
  },
  empty: {
    color: "#6b7280",
  },
  composer: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#111827",
    borderRadius: 10,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
