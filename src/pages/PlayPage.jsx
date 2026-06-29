import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import tasks from "../content/tasks.json";
import bots from "../content/bots.json";
import { useGameStore } from "../store/gameStore";
import ChatWindow from "../components/ChatWindow";
import OpponentPanel from "../components/OpponentPanel";
import GoalBanner from "../components/GoalBanner";
import "../theme/components.css";

export default function PlayPage() {
  const navigate = useNavigate();
  const currentTaskId = useGameStore((s) => s.currentTaskId);
  const completedTaskIds = useGameStore((s) => s.completedTaskIds);
  const task = tasks.find((t) => t.id === currentTaskId);
  const bot = task ? bots.find((b) => b.id === task.botId) : null;

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") navigate("/choose-bot");
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate]);

  if (!task) return <Navigate to="/" replace />;

  const isWon = completedTaskIds.includes(task.id);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
      <GoalBanner task={task} />
      <div className="play-layout">
        <div className="play-layout__chat" style={{ position: "relative" }}>
          <ChatWindow task={task} />
          {isWon && (
            <div className="win-overlay">
              <div className="win-overlay__title">&gt;&gt; TASK CRACKED</div>
              <div className="win-overlay__subtitle">you got the bot to break its own rules.</div>
              <button className="terminal-button" onClick={() => navigate("/choose-bot")}>
                choose another bot
              </button>
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
    </div>
  );
}
