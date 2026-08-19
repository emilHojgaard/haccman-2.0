import { useEffect, useRef, useState } from "react";
import {
  signInAdmin, signOutAdmin,
  getAllPlayers, getSessionsByUser, loadSessionThread,
} from "../services/adminService";
import bots from "../content/bots.json";
import tasks from "../content/tasks.json";
import "../theme/components.css";

// ─── helpers ──────────────────────────────────────────────────────────────────
function botName(id)  { return bots.find((b) => b.id === id)?.name  ?? `bot ${id}`; }
function taskTitle(id){ return tasks.find((t) => t.id === id)?.title ?? `task ${id}`; }

function fmt(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" });
}

function downloadTxt(thread, username, sessionId) {
  const lines = thread.map(
    (m) => `[${fmt(m.created_at)}] ${m.role.toUpperCase()}\n${m.content}\n`
  );
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: `thread_${username ?? "user"}_${sessionId.slice(0,8)}.txt` });
  a.click();
  URL.revokeObjectURL(url);
}

// ─── bar chart row ─────────────────────────────────────────────────────────────
function BarRow({ label, wins, tests, color = "var(--hc-accent)", onClick, active }) {
  const pct = tests ? Math.round((wins / tests) * 100) : 0;
  return (
    <div
      className={`admin-bar-row${active ? " admin-bar-row--active" : ""}${onClick ? " admin-bar-row--clickable" : ""}`}
      onClick={onClick}
    >
      <div className="admin-bar-label">{label}</div>
      <div className="admin-bar-track">
        <div className="admin-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="admin-bar-stat">{pct}% <span className="admin-bar-frac">({wins}/{tests})</span></div>
    </div>
  );
}

