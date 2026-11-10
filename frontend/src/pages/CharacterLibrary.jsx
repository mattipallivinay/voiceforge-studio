import { useEffect, useState } from "react";

const characters = [
  {
    id: 1,
    name: "Pranav",
    gender: "male",
    role: "Young Narrator",
    description: "A friendly and expressive voice for storytelling and narration.",
    style: "Warm · Friendly",
    pitch: 0.9,
    rate: 0.95,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfT5Z6WVqhlUIySseG7czM1JKnnFgoyVu7Mr62d5it3Q&s=10",
    sample: "Hello! I'm Pranav. Let me take you on an interesting storytelling journey."
  },
  {
    id: 2,
    name: "Girish",
    gender: "male",
    role: "Professional Voice",
    description: "A confident voice suitable for documentaries and presentations.",
    style: "Deep · Professional",
    pitch: 0.75,
    rate: 0.9,
    image: "https://png.pngtree.com/thumb_back/fh260/background/20240223/pngtree-a-cute-handsome-young-man-image_15629291.jpg",
    sample: "Welcome. Today, we explore an idea that could change the way you see the world."
  },
  {
    id: 3,
    name: "Kaveri",
    gender: "female",
    role: "Storyteller",
    description: "A gentle and engaging voice for stories and creative content.",
    style: "Soft · Expressive",
    pitch: 1.2,
    rate: 0.95,
    image: "https://img.magnific.com/premium-photo/cute-cartoon-girl-with-beautiful-brown-shoulderlength-hair-brings-joy-charm-every-scene_1283595-44175.jpg?semt=ais_hybrid&w=740&q=80",
    sample: "Every story begins with a little imagination. Let me tell you one."
  },
  {
    id: 4,
    name: "Pranav",
    gender: "male",
    role: "Energetic Character",
    description: "An energetic voice for animation and entertaining content.",
    style: "Energetic · Lively",
    pitch: 1.05,
    rate: 1.08,
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    sample: "Hey there! Are you ready for an exciting adventure? Let's get started!"
  },
  {
    id: 5,
    name: "Girish",
    gender: "male",
    role: "Mature Narrator",
    description: "A mature and composed voice for informative narration.",
    style: "Mature · Calm",
    pitch: 0.7,
    rate: 0.85,
    image: "https://randomuser.me/api/portraits/men/60.jpg",
    sample: "Experience teaches us many things. The most important is to never stop learning."
  },
  {
    id: 6,
    name: "Kaveri",
    gender: "female",
    role: "Friendly Companion",
    description: "A cheerful voice for conversational and lifestyle content.",
    style: "Cheerful · Natural",
    pitch: 1.3,
    rate: 1.02,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    sample: "Hi! It's wonderful to have you here. Let's make something amazing together."
  },
  {
    id: 7,
    name: "Pranav",
    gender: "male",
    role: "Dramatic Character",
    description: "A bold voice for cinematic scenes and dramatic dialogues.",
    style: "Bold · Dramatic",
    pitch: 0.8,
    rate: 0.88,
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    sample: "This is not the end. It's only the beginning of something much bigger."
  },
  {
    id: 8,
    name: "Girish",
    gender: "male",
    role: "Casual Conversationalist",
    description: "A relaxed voice for everyday conversations and dialogue.",
    style: "Casual · Relaxed",
    pitch: 0.95,
    rate: 1,
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    sample: "So, what do you think? I believe we have a great idea worth exploring."
  },
  {
    id: 9,
    name: "Kaveri",
    gender: "female",
    role: "Elegant Narrator",
    description: "A clear and graceful voice for narration and presentations.",
    style: "Elegant · Clear",
    pitch: 1.15,
    rate: 0.9,
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    sample: "Welcome to a world of creativity, where every idea has a voice."
  },
  {
    id: 10,
    name: "Pranav",
    gender: "male",
    role: "Adventure Character",
    description: "An adventurous voice for action stories and character dialogues.",
    style: "Adventurous · Strong",
    pitch: 1,
    rate: 1.05,
    image: "https://randomuser.me/api/portraits/men/85.jpg",
    sample: "Come on! There's a whole new world waiting for us to discover."
  }
];

function CharacterLibrary() {
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playSample = (character) => {
    if (!("speechSynthesis" in window)) {
      alert("Audio playback is not supported in this browser.");
      return;
    }

    const speech = window.speechSynthesis;

    // Clicking the same character again stops playback.
    if (playingId === character.id) {
      speech.cancel();
      setPlayingId(null);
      return;
    }

    speech.cancel();

    const utterance = new SpeechSynthesisUtterance(character.sample);
    utterance.lang = "en-IN";
    utterance.pitch = character.pitch;
    utterance.rate = character.rate;

    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);

    setPlayingId(character.id);
    speech.speak(utterance);
  };

  return (
    <main className="character-library-page">
      <section className="character-library-header">
        <p className="eyebrow">VOICEFORGE COLLECTION</p>
        <h1>
          Meet your <span className="hero-highlight">characters.</span>
        </h1>
        <p>
          Explore our collection of AI voice characters. Listen to their
          sample voices and find the right personality for your story.
        </p>
      </section>

      <section className="character-library-content">
        <div className="character-library-heading">
          <div>
            <h2>Character Library</h2>
            <p>Choose a character and discover their voice.</p>
          </div>
          <span className="character-count">
            {characters.length} Characters
          </span>
        </div>

        <div className="character-library-grid">
          {characters.map((character) => (
            <article className="library-character-card" key={character.id}>
              <div className="library-character-image">
                <img
                  src={character.image}
                  alt={`${character.name} character profile`}
                  loading="lazy"
                />
                <span className="character-number">
                  #{String(character.id).padStart(2, "0")}
                </span>
              </div>

              <div className="library-character-details">
                <div className="library-character-title">
                  <div>
                    <h3>{character.name}</h3>
                    <span>{character.role}</span>
                  </div>
                  <span className="character-gender">
                    {character.gender === "male" ? "♂" : "♀"}
                  </span>
                </div>

                <p className="library-character-description">
                  {character.description}
                </p>

                <div className="character-voice-style">
                  <span>VOICE STYLE</span>
                  <strong>{character.style}</strong>
                </div>

                <button
                  className={`character-play-button ${
                    playingId === character.id ? "is-playing" : ""
                  }`}
                  onClick={() => playSample(character)}
                  type="button"
                >
                  <span>{playingId === character.id ? "Ⅱ" : "▶"}</span>
                  {playingId === character.id ? "Stop Sample" : "Play Sample"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default CharacterLibrary;