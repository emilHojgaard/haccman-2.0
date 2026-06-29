import { useEffect, useRef, useState } from "react";
import bots from "../content/bots.json";
import { useGameStore } from "../store/gameStore";
import { checkWin } from "../engine/winDetector";
import { askBot, insertPrompt, insertResponse } from "../services/chatService";
import { endSession } from "../services/sessionService";
import "../theme/components.css";

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWindow({ task }) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bot = bots.find((b) => b.id === task.botId);
  const messages = useGameStore((s) => s.messages);
  const sessionId = useGameStore((s) => s.sessionId);
  const addMessage = useGameStore((s) => s.addMessage);
  const markTaskCompleted = useGameStore((s) => s.markTaskCompleted);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setDraft("");
    addMessage({ role: "user", content: text, createdAt: new Date().toISOString() });

    try {
      const prompt = await insertPrompt(sessionId, text);
      const { aiResponsetext, sources, sourceRefs } = await askBot({
        message: text,
        systemPrompt: task.systemPrompt,
        constrain: task.constrain,
        guardrail: true,
        previousPrompts: messages.map((m) => ({
          id: m.role === "user" ? "user" : "assistant",
          message: m.content,
        })),
      });
      await insertResponse(prompt.id, aiResponsetext, sources);
      addMessage({
        role: "bot",
        content: aiResponsetext,
        createdAt: new Date().toISOString(),
        sourceRefs,
      });

      if (checkWin(task.id, aiResponsetext)) {
        markTaskCompleted(task.id);
        await endSession(sessionId);
      }
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header__dot" />
        <span className="chat-header__name">{bot.name.toUpperCase()} — ONLINE</span>
        <span className="chat-header__difficulty">{task.difficulty}</span>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble-wrap chat-bubble-wrap--${m.role === "user" ? "user" : "bot"}`}>
            <div className={`chat-bubble chat-bubble--${m.role === "user" ? "user" : "bot"}`}>
              {m.content}
            </div>
            {m.sourceRefs?.length > 0 && (
              <div className="chat-sources">
                <i className="ti ti-file-text" aria-hidden="true" />
                {m.sourceRefs.join(" · ")}
              </div>
            )}
            {m.createdAt && <div className="chat-timestamp">{formatTime(m.createdAt)}</div>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          ref={inputRef}
          className="chat-input__field"
          placeholder="> inject prompt..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={sending}
        />
        <button className="chat-input__send" onClick={handleSend} aria-label="Send">
          <i className="ti ti-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
