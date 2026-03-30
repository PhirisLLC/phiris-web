import React from 'react'
import { useNavigate, Link } from 'react-router-dom'


const ROLES = [
  {
    key: 'patient',
    icon: '🧑‍⚕️',
    title: 'Patient',
    description: 'View or update your Phiris emergency profile.',
    loginPath: '/login/patient',
    registerPath: '/register',
    registerLabel: 'New? Enroll as a Patient →',
    color: '#3AABAB',
    border: 'rgba(58,171,171,0.35)',
    bg: 'rgba(58,171,171,0.08)',
  },
  {
    key: 'hcp',
    icon: '🚑',
    title: 'First Responder / HCP',
    description: 'Access patient scan data as a verified first responder or healthcare professional.',
    loginPath: '/login/hcp',
    registerPath: '/responder/register',
    registerLabel: 'Apply for access →',
    color: '#D4A847',
    border: 'rgba(212,168,71,0.35)',
    bg: 'rgba(212,168,71,0.08)',
  },
]

export default function LoginSelect() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <div style={styles.bg} />

      <div style={styles.wrap}>
        <div style={styles.logoArea}>
          <Link to="/" style={{ display: 'inline-block', lineHeight: 0 }}>
            <img src="/logo-white.svg" alt="Phiris" style={{ height: 44, marginBottom: 10 }} />
          </Link>
          <p style={styles.tagline}>Your Healthcare Passport</p>
        </div>

        <h1 style={styles.heading}>How are you signing in?</h1>
        <p style={styles.sub}>Select your role to continue</p>

        <div style={styles.grid}>
          {ROLES.map(role => (
            <button
              key={role.key}
              onClick={() => navigate(role.loginPath)}
              style={{ ...styles.card, borderColor: role.border, background: role.bg }}
            >
              <div style={styles.roleIcon}>{role.icon}</div>
              <div style={{ ...styles.roleTitle, color: role.color }}>{role.title}</div>
              <div style={styles.roleDesc}>{role.description}</div>
              <div style={{ ...styles.signInBtn, background: role.color }}>
                Sign In →
              </div>
              <Link
                to={role.registerPath}
                onClick={e => e.stopPropagation()}
                style={{ ...styles.registerLink, color: role.color }}
              >
                {role.registerLabel}
              </Link>
            </button>
          ))}
        </div>

        <div style={styles.adminLink}>
          <Link to="/admin/login" style={styles.adminAnchor}>
            🔐 Phiris staff sign in
          </Link>
          <div style={{ marginTop: 12 }}>
            <Link to="/" style={{ ...styles.adminAnchor, color: 'rgba(255,255,255,0.35)' }}>
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0D1A1A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    position: 'relative',
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 0%, rgba(30,132,132,0.15) 0%, transparent 65%)',
    pointerEvents: 'none',
  },
  wrap: {
    width: '100%',
    maxWidth: 600,
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
  },
  logoArea: {
    marginBottom: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tagline: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '0.82rem',
    letterSpacing: '0.05em',
    margin: 0,
  },
  heading: {
    color: 'white',
    fontSize: '1.75rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    marginBottom: 8,
  },
  sub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.9rem',
    marginBottom: 32,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 28,
  },
  card: {
    border: '1.5px solid',
    borderRadius: 20,
    padding: '28px 24px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    transition: 'transform 0.15s, box-shadow 0.15s',
    textAlign: 'center',
  },
  roleIcon: {
    fontSize: '2.5rem',
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: '1.05rem',
    fontWeight: 800,
    letterSpacing: '-0.01em',
  },
  roleDesc: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '0.8rem',
    lineHeight: 1.55,
    marginBottom: 4,
  },
  signInBtn: {
    borderRadius: 10,
    padding: '9px 20px',
    color: 'white',
    fontWeight: 700,
    fontSize: '0.875rem',
    width: '100%',
    marginTop: 4,
  },
  registerLink: {
    fontSize: '0.78rem',
    fontWeight: 600,
    textDecoration: 'none',
    opacity: 0.8,
  },
  adminLink: {
    marginTop: 8,
    paddingTop: 20,
    borderTop: '1px solid rgba(255,255,255,0.07)',
  },
  adminAnchor: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: '0.82rem',
    textDecoration: 'none',
    letterSpacing: '0.01em',
  },
}
