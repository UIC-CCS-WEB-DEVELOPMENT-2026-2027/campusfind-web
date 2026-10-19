
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import LoginForm from './components/Loginform'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'
import ReportLostForm from './components/ReportLostForm'
import './App.css'

function App() {
  const [isLoginPage, setIsLoginPage] = useState(window.location.hash === '#login')

  useEffect(() => {
    const syncPage = () => setIsLoginPage(window.location.hash === '#login')
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        {isLoginPage ? (
          <div className="login-page">
            <LoginForm />
          </div>
        ) : (
          <Dashboard />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
