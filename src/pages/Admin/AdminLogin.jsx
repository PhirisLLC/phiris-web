import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminLogin() {
  const { login, userProfile, currentUser } = useAuth()
  const navigate = useNavigate()

  // Already signed in as admin → skip straight to portal
  useEffect(() => {
    if (currentUser && userProfile?.accountType === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [currentUser, userProfile])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      // Route guard in App.jsx will redirect based on accountType
      navigate('/admin')
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No admin account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/invalid-credential': 'Invalid email or password.',
      }
      setError(messages[err.code] || 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Background grid */}
      <div style={styles.grid} />

      <div style={styles.wrap}>
        {/* Logo area */}
        <div style={styles.logoArea}>
          <img src="/logo-white.svg" alt="Phiris" style={{ height: 40, marginBottom: 8 }} />
          <div style={styles.badge}>STAFF PORTAL</div>
        </div>

        <div style={styles.card}>
          <h1 style={styles.title}>Admin Sign In</h1>
          <p style={styles.subtitle}>Access is restricted to authorized Phiris staff only.</p>

          {error && (
            <div style={styles.errorBox}>
              <span style={{ marginRight: 8 }}>⚠️</span>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@phiris.com"
                required
                autoFocus
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.btn}
            >
              {loading
                ? <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : 'Sign In to Admin Portal'
              }
            </button>
          </form>

          <div style={styles.footer}>
            <Link to="/" style={styles.backLink}>← Back to Phiris</Link>
            <Link to="/login" style={styles.backLink}>Patient login</Link>
          </div>
        </div>

        <p style={styles.secureNote}>
          🔒 Secured connection · All access is logged and audited
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#060E0E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    position: 'relative',
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(58,171,171,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(58,171,171,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  wrap: {
    width: '100%',
    maxWidth: 420,
    position: 'relative',
    zIndex: 1,
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: 28,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    background: 'rgba(58,171,171,0.15)',
    border: '1px solid rgba(58,171,171,0.35)',
    color: '#3AABAB',
    fontSize: '0.65rem',
    fontWeight: 800,
    letterSpacing: '0.15em',
    padding: '4px 14px',
    borderRadius: 100,
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: '32px',
    backdropFilter: 'blur(20px)',
  },
  title: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.85rem',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 1.5,
  },
  errorBox: {
    background: 'rgba(224,85,85,0.12)',
    border: '1px solid rgba(224,85,85,0.35)',
    color: '#F08080',
    borderRadius: 10,
    padding: '12px 16px',
    fontSize: '0.85rem',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
  },
  field: {
    marginBottom: 18,
  },
  label: {
    display: 'block',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '12px 14px',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  btn: {
    width: '100%',
    background: 'linear-gradient(90deg, #155F5F, #1E8484)',
    border: 'none',
    borderRadius: 12,
    padding: '14px',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'opacity 0.2s',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 20,
    borderTop: '1px solid rgba(255,255,255,0.07)',
  },
  backLink: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '0.8rem',
    textDecoration: 'none',
  },
  secureNote: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.2)',
    fontSize: '0.72rem',
    marginTop: 20,
    letterSpacing: '0.02em',
  },
}
