import { Navigate, useNavigate } from "react-router-dom";
import tasks from "../content/tasks.json";
import { useGameStore } from "../store/gameStore";
import ChatWindow from "../components/ChatWindow";
import "../theme/components.css";

export default function PlayPage() {
  const navigate = useNavigate();
  const currentTaskId = useGameStore((s) => s.currentTaskId);
  const completedTaskIds = useGameStore((s) => s.completedTaskIds);
  const task = tasks.find((t) => t.id === currentTaskId);

  if (!task) return <Navigate to="/" replace />;

  const isWon = completedTaskIds.includes(task.id);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
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
  );
}
