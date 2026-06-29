import { useState } from "react";
import "../theme/components.css";

export default function OpponentPanel({ bot }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="opponent-panel">
      <div className="opponent-panel__name">{bot.name}</div>
      <img src={bot.image} alt="" className="opponent-panel__avatar" />
      <div className="opponent-panel__description">{bot.inGameDescription}</div>
      <button className="terminal-button" onClick={() => setShowInfo(true)}>
        <i className="ti ti-info-circle" aria-hidden="true" /> how this bot works
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
              {bot.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
