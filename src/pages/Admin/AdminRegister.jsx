import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminRegister() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('invite')

  const [inviteValid, setInviteValid] = useState(null) // null=checking, true, false
  const [inviteDocId, setInviteDocId] = useState(null)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) { setInviteValid(false); return }
    validateToken()
  }, [token])

  async function validateToken() {
    try {
      const snap = await getDocs(collection(db, 'adminInvites'))
      const invite = snap.docs.find(d => d.data().token === token && !d.data().used)
      if (!invite) { setInviteValid(false); return }
      // Check expiry
      const expires = invite.data().expiresAt?.toDate?.()
      if (expires && expires < new Date()) { setInviteValid(false); return }
      setInviteDocId(invite.id)
      setInviteValid(true)
    } catch {
      setInviteValid(false)
    }
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    setLoading(true)
    try {
      await register(form.email, form.password, form.fullName, 'admin', { adminRole: 'staff' })
      // Mark invite as used
      if (inviteDocId) {
        await updateDoc(doc(db, 'adminInvites', inviteDocId), { used: true, usedBy: form.email, usedAt: new Date() })
      }
      navigate('/admin')
    } catch (err) {
      const messages = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password is too weak.',
      }
      setError(messages[err.code] || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (inviteValid === null) {
    return (
      <div style={{ background: '#060E0E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner spinner-teal" />
      </div>
    )
  }

  if (!inviteValid) {
    return (
      <div style={{ background: '#060E0E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚫</div>
          <h2 style={{ color: 'white', fontWeight: 800, marginBottom: 12 }}>Invalid or Expired Invite</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>
            This invite link is invalid, has already been used, or has expired. Contact an existing admin to generate a new one.
          </p>
          <Link to="/admin/login" style={{ color: '#3AABAB', fontSize: '0.875rem' }}>← Admin sign in</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.grid} />
      <div style={styles.wrap}>
        <div style={styles.logoArea}>
          <img src="/logo-white.svg" alt="Phiris" style={{ height: 36, marginBottom: 8 }} />
          <div style={styles.badge}>ADMIN REGISTRATION</div>
        </div>

        <div style={styles.card}>
          <div style={styles.invitedBanner}>
            ✓ Valid invite — create your admin account below
          </div>

          <h1 style={styles.title}>Create Admin Account</h1>

          {error && <div style={styles.errorBox}><span style={{ marginRight: 8 }}>⚠️</span>{error}</div>}

          <form onSubmit={handleSubmit}>
            {[
              { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Your name' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'admin@phiris.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'At least 8 characters' },
              { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.name} style={styles.field}>
                <label style={styles.label}>{f.label}</label>
                <input
                  style={styles.input}
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  required
                />
              </div>
            ))}

            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? 'Creating Account…' : 'Create Admin Account'}
            </button>
          </form>
        </div>

        <p style={styles.secureNote}>🔒 Admin accounts have full access to patient data</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#060E0E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', position: 'relative', overflow: 'hidden' },
  grid: { position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(58,171,171,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(58,171,171,0.04) 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' },
  wrap: { width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 },
  logoArea: { textAlign: 'center', marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 },
  badge: { background: 'rgba(58,171,171,0.15)', border: '1px solid rgba(58,171,171,0.35)', color: '#3AABAB', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', padding: '4px 14px', borderRadius: 100 },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '28px 32px', backdropFilter: 'blur(20px)' },
  invitedBanner: { background: 'rgba(42,157,106,0.12)', border: '1px solid rgba(42,157,106,0.3)', color: '#2A9D6A', borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem', fontWeight: 600, marginBottom: 20 },
  title: { color: 'white', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20 },
  errorBox: { background: 'rgba(224,85,85,0.12)', border: '1px solid rgba(224,85,85,0.35)', color: '#F08080', borderRadius: 10, padding: '12px 16px', fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center' },
  field: { marginBottom: 16 },
  label: { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 7, textTransform: 'uppercase' },
  input: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '11px 14px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', background: 'linear-gradient(90deg, #155F5F, #1E8484)', border: 'none', borderRadius: 12, padding: '13px', color: 'white', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', marginTop: 6 },
  secureNote: { textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', marginTop: 20 },
}
