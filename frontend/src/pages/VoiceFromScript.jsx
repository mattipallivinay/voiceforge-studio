
import { useState } from "react";

function VoiceFromScript() {
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState("Pranav");
  const [language, setLanguage] = useState("en-IN");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  
const generateVoice = async () => {
  setLoading(true);
  setError("");
  setAudioUrl("");

  try {
    const response = await fetch("http://127.0.0.1:8000/api/audio/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: script.trim(),
        voice,
        language,
        speed: 1.0,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Audio generation failed.");
    }

    setAudioUrl(
      `http://127.0.0.1:8000/api/audio/download?file=${encodeURIComponent(data.file)}`
    );
  } catch (err) {
    setError(err.message || "Could not connect to the backend.");
  } finally {
    setLoading(false);
  }
};


  return (
    <section className="workspace">
      <div className="section-heading">
        <div>
          <p className="eyebrow">VOICE STUDIO / 02</p>
          <h2>Voice Your Script</h2>
        </div>
        <span className="step-number">01 — 02</span>
      </div>

      <p className="subtitle">
        Bring your own words to life with AI-generated speech.
      </p>

      <label htmlFor="custom-script">Your script</label>
      <textarea
        id="custom-script"
        rows={8}
        maxLength={2000}
        placeholder="Type or paste the text you want to turn into speech..."
        value={script}
        onChange={(event) => setScript(event.target.value)}
      />

      <p className="character-count">{script.length} / 2000 characters</p>

      <div className="settings">
        <div>
          <label htmlFor="voice-choice">Voice</label>
          <select
            id="voice-choice"
            value={voice}
            onChange={(event) => setVoice(event.target.value)}
          >
            <option value="Pranav">Pranav</option>
            <option value="Girish">Girish</option>
            <option value="Kaveri">Kaveri</option>
          </select>
        </div>

        <div>
          <label htmlFor="voice-language">Language</label>
          <select
            id="voice-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value="en-IN">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="te-IN">Telugu</option>
            <option value="ta-IN">Tamil</option>
            <option value="kn-IN">Kannada</option>
          </select>
        </div>
      </div>

      <button
        className="generate-button"
        disabled={script.trim().length === 0}
        onClick={generateVoice}
      >
        {loading ? "Generating voice..." : "Generate voice"} <span>↗</span>
        {error && <p role="alert">{error}</p>}

{audioUrl && (
  <div className="dialogue-item">
    <h3>Your generated voice</h3>
    <audio controls src={audioUrl} className="audio-player" />
    <a
      className="service-link"
      href={audioUrl}
      download="voiceforge-audio.wav"
    >
      Download audio ↗
    </a>
  </div>
)}
      </button>

      <p className="footnote">
        Powered by Gnani AI voice technology
      </p>
    </section>
  );
}

export default VoiceFromScript;
