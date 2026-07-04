import { createContext, useContext, useEffect, useRef, useState } from "react";

const SoundEffectContext = createContext(null);

const SOURCES = {
  select:   "/sound/8-bit-game-7-188104.mp3",
  win:      "/sound/success-fanfare-trumpets-6185.mp3",
  send:     "/sound/8-bit-game-2-186976.mp3",
  receive:  "/sound/8-bit-game-7-188104.mp3",
  navigate: "/sound/game-ui-sounds-14857.wav",
  click:    "/sound/game-ui-sounds-14857.wav",
};

const VOLUME = { select: 0.3, win: 1.0, send: 0.18, receive: 0.1, navigate: 0.12, click: 0.18 };

export function SoundEffectProvider({ children }) {
  const [isMuted, setIsMuted] = useState(localStorage.getItem("isMuted") === "true");
  const audioRefs  = useRef({});
  const musicRef   = useRef(null);

  useEffect(() => {
    localStorage.setItem("isMuted", isMuted);
    if (isMuted && musicRef.current) musicRef.current.volume = 0;
    else if (!isMuted && musicRef.current) musicRef.current.volume = 0.25;
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
    } catch (e) { /* ignore */ }
  }

  function playMusic(trackNum = 1) {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.src = "";
    }
    const audio = new Audio(`/sound/music-${trackNum}.mp3`);
    audio.loop   = true;
    audio.volume = isMuted ? 0 : 0.25;
    audio.play().catch(() => {});
    musicRef.current = audio;
  }

  function stopMusic() {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.src = "";
      musicRef.current = null;
    }
  }

  return (
    <SoundEffectContext.Provider value={{ playSoundEffect, playMusic, stopMusic, isMuted, setIsMuted }}>
      {children}
    </SoundEffectContext.Provider>
  );
}

export const useSoundEffect = () => useContext(SoundEffectContext);
