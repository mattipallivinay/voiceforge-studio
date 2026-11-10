
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home.jsx";
import Navbar from "./pages/Navbar.jsx";
import ScriptVoice from "./ScriptVoice.jsx";
import VoiceFromScript from "./pages/VoiceFromScript.jsx";
import CharacterStudio from "./pages/CharacterStudio.jsx";
import CharacterLibrary from "./pages/CharacterLibrary";
import ContactSales from "./pages/ContactSales";

function App() {
  return (
    <main className="app">
      <div className="neural-background" aria-hidden="true">
        <svg
          className="neural-wave"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient
              id="neuralGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
              <stop offset="30%" stopColor="#38bdf8" />
              <stop offset="65%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
            <filter
              id="neuralGlow"
              x="-50%"
              y="-100%"
              width="200%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g
            fill="none"
            stroke="url(#neuralGradient)"
            filter="url(#neuralGlow)"
          >
            <path
              className="neural-line neural-line-one"
              d="M-100 480 C100 300 190 650 380 460 S650 300 800 470 S1100 650 1280 420 S1450 400 1540 460"
            />
            <path
              className="neural-line neural-line-two"
              d="M-100 520 C120 680 260 340 440 510 S700 680 880 470 S1130 330 1300 520 S1470 570 1540 500"
            />
            <path
              className="neural-line neural-line-three"
              d="M-100 450 C130 400 240 540 420 450 S690 390 850 510 S1110 570 1280 460 S1450 430 1540 480"
            />
          </g>

          <g className="neural-particles">
            {Array.from({ length: 45 }, (_, i) => (
              <circle
                key={i}
                className={`neural-particle neural-particle-${i % 5}`}
                cx={(i * 137 + 41) % 1440}
                cy={(i * 193 + 67) % 900}
                r={i % 4 === 0 ? 2.5 : 1.4}
                fill={i % 2 === 0 ? "#60a5fa" : "#c4b5fd"}
              />
            ))}
          </g>
        </svg>
      </div>

      <Navbar />

      
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/script-voice" element={<ScriptVoice />} />
  <Route
  path="/voice-from-script"
  element={<VoiceFromScript />}
/>
<Route
  path="/character-studio"
  element={<CharacterStudio />}
/>
<Route path="/characters" element={<CharacterLibrary />} />
<Route path="/contact-sales" element={<ContactSales />} />
</Routes>

      <footer>
        <span>VOICEFORGE STUDIO</span>
        <span>IMAGINATION, AMPLIFIED.</span>
      </footer>
    </main>
  );
}

export default App;
