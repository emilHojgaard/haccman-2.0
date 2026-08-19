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
            {/* Thread */}
            <div className="history-modal__thread">
              {thread === null && <div className="terminal-note">loading...</div>}
              {thread?.map((m, i) => (
                <div key={i} className={`history-modal__msg history-modal__msg--${m.role === "user" ? "user" : "bot"}`}>
                  <div className={`chat-bubble chat-bubble--${m.role === "user" ? "user" : "bot"}`}>
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="admin-strategy-tags">
                      {(m.strategy_tags?.length > 0) ? m.strategy_tags.map((tag) => (
                        <span key={tag} className="admin-strategy-tag">{tag.replace(/_/g, " ")}</span>
                      )) : (
                        <span className="admin-strategy-tag admin-strategy-tag--unidentified">unidentified</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Strategy panel */}
            {selectedSession.completed && (
              <div className="history-modal__strategy-panel">
                {(() => {
                  const allTags = [...new Set((thread ?? []).flatMap((m) => m.strategy_tags ?? []))];
                  return (
                    <>
                      <div className="win-explanation__label">
                        // strategies detected
                        {allTags.length > 0 && (
                          <span className="history-modal__strategy-count">{allTags.length}</span>
                        )}
                      </div>
                      {thread === null ? (
                        <div className="terminal-note" style={{ marginTop: 8 }}>loading...</div>
                      ) : allTags.length > 0 ? (
                        <div className="history-modal__strategy-tags">
                          {allTags.map((tag) => (
                            <span key={tag} className="history-modal__strategy-tag">{tag.replace(/_/g, " ")}</span>
                          ))}
                        </div>
                      ) : (
                        <div className="history-modal__strategy-tags">
                          <span className="history-modal__strategy-tag history-modal__strategy-tag--unidentified">unidentified</span>
                        </div>
                      )}

                      <div className="win-explanation__label" style={{ marginTop: 20 }}>// why it worked</div>
                      {allTags.length > 0 ? (
                        <p className="history-modal__cracking-strategy">
                          you cracked it using{" "}
                          {allTags.length === 1
                            ? <strong>{allTags[0].replace(/_/g, " ")}</strong>
                            : <>
                                {allTags.slice(0, -1).map((t, i) => (
                                  <span key={t}><strong>{t.replace(/_/g, " ")}</strong>{i < allTags.length - 2 ? ", " : ""}</span>
                                ))}
                                {" "}and <strong>{allTags[allTags.length - 1].replace(/_/g, " ")}</strong>
                              </>
                          }
                        </p>
                      ) : thread !== null && (
                        <p className="history-modal__cracking-strategy">
                          cracked with an <strong>unidentified strategy</strong>
                        </p>
                      )}
                      {selectedTask?.winExplanation && (
                        <>
                          <p className="win-explanation__why">{selectedTask.winExplanation.why}</p>
                          <div className="win-explanation__concept-block">
                            <span className="win-explanation__key">concept</span>
                            <p className="win-explanation__concept-text">{selectedTask.winExplanation.concept}</p>
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
