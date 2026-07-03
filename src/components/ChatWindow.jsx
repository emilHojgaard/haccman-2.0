import { useEffect, useRef, useState } from "react";
import bots from "../content/bots.json";
import { useGameStore } from "../store/gameStore";
import { checkWin } from "../engine/winDetector";
import { askBot, insertPrompt, insertResponse, classifyPrompt } from "../services/chatService";
import { endSession, deleteSession } from "../services/sessionService";
import { useSoundEffect } from "../theme/SoundEffectContext";
import "../theme/components.css";

const MAX_LENGTH = 6000;
const WARN_THRESHOLD = MAX_LENGTH - 200;
const HINT_AFTER = 10;

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWindow({ task }) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);
  const bot = bots.find((b) => b.id === task.botId);
  const messages = useGameStore((s) => s.messages);
  const sessionId = useGameStore((s) => s.sessionId);
  const sessionWon = useGameStore((s) => s.sessionWon);
  const addMessage = useGameStore((s) => s.addMessage);
  const markTaskCompleted = useGameStore((s) => s.markTaskCompleted);
  const { playSoundEffect } = useSoundEffect();
  const userMsgCount = messages.filter((m) => m.role === "user").length;
  const hintAvailable = task.hint && userMsgCount >= HINT_AFTER && !sessionWon;
  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    return () => {
      const { sessionId: sid, messages: msgs } = useGameStore.getState();
      if (sid && msgs.filter((m) => m.role === "user").length === 0) {
        deleteSession(sid).catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (!sending && !sessionWon) inputRef.current?.focus({ preventScroll: true });
  }, [sending, sessionWon]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft]);

  useEffect(() => {
    if (messages.length === 0) return;
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  async function handleSend() {
    const text = draft.trim();
    if (!text || sending || text.length > MAX_LENGTH) return;

    setSending(true);
    setDraft("");
    playSoundEffect("send");
    addMessage({ role: "user", content: text, createdAt: new Date().toISOString() });

    try {
      const prompt = await insertPrompt(sessionId, text);

      // Fire-and-forget: classify strategy in background, doesn't block the chat
      classifyPrompt(
        prompt.id,
        text,
        messages.map((m) => ({ role: m.role, content: m.content })),
        task.task,
      );

      const { aiResponsetext, sources, sourceRefs } = await askBot({
        message: text,
        systemPrompt: task.systemPrompt,
        constrain: task.constrain,
        guardrail: true,
        useRag: Boolean(bot.ragEnabled),
        previousPrompts: messages.map((m) => ({
          id: m.role === "user" ? "user" : "assistant",
          message: m.content,
        })),
      });
      await insertResponse(prompt.id, aiResponsetext, sources);
      playSoundEffect("receive");
      addMessage({
        role: "bot",
        content: aiResponsetext,
        createdAt: new Date().toISOString(),
        sourceRefs,
      });

      if (checkWin(task.id, aiResponsetext)) {
        markTaskCompleted(task.id);
        await endSession(sessionId, { completed: true });
        playSoundEffect("win");
      }
    } catch (e) {
      console.error("Failed to send message:", e);
      addMessage({ role: "error", content: "Message failed to send. Try again." });
      setDraft(text);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header__dot" />
        <span className="chat-header__name">{bot.name.toUpperCase()} — ONLINE</span>
        <span className="chat-header__difficulty">{task.difficulty}</span>
      </div>

      <div className="chat-messages" ref={messagesRef}>
        {messages.map((m, i) =>
          m.role === "error" ? (
            <div key={i} className="chat-error">
              <i className="ti ti-alert-triangle" aria-hidden="true" /> {m.content}
            </div>
          ) : (
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
          )
        )}
        {sending && (
          <div className="chat-bubble-wrap chat-bubble-wrap--bot">
            <div className="chat-bubble chat-bubble--bot chat-typing">
              <span className="chat-typing__dot" />
              <span className="chat-typing__dot" />
              <span className="chat-typing__dot" />
            </div>
          </div>
        )}
      </div>

      {hintAvailable && (
        <div className="chat-hint">
          <i className="ti ti-bulb" aria-hidden="true" />
          {hintRevealed ? (
            <span className="chat-hint__text">{task.hint}</span>
          ) : (
            <button className="chat-hint__reveal" onClick={() => setHintRevealed(true)}>
              need a hint?
            </button>
          )}
        </div>
      )}

      {draft.length > WARN_THRESHOLD && (
        <div className="chat-length-warning">
          {draft.length} / {MAX_LENGTH}
          {draft.length >= MAX_LENGTH && " — message too long"}
        </div>
      )}
      <div className="chat-input">
        <textarea
          ref={inputRef}
          className="chat-input__field"
          placeholder="> inject prompt..."
          rows={1}
          maxLength={MAX_LENGTH}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={sending}
        />
        <button className="chat-input__send" onClick={handleSend} aria-label="Send">
          <i className="ti ti-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
