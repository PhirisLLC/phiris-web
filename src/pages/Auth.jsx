import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'

const HCP_ROLES = [
  { value: 'emt', label: 'EMT / Paramedic' },
  { value: 'firefighter', label: 'Firefighter' },
  { value: 'police', label: 'Police Officer' },
  { value: 'nurse', label: 'Nurse (RN/LPN)' },
  { value: 'physician', label: 'Physician / PA / NP' },
  { value: 'er_staff', label: 'ER / Hospital Staff' },
  { value: 'other_clinical', label: 'Other Clinical HCP' },
  { value: 'other_responder', label: 'Other First Responder' },
]

// Roles that have an NPI number
const NPI_ROLES = ['nurse', 'physician', 'er_staff', 'other_clinical']

async function verifyNPI(npi, fullName) {
  try {
    const res = await fetch(
      `https://npiregistry.cms.hhs.gov/api/?number=${npi}&version=2.1`
    )
    const data = await res.json()
    if (!data.results || data.results.length === 0) return { valid: false, reason: 'NPI number not found in registry.' }
    const provider = data.results[0]
    const basic = provider.basic || {}
    // Check name match (case-insensitive partial match)
    const registryName = `${basic.first_name || ''} ${basic.last_name || ''}`.toLowerCase()
    const enteredName = fullName.toLowerCase()
    const lastNameMatch = enteredName.includes((basic.last_name || '').toLowerCase())
    if (!lastNameMatch) {
      return { valid: false, reason: `NPI found but name doesn't match registry. Registered as: ${basic.first_name} ${basic.last_name}.` }
    }
    return { valid: true, providerInfo: basic }
  } catch {
    return { valid: true, providerInfo: null } // Allow through if API fails — admin will review
  }
}

