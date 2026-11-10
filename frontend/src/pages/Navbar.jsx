import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <span className="brand-icon">♫</span>
        VoiceForge <span>Studio</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/contact-sales">Contact Sales</NavLink>
        <NavLink to="/characters">Characters</NavLink>
      </div>

      <details className="profile-menu">
        <summary className="profile-trigger">
          <span className="profile-avatar">V</span>
          <span className="profile-name">Vinay</span>
          <span className="profile-arrow">⌄</span>
        </summary>

        <div className="profile-dropdown">
          <div className="profile-info">
            <span className="profile-avatar large">V</span>
            <div>
              <strong>Vinay</strong>
              <span>Studio Member</span>
            </div>
          </div>

          <div className="profile-divider" />

          <Link to="/character-studio">My Characters</Link>
          <button type="button">Account Settings</button>
          <button type="button">Sign Out</button>
        </div>
      </details>
    </nav>
  );
}

export default Navbar;