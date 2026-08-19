import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import tasks from "../content/tasks.json";
import bots from "../content/bots.json";
import { useGameStore } from "../store/gameStore";
import { startSession, deleteSession, loadSessionMessages } from "../services/sessionService";
import { useSoundEffect } from "../theme/SoundEffectContext";
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
  const { playMusic, stopMusic, playSoundEffect } = useSoundEffect();

  function maybeDeleteEmptySession() {
    const { sessionId: sid, messages: msgs } = useGameStore.getState();
    if (sid && msgs.filter((m) => m.role === "user").length === 0) {
      deleteSession(sid).catch(() => {});
    }
  }
  const task = tasks.find((t) => t.id === currentTaskId);
  const bot = task ? bots.find((b) => b.id === task.botId) : null;
  const [showHistory, setShowHistory] = useState(false);
  const [showWinOverlay, setShowWinOverlay] = useState(false);
  const [retryError, setRetryError] = useState("");
  const [winTags, setWinTags] = useState(null);

  useEffect(() => {
    playMusic(1);
    return () => stopMusic();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sessionWon) return;
    setShowWinOverlay(true);
    setWinTags(null);
    const { sessionId } = useGameStore.getState();
    const timer = setTimeout(async () => {
      try {
        const msgs = await loadSessionMessages(sessionId);
        const tags = [...new Set(msgs.flatMap((m) => m.strategy_tags ?? []))];
        setWinTags(tags);
      } catch {
        setWinTags([]);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [sessionWon]);

  useEffect(() => {
    function onKey(e) {
      if (e.key !== "Escape") return;
      if (showWinOverlay) {
        setShowWinOverlay(false);
      } else {
        maybeDeleteEmptySession();
        navigate("/choose-bot");
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate, showWinOverlay]);

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
          {showWinOverlay && (
            <div className="win-overlay">
              <div className="win-overlay__title">&gt;&gt; TASK CRACKED</div>
              <div className="win-overlay__subtitle">you got the bot to break its own rules.</div>
              {retryError && <div className="terminal-error">{retryError}</div>}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <button className="terminal-button" onClick={handleTryAgain}>
                  try again
                </button>
                <button className="terminal-button" onClick={() => { playSoundEffect("click"); setShowHistory(true); }}>
                  past attempts
                </button>
                <button className="terminal-button" onClick={() => { maybeDeleteEmptySession(); navigate("/choose-bot"); }}>
                  choose another bot
                </button>
              </div>
              {task.winExplanation && (
                <div className="win-explanation">
                  <div className="win-explanation__label">// strategies detected</div>
                  {winTags === null ? (
                    <div className="terminal-note" style={{ margin: "6px 0 12px" }}>classifying...</div>
                  ) : winTags.length === 0 ? (
                    <>
                      <div className="history-modal__strategy-tags" style={{ margin: "6px 0 4px" }}>
                        <span className="history-modal__strategy-tag history-modal__strategy-tag--unidentified">unidentified</span>
                      </div>
                      <p className="history-modal__cracking-strategy" style={{ marginBottom: 12 }}>
                        cracked with an <strong>unidentified strategy</strong>
                      </p>
                    </>
                  ) : (
                    <div className="history-modal__strategy-tags" style={{ margin: "6px 0 12px" }}>
                      {winTags.map((tag) => (
                        <span key={tag} className="history-modal__strategy-tag">{tag.replace(/_/g, " ")}</span>
                      ))}
                    </div>
                  )}
                  <div className="win-explanation__label">// why it worked</div>
                  <p className="win-explanation__why">{task.winExplanation.why}</p>
                  <div className="win-explanation__concept-block">
                    <span className="win-explanation__key">concept</span>
                    <p className="win-explanation__concept-text">{task.winExplanation.concept}</p>
                  </div>
                </div>
              )}
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
