import { useState } from "react";
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

  async function handlePick(bot) {
    setError("");
    try {
      const task = tasks.find((t) => t.botId === bot.id);
      selectBot(bot.id, task.id);
      const session = await startSession(bot.id);
      setSession(session.id);
      navigate("/play");
    } catch (e) {
      console.error("Failed to start session:", e);
      setError(e.message || "Failed to start session");
    }
  }

  return (
    <div>
      {error && (
        <div className="terminal-error" style={{ marginBottom: 16, fontFamily: "var(--hc-font-mono)" }}>
          {error}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
      {bots.map((bot) => (
        <button
          key={bot.id}
          onClick={() => handlePick(bot)}
          style={{
            background: "var(--hc-surface)",
            border: "0.5px solid var(--hc-user-border)",
            borderRadius: "var(--hc-radius)",
            padding: 16,
            color: "var(--hc-user)",
            fontFamily: "var(--hc-font-mono)",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <img src={bot.image} alt="" width={48} height={48} style={{ borderRadius: 8 }} />
          <div style={{ marginTop: 10, fontSize: 13, color: "var(--hc-bot)" }}>{bot.name}</div>
          <div style={{ marginTop: 4, fontSize: 11, color: "var(--hc-text-dim)" }}>
            {bot.inGameDescription}
          </div>
        </button>
      ))}
      </div>
    </div>
  );
}
