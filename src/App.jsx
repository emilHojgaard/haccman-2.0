import { Routes, Route } from "react-router-dom";
import ChooseBotPage from "./pages/ChooseBotPage";
import PlayPage from "./pages/PlayPage";
import "./theme/tokens.css";

function App() {
  return (
    <div style={{ background: "var(--hc-bg)", minHeight: "100vh", padding: 24 }}>
      <Routes>
        <Route path="/" element={<ChooseBotPage />} />
        <Route path="/play" element={<PlayPage />} />
      </Routes>
    </div>
  );
}

export default App;
