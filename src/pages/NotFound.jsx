import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#0D1A1A', minHeight: '100vh' }}>
      <Header variant="dark" />
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 8, opacity: 0.4 }}>404</div>
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>
            Page Not Found
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 32, maxWidth: 320, margin: '0 auto 32px' }}>
            This page doesn't exist or you may not have access to it.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </main>
    </div>
  )
}
