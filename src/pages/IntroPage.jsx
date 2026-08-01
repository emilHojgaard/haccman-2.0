import { useEffect } from "react";
import { useOnboarding, STEPS, MAX_NAME_LEN } from "./useOnboarding";
import bots from "../content/bots.json";
import { useSoundEffect } from "../theme/SoundEffectContext";
import "../theme/components.css";

export default function IntroPage() {
  const {
    stage, existingName, step, busy, error, form, isUsernameValid, isAgeValid,
    setForm, setStep, handleContinueAsCurrent, handlePlayAsSomeoneElse, nextOrSubmit,
  } = useOnboarding();
  const { playSoundEffect } = useSoundEffect();

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
    <div className="attract">
      <div className="attract__scan" aria-hidden="true" />
      <div className="attract__inner">
        <h1 className="attract__title">HACCMAN</h1>

        <ul className="attract__roster" aria-label="opponents">
          {bots.map((b) => (
            <li key={b.id} className={`attract__chip attract__chip--${b.difficulty}`}>
              {b.name}<span>&middot; {b.difficulty}</span>
            </li>
          ))}
        </ul>

        <div className="attract__entry">
          {stage === "loading" && <div className="attract__booting">booting&hellip;</div>}

          {stage === "gate" && (
            <>
              <p className="attract__prompt">welcome back, {existingName}</p>
              <div className="attract__buttons">
                <button className="attract__start" onClick={() => { playSoundEffect("select"); handleContinueAsCurrent(); }}>
                  &#9654; continue
                </button>
                <button className="terminal-button" onClick={handlePlayAsSomeoneElse} disabled={busy !== "none"}>
                  {busy === "switch" ? "preparing…" : "new player"}
                </button>
              </div>
            </>
          )}

          {stage === "form" && (
            <>
              <label className="attract__prompt" htmlFor="intro-field">
                {STEPS[step] === "username" ? "Insert your name" : "Enter your age"}
              </label>
              {STEPS[step] === "username" ? (
                <input
                  id="intro-field"
                  autoFocus
                  className="terminal-input attract__field"
                  maxLength={MAX_NAME_LEN}
                  placeholder="name"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                />
              ) : (
                <input
                  id="intro-field"
                  autoFocus
                  className="terminal-input attract__field"
                  placeholder="age"
                  inputMode="numeric"
                  value={form.age}
                  onChange={(e) => setForm((f) => ({ ...f, age: e.target.value.replace(/[^0-9]/g, "") }))}
                />
              )}

              <button
                className="attract__start"
                onClick={() => { playSoundEffect("select"); nextOrSubmit(); }}
                disabled={busy !== "none" || (STEPS[step] === "username" ? !isUsernameValid : !isAgeValid)}
              >
                {busy === "save"
                  ? "entering…"
                  : STEPS[step] === "username"
                  ? "▶ press start"
                  : "▶ enter the arcade"}
              </button>

              {error && <div className="terminal-error">{error}</div>}
            </>
          )}
        </div>

        <p className="attract__note">
          by playing, you accept that the info entered here and your interactions with the
          bots (text and timestamps) are saved and analysed to improve the game.
        </p>
      </div>
    </div>
  );
}
