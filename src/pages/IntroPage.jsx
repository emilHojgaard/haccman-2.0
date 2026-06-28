import { useEffect } from "react";
import { useOnboarding, STEPS } from "./useOnboarding";
import "../theme/components.css";

export default function IntroPage() {
  const {
    stage, existingName, step, busy, error, form, isUsernameValid, isAgeValid,
    setForm, setStep, handleContinueAsCurrent, handlePlayAsSomeoneElse, nextOrSubmit,
  } = useOnboarding();

  useEffect(() => {
    function onKey(e) {
      if (stage !== "form") return;
      if (e.key === "Enter") nextOrSubmit();
      if (e.key === "Escape") setStep(0);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [stage, nextOrSubmit, setStep]);

  return (
    <div className="terminal-screen" style={{ paddingTop: 60 }}>
      <div style={{ color: "var(--hc-bot)", fontSize: 18 }}>HACCMAN_2.0</div>
      <div style={{ color: "var(--hc-text-dim)", fontSize: 12 }}>
        an arcade game for jailbreaking LLMs
      </div>

      {stage === "loading" && <div>loading...</div>}

      {stage === "gate" && (
        <div style={{ display: "flex", gap: 16 }}>
          <button className="terminal-button" onClick={handleContinueAsCurrent}>
            play as "{existingName}"
          </button>
          <button className="terminal-button" onClick={handlePlayAsSomeoneElse} disabled={busy !== "none"}>
            {busy === "switch" ? "preparing..." : "play as someone else"}
          </button>
        </div>
      )}

      {stage === "form" && (
        <>
          {STEPS[step] === "username" && (
            <div className="terminal-screen">
              <div className="terminal-step__title">&gt;&gt; enter a username</div>
              <input
                autoFocus
                className="terminal-input"
                maxLength={12}
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              />
            </div>
          )}

          {STEPS[step] === "age" && (
            <div className="terminal-screen">
              <div className="terminal-step__title">&gt;&gt; enter your age</div>
              <input
                autoFocus
                className="terminal-input"
                value={form.age}
                onChange={(e) =>
                  setForm((f) => ({ ...f, age: e.target.value.replace(/[^0-9]/g, "") }))
                }
              />
            </div>
          )}

          {STEPS[step] === "gender" && (
            <div className="terminal-screen">
              <div className="terminal-step__title">&gt;&gt; gender you identify with</div>
              <div className="terminal-option-group">
                {["Female", "Male", "Other"].map((g) => (
                  <label key={g}>
                    <input
                      type="radio"
                      name="gender"
                      checked={form.gender === g}
                      onChange={() => setForm((f) => ({ ...f, gender: g }))}
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>
          )}

          {STEPS[step] === "familiarity" && (
            <div className="terminal-screen">
              <div className="terminal-step__title">&gt;&gt; hacking/jailbreaking experience</div>
              <div className="terminal-option-group">
                {["Beginner", "Familiar", "Advanced"].map((f) => (
                  <label key={f}>
                    <input
                      type="radio"
                      name="familiarity"
                      checked={form.familiarity === f}
                      onChange={() => setForm((s) => ({ ...s, familiarity: f }))}
                    />
                    {f}
                  </label>
                ))}
              </div>
              {isUsernameValid && isAgeValid && (
                <button className="terminal-button" onClick={nextOrSubmit} disabled={busy !== "none"}>
                  {busy === "save" ? "entering..." : "press enter to access game"}
                </button>
              )}
            </div>
          )}

          {error && <div className="terminal-error">{error}</div>}
        </>
      )}

      <div className="terminal-note">
        by playing this game, you accept that the info entered here and your interactions
        with the LLM (text and timestamps) will be saved and analysed for research purposes.
      </div>
    </div>
  );
}
