import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bots from "../content/bots.json";
import tasks from "../content/tasks.json";
import { useGameStore } from "../store/gameStore";
import { startSession, getCrackedBotIds } from "../services/sessionService";
import { useSoundEffect } from "../theme/SoundEffectContext";
import "../theme/components.css";

export default function ChooseBotPage() {
  const navigate = useNavigate();
  const selectBot = useGameStore((s) => s.selectBot);
  const setSession = useGameStore((s) => s.setSession);
  const { playSoundEffect } = useSoundEffect();
  const [error, setError] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [crackedBotIds, setCrackedBotIds] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    getCrackedBotIds()
      .then(setCrackedBotIds)
      .catch((e) => console.warn("Failed to load cracked bots:", e.message));
  }, []);

  useEffect(() => {
    cardRefs.current[focusedIndex]?.focus({ preventScroll: true });
  }, [focusedIndex]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") return navigate("/");
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((i) => (i + 1) % bots.length);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
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
  }, [navigate, focusedIndex]);

  function isCracked(bot) {
    return crackedBotIds.includes(bot.id);
  }

  async function handlePick(bot) {
    setError("");
    playSoundEffect("select");
    try {
      const task = tasks.find((t) => t.botId === bot.id);
      selectBot(bot.id, task.id);
      const session = await startSession(bot.id, task.id);
      setSession(session.id);
      navigate("/play");
    } catch (e) {
      console.error("Failed to start session:", e);
      setError(e.message || "Failed to start session");
    }
  }

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
            {isCracked(bot) && (
              <div className="bot-card__cracked">
                <i className="ti ti-check" aria-hidden="true" /> cracked
              </div>
            )}
            <img src={bot.image} alt="" className="bot-card__avatar" />
            <div className="bot-card__name">{bot.name}</div>
            <div className="bot-card__description">{bot.inGameDescription}</div>
          </button>
        ))}
      </div>
      <div className="terminal-note" style={{ marginTop: 20, textAlign: "center" }}>
        use arrow keys + enter, or esc to go back
      </div>
    </div>
  );
}
