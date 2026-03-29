import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header({ variant = 'default' }) {
  const { currentUser, userProfile, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const isResponder = userProfile?.accountType === 'responder'
  const isAdmin = userProfile?.accountType === 'admin'

  return (
    <header style={styles.header(variant)}>
      <div className="container" style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <img
            src={variant === 'dark' ? '/logo-white.svg' : '/logo-color.svg'}
            alt="Phiris"
            style={{ height: 36, width: 'auto' }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav style={styles.nav}>
          {!currentUser ? (
            <>
              <Link to="/solutions" style={styles.navLink(variant, location.pathname === '/solutions')}>For Organizations</Link>
              <Link to="/about" style={styles.navLink(variant, location.pathname === '/about')}>About</Link>
              <Link to="/login" style={styles.navLink(variant)}>Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Enroll as a Patient
              </Link>
            </>
          ) : isAdmin ? (
            <>
              <Link to="/admin" style={styles.navLink(variant, location.pathname.startsWith('/admin'))}>
                Admin Portal
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Sign Out
              </button>
            </>
          ) : isResponder ? (
            <>
              <Link
                to="/responder"
                style={styles.navLink(variant, location.pathname === '/responder')}
              >
                Dashboard
              </Link>
              <Link
                to="/responder/scan"
                style={styles.navLink(variant, location.pathname === '/responder/scan')}
              >
                Scan Patient
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                style={styles.navLink(variant, location.pathname === '/profile')}
              >
                My Profile
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Sign Out
              </button>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          style={styles.hamburger(variant)}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {!currentUser ? (
            <>
              <Link to="/solutions" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>For Organizations</Link>
              <Link to="/about" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Enroll as a Patient</Link>
            </>
          ) : isResponder ? (
            <>
              <Link to="/responder" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/responder/scan" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Scan Patient</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} style={styles.mobileLink}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/profile" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Profile</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} style={styles.mobileLink}>Sign Out</button>
            </>
          )}
        </div>
      )}
    </header>
  )
}

const styles = {
  header: (variant) => ({
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: variant === 'dark'
      ? 'rgba(13,26,26,0.95)'
      : 'rgba(247,245,240,0.96)',
    backdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${variant === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(21,95,95,0.1)'}`,
  }),
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #155F5F 0%, #6FC8C8 100%)',
    flexShrink: 0,
  },
  logoText: (variant) => ({
    fontSize: '1.25rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: variant === 'dark' ? 'white' : '#1C2A2A',
  }),
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },
  navLink: (variant, active) => ({
    fontSize: '0.9rem',
    fontWeight: 500,
    color: active
      ? '#3AABAB'
      : variant === 'dark' ? 'rgba(255,255,255,0.8)' : '#5A7070',
    transition: 'color 0.2s',
    borderBottom: active ? '2px solid #3AABAB' : '2px solid transparent',
    paddingBottom: 2,
  }),
  logoutBtn: {
    background: 'none',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#5A7070',
    cursor: 'pointer',
    padding: 0,
  },
  hamburger: (variant) => ({
    display: 'none',
    flexDirection: 'column',
    gap: 5,
    background: 'none',
    border: 'none',
    padding: 4,
    cursor: 'pointer',
    // shown via media query
  }),
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    borderTop: '1px solid #D4E5E5',
    padding: '16px 24px',
    gap: 4,
  },
  mobileLink: {
    display: 'block',
    padding: '12px 0',
    fontSize: '1rem',
    fontWeight: 500,
    color: '#1C2A2A',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    borderBottom: '1px solid #F0EDED',
  },
}
