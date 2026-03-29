import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'

export default function HCPPending() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div style={{ background: '#0D1A1A', minHeight: '100vh' }}>
      <Header variant="dark" />
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>

          <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>⏳</div>

          <div style={{
            display: 'inline-block',
            background: 'rgba(200,160,74,0.15)',
            border: '1px solid rgba(200,160,74,0.4)',
            color: '#D4A847',
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            padding: '4px 14px',
            borderRadius: 100,
            marginBottom: 20,
          }}>
            PENDING REVIEW
          </div>

          <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em' }}>
            Application Under Review
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 32, fontSize: '0.95rem' }}>
            Thank you for registering as a First Responder / HCP on Phiris.
            Your credentials are being reviewed by our team. You'll receive an email
            once your account is approved and scan access is granted.
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 32,
            textAlign: 'left',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 14 }}>
              WHAT HAPPENS NEXT
            </div>
            {[
              { icon: '✓', text: 'Registration received and logged' },
              { icon: '🔍', text: 'Our team verifies your credentials (NPI, badge, agency)' },
              { icon: '📧', text: 'You receive an approval email within 1–2 business days' },
              { icon: '🔓', text: 'Full scan access granted upon approval' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 3 ? 12 : 0 }}>
                <span style={{ fontSize: '1rem', marginTop: 1 }}>{step.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem' }}>{step.text}</span>
              </div>
            ))}
          </div>

          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginBottom: 24 }}>
            Questions? Contact us at <a href="mailto:support@phiris.com" style={{ color: '#3AABAB' }}>support@phiris.com</a>
          </p>

          <button
            onClick={handleLogout}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  )
}
