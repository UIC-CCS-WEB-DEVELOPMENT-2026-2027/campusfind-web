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
  loadContactRequests,
  loadItems,
  loadSession,
  registerAccount,
  saveContactRequests,
  saveItems,
  saveSession,
} from './lib/campusFindStorage'
import './App.css'

function scrollToPosition(targetY) {
  const startY = window.scrollY
  const distance = targetY - startY
  if (Math.abs(distance) < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo({ top: targetY, behavior: 'instant' })
    return
  }

  const duration = Math.min(800, Math.max(400, Math.abs(distance) * 0.35))
  const startTime = performance.now()
  let frameId

  const cancelScroll = () => {
    cancelAnimationFrame(frameId)
    window.removeEventListener('wheel', cancelScroll)
    window.removeEventListener('touchstart', cancelScroll)
    window.removeEventListener('pointerdown', cancelScroll)
    window.removeEventListener('keydown', cancelScroll)
  }

  const animate = (time) => {
    const progress = Math.min((time - startTime) / duration, 1)
    const easedProgress = 1 - (1 - progress) ** 3
    window.scrollTo({ top: startY + distance * easedProgress, behavior: 'instant' })

    if (progress < 1) {
      frameId = requestAnimationFrame(animate)
    } else {
      cancelScroll()
    }
  }

  window.addEventListener('wheel', cancelScroll, { once: true, passive: true })
  window.addEventListener('touchstart', cancelScroll, { once: true, passive: true })
  window.addEventListener('pointerdown', cancelScroll, { once: true, passive: true })
  window.addEventListener('keydown', cancelScroll, { once: true })
  frameId = requestAnimationFrame(animate)
}

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
  const [initialContactRequestsState] = useState(() =>
    readInitialValue(loadContactRequests, [], 'Could not load saved contact requests'))
  const [initialSession] = useState(() => readInitialValue(loadSession, null, 'Could not load the demo session'))
  const [items, setItems] = useState(initialItemsState.value)
  const [contactRequests, setContactRequests] = useState(initialContactRequestsState.value)
  const [session, setSession] = useState(initialSession.value)
  const [storageError, setStorageError] = useState(
    initialItemsState.error || initialContactRequestsState.error || initialSession.error,
  )

  useEffect(() => {
    const syncPage = () => {
      const nextPage = window.location.hash
      setCurrentPage(nextPage)
    }
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  const handleInternalNavigation = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !(event.target instanceof Element)
    ) return

    const link = event.target.closest('a[href^="#"]')
    const hash = link?.getAttribute('href')
    if (!hash) return

    event.preventDefault()
    window.history.pushState(null, '', hash)
    setCurrentPage(hash)

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (hash === '#dashboard' || hash === '#login') {
          scrollToPosition(0)
          return
        }

        const destination = document.getElementById(hash.slice(1))
        if (!destination) return
        const targetY = window.scrollY + destination.getBoundingClientRect().top
        scrollToPosition(Math.min(targetY, document.documentElement.scrollHeight - window.innerHeight))
      })
    })
  }

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

  const sendContactRequest = ({ item, message, relatedReportId }) => {
    if (!session) {
      setStorageError('Sign in before contacting the owner of a report.')
      return false
    }
    if (!item.ownerEmail || item.ownerEmail === session.email) {
      setStorageError('This report cannot receive a contact request from your account.')
      return false
    }
    if (!items.some((savedItem) => savedItem.id === item.id && savedItem.ownerEmail === item.ownerEmail)) {
      setStorageError('This report is no longer available. Refresh the page and try again.')
      return false
    }
    const relatedReport = items.find((savedItem) =>
      savedItem.id === relatedReportId &&
      savedItem.ownerEmail === session.email &&
      savedItem.type !== item.type &&
      savedItem.isListed !== false,
    )
    if (relatedReportId && !relatedReport) {
      setStorageError('Choose one of your active reports of the opposite type to link this conversation.')
      return false
    }

    try {
      const now = new Date().toISOString()
      const request = {
        id: `CR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        reportId: item.id,
        reportName: item.name,
        ownerEmail: item.ownerEmail,
        senderEmail: session.email,
        senderName: session.name,
        intent: item.type === 'Found' ? 'I think this is mine' : 'I found this item',
        message: message.trim(),
        createdAt: now,
        relatedReportId: relatedReport?.id ?? '',
        relatedReportName: relatedReport?.name ?? '',
        relatedReportType: relatedReport?.type ?? '',
        relatedOwnerEmail: relatedReport?.ownerEmail ?? '',
        status: 'Contacting',
        messages: [{
          senderEmail: session.email,
          senderName: session.name,
          message: message.trim(),
          createdAt: now,
        }],
      }
      const matchingThread = contactRequests.find((thread) =>
        thread.reportId === item.id &&
        thread.relatedReportId === (relatedReport?.id ?? '') &&
        thread.senderEmail === session.email &&
      ['Contacting', 'Matched'].includes(thread.status),
      )
      const nextRequests = matchingThread
        ? contactRequests.map((thread) => thread.id === matchingThread.id
          ? { ...thread, messages: [...thread.messages, ...request.messages] }
          : thread)
        : [request, ...contactRequests]
      saveContactRequests(nextRequests)
      setContactRequests(nextRequests)
      setStorageError('')
      return true
    } catch (error) {
      setStorageError(`Could not save your contact request in this browser: ${error instanceof Error ? error.message : 'Unknown storage error'}`)
      return false
    }
  }

  const replyToContactRequest = (threadId, message) => {
    const thread = contactRequests.find((request) => request.id === threadId)
    if (!thread || ![thread.ownerEmail, thread.senderEmail, thread.relatedOwnerEmail].includes(session?.email)) {
      setStorageError('You are not a participant in this conversation.')
      return false
    }
    if (!message.trim()) {
      setStorageError('Write a message before sending.')
      return false
    }

    const nextRequests = contactRequests.map((request) => request.id === threadId
      ? {
          ...request,
          messages: [...request.messages, {
            senderEmail: session.email,
            senderName: session.name,
            message: message.trim(),
            createdAt: new Date().toISOString(),
          }],
        }
      : request)

    try {
      saveContactRequests(nextRequests)
      setContactRequests(nextRequests)
      setStorageError('')
      return true
    } catch (error) {
      setStorageError(`Could not send your message in this browser: ${error instanceof Error ? error.message : 'Unknown storage error'}`)
      return false
    }
  }

  const updateContactOutcome = (threadId, outcome) => {
    const thread = contactRequests.find((request) => request.id === threadId)
    if (!thread || ![thread.ownerEmail, thread.senderEmail, thread.relatedOwnerEmail].includes(session?.email)) {
      setStorageError('You are not a participant in this conversation.')
      return false
    }
    if (!['Matched', 'Claimed', 'Delisted'].includes(outcome)) {
      setStorageError('Choose a valid report outcome.')
      return false
    }

    const linkedIds = new Set([thread.reportId, thread.relatedReportId].filter(Boolean))
    const nextItems = items.map((item) => {
      if (!linkedIds.has(item.id)) return item
      if (outcome === 'Delisted') return { ...item, isListed: false, status: 'Delisted' }
      return { ...item, isListed: true, status: outcome }
    })
    const nextRequests = contactRequests.map((request) => request.id === threadId
      ? { ...request, status: outcome }
      : request)

    try {
      saveContactRequests(nextRequests)
      try {
        saveItems(nextItems)
      } catch (error) {
        try {
          saveContactRequests(contactRequests)
        } catch (rollbackError) {
          throw new Error(
            `${error instanceof Error ? error.message : 'Could not save report updates'}; ` +
            `conversation rollback also failed: ${rollbackError instanceof Error ? rollbackError.message : 'Unknown storage error'}`,
            { cause: rollbackError },
          )
        }
        throw error
      }
      setItems(nextItems)
      setContactRequests(nextRequests)
      setStorageError('')
      return true
    } catch (error) {
      setStorageError(`Could not update the report outcome in this browser: ${error instanceof Error ? error.message : 'Unknown storage error'}`)
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

  const toggleReportListing = (reportId, isListed) => {
    const report = items.find((item) => item.id === reportId)
    if (!session || !report || report.ownerEmail !== session.email) {
      setStorageError('You can only change the listing visibility of your own reports.')
      return false
    }
    return updateItems(items.map((item) => item.id === reportId
      ? {
          ...item,
          isListed,
          status: isListed ? (item.status === 'Claimed' ? 'Claimed' : 'In review') : 'Delisted',
        }
      : item))
  }

  const loginForm = (
    <div className="login-page">
      <LoginForm onSignIn={signIn} onSignUp={signUp} />
    </div>
  )

  return (
    <div className="app-shell" onClick={handleInternalNavigation}>
      <Navbar session={session} onSignOut={signOut} />
      {storageError && <div className="app-storage-error" role="alert">{storageError}</div>}
      <main className="app-main">
        {currentPage === '#login' ? (
          <div className="route-transition" key="login">{loginForm}</div>
        ) : currentPage === '#dashboard' ? (
          session ? (
            <div className="route-transition" key="dashboard">
              <UserDashboard
                contactRequests={contactRequests}
                items={items}
                onDeleteReport={deleteReport}
                onReplyToContactRequest={replyToContactRequest}
                onSaveReport={saveReport}
                onToggleReportListing={toggleReportListing}
                onUpdateContactOutcome={updateContactOutcome}
                session={session}
              />
            </div>
          ) : (
            loginForm
          )
        ) : (
          <Dashboard
            contactRequests={contactRequests}
            currentUserEmail={session?.email}
            items={items}
            onSendContactRequest={sendContactRequest}
            session={session}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
