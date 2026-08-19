import { useState } from "react";
import "../theme/components.css";

export default function GoalBanner({ task, bot }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="goal-banner">
      <button
        className="goal-banner__badge"
        onClick={() => setShowInfo(true)}
        aria-label={`About ${bot.name}`}
      >
        <img src={bot.image} alt="" />
      </button>
      <div className="goal-banner__label">&gt;&gt;&gt; jailbreak challenge</div>
      <div className="goal-banner__goal">{task.task}</div>

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
              <img src={bot.image} alt="" className="opponent-panel__avatar" style={{ alignSelf: "center" }} />
              <p>{bot.inGameDescription}</p>
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
