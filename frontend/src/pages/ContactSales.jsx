
import { Link } from "react-router-dom";

function ContactSales() {
  return (
    <main className="coming-soon-page">
      <div className="coming-soon-glow" />

      <section className="coming-soon-content">
        <div className="coming-soon-icon">♫</div>

        <span className="coming-soon-label">
          <span className="coming-soon-dot" />
          SOMETHING EXCITING IS COMING
        </span>

        <h1>
          Let's create
          <br />
          something <span>amazing.</span>
        </h1>

        <p className="coming-soon-description">
          We're working on a dedicated space to connect you
          with our team, explore custom voice solutions, and
          bring your creative ideas to life.
        </p>

        <div className="coming-soon-divider">
          <span />
          <div className="sound-wave">
            {Array.from({ length: 25 }).map((_, i) => (
              <i key={i} style={{ "--i": i }} />
            ))}
          </div>
          <span />
        </div>

        <h2>Contact Sales</h2>
        <p className="coming-soon-status">
          Our sales experience is currently under development.
          Stay tuned!
        </p>

        <div className="coming-soon-badge">
          <span>✦</span> COMING SOON
        </div>

        <Link to="/" className="coming-home-button">
          <span>←</span> Back to Home
        </Link>

        <p className="coming-soon-footer">
          VOICEFORGE STUDIO · YOUR STORY. YOUR VOICES.
        </p>
      </section>
    </main>
  );
}

export default ContactSales;
