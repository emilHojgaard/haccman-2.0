import { useEffect, useState } from "react";
import {
  signInAdmin,
  signOutAdmin,
  getAllPlayers,
  getSessionsByUser,
  loadSessionThread,
} from "../services/adminService";
import "../theme/components.css";

function downloadTxt(thread, username, sessionId) {
  const lines = thread.map(
    (m) => `[${new Date(m.created_at).toLocaleString()}] ${m.role.toUpperCase()}\n${m.content}\n`
  );
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `conversation_${username ?? "user"}_${sessionId.slice(0, 8)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [thread, setThread] = useState([]);

  useEffect(() => {
    return () => signOutAdmin();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      await signInAdmin(email, password);
      setLoggedIn(true);
      setPlayers(await getAllPlayers());
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  async function handleSelectPlayer(player) {
    setSelectedPlayer(player);
    setSelectedSessionId(null);
    setThread([]);
    setSessions(await getSessionsByUser(player.id));
  }

  async function handleSelectSession(sessionId) {
    setSelectedSessionId(sessionId);
    setThread(await loadSessionThread(sessionId));
  }

  if (!loggedIn) {
    return (
      <form onSubmit={handleLogin} className="terminal-screen" style={{ paddingTop: 60 }}>
        <div className="terminal-step__title">&gt;&gt; admin login</div>
        <input className="terminal-input" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="terminal-input" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="terminal-button" type="submit">log in</button>
        {error && <div className="terminal-error">{error}</div>}
      </form>
    );
  }

  return (
    <div style={{ display: "flex", gap: 24, fontFamily: "var(--hc-font-mono)", color: "var(--hc-user)" }}>
      <div style={{ flex: 1 }}>
        <div className="terminal-step__title" style={{ marginBottom: 10 }}>players</div>
        <div className="admin-list">
          {players.map((p) => (
            <button key={p.id} className="admin-list-item" onClick={() => handleSelectPlayer(p)}>
              {p.username || "(no name)"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {selectedPlayer && (
          <>
            <div className="terminal-step__title" style={{ marginBottom: 10 }}>
              sessions for {selectedPlayer.username}
            </div>
            <div className="admin-list">
              {sessions.map((s) => (
                <button key={s.id} className="admin-list-item" onClick={() => handleSelectSession(s.id)}>
                  bot {s.bot_id} — {new Date(s.started_at).toLocaleString()}
                </button>
              ))}
              {sessions.length === 0 && <div className="terminal-note">no sessions found.</div>}
            </div>
          </>
        )}
      </div>

      <div style={{ flex: 2 }}>
        {selectedSessionId && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div className="terminal-step__title">thread</div>
              <button
                className="terminal-button"
                onClick={() => downloadTxt(thread, selectedPlayer?.username, selectedSessionId)}
              >
                download .txt
              </button>
            </div>
            <div className="admin-thread">
              {thread.map((m, i) => (
                <div key={i} className={`chat-bubble chat-bubble--${m.role === "user" ? "user" : "bot"}`}>
                  {m.content}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
