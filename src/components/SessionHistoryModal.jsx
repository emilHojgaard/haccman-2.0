import { useEffect, useState } from "react";
import { getOwnSessionsForBot, loadSessionMessages } from "../services/sessionService";
import tasks from "../content/tasks.json";
import "../theme/components.css";

function formatDateTime(iso) {
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

export default function SessionHistoryModal({ botId, onClose }) {
  const [sessions, setSessions] = useState(null);
  const [error, setError] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [thread, setThread] = useState(null);

  useEffect(() => {
    getOwnSessionsForBot(botId)
      .then(setSessions)
      .catch((e) => setError(e.message || "Failed to load sessions"));
  }, [botId]);

  useEffect(() => {
    function onKey(e) {
      if (e.key !== "Escape") return;
      if (selectedSession) {
        e.stopPropagation();
        setSelectedSession(null);
      }
    }
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [selectedSession]);

  async function handleSelectSession(session) {
    setSelectedSession(session);
    setThread(null);
    try {
      setThread(await loadSessionMessages(session.id));
    } catch (e) {
      setError(e.message || "Failed to load transcript");
    }
  }

  const selectedTask = selectedSession
    ? tasks.find((t) => t.id === selectedSession.task_id)
    : null;

  return (
    <div className="info-modal-backdrop" onClick={onClose}>
      <div className="history-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="info-modal__header">
          {selectedSession ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
              <button className="history-modal__back" onClick={() => setSelectedSession(null)}>
                <i className="ti ti-arrow-left" aria-hidden="true" />
              </button>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {formatDateTime(selectedSession.started_at)}
              </span>
              {selectedSession.completed && (
                <span className="history-modal__cracked-badge">
                  <i className="ti ti-lock-open" aria-hidden="true" /> cracked
                </span>
              )}
            </div>
          ) : (
            <span>past attempts</span>
          )}
          <button className="chat-input__send" onClick={onClose} aria-label="Close" style={{ marginLeft: 12, flexShrink: 0 }}>
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        {error && <div className="terminal-error" style={{ margin: "0 0 10px" }}>{error}</div>}

        {/* List view */}
        {!selectedSession && (
          <div className="history-modal__list">
            {sessions === null && <div className="terminal-note">loading...</div>}
            {sessions?.length === 0 && <div className="terminal-note">no past attempts yet.</div>}
            {sessions?.map((s) => (
              <button
                key={s.id}
                className={`history-modal__item${s.completed ? " history-modal__item--cracked" : ""}`}
                onClick={() => handleSelectSession(s)}
              >
                <i className="ti ti-message" aria-hidden="true" style={{ opacity: 0.4 }} />
                <span className="history-modal__item-date">{formatDateTime(s.started_at)}</span>
                {s.completed && (
                  <span className="history-modal__cracked-badge">
                    <i className="ti ti-lock-open" aria-hidden="true" /> cracked
                  </span>
                )}
                <i className="ti ti-chevron-right" aria-hidden="true" style={{ marginLeft: "auto", opacity: 0.3 }} />
              </button>
            ))}
          </div>
        )}

        {/* Transcript view */}
        {selectedSession && (
          <div className="history-modal__transcript">
            <div className="admin-thread">
              {thread === null && <div className="terminal-note">loading...</div>}
              {thread?.map((m, i) => (
                <div key={i} className={`chat-bubble-wrap chat-bubble-wrap--${m.role === "user" ? "user" : "bot"}`}>
                  <div className={`chat-bubble chat-bubble--${m.role === "user" ? "user" : "bot"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {selectedSession.completed && selectedTask?.winExplanation && (
              <div className="history-modal__explanation">
                <div className="win-explanation__label">// why it worked</div>
                <div className="win-explanation__row" style={{ marginTop: 8 }}>
                  <span className="win-explanation__key">technique</span>
                  <span className="win-explanation__val">{selectedTask.winExplanation.technique}</span>
                </div>
                <p className="win-explanation__why">{selectedTask.winExplanation.why}</p>
                <div className="win-explanation__concept-block">
                  <span className="win-explanation__key">concept</span>
                  <p className="win-explanation__concept-text">{selectedTask.winExplanation.concept}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
