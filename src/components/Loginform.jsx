import React from 'react';
// 1. IMPORT YOUR IMAGE FILE HERE
import signInImage from '../assets/SignI.jpg';

export default function LoginForm() {
  return (
    <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '400px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '20px', fontFamily: 'cursive', color: '#374151' }}>Login</h2>
      
      {/* Google Login Button */}
      <button style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '15px' }}>
        {/* 2. USE THE IMPORT VARIABLE NAME INSIDE CURLY BRACES */}
        <img src={signInImage} alt="Google" width="16" height="16" style={{ objectFit: 'contain' }} /> 
        Continue with Google
      </button>
      
      <div style={{ margin: '15px 0', color: '#9CA3AF', fontSize: '12px' }}>or</div>

      {/* Form Fields */}
      <form style={{ textAlign: 'left' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#4B5563', marginBottom: '5px' }}>Email Address</label>
          <input type="email" placeholder="you@example.com" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#4B5563', marginBottom: '5px' }}>Password</label>
          <input type="password" placeholder="Enter your password" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" style={{ backgroundColor: '#3B82F6', color: '#fff', width: '100%', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
        Sign In
        </button>
      </form>
    </div>
  );
}