// ─── thread panel ─────────────────────────────────────────────────────────────
function ThreadPanel({ thread, player, sessionId, onClose }) {
  return (
    <div className="admin-thread-panel">
      <div className="admin-thread-header">
        <span className="admin-section-label">transcript</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="admin-pill-btn" onClick={() => downloadTxt(thread, player?.username, sessionId)}>
            <i className="ti ti-download" /> .txt
          </button>
          <button className="admin-pill-btn" onClick={onClose}>
            <i className="ti ti-x" />
          </button>
        </div>
      </div>
      <div className="admin-thread">
        {thread.length === 0 && <div className="terminal-note">no messages.</div>}
        {thread.map((m, i) => (
          <div key={i} className={`admin-thread-msg admin-thread-msg--${m.role === "user" ? "user" : "bot"}`}>
            <div className={`chat-bubble chat-bubble--${m.role === "user" ? "user" : "bot"}`}>
              <div className="admin-thread-ts">{fmt(m.created_at)}</div>
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="admin-strategy-tags">
                {(m.strategy_tags?.length > 0) ? m.strategy_tags.map((tag) => (
                  <span key={tag} className="admin-strategy-tag">{tag.replace(/_/g, " ")}</span>
                )) : (
                  <span className="admin-strategy-tag admin-strategy-tag--unidentified">unidentified</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sessions tab ─────────────────────────────────────────────────────────────
function SessionsTab() {
  const [players, setPlayers]           = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [sessions, setSessions]         = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [thread, setThread]             = useState([]);
  const [loading, setLoading]           = useState(false);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    getAllPlayers().then(setPlayers).catch((e) => setSessionError(e.message));
  }, []);

  async function selectPlayer(p) {
    setSelectedPlayer(p);
    setSelectedSession(null);
    setThread([]);
    setSessionError("");
    setLoading(true);
    try { setSessions(await getSessionsByUser(p.id)); }
    catch (e) { setSessionError(e.message); }
    finally { setLoading(false); }
  }

  async function selectSession(s) {
    setSelectedSession(s);
    setSessionError("");
    setLoading(true);
    try { setThread(await loadSessionThread(s.id)); }
    catch (e) { setSessionError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="admin-sessions-layout">
      {/* Players sidebar */}
      <div className="admin-sidebar">
        <div className="admin-section-label">players</div>
        {players.length === 0 && <div className="terminal-note">no players yet.</div>}
        {players.map((p) => (
          <button
            key={p.id}
            className={`admin-list-item${selectedPlayer?.id === p.id ? " admin-list-item--active" : ""}`}
            onClick={() => selectPlayer(p)}
          >
            <i className="ti ti-user" style={{ opacity: 0.4 }} /> {p.username || "(anonymous)"}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      <div className="admin-sessions-col">
        {sessionError && (
          <div className="terminal-error" style={{ fontSize: 11, padding: "8px 0" }}>
            {sessionError.includes("permission") || sessionError.includes("RLS") || sessionError.includes("policy")
              ? "Permission denied. Add RLS policy in Supabase — see console for details."
              : sessionError}
          </div>
        )}
        {!selectedPlayer && !sessionError && (
          <div className="admin-empty">select a player to see their sessions</div>
        )}
        {selectedPlayer && (
          <>
            <div className="admin-section-label">{selectedPlayer.username} — sessions</div>
            {loading && !selectedSession && <div className="terminal-note">loading...</div>}
            {sessions.length === 0 && !loading && <div className="terminal-note">no sessions.</div>}
            {sessions.map((s) => (
              <button
                key={s.id}
                className={`admin-session-card${selectedSession?.id === s.id ? " admin-session-card--active" : ""}`}
                onClick={() => selectSession(s)}
              >
                <div className="admin-session-card__top">
                  <span className="admin-session-card__bot">{botName(s.bot_id)}</span>
                  {s.completed
                    ? <span className="admin-badge admin-badge--win"><i className="ti ti-lock-open" /> cracked</span>
                    : <span className="admin-badge admin-badge--fail">failed</span>
                  }
                </div>
                <div className="admin-session-card__task">{taskTitle(s.task_id)}</div>
                <div className="admin-session-card__date">{fmt(s.started_at)}</div>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Thread panel */}
      {selectedSession && (
        <ThreadPanel
          thread={thread}
          player={selectedPlayer}
          sessionId={selectedSession.id}
          onClose={() => { setSelectedSession(null); setThread([]); }}
        />
      )}
    </div>
  );
}

// ─── Test Results tab ─────────────────────────────────────────────────────────
function TestResultsTab() {
  const fileRef = useRef();
  const [runs, setRuns]           = useState([]);
  const [runIdx, setRunIdx]       = useState(0);

  useEffect(() => {
    fetch("/test-results.json")
      .then((r) => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then((parsed) => {
        const r = parsed.runs ?? [parsed];
        setRuns(r);
        setRunIdx(r.length - 1);
      })
      .catch(() => {}); // silently ignore — file may not exist yet
  }, []);
  const [filterStrategy, setFilterStrategy] = useState("all");
  const [filterResult, setFilterResult]     = useState("all");
  const [activeTranscript, setActiveTranscript] = useState(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const r = parsed.runs ?? [parsed];
        setRuns(r);
        setRunIdx(r.length - 1);
      } catch {
        alert("Could not parse file — make sure it's a valid test-results.json");
      }
    };
    reader.readAsText(file);
  }

  if (runs.length === 0) {
    return (
      <div className="admin-upload-area" onClick={() => fileRef.current.click()}>
        <input ref={fileRef} type="file" accept=".json" style={{ display: "none" }} onChange={handleFile} />
        <i className="ti ti-upload" style={{ fontSize: 28, opacity: 0.4 }} />
        <div className="admin-upload-label">click to upload test-results.json</div>
        <div className="admin-upload-hint">or copy scripts/test-results.json → public/test-results.json to auto-load</div>
      </div>
    );
  }

  const run      = runs[runIdx];
  const summary  = run.summary;
  const results  = run.results ?? [];
  const params   = run.run?.params ?? {};

  const strategies = Object.entries(summary.byStrategy ?? {}).sort((a,b) => b[1].successRate - a[1].successRate);
  const taskRows   = Object.entries(summary.byTask     ?? {}).sort((a,b) => b[1].successRate - a[1].successRate);

  const filtered = results.filter((r) => {
    if (filterStrategy !== "all" && r.strategy !== filterStrategy) return false;
    if (filterResult === "wins"  && !r.success) return false;
    if (filterResult === "fails" && r.success)  return false;
    return true;
  });

  const strategyKeys = [...new Set(results.map((r) => r.strategy))];

  return (
    <div className="admin-results-layout">
      {/* Run selector + file reload */}
      <div className="admin-results-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {runs.length > 1 && (
            <select
              className="admin-select"
              value={runIdx}
              onChange={(e) => setRunIdx(Number(e.target.value))}
            >
              {runs.map((r, i) => (
                <option key={i} value={i}>
                  {new Date(r.run?.timestamp).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })} — {r.summary?.totalTests} tests
                </option>
              ))}
            </select>
          )}
          <div className="admin-run-meta">
            {fmt(run.run?.timestamp)} · {summary.totalTests} runs · {Math.round(summary.successRate * 100)}% overall win rate
          </div>
        </div>
        <button className="admin-pill-btn" onClick={() => { setRuns([]); setActiveTranscript(null); }}>
          <i className="ti ti-upload" /> load new file
        </button>
      </div>

      <div className="admin-results-body">
        {/* Charts column */}
        <div className="admin-charts-col">
          <div className="admin-section-label" style={{ marginBottom: 12 }}>by strategy</div>
          {strategies.map(([key, s]) => (
            <BarRow
              key={key}
              label={s.label}
              wins={s.wins}
              tests={s.tests}
              active={filterStrategy === key}
              onClick={() => setFilterStrategy(filterStrategy === key ? "all" : key)}
            />
          ))}

          <div className="admin-section-label" style={{ margin: "24px 0 12px" }}>by task</div>
          {taskRows.map(([id, t]) => (
            <BarRow
              key={id}
              label={`${t.botName} / ${t.title}`}
              wins={t.wins}
              tests={t.tests}
              color="var(--hc-bot)"
            />
          ))}

          <div className="admin-section-label" style={{ margin: "24px 0 12px" }}>run parameters</div>
          <div className="admin-params">
            {[
              ["turns",      params.maxTurns],
              ["tokens/msg", params.maxTokensPerTurn],
              ["variations", params.variationsPerStrategy],
              ["model",      params.attackerModel],
            ].map(([k, v]) => (
              <div key={k} className="admin-param-row">
                <span className="admin-param-key">{k}</span>
                <span className="admin-param-val">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table column */}
        <div className="admin-table-col">
          <div className="admin-table-toolbar">
            <div className="admin-section-label">results — {filtered.length} shown</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["all","wins","fails"].map((v) => (
                <button
                  key={v}
                  className={`admin-pill-btn${filterResult === v ? " admin-pill-btn--active" : ""}`}
                  onClick={() => setFilterResult(v)}
                >{v}</button>
              ))}
              <select className="admin-select" value={filterStrategy} onChange={(e) => setFilterStrategy(e.target.value)}>
                <option value="all">all strategies</option>
                {strategyKeys.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>task</th>
                  <th>strategy</th>
                  <th>v</th>
                  <th>result</th>
                  <th>turns</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} className={r.success ? "admin-tr--win" : ""}>
                    <td><span className="admin-td-bot">{r.botName}</span><br /><span className="admin-td-task">{r.taskTitle}</span></td>
                    <td>{r.strategy}</td>
                    <td>{r.variation}</td>
                    <td>{r.success ? <span className="admin-badge admin-badge--win">win</span> : <span className="admin-badge admin-badge--fail">fail</span>}</td>
                    <td>{r.turnsUsed}</td>
                    <td>
                      <button className="admin-pill-btn" onClick={() => setActiveTranscript(activeTranscript === i ? null : i)}>
                        <i className={`ti ti-${activeTranscript === i ? "chevron-up" : "message"}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inline transcript */}
          {activeTranscript !== null && filtered[activeTranscript] && (
            <div className="admin-inline-transcript">
              <div className="admin-thread-header">
                <span className="admin-section-label">
                  {filtered[activeTranscript].botName} — {filtered[activeTranscript].strategy} v{filtered[activeTranscript].variation}
                </span>
                <button className="admin-pill-btn" onClick={() => setActiveTranscript(null)}>
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="admin-thread" style={{ maxHeight: 320 }}>
                {(filtered[activeTranscript].transcript ?? []).map((m, j) => (
                  <div key={j} className={`chat-bubble chat-bubble--${m.role === "user" ? "user" : "bot"}`}>
                    {m.content}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [tab, setTab]           = useState("sessions");

  useEffect(() => () => signOutAdmin(), []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      await signInAdmin(email, password);
      setLoggedIn(true);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  if (!loggedIn) {
    return (
      <form onSubmit={handleLogin} className="admin-login-form">
        <div className="terminal-step__title" style={{ marginBottom: 24 }}>&gt;&gt; admin login</div>
        <input
          className="terminal-input admin-login-input"
          placeholder="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <input
          className="terminal-input admin-login-input"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
        />
        <button className="terminal-button admin-login-input" type="submit">log in</button>
        {error && <div className="terminal-error" style={{ marginTop: 10 }}>{error}</div>}
      </form>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div className="admin-tabs">
          <button className={`admin-tab${tab === "sessions" ? " admin-tab--active" : ""}`} onClick={() => setTab("sessions")}>
            <i className="ti ti-messages" /> sessions
          </button>
          <button className={`admin-tab${tab === "testResults" ? " admin-tab--active" : ""}`} onClick={() => setTab("testResults")}>
            <i className="ti ti-chart-bar" /> test results
          </button>
        </div>
        <button className="admin-pill-btn" onClick={async () => { await signOutAdmin(); setLoggedIn(false); }}>
          <i className="ti ti-logout" /> logout
        </button>
      </div>

      <div className="admin-content">
        {tab === "sessions"    && <SessionsTab />}
        {tab === "testResults" && <TestResultsTab />}
      </div>
    </div>
  );
}
