
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <p className="eyebrow">YOUR STORY. OUR VOICES.</p>

        <h1 className="hero-title">
          Turn imagination
          <br />
          into <span className="hero-highlight">sound.</span>
        </h1>

        <p className="subtitle">
          Welcome to VoiceForge Studio — your creative workspace
          for AI-powered storytelling and voice generation.
        </p>

        <a href="#services" className="generate-button">
          Explore our studio <span>↓</span>
        </a>
      </section>

      <section className="home-about">
        <p className="eyebrow">ABOUT THE STUDIO</p>
        <h2>Stories deserve to be heard.</h2>
        <p>
          Create original scripts, bring characters to life with AI voices,
          and turn your ideas into immersive audio experiences — all in one place.
        </p>
      </section>

      <section id="services" className="home-services">
        <p className="eyebrow">EXPLORE OUR SERVICES</p>
        <h2>What would you like to create?</h2>

        <div className="service-grid">
          <article className="service-card">
            <span className="service-icon">✦</span>
            <h3>Script + Voice</h3>
            <p>
              Start with an idea. Generate a story and give each character
              a voice.
            </p>
            <Link to="/script-voice" className="service-button">
  Create a story <span>↗</span>
</Link>
          </article>

          <article className="service-card">
            <span className="service-icon">♫</span>
            <h3>Voice Your Script</h3>
            <p>
              Already have a script? Bring your dialogue to life with
              your selected AI voices.
            </p>
            <Link to="/voice-from-script" className="service-button">
  Create voice audio <span>↗</span>
</Link>
          </article>

          <article className="service-card">
            <span className="service-icon">◈</span>
            <h3>Character Studio</h3>
            <p>
              Explore character names, roles, and voice assignments
              for your stories.
            </p>
            <Link to="/character-studio" className="service-button">
  Explore characters <span>↗</span>
</Link>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Home;
