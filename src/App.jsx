import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import LoginForm from './components/Loginform'
import Dashboard from './components/Dashboard'
import UserDashboard from './components/UserDashboard'
import Footer from './components/Footer'
import sampleItems from './data/items.json'
import {
  authenticateAccount,
  clearSession,
  loadItems,
  loadSession,
  registerAccount,
  saveItems,
  saveSession,
} from './lib/campusFindStorage'
import './App.css'

function readInitialValue(reader, fallback, description) {
  try {
    return { value: reader(), error: '' }
  } catch (error) {
    return {
      value: fallback,
      error: `${description}: ${error instanceof Error ? error.message : 'Unknown storage error'}`,
    }
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState(window.location.hash)
  const [initialItemsState] = useState(() => readInitialValue(loadItems, sampleItems, 'Could not load saved listings'))
  const [initialSession] = useState(() => readInitialValue(loadSession, null, 'Could not load the demo session'))
  const [items, setItems] = useState(initialItemsState.value)
  const [session, setSession] = useState(initialSession.value)
  const [storageError, setStorageError] = useState(initialItemsState.error || initialSession.error)

  useEffect(() => {
    const syncPage = () => setCurrentPage(window.location.hash)
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  const updateItems = (nextItems) => {
    try {
      saveItems(nextItems)
      setItems(nextItems)
      setStorageError('')
      return true
    } catch (error) {
      setStorageError(`Could not save listing changes in this browser: ${error instanceof Error ? error.message : 'Unknown storage error'}`)
      return false
    }
  }

  const startSession = (nextSession) => {
    saveSession(nextSession)
    setSession(nextSession)
    setStorageError('')
    window.location.hash = '#dashboard'
  }

  const signIn = async (email, password) => {
    const account = await authenticateAccount(email, password)
    startSession(account)
  }

  const signUp = async (name, email, password) => {
    const account = await registerAccount(name, email, password)
    startSession(account)
  }

  const signOut = () => {
    try {
      clearSession()
      setStorageError('')
    } catch (error) {
      setStorageError(`Could not clear the sign-in session: ${error instanceof Error ? error.message : 'Unknown storage error'}`)
      return
    }
    setSession(null)
    window.location.hash = '#home'
  }

  const saveReport = (report) => {
    if (!session) return false
    if (report.ownerEmail && report.ownerEmail !== session.email) {
      setStorageError('You can only edit reports created by your signed-in account.')
      return false
    }

    const isNew = !report.id
    const nextReport = {
      ...report,
      id: report.id ?? `CF-${Date.now()}`,
      ownerEmail: session.email,
    }
    const nextItems = isNew
      ? [nextReport, ...items]
      : items.map((item) => item.id === report.id ? nextReport : item)

    return updateItems(nextItems)
  }

  const deleteReport = (reportId) => {
    const report = items.find((item) => item.id === reportId)
    if (!session || !report || report.ownerEmail !== session.email) {
      setStorageError('You can only delete reports created by your signed-in account.')
      return false
    }
    return updateItems(items.filter((item) => item.id !== reportId))
  }

  const loginForm = (
    <div className="login-page">
      <LoginForm onSignIn={signIn} onSignUp={signUp} />
    </div>
  )

  return (
    <div className="app-shell">
      <Navbar session={session} onSignOut={signOut} />
      {storageError && <div className="app-storage-error" role="alert">{storageError}</div>}
      <main className="app-main">
        {currentPage === '#login' ? (
          loginForm
        ) : currentPage === '#dashboard' ? (
          session ? (
            <UserDashboard
              items={items}
              onDeleteReport={deleteReport}
              onSaveReport={saveReport}
              session={session}
            />
          ) : (
            loginForm
          )
        ) : (
          <Dashboard currentUserEmail={session?.email} items={items} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
