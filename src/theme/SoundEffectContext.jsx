import { createContext, useContext, useEffect, useRef, useState } from "react";

const SoundEffectContext = createContext(null);

const SOURCES = {
  select: "/sound/8-bit-game-7-188104.mp3",
  navigate: "/sound/8-bit-game-2-186976.mp3",
  win: "/sound/success-fanfare-trumpets-6185.mp3",
};

const VOLUME = { select: 0.3, navigate: 1.0, win: 1.0 };

export function SoundEffectProvider({ children }) {
  const [isMuted, setIsMuted] = useState(localStorage.getItem("isMuted") === "true");
  const audioRefs = useRef({});

  useEffect(() => {
    localStorage.setItem("isMuted", isMuted);
  }, [isMuted]);

  useEffect(() => {
    for (const [key, url] of Object.entries(SOURCES)) {
      const audio = new Audio(url);
      audio.preload = "auto";
      audioRefs.current[key] = audio;
    }
  }, []);

  function playSoundEffect(type) {
    if (isMuted) return;
    const audio = audioRefs.current[type];
    if (!audio) return;
    try {
      audio.volume = VOLUME[type] ?? 1.0;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (e) {
      // ignore
    }
  }

  return (
    <SoundEffectContext.Provider value={{ playSoundEffect, isMuted, setIsMuted }}>
      {children}
    </SoundEffectContext.Provider>
  );
}

export const useSoundEffect = () => useContext(SoundEffectContext);
