import './Navbar.css'

export default function Navbar() {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="CampusFind home">
        <span className="brand-mark" aria-hidden="true">⌕</span>
        <span>Campus<span>Find</span></span>
      </a>

      <nav className="primary-nav" aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#items">Browse items</a>
        <a href="#how-it-works">How it works</a>
      </nav>

      <a className="sign-in-link" href="#login">Log in</a>
    </header>
  )
}
