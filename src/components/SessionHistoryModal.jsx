import { useEffect, useState } from "react";
import { getOwnSessionsForBot, loadSessionMessages } from "../services/sessionService";
import tasks from "../content/tasks.json";
import "../theme/components.css";

function formatDateTime(iso) {
  return new Date(iso).toLocaleString([], { dateStyle: "short", timeStyle: "short" });
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
      <div className="info-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div className="info-modal__header">
          <span>{selectedSession ? "transcript" : "past attempts"}</span>
          <button className="chat-input__send" onClick={onClose} aria-label="Close">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        {error && <div className="terminal-error" style={{ marginBottom: 10 }}>{error}</div>}

        {!selectedSession && (
          <div className="admin-list">
            {sessions === null && <div className="terminal-note">loading...</div>}
            {sessions?.length === 0 && <div className="terminal-note">no past attempts yet.</div>}
            {sessions?.map((s) => (
              <button key={s.id} className="admin-list-item" onClick={() => handleSelectSession(s)}>
                {formatDateTime(s.started_at)}
                {s.completed && <span style={{ color: "var(--hc-bot)", marginLeft: 8 }}>cracked</span>}
              </button>
            ))}
          </div>
        )}

        {selectedSession && (
          <>
            <button
              className="terminal-button"
              style={{ marginBottom: 10 }}
              onClick={() => setSelectedSession(null)}
            >
              <i className="ti ti-arrow-left" aria-hidden="true" /> back to list
            </button>

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
              <div className="win-explanation" style={{ marginTop: 16 }}>
                <div className="win-explanation__label">// why it worked</div>
                <div className="win-explanation__row">
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
          </>
        )}
      </div>
    </div>
  );
}
