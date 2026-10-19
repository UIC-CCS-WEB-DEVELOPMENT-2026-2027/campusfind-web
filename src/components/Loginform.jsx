import { useState } from 'react'
import signInImage from '../assets/SignI.jpg'

export default function LoginForm() {
  const [message, setMessage] = useState('')

  const showUnavailableMessage = (event) => {
    event.preventDefault()
    setMessage('Sign-in is not available in this demo yet. Authentication must be connected before you can submit a report.')
  }

  return (
    <section className="login-card" aria-labelledby="login-title">
      <span className="login-eyebrow">CAMPUSFIND ACCOUNT</span>
      <h1 id="login-title">Sign in to continue</h1>
      <p className="login-intro">Sign in is required before you can submit a lost-item report.</p>

      <button className="google-login-button" type="button" onClick={showUnavailableMessage}>
        <img src={signInImage} alt="" width="18" height="18" />
        Continue with Google
      </button>

      <div className="login-divider"><span>or use your email</span></div>

      <form onSubmit={showUnavailableMessage}>
        <label htmlFor="loginEmail">Email address</label>
        <input id="loginEmail" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />

        <label htmlFor="loginPassword">Password</label>
        <input id="loginPassword" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />

        {message && <p className="login-notice" role="status">{message}</p>}
        <button className="login-submit-button" type="submit">Sign in</button>
      </form>

      <a className="login-back-link" href="#report-lost-item">Return to report form</a>
    </section>
  )
}
