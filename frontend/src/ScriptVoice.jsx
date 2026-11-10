
import { useEffect, useState } from "react";
import "./App.css";

function ScriptVoice() {
  const [idea, setIdea] = useState("");
  const [genre, setGenre] = useState("Thriller");
  const [language, setLanguage] = useState("English");
  const [characters, setCharacters] = useState(2);

  const [voiceSelections, setVoiceSelections] = useState(() => {
    const defaults = {
      1: "Pranav",
      2: "Girish",
      3: "Kaveri",
      4: "Pranav",
      5: "Girish",
      6: "Kaveri",
      7: "Pranav",
      8: "Girish",
      9: "Kaveri",
      10: "Pranav",
    };

    try {
      const saved = JSON.parse(
        localStorage.getItem("voiceforgeCharacters") || "null"
      );

      if (!Array.isArray(saved)) return defaults;

      saved.forEach((character, index) => {
        if (index < 10 && character.voice) {
          defaults[index + 1] = character.voice;
        }
      });
    } catch {
      return defaults;
    }

    return defaults;
  });

  const [characterProfiles, setCharacterProfiles] = useState(() => {
    const defaults = {
      1: { name: "Character 1", role: "Hero" },
      2: { name: "Character 2", role: "Villain" },
      3: { name: "Character 3", role: "Supporting Character" },
      4: { name: "Character 4", role: "Supporting Character" },
      5: { name: "Character 5", role: "Supporting Character" },
      6: { name: "Character 6", role: "Supporting Character" },
      7: { name: "Character 7", role: "Supporting Character" },
      8: { name: "Character 8", role: "Supporting Character" },
      9: { name: "Character 9", role: "Supporting Character" },
      10: { name: "Character 10", role: "Supporting Character" },
    };

    try {
      const saved = JSON.parse(
        localStorage.getItem("voiceforgeCharacters") || "null"
      );

      if (!Array.isArray(saved)) return defaults;

      saved.forEach((character, index) => {
        if (index < 10) {
          defaults[index + 1] = {
            name: character.name || `Character ${index + 1}`,
            role: character.role || "Supporting Character",
          };
        }
      });
    } catch {
      return defaults;
    }

    return defaults;
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Sync saved characters from Character Studio
  useEffect(() => {
    const syncCharacters = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem("voiceforgeCharacters") || "null"
        );

        if (!Array.isArray(saved)) return;

        setCharacterProfiles((previous) => {
          const updated = { ...previous };

          saved.slice(0, 10).forEach((character, index) => {
            const number = index + 1;

            updated[number] = {
              name: character.name || `Character ${number}`,
              role: character.role || "Supporting Character",
            };
          });

          return updated;
        });

        setVoiceSelections((previous) => {
          const updated = { ...previous };

          saved.slice(0, 10).forEach((character, index) => {
            if (character.voice) {
              updated[index + 1] = character.voice;
            }
          });

          return updated;
        });
      } catch (error) {
        console.error("Could not sync saved characters:", error);
      }
    };

    window.addEventListener("focus", syncCharacters);
    syncCharacters();

    return () => {
      window.removeEventListener("focus", syncCharacters);
    };
  }, []);

  // Generate scene
  const generateScene = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/scene/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idea,
            genre: genre.toLowerCase(),
            language,
            characters,
            voice_selections: voiceSelections,
            character_profiles: characterProfiles,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Scene generation failed.");
      }

      setResult(data);
    } catch (error) {
      alert(error.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SCRIPT + VOICE PAGE HEADER */}
      <section className="script-voice-header">
        <p className="eyebrow">VOICEFORGE WORKSPACE</p>
        <h1>
          Script <span className="hero-highlight">+</span> Voice
        </h1>
        <p>
          Turn your ideas into original stories and bring every
          character to life with AI-generated voices.
        </p>
      </section>

      {/* SCENE CREATION WORKSPACE */}
      <section className="workspace">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WORKSPACE / 01</p>
            <h2>Create a scene</h2>
          </div>
          <span className="step-number">01 — 03</span>
        </div>

        <label htmlFor="idea">What's your story about?</label>

        <textarea
          id="idea"
          placeholder="A detective discovers a secret that could change the world..."
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          maxLength={2000}
          rows={5}
        />

        <p className="character-count">
          {idea.length} / 2000 characters
        </p>

        {/* SCENE SETTINGS */}
        <div className="settings">
          <div>
            <label htmlFor="genre">Genre</label>
            <select
              id="genre"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
            >
              <option>Thriller</option>
              <option>Drama</option>
              <option>Comedy</option>
              <option>Horror</option>
              <option>Fantasy</option>
              <option>Science Fiction</option>
              <option>Romance</option>
            </select>
          </div>

          <div>
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Telugu</option>
              <option>Tamil</option>
              <option>Kannada</option>
            </select>
          </div>

          <div>
            <label htmlFor="characters">Characters</label>
            <select
              id="characters"
              value={characters}
              onChange={(event) =>
                setCharacters(Number(event.target.value))
              }
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                <option key={number} value={number}>
                  {number} {number === 1 ? "character" : "characters"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CHARACTER PROFILES AND VOICES */}
        <div className="voice-settings">
          <div className="voice-heading">
            <h3>Character profiles & voices</h3>
            <p>
              Customize each character's name, role, and voice.
            </p>
          </div>

          {Array.from({ length: characters }, (_, index) => {
            const characterNumber = index + 1;

            return (
              <div className="profile-row" key={characterNumber}>
                <h4>Character {characterNumber}</h4>

                <label htmlFor={`name-${characterNumber}`}>
                  Character name
                </label>

                <input
                  id={`name-${characterNumber}`}
                  type="text"
                  value={characterProfiles[characterNumber].name}
                  onChange={(event) =>
                    setCharacterProfiles((previous) => ({
                      ...previous,
                      [characterNumber]: {
                        ...previous[characterNumber],
                        name: event.target.value,
                      },
                    }))
                  }
                  placeholder="Enter character name"
                />

                <label htmlFor={`role-${characterNumber}`}>
                  Role
                </label>

                <select
                  id={`role-${characterNumber}`}
                  value={characterProfiles[characterNumber].role}
                  onChange={(event) =>
                    setCharacterProfiles((previous) => ({
                      ...previous,
                      [characterNumber]: {
                        ...previous[characterNumber],
                        role: event.target.value,
                      },
                    }))
                  }
                >
                  <option value="Hero">Hero</option>
                  <option value="Villain">Villain</option>
                  <option value="Protagonist">Protagonist</option>
                  <option value="Antagonist">Antagonist</option>
                  <option value="Supporting Character">
                    Supporting Character
                  </option>
                  <option value="Narrator">Narrator</option>
                  <option value="Friend">Friend</option>
                  <option value="Custom">Custom</option>
                </select>

                <label htmlFor={`voice-${characterNumber}`}>
                  Voice
                </label>

                <select
                  id={`voice-${characterNumber}`}
                  value={voiceSelections[characterNumber]}
                  onChange={(event) =>
                    setVoiceSelections((previous) => ({
                      ...previous,
                      [characterNumber]: event.target.value,
                    }))
                  }
                >
                  <option value="Pranav">Pranav</option>
                  <option value="Girish">Girish</option>
                  <option value="Kaveri">Kaveri</option>
                </select>
              </div>
            );
          })}
        </div>

        <button
          className="generate-button"
          disabled={loading || idea.trim().length < 3}
          onClick={generateScene}
        >
          {loading ? "Generating your scene..." : "Generate your scene"}
          <span>↗</span>
        </button>

        <p className="footnote">
          Powered by Groq AI and Gnani AI voice technology
        </p>
      </section>

      {/* GENERATED SCENE RESULT */}
      {result && (
        <section className="workspace">
          <p className="eyebrow">GENERATION COMPLETE</p>

          <h2>{result.script?.title || "Your generated scene"}</h2>

          <p className="subtitle">
            {result.script?.genre || genre} ·{" "}
            {result.script?.dialogue?.length || 0} dialogue lines
          </p>

          <div className="dialogue-list">
            {result.script?.dialogue?.map((line, index) => (
              <div className="dialogue-item" key={index}>
                <strong>{line.character}</strong>

                <p>{line.text}</p>

                <span>
                  Voice:{" "}
                  {voiceSelections[
                    [...new Set(
                      result.script.dialogue.map(
                        (item) => item.character
                      )
                    )].indexOf(line.character) + 1
                  ] || line.voice}
                </span>

                <audio
                  controls
                  preload="none"
                  src={`http://127.0.0.1:8000/api/scene/${result.audio.scene_id}/track/${index + 1}`}
                  className="audio-player"
                />
              </div>
            ))}
          </div>

          <a
            className="generate-button download-link"
            href={`http://127.0.0.1:8000${result.download_endpoint}`}
            target="_blank"
            rel="noreferrer"
          >
            Download scene audio ZIP ↗
          </a>
        </section>
      )}
    </>
  );
}

export default ScriptVoice;
