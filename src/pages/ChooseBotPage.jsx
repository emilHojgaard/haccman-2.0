import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bots from "../content/bots.json";
import tasks from "../content/tasks.json";
import { useGameStore } from "../store/gameStore";
import { startSession } from "../services/sessionService";
import "../theme/components.css";

export default function ChooseBotPage() {
  const navigate = useNavigate();
  const selectBot = useGameStore((s) => s.selectBot);
  const setSession = useGameStore((s) => s.setSession);
  const [error, setError] = useState("");

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") navigate("/");
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate]);

  async function handlePick(bot) {
    setError("");
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
      {error && (
        <div className="terminal-error" style={{ marginBottom: 16, fontFamily: "var(--hc-font-mono)" }}>
          {error}
        </div>
      )}
      <div className="bot-grid">
        {bots.map((bot) => (
          <button key={bot.id} className="bot-card" onClick={() => handlePick(bot)}>
            <img src={bot.image} alt="" className="bot-card__avatar" />
            <div className="bot-card__name">{bot.name}</div>
            <div className="bot-card__description">{bot.inGameDescription}</div>
          </button>
        ))}
      </div>
      <div className="terminal-note" style={{ marginTop: 20, textAlign: "center" }}>
        press esc to go back
      </div>
    </div>
  );
}
