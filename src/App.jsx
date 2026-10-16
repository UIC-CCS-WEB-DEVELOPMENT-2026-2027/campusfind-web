import { useState } from 'react'
import Navbar from './components/Navbar'
import LoginForm from './components/Loginform'
import Footer from './components/Footer'
import './App.css'

function App() {
  // You can keep this count state here if you need it later for custom logic
  const [count, setCount] = useState(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* 1. Top Navigation Bar */}
      <Navbar />
      
      {/* 2. Main Content Area with Gradient Background */}
      <main style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, #93C5FD 0%, #C084FC 100%)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '40px 0'
      }}>
        {/* Your center login form component card */}
        <LoginForm />
      </main>
      
      {/* 3. Dark Bottom Footer Bar */}
      <Footer />
    </div>
  )
}

export default App