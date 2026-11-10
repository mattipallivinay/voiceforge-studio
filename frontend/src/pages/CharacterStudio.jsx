import { useEffect, useState } from "react";

function CharacterStudio() {
    const [characters, setCharacters] = useState(() => {
        try {
          const savedCharacters = localStorage.getItem("voiceforgeCharacters");
          return savedCharacters
            ? JSON.parse(savedCharacters)
            : [
                { id: 1, name: "Arjun", role: "Hero", voice: "Pranav" },
                { id: 2, name: "Ravan", role: "Villain", voice: "Girish" },
              ];
        } catch {
          return [
            { id: 1, name: "Arjun", role: "Hero", voice: "Pranav" },
            { id: 2, name: "Ravan", role: "Villain", voice: "Girish" },
          ];
        }
      });
      
      useEffect(() => {
        localStorage.setItem("voiceforgeCharacters", JSON.stringify(characters));
      }, [characters]);

  const updateCharacter = (id, field, value) => {
    setCharacters((previous) =>
      previous.map((character) =>
        character.id === id
          ? { ...character, [field]: value }
          : character
      )
    );
  };

  const addCharacter = () => {
    setCharacters((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: "",
        role: "Supporting Character",
        voice: "Kaveri",
      },
    ]);
  };

  const removeCharacter = (id) => {
    setCharacters((previous) =>
      previous.filter((character) => character.id !== id)
    );
  };

  return (
    <section className="workspace">
      <div className="section-heading">
        <div>
          <p className="eyebrow">CHARACTER STUDIO / 03</p>
          <h2>Character & Voice Studio</h2>
        </div>
        <span className="step-number">
          {String(characters.length).padStart(2, "0")} CHARACTERS
        </span>
      </div>

      <p className="subtitle">
        Build your cast, define each character, and choose their voice.
      </p>

      <div className="voice-settings">
        {characters.map((character, index) => (
          <div className="profile-row" key={character.id}>
            <h4>CHARACTER {index + 1}</h4>

            <label htmlFor={`character-name-${character.id}`}>
              Character name
            </label>
            <input
              id={`character-name-${character.id}`}
              value={character.name}
              maxLength={60}
              placeholder="Enter character name"
              onChange={(event) =>
                updateCharacter(character.id, "name", event.target.value)
              }
            />

            <label htmlFor={`character-role-${character.id}`}>Role</label>
            <select
              id={`character-role-${character.id}`}
              value={character.role}
              onChange={(event) =>
                updateCharacter(character.id, "role", event.target.value)
              }
            >
              <option>Hero</option>
              <option>Villain</option>
              <option>Protagonist</option>
              <option>Antagonist</option>
              <option>Narrator</option>
              <option>Friend</option>
              <option>Supporting Character</option>
              <option>Custom</option>
            </select>

            <label htmlFor={`character-voice-${character.id}`}>Voice</label>
            <select
              id={`character-voice-${character.id}`}
              value={character.voice}
              onChange={(event) =>
                updateCharacter(character.id, "voice", event.target.value)
              }
            >
              <option>Pranav</option>
              <option>Girish</option>
              <option>Kaveri</option>
            </select>

            <button
              type="button"
              className="service-link"
              onClick={() => removeCharacter(character.id)}
            >
              Remove character −
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="generate-button"
        disabled={characters.length >= 10}
        onClick={addCharacter}
      >
        Add character + 
      </button>

      <p className="footnote">
        Your character settings are currently held in this page's state.
      </p>
    </section>
  );
}

export default CharacterStudio;
