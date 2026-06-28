import { Navigate } from "react-router-dom";
import tasks from "../content/tasks.json";
import { useGameStore } from "../store/gameStore";
import ChatWindow from "../components/ChatWindow";

export default function PlayPage() {
  const currentTaskId = useGameStore((s) => s.currentTaskId);
  const task = tasks.find((t) => t.id === currentTaskId);

  if (!task) return <Navigate to="/" replace />;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <ChatWindow task={task} />
    </div>
  );
}
