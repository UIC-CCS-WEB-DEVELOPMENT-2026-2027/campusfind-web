import './Navbar.css'

export default function Navbar({ session, onSignOut }) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="CampusFind home">
        <span className="brand-mark" aria-hidden="true">⌕</span>
        <span>Campus<span>Find</span></span>
      </a>

      <nav className="primary-nav" aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#items">Browse items</a>
        <a href="#dashboard">My dashboard</a>
        <a href="#how-it-works">How it works</a>
      </nav>

      <div className="account-actions">
        {session ? (
          <>
            <a className="account-name" href="#dashboard">{session.name}</a>
            <button className="sign-in-link sign-out-button" onClick={onSignOut} type="button">Sign out</button>
          </>
        ) : (
          <a className="sign-in-link" href="#login">Sign in</a>
        )}
      </div>
    </header>
  )
}
