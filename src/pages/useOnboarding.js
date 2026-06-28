import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  getPlayerProfile,
  signInAnonPlayer,
  signOutPlayer,
  savePlayerProfile,
} from "../services/playerService";

export const MAX_NAME_LEN = 12;
const STEPS = ["username", "age", "gender", "familiarity"];

export function useOnboarding() {
  const [stage, setStage] = useState("loading");
  const [existingName, setExistingName] = useState("");
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState("none");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", age: "", gender: "", familiarity: "" });
  const navigate = useNavigate();

  useEffect(() => {
    let stale = false;
    (async () => {
      const user = await getCurrentUser();
      if (!user) {
        if (!stale) setStage("form");
        return;
      }
      const profile = await getPlayerProfile(user.id);
      if (stale) return;
      if (profile?.username) {
        setExistingName(profile.username);
        setStage("gate");
      } else {
        setStage("form");
      }
    })().catch((e) => setError(e.message || "Load failed"));
    return () => { stale = true; };
  }, []);

  const isUsernameValid = form.username.trim().length > 0 && form.username.length <= MAX_NAME_LEN;
  const isAgeValid = !isNaN(form.age) && +form.age >= 8 && +form.age <= 120;

  const handleContinueAsCurrent = useCallback(() => navigate("/choose-bot", { replace: true }), [navigate]);

  const handlePlayAsSomeoneElse = useCallback(async () => {
    setBusy("switch");
    setError("");
    try {
      await signOutPlayer();
      setStage("form");
      setStep(0);
      setForm({ username: "", age: "", gender: "", familiarity: "" });
    } catch (e) {
      setError(e.message || "Failed to switch user");
    } finally {
      setBusy("none");
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    setBusy("save");
    setError("");
    try {
      const user = await signInAnonPlayer();
      await savePlayerProfile(user.id, {
        username: form.username.trim(),
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        familiarity: form.familiarity || null,
      });
      navigate("/choose-bot");
    } catch (e) {
      setError(e.message || "Failed to save profile");
    } finally {
      setBusy("none");
    }
  }, [form, navigate]);

  const nextOrSubmit = useCallback(() => {
    const current = STEPS[step];
    if (current === "username" && !isUsernameValid) return setError("Enter a username (max 12 characters)");
    if (current === "age" && !isAgeValid) return setError("Enter an age between 8 and 120");
    if (current === "gender" && !form.gender) return setError("Select a gender");
    if (current === "familiarity" && !form.familiarity) return setError("Select your familiarity level");

    setError("");
    if (step === STEPS.length - 1) handleSubmit();
    else setStep(step + 1);
  }, [step, isUsernameValid, isAgeValid, form, handleSubmit]);

  return {
    stage, existingName, step, busy, error, form, isUsernameValid, isAgeValid,
    setForm, setStep, handleContinueAsCurrent, handlePlayAsSomeoneElse, nextOrSubmit,
  };
}

export { STEPS };