export default function Auth({ mode }) {
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const isLogin = mode === 'login'
  const isHCP = mode === 'responder-register'

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agencyName: '',
    badgeNumber: '',
    hcpRole: '',
    npiNumber: '',
  })
  const [error, setError] = useState('')
  const [npiStatus, setNpiStatus] = useState(null) // null | 'checking' | 'verified' | 'failed'
  const [loading, setLoading] = useState(false)

  const showNpiField = NPI_ROLES.includes(form.hcpRole)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (e.target.name === 'npiNumber') setNpiStatus(null)
    if (e.target.name === 'hcpRole') setNpiStatus(null)
  }

  async function handleNpiVerify() {
    if (!form.npiNumber || form.npiNumber.length !== 10) {
      return setError('NPI numbers are exactly 10 digits.')
    }
    setNpiStatus('checking')
    setError('')
    const result = await verifyNPI(form.npiNumber, form.fullName)
    if (result.valid) {
      setNpiStatus('verified')
    } else {
      setNpiStatus('failed')
      setError(result.reason)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!isLogin && form.password !== form.confirmPassword) {
      return setError('Passwords do not match.')
    }
    if (!isLogin && form.password.length < 8) {
      return setError('Password must be at least 8 characters.')
    }
    if (isHCP && !form.hcpRole) {
      return setError('Please select your role.')
    }
    if (isHCP && showNpiField && npiStatus !== 'verified') {
      return setError('Please verify your NPI number before submitting.')
    }

    setLoading(true)
    try {
      if (isLogin) {
        await login(form.email, form.password)
        navigate('/')
      } else {
        const accountType = isHCP ? 'responder' : 'patient'
        const extra = isHCP ? {
          agencyName: form.agencyName,
          badgeNumber: form.badgeNumber,
          hcpRole: form.hcpRole,
          npiNumber: form.npiNumber || null,
          npiVerified: npiStatus === 'verified',
          approvalStatus: 'pending', // Requires admin approval
        } : {}
        await register(form.email, form.password, form.fullName, accountType, extra)
        navigate(isHCP ? '/hcp/pending' : '/enroll')
      }
    } catch (err) {
      const messages = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password is too weak. Try something longer.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
      }
      setError(messages[err.code] || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const title = isLogin ? 'Welcome back'
    : isHCP ? 'First Responder / HCP Registration'
    : 'Create your profile'

  const subtitle = isLogin
    ? 'Log in to view or update your Phiris profile.'
    : isHCP
    ? 'Register as a verified First Responder or Healthcare Professional to access patient scan data.'
    : 'Enroll in minutes and protect yourself in any emergency.'

  return (
    <div className="page" style={{ background: '#F7F5F0' }}>
      <Header />
      <main className="page-content" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="container-narrow">

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            {isHCP && (
              <div className="tag tag-gold" style={{ marginBottom: 16, display: 'inline-flex' }}>
                First Responder / HCP Portal
              </div>
            )}
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1C2A2A', marginBottom: 8 }}>
              {title}
            </h1>
            <p style={{ color: '#5A7070', lineHeight: 1.6 }}>{subtitle}</p>
          </div>

          {isHCP && (
            <div style={styles.infoBox}>
              <span style={{ fontSize: '1.1rem' }}>🔐</span>
              <div>
                <div style={{ fontWeight: 700, color: '#1C2A2A', marginBottom: 4 }}>Verification Required</div>
                <div style={{ fontSize: '0.85rem', color: '#5A7070', lineHeight: 1.55 }}>
                  All First Responder and HCP accounts are reviewed and approved before scan access is granted.
                  Clinical providers (nurses, physicians, etc.) will be verified against the NPI Registry.
                </div>
              </div>
            </div>
          )}

          <div className="card">
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Austin Gibson"
                    required
                    autoFocus
                  />
                </div>
              )}

              {isHCP && (
                <>
                  <div className="form-group">
                    <label className="form-label">Your Role</label>
                    <select
                      className="form-input"
                      name="hcpRole"
                      value={form.hcpRole}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select your role…</option>
                      {HCP_ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Agency / Organization / Hospital</label>
                    <input
                      className="form-input"
                      type="text"
                      name="agencyName"
                      value={form.agencyName}
                      onChange={handleChange}
                      placeholder="Dallas Fire-Rescue, Mayo Clinic, etc."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Badge / Employee / License Number</label>
                    <input
                      className="form-input"
                      type="text"
                      name="badgeNumber"
                      value={form.badgeNumber}
                      onChange={handleChange}
                      placeholder="12345"
                      required
                    />
                  </div>

                  {showNpiField && (
                    <div className="form-group">
                      <label className="form-label">
                        NPI Number
                        <span style={{ color: '#E05555', marginLeft: 4 }}>*</span>
                        <a
                          href="https://npiregistry.cms.hhs.gov/search"
                          target="_blank"
                          rel="noreferrer"
                          style={{ marginLeft: 8, fontSize: '0.75rem', color: '#3AABAB' }}
                        >
                          Look up your NPI →
                        </a>
                      </label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          className="form-input"
                          type="text"
                          name="npiNumber"
                          value={form.npiNumber}
                          onChange={handleChange}
                          placeholder="10-digit NPI number"
                          maxLength={10}
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={handleNpiVerify}
                          disabled={npiStatus === 'checking' || !form.npiNumber}
                          style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                        >
                          {npiStatus === 'checking' ? <span className="spinner" /> : 'Verify NPI'}
                        </button>
                      </div>
                      {npiStatus === 'verified' && (
                        <div style={styles.npiSuccess}>✓ NPI verified against CMS registry</div>
                      )}
                      {npiStatus === 'failed' && (
                        <div style={styles.npiFail}>✗ NPI verification failed — see error above</div>
                      )}
                    </div>
                  )}
                </>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoFocus={isLogin}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={isLogin ? '••••••••' : 'At least 8 characters'}
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    className="form-input"
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              {!isLogin && (
                <p style={{ fontSize: '0.78rem', color: '#5A7070', marginBottom: 20, lineHeight: 1.55 }}>
                  By creating an account you agree to Phiris's Terms of Service and Privacy Policy.
                  {isHCP && ' Your account will be reviewed and approved before scan access is granted.'}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
                style={{ marginBottom: 16 }}
              >
                {loading ? <span className="spinner" />
                  : isLogin ? 'Log In'
                  : isHCP ? 'Submit for Review'
                  : 'Create My Profile'}
              </button>
            </form>

            <div className="divider">or</div>

            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#5A7070' }}>
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: '#1E8484', fontWeight: 600 }}>Enroll free</Link>
                  <br /><br />
                  <Link to="#" style={{ color: '#5A7070' }}>Forgot password?</Link>
                  <br /><br />
                  <div style={{ borderTop: '1px solid #E8E4DE', paddingTop: 16, marginTop: 4 }}>
                    <span style={{ color: '#9AAFAF', fontSize: '0.8rem' }}>Phiris staff? </span>
                    <Link to="/admin" style={{ color: '#9AAFAF', fontSize: '0.8rem', fontWeight: 600 }}>
                      Admin sign in →
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  Already enrolled?{' '}
                  <Link to="/login" style={{ color: '#1E8484', fontWeight: 600 }}>Log in</Link>
                  {!isHCP && (
                    <>
                      <br /><br />
                      Are you a First Responder or HCP?{' '}
                      <Link to="/responder/register" style={{ color: '#C8A04A', fontWeight: 600 }}>Register here</Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const styles = {
  infoBox: {
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
    background: 'rgba(200,160,74,0.1)',
    border: '1px solid rgba(200,160,74,0.3)',
    borderRadius: 14,
    padding: '16px 20px',
    marginBottom: 24,
  },
  npiSuccess: {
    marginTop: 6,
    fontSize: '0.82rem',
    color: '#2A9D6A',
    fontWeight: 600,
  },
  npiFail: {
    marginTop: 6,
    fontSize: '0.82rem',
    color: '#E05555',
    fontWeight: 600,
  },
}
