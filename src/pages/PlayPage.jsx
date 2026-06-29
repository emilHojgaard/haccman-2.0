import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import tasks from "../content/tasks.json";
import bots from "../content/bots.json";
import { useGameStore } from "../store/gameStore";
import { startSession } from "../services/sessionService";
import ChatWindow from "../components/ChatWindow";
import OpponentPanel from "../components/OpponentPanel";
import GoalBanner from "../components/GoalBanner";
import SessionHistoryModal from "../components/SessionHistoryModal";
import "../theme/components.css";

export default function PlayPage() {
  const navigate = useNavigate();
  const currentTaskId = useGameStore((s) => s.currentTaskId);
  const sessionWon = useGameStore((s) => s.sessionWon);
  const selectBot = useGameStore((s) => s.selectBot);
  const setSession = useGameStore((s) => s.setSession);
  const task = tasks.find((t) => t.id === currentTaskId);
  const bot = task ? bots.find((b) => b.id === task.botId) : null;
  const [showHistory, setShowHistory] = useState(false);
  const [retryError, setRetryError] = useState("");

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") navigate("/choose-bot");
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate]);

  if (!task) return <Navigate to="/" replace />;

  async function handleTryAgain() {
    setRetryError("");
    try {
      selectBot(bot.id, task.id);
      const session = await startSession(bot.id, task.id);
      setSession(session.id);
    } catch (e) {
      console.error("Failed to start new session:", e);
      setRetryError(e.message || "Failed to start a new attempt");
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
      <GoalBanner task={task} bot={bot} />
      <div className="play-layout">
        <div className="play-layout__chat" style={{ position: "relative" }}>
          <ChatWindow task={task} />
          {sessionWon && (
            <div className="win-overlay">
              <div className="win-overlay__title">&gt;&gt; TASK CRACKED</div>
              <div className="win-overlay__subtitle">you got the bot to break its own rules.</div>
              {retryError && <div className="terminal-error">{retryError}</div>}
              <div style={{ display: "flex", gap: 12 }}>
                <button className="terminal-button" onClick={handleTryAgain}>
                  try again
                </button>
                <button className="terminal-button" onClick={() => setShowHistory(true)}>
                  past attempts
                </button>
                <button className="terminal-button" onClick={() => navigate("/choose-bot")}>
                  choose another bot
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="play-layout__side">
          <OpponentPanel bot={bot} />
          <div className="terminal-note" style={{ marginTop: 12, textAlign: "center" }}>
            press esc to leave this challenge
          </div>
        </div>
      </div>

      {showHistory && <SessionHistoryModal botId={bot.id} onClose={() => setShowHistory(false)} />}
    </div>
  );
}
