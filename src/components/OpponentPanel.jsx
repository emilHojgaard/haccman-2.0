import { useEffect, useState } from "react";
import SessionHistoryModal from "./SessionHistoryModal";
import "../theme/components.css";

export default function OpponentPanel({ bot }) {
  const [showInfo, setShowInfo] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!showInfo && !showHistory) return;
    function onKey(e) {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setShowInfo(false);
      setShowHistory(false);
    }
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [showInfo, showHistory]);

  return (
    <div>
      <div className="opponent-panel">
        <div className="opponent-panel__name">{bot.name}</div>
        <img src={bot.image} alt="" className="opponent-panel__avatar" />
        <div className="opponent-panel__description">{bot.inGameDescription}</div>
        <button className="terminal-button" onClick={() => setShowInfo(true)}>
          <i className="ti ti-info-circle" aria-hidden="true" /> how this bot works
        </button>
      </div>

      <button className="terminal-button" style={{ width: "100%", marginTop: 12 }} onClick={() => setShowHistory(true)}>
        <i className="ti ti-history" aria-hidden="true" /> past attempts
      </button>

      {showInfo && (
        <div className="info-modal-backdrop" onClick={() => setShowInfo(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="info-modal__header">
              <span>{bot.name}</span>
              <button className="chat-input__send" onClick={() => setShowInfo(false)} aria-label="Close">
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>
            <div className="info-modal__body">
              {bot.concept && (
                <div className="info-modal__concept">
                  <div className="info-modal__concept-name">{bot.concept.name}</div>
                  <div className="info-modal__concept-tagline">{bot.concept.tagline}</div>
                  <p className="info-modal__concept-desc">{bot.concept.description}</p>
                </div>
              )}
              {bot.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {showHistory && <SessionHistoryModal botId={bot.id} onClose={() => setShowHistory(false)} />}
    </div>
  );
}
