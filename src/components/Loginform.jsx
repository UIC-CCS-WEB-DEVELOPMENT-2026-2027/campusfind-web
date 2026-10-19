import { useState } from 'react'
import './Loginform.css'

function LoginForm({ onSignIn, onSignUp }) {
  const [mode, setMode] = useState('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSignUp = mode === 'sign-up'

  const submit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (isSignUp && password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      if (isSignUp) {
        await onSignUp(name, email, password)
      } else {
        await onSignIn(email, password)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not complete sign-in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="login-card" aria-labelledby="login-title">
      <a className="login-brand" href="#home">Campus<span>Find</span></a>
      <span className="eyebrow">CAMPUS LOST &amp; FOUND</span>
      <h1 id="login-title">{isSignUp ? 'Create your account' : 'Welcome back'}</h1>
      <p className="login-intro">
        {isSignUp ? 'Create an account to report and manage campus items.' : 'Sign in to manage your campus reports.'}
      </p>

      <div className="auth-notice" role="note">
        Prototype authentication: your account and password hash are stored only in this browser. This is not secure production sign-in.
      </div>

      {message && (
        <div className="login-message" role="alert">
          <span>{message}</span>
        </div>
      )}

      <form className="login-fields" onSubmit={submit}>
        {isSignUp && (
          <>
            <label htmlFor="account-name">Full name</label>
            <input
              autoComplete="name"
              id="account-name"
              maxLength={80}
              onChange={(event) => setName(event.target.value)}
              required
              value={name}
            />
          </>
        )}
        <label htmlFor="account-email">Email address</label>
        <input
          autoComplete="email"
          id="account-email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
        <label htmlFor="account-password">Password</label>
        <input
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          id="account-password"
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
        {isSignUp && (
          <>
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              autoComplete="new-password"
              id="confirm-password"
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              type="password"
              value={confirmPassword}
            />
          </>
        )}
        <button className="login-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <p className="auth-switch">
        {isSignUp ? 'Already have an account?' : 'New to CampusFind?'}
        <button
          type="button"
          onClick={() => {
            setMode(isSignUp ? 'sign-in' : 'sign-up')
            setMessage('')
          }}
        >
          {isSignUp ? 'Sign in' : 'Create account'}
        </button>
      </p>
      <a className="login-back-link" href="#home">← Back to campus listings</a>
    </section>
  )
}

export default LoginForm
