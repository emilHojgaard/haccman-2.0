import { Routes, Route } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import ChooseBotPage from "./pages/ChooseBotPage";
import PlayPage from "./pages/PlayPage";
import AdminPage from "./pages/AdminPage";
import ScrollToTop from "./ScrollToTop";
import { SoundEffectProvider, useSoundEffect } from "./theme/SoundEffectContext";
import "./theme/tokens.css";

function MuteToggle() {
  const { isMuted, setIsMuted } = useSoundEffect();
  return (
    <button
      onClick={() => setIsMuted((m) => !m)}
      aria-label={isMuted ? "Unmute" : "Mute"}
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        background: "transparent",
        border: "0.5px solid var(--hc-user-border)",
        borderRadius: "var(--hc-radius)",
        color: "var(--hc-text-dim)",
        width: 32,
        height: 32,
        cursor: "pointer",
        zIndex: 50,
      }}
    >
      <i className={`ti ${isMuted ? "ti-volume-3" : "ti-volume"}`} aria-hidden="true" />
    </button>
  );
}

function App() {
  return (
    <SoundEffectProvider>
      <div style={{ background: "var(--hc-bg)", minHeight: "100vh", padding: 24 }}>
        <ScrollToTop />
        <MuteToggle />
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/choose-bot" element={<ChooseBotPage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </SoundEffectProvider>
  );
}

export default App;
