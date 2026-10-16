import React from 'react';

export default function Navbar() {
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '14px 40px', 
      backgroundColor: '#ffffff', 
      borderBottom: '1px solid #E5E7EB' // Subtle bottom separator line
    }}>
      
      {/* LEFT SECTION: Logo & Navigation Links grouped together */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '18px', color: '#1E3A8A', letterSpacing: '-0.3px' }}>
          🔍 Lost & Found
        </div>
        
        {/* Navigation Links nestled right next to the logo */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#home" style={linkStyle}>Home</a>
          <a href="#report-lost" style={linkStyle}>Report Lost</a>
          <a href="#report-found" style={linkStyle}>Report Found</a>
          <a href="#lost-items" style={linkStyle}>Lost Items</a>
          <a href="#found-items" style={linkStyle}>Found Items</a>
          <a href="#matches" style={linkStyle}>Matches</a>
        </div>
      </div>
      
      {/* RIGHT SECTION: Action items aligned to the right side */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <a href="#login" style={{ ...linkStyle, fontSize: '14px' }}>Log in</a>
        <a href="#signup" style={{ ...linkStyle, fontSize: '14px' }}>Sign up</a>
        
        {/* Main CTA button using your signature blue theme */}
        <button style={{ 
          backgroundColor: '#3B82F6', 
          color: '#ffffff', 
          padding: '8px 20px', 
          borderRadius: '20px', // Fully pill-shaped round borders like Browserbase
          border: 'none', 
          cursor: 'pointer', 
          fontWeight: '500',
          fontSize: '14px',
          boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
        }}>
          + Register Item
        </button>
      </div>

    </nav>
  );
}

// Global link stylings
const linkStyle = {
  textDecoration: 'none',
  color: '#4B5563',       
  fontSize: '14px',       
  fontWeight: '500',      
  transition: 'color 0.15s ease'
};
