import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'

export default function ResponderHome() {
  const { userProfile } = useAuth()

  return (
    <div className="page" style={{ background: '#0D1A1A', minHeight: '100vh' }}>
      <Header variant="dark" />
      <main className="page-content">
        <div className="container" style={{ maxWidth: 700 }}>

          {/* Welcome */}
          <div style={styles.welcome}>
            <div className="tag tag-gold" style={{ marginBottom: 12 }}>First Responder Portal</div>
            <h1 style={styles.title}>
              Welcome, {userProfile?.fullName?.split(' ')[0] || 'Responder'}
            </h1>
            <p style={styles.subtitle}>
              Use the Phiris scan interface to instantly identify patients and access their critical medical information.
            </p>
          </div>

          {/* Main action */}
          <Link to="/responder/scan" style={styles.scanCard}>
            <div style={styles.scanIcon}>📷</div>
            <div>
              <div style={styles.scanTitle}>Scan Patient</div>
              <div style={styles.scanDesc}>Use camera to identify an unresponsive patient</div>
            </div>
            <div style={styles.scanArrow}>→</div>
          </Link>

          {/* Info cards */}
          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>⚡</div>
              <div style={styles.infoTitle}>Instant Results</div>
              <div style={styles.infoDesc}>Average match time under 3 seconds from scan</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>🔒</div>
              <div style={styles.infoTitle}>Audit Logged</div>
              <div style={styles.infoDesc}>All lookups are logged for compliance and privacy</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📋</div>
              <div style={styles.infoTitle}>Full Profile</div>
              <div style={styles.infoDesc}>Allergies, conditions, meds, and emergency contacts</div>
            </div>
          </div>

          {/* Status */}
          <div style={styles.statusCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={styles.statusDot} />
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 500 }}>
                System online — Phiris database active
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const styles = {
  welcome: { marginBottom: 32, paddingTop: 8 },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'white',
    letterSpacing: '-0.02em',
    marginBottom: 10,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '1rem',
    lineHeight: 1.65,
    maxWidth: 500,
  },
  scanCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    padding: '24px 28px',
    background: 'linear-gradient(135deg, #155F5F, #1E8484)',
    borderRadius: 20,
    marginBottom: 20,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 8px 32px rgba(30,132,132,0.35)',
    textDecoration: 'none',
  },
  scanIcon: { fontSize: '2.25rem' },
  scanTitle: { fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: 4 },
  scanDesc: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)' },
  scanArrow: { marginLeft: 'auto', color: 'rgba(255,255,255,0.6)', fontSize: '1.25rem' },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 14,
    marginBottom: 20,
  },
  infoCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: '20px 16px',
  },
  infoIcon: { fontSize: '1.5rem', marginBottom: 10 },
  infoTitle: { fontSize: '0.875rem', fontWeight: 700, color: 'white', marginBottom: 6 },
  infoDesc: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 },
  statusCard: {
    background: 'rgba(58,171,171,0.08)',
    border: '1px solid rgba(58,171,171,0.2)',
    borderRadius: 12,
    padding: '14px 20px',
  },
  statusDot: {
    width: 8, height: 8,
    borderRadius: '50%',
    background: '#3AABAB',
    boxShadow: '0 0 8px #3AABAB',
  },
}
