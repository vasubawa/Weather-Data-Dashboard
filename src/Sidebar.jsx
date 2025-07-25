import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './App.css'

function Sidebar() {
  const location = useLocation()
  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: 180,
      background: 'rgba(0,0,0,0.15)',
      color: 'white',
      padding: '2rem 1rem',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      borderRight: '1px solid rgba(255,255,255,0.1)'
    }}>
      <h2 style={{ fontSize: 22, marginBottom: 0 }}>☀️ Solar</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Link to="/" style={{ color: location.pathname === '/' ? '#FFD700' : 'white', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
        <span style={{ color: '#aaa', fontSize: 13 }}>Weather Data</span>
        <span style={{ color: '#aaa', fontSize: 13 }}>Charts</span>
        <span style={{ color: '#aaa', fontSize: 13 }}>About</span>
      </nav>
    </aside>
  )
}

export default Sidebar
