import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bots from "../content/bots.json";
import tasks from "../content/tasks.json";
import { useGameStore } from "../store/gameStore";
import { startSession, getCrackedBotIds, getCrackedTaskIds } from "../services/sessionService";
import { savePlayerProfile } from "../services/playerService";
import { getCurrentUser } from "../services/playerService";
import { useSoundEffect } from "../theme/SoundEffectContext";
import "../theme/components.css";

export default function ChooseBotPage() {
  const navigate = useNavigate();
  const selectBot = useGameStore((s) => s.selectBot);
  const setSession = useGameStore((s) => s.setSession);
  const pendingProfile = useGameStore((s) => s.pendingProfile);
  const clearPendingProfile = useGameStore((s) => s.clearPendingProfile);
  const { playSoundEffect } = useSoundEffect();
  const [error, setError] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [crackedBotIds, setCrackedBotIds] = useState([]);
  const [crackedTaskIds, setCrackedTaskIds] = useState([]);
  const [taskPickerBot, setTaskPickerBot] = useState(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    getCrackedBotIds()
      .then(setCrackedBotIds)
      .catch((e) => console.warn("Failed to load cracked bots:", e.message));
    getCrackedTaskIds()
      .then(setCrackedTaskIds)
      .catch((e) => console.warn("Failed to load cracked tasks:", e.message));
  }, []);

  useEffect(() => {
    if (!taskPickerBot) {
      const card = cardRefs.current[focusedIndex];
      if (card) {
        card.focus({ preventScroll: true });
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [focusedIndex, taskPickerBot]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (taskPickerBot) return setTaskPickerBot(null);
        return navigate("/");
      }
      if (taskPickerBot) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        playSoundEffect("navigate");
        setFocusedIndex((i) => (i + 1) % bots.length);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        playSoundEffect("navigate");
        setFocusedIndex((i) => (i - 1 + bots.length) % bots.length);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        handlePick(bots[focusedIndex]);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, focusedIndex, taskPickerBot]);

  function isCracked(bot) {
    return crackedBotIds.includes(bot.id);
  }

  const difficultyOrder = { easy: 0, medium: 1, hard: 2 };

  function botTasks(bot) {
    return tasks
      .filter((t) => t.botId === bot.id)
      .sort((a, b) => (difficultyOrder[a.difficulty] ?? 9) - (difficultyOrder[b.difficulty] ?? 9));
  }

  function handlePick(bot) {
    setError("");
    const available = botTasks(bot);
    if (available.length > 1) {
      playSoundEffect("click");
      setTaskPickerBot(bot);
      return;
    }
    playSoundEffect("select");
    startGame(bot, available[0]);
  }

  async function startGame(bot, task) {
    setTaskPickerBot(null);
    setError("");
    try {
      if (pendingProfile) {
        const user = await getCurrentUser();
        await savePlayerProfile(user.id, pendingProfile);
        clearPendingProfile();
      }
      selectBot(bot.id, task.id);
      const session = await startSession(bot.id, task.id);
      setSession(session.id);
      navigate("/play");
    } catch (e) {
      console.error("Failed to start session:", e);
      setError(e.message || "Failed to start session");
    }
  }

  const pickerTasks = taskPickerBot ? botTasks(taskPickerBot) : [];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div
        style={{
          fontFamily: "var(--hc-font-mono)",
          color: "var(--hc-bot)",
          fontSize: 18,
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        &gt;&gt; choose your opponent
      </div>
      {error && (
        <div className="terminal-error" style={{ marginBottom: 16, fontFamily: "var(--hc-font-mono)" }}>
          {error}
        </div>
      )}
      <div className="bot-grid">
        {bots.map((bot, i) => (
          <button
            key={bot.id}
            ref={(el) => (cardRefs.current[i] = el)}
            className="bot-card"
            onClick={() => handlePick(bot)}
            onFocus={() => setFocusedIndex(i)}
          >
            <img src={bot.image} alt="" className="bot-card__avatar" />
            <div className="bot-card__body">
              <div className="bot-card__header">
                <span className="bot-card__name">{bot.name}</span>
                {bot.concept && (
                  <div className="bot-card__concept">{bot.concept.name}</div>
                )}
              </div>
              <div className="bot-card__content">
                <div className="bot-card__description">{bot.inGameDescription}</div>
                <div className="bot-card__missions">
                  <div className="bot-card__missions-label">missions</div>
                  {botTasks(bot).map((t) => (
                    <div key={t.id} className="bot-card__mission">
                      <span className={`bot-card__difficulty bot-card__difficulty--${t.difficulty}`}>
                        {t.difficulty}
                      </span>
                      <span className="bot-card__mission-title">{t.title}</span>
                      {crackedTaskIds.includes(t.id) && (
                        <span className="bot-card__cracked-badge">
                          <i className="ti ti-lock-open" aria-hidden="true" /> cracked
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bot-card__footer">
                <i className="ti ti-chevron-right" aria-hidden="true" style={{ marginLeft: "auto", opacity: 0.25 }} />
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="terminal-note" style={{ marginTop: 20, textAlign: "center" }}>
        use arrow keys + enter, or esc to go back
      </div>

      {taskPickerBot && (
        <div className="info-modal-backdrop" onClick={() => setTaskPickerBot(null)}>
          <div className="task-picker" onClick={(e) => e.stopPropagation()}>
            <div className="info-modal__header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src={taskPickerBot.image} alt="" className="task-picker__avatar" />
                <span>{taskPickerBot.name} — choose a mission</span>
              </div>
              <button className="chat-input__send" onClick={() => setTaskPickerBot(null)} aria-label="Close">
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>
            <div className="task-picker__list">
              {pickerTasks.map((task) => {
                const isTaskCracked = crackedTaskIds.includes(task.id);
                return (
                  <button
                    key={task.id}
                    className={`task-picker__item${isTaskCracked ? " task-picker__item--cracked" : ""}`}
                    onClick={() => { playSoundEffect("select"); startGame(taskPickerBot, task); }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="task-picker__item-header">
                        <span className={`bot-card__difficulty bot-card__difficulty--${task.difficulty}`}>
                          {task.difficulty}
                        </span>
                        <span className="task-picker__title">{task.title || "mission"}</span>
                        {isTaskCracked && (
                          <span className="history-modal__cracked-badge">
                            <i className="ti ti-lock-open" aria-hidden="true" /> cracked
                          </span>
                        )}
                      </div>
                      <div className="task-picker__desc">
                        {task.task.split("\n\n").pop()}
                      </div>
                    </div>
                    <i className="ti ti-chevron-right" aria-hidden="true" style={{ opacity: 0.3, flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
