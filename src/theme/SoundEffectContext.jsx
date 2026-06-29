import { createContext, useContext, useEffect, useState } from "react";

const SoundEffectContext = createContext(null);

const GAIN = { select: 0.3, navigate: 1.0, win: 2.0 };
const SOURCES = {
  select: "/sound/8-bit-game-7-188104.mp3",
  navigate: "/sound/8-bit-game-2-186976.mp3",
  win: "/sound/success-fanfare-trumpets-6185.mp3",
};

export function SoundEffectProvider({ children }) {
  const [audioContext, setAudioContext] = useState(null);
  const [soundBuffers, setSoundBuffers] = useState({});
  const [isMuted, setIsMuted] = useState(localStorage.getItem("isMuted") === "true");

  useEffect(() => {
    localStorage.setItem("isMuted", isMuted);
  }, [isMuted]);

  useEffect(() => {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctor();
    setAudioContext(ctx);

    async function loadSound(url) {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      return ctx.decodeAudioData(arrayBuffer);
    }

    Promise.all(Object.entries(SOURCES).map(async ([key, url]) => [key, await loadSound(url)]))
      .then((entries) => setSoundBuffers(Object.fromEntries(entries)))
      .catch((e) => console.warn("Failed to load sound effects:", e));

    function unlock() {
      ctx.resume().catch(() => {});
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    }
    window.addEventListener("click", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  async function playSoundEffect(type) {
    if (isMuted || !audioContext || !soundBuffers[type]) return;
    try {
      if (audioContext.state === "suspended") await audioContext.resume();
      const gain = audioContext.createGain();
      gain.gain.value = GAIN[type] ?? 1;
      gain.connect(audioContext.destination);

      const src = audioContext.createBufferSource();
      src.buffer = soundBuffers[type];
      src.connect(gain);
      src.start(0);
    } catch (e) {
      console.warn("playSoundEffect failed:", e);
    }
  }

  return (
    <SoundEffectContext.Provider value={{ playSoundEffect, isMuted, setIsMuted }}>
      {children}
    </SoundEffectContext.Provider>
  );
}

export const useSoundEffect = () => useContext(SoundEffectContext);
