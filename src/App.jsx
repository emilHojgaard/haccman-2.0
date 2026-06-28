import { Routes, Route } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import ChooseBotPage from "./pages/ChooseBotPage";
import PlayPage from "./pages/PlayPage";
import AdminPage from "./pages/AdminPage";
import "./theme/tokens.css";

function App() {
  return (
    <div style={{ background: "var(--hc-bg)", minHeight: "100vh", padding: 24 }}>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/choose-bot" element={<ChooseBotPage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
