import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import LoginForm from './components/Loginform'
import ReportLostForm from './components/ReportLostForm'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState(() => window.location.hash.slice(1))
  const [reportedItems, setReportedItems] = useState([])
  const isSignedIn = false

  useEffect(() => {
    const syncPage = () => setCurrentPage(window.location.hash.slice(1))
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        {currentPage === 'login' ? (
          <div className="login-page">
            <LoginForm />
          </div>
        ) : currentPage === 'report-lost-item' || currentPage === 'report-lost' ? (
          <ReportLostForm
            isSignedIn={isSignedIn}
            onSubmitReport={(report) => setReportedItems((items) => [report, ...items])}
          />
        ) : (
          <Dashboard reportedItems={reportedItems} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
