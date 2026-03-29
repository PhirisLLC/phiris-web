import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

function generateToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function AdminTeam() {
  const { userProfile } = useAuth()
  const isMaster = userProfile?.adminRole === 'master'

  const [admins, setAdmins]       = useState([])
  const [invites, setInvites]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [copied, setCopied]       = useState('')
  const [generating, setGenerating] = useState(false)
  const [promotingId, setPromotingId] = useState('')
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')

  // Email invite form
  const [inviteEmail, setInviteEmail] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const usersSnap = await getDocs(collection(db, 'users'))
      const allAdmins = usersSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(u => u.accountType === 'admin')
        .sort((a, b) => {
          if (a.adminRole === 'master' && b.adminRole !== 'master') return -1
          if (b.adminRole === 'master' && a.adminRole !== 'master') return 1
          return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
        })
      setAdmins(allAdmins)

      const invitesSnap = await getDocs(collection(db, 'adminInvites'))
      setInvites(invitesSnap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Create invite token in Firestore, returns { token, url }
  async function createInviteToken(recipientEmail = null) {
    const token = generateToken()
    const inviteRef = doc(collection(db, 'adminInvites'))
    await setDoc(inviteRef, {
      token,
      createdAt: serverTimestamp(),
      used: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ...(recipientEmail ? { sentTo: recipientEmail } : {}),
    })
    const url = `${window.location.origin}/admin/register?invite=${token}`
    return { token, url }
  }

  // Generate link only (no email)
  async function generateInvite() {
    setGenerating(true)
    setError('')
    setSuccess('')
    try {
      await createInviteToken()
      await fetchAll()
    } catch (e) {
      console.error('Generate invite error:', e)
      if (e.code === 'permission-denied') {
        setError('Permission denied — publish your Firestore security rules first (Firebase Console → Firestore → Rules).')
      } else {
        setError(`Failed to generate invite: ${e.message}`)
      }
    } finally {
      setGenerating(false)
    }
  }

  // Generate link AND send via email
  async function sendEmailInvite(e) {
    e.preventDefault()
    if (!inviteEmail) return
    setSendingEmail(true)
    setError('')
    setSuccess('')
    try {
      // 1. Create the invite token
      const { url } = await createInviteToken(inviteEmail)

      // 2. Send via EmailJS REST API
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        // EmailJS not configured yet — still created the link, tell user
        await fetchAll()
        setSuccess(`Invite link created! EmailJS isn't configured yet so the email wasn't sent automatically. Copy the link below to send manually.`)
        setInviteEmail('')
        return
      }

      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email:    inviteEmail,
            invite_link: url,
            from_name:   'Phiris Leadership',
            reply_to:    'austin@phiris.com',
          },
        }),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`EmailJS error: ${txt}`)
      }

      await fetchAll()
      setSuccess(`Invite sent to ${inviteEmail}! They'll receive an email with the signup link.`)
      setInviteEmail('')
    } catch (e) {
      console.error('Send invite error:', e)
      if (e.code === 'permission-denied') {
        setError('Permission denied — publish your Firestore security rules first.')
      } else {
        setError(`Failed to send invite: ${e.message}`)
      }
    } finally {
      setSendingEmail(false)
    }
  }

  async function revokeInvite(id) {
    try {
      await deleteDoc(doc(db, 'adminInvites', id))
      setInvites(inv => inv.filter(i => i.id !== id))
    } catch (e) {
      setError(`Failed to revoke: ${e.message}`)
    }
  }

  async function setAdminRole(adminId, newRole) {
    setPromotingId(adminId)
    try {
      await updateDoc(doc(db, 'users', adminId), { adminRole: newRole })
      setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, adminRole: newRole } : a))
    } finally {
      setPromotingId('')
    }
  }

  function copyLink(token) {
    const url = `${window.location.origin}/admin/register?invite=${token}`
    navigator.clipboard.writeText(url)
    setCopied(token)
    setTimeout(() => setCopied(''), 2500)
  }

  const currentUserId = userProfile?.uid
  const emailjsConfigured = !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY)

  return (
    <div style={{ background: '#0D1A1A', minHeight: '100vh' }}>
      <Header variant="dark" />
      <main style={{ padding: '28px 0 64px' }}>
        <div className="container" style={{ maxWidth: 760 }}>

          {/* Nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <Link to="/admin" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', textDecoration: 'none' }}>
                ← Admin Portal
              </Link>
              <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, marginTop: 8, letterSpacing: '-0.02em' }}>
                Team & Access
              </h1>
            </div>
          </div>

          {/* Error / Success banners */}
          {error && (
            <div style={styles.alertBanner('error')}>⚠️ {error}</div>
          )}
          {success && (
            <div style={styles.alertBanner('success')}>✓ {success}</div>
          )}

          {/* Permission level banner for staff */}
          {!isMaster && (
            <div style={styles.staffBanner}>
              <span style={{ marginRight: 8 }}>🔒</span>
              You have <strong>Staff Admin</strong> access. Only Master Admins can send invites or change roles.
            </div>
          )}

          {/* Current admins */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Admin Accounts</span>
              <span style={styles.count}>{admins.length}</span>
            </div>

            {/* Permission legend */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ ...styles.roleBadge, background: 'rgba(212,168,71,0.15)', border: '1px solid rgba(212,168,71,0.35)', color: '#D4A847' }}>Master</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>Full access — invites, roles, all data</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ ...styles.roleBadge, background: 'rgba(58,171,171,0.12)', border: '1px solid rgba(58,171,171,0.25)', color: '#3AABAB' }}>Staff</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>Approve/reject HCPs, view users</span>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <div className="spinner spinner-teal" style={{ margin: '0 auto' }} />
              </div>
            ) : admins.length === 0 ? (
              <p style={styles.empty}>No admin accounts found.</p>
            ) : (
              admins.map(admin => {
                const isSelf = admin.id === currentUserId
                const role = admin.adminRole || 'staff'
                const isMasterAdmin = role === 'master'
                return (
                  <div key={admin.id} style={styles.row}>
                    <div style={styles.avatar}>
                      {admin.fullName?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{admin.fullName}</span>
                        {isSelf && (
                          <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)', borderRadius: 100, padding: '2px 8px', fontSize: '0.65rem', fontWeight: 700 }}>YOU</span>
                        )}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: 2 }}>{admin.email}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{
                        ...styles.roleBadge,
                        background: isMasterAdmin ? 'rgba(212,168,71,0.15)' : 'rgba(58,171,171,0.12)',
                        border: isMasterAdmin ? '1px solid rgba(212,168,71,0.35)' : '1px solid rgba(58,171,171,0.25)',
                        color: isMasterAdmin ? '#D4A847' : '#3AABAB',
                      }}>
                        {isMasterAdmin ? '★ Master' : 'Staff'}
                      </span>
                      {isMaster && !isSelf && (
                        <button
                          onClick={() => setAdminRole(admin.id, isMasterAdmin ? 'staff' : 'master')}
                          disabled={promotingId === admin.id}
                          style={{
                            ...styles.actionBtn,
                            color: isMasterAdmin ? '#E05555' : '#D4A847',
                            borderColor: isMasterAdmin ? 'rgba(224,85,85,0.3)' : 'rgba(212,168,71,0.3)',
                            opacity: promotingId === admin.id ? 0.5 : 1,
                          }}
                        >
                          {promotingId === admin.id ? '…' : isMasterAdmin ? 'Demote' : 'Make Master'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Invite section — master only */}
          {isMaster && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>Invite Staff</span>
              </div>

              {/* Email invite form */}
              <div style={styles.emailInviteBox}>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>
                    Send Invite by Email
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>
                    Generates a link and emails it directly — invite expires in 7 days.
                    {!emailjsConfigured && (
                      <span style={{ color: '#D4A847' }}> (EmailJS not configured yet — link will be created but email won't send. See setup instructions below.)</span>
                    )}
                  </div>
                </div>
                <form onSubmit={sendEmailInvite} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    required
                    style={styles.emailInput}
                  />
                  <button
                    type="submit"
                    disabled={sendingEmail || !inviteEmail}
                    style={{
                      ...styles.sendBtn,
                      opacity: sendingEmail || !inviteEmail ? 0.6 : 1,
                    }}
                  >
                    {sendingEmail ? 'Sending…' : '✉ Send Invite'}
                  </button>
                </form>
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em' }}>OR</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              </div>

              {/* Generate link only */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>
                  Generate a link to copy and share yourself.
                </div>
                <button
                  onClick={generateInvite}
                  disabled={generating}
                  style={{ ...styles.actionBtn, color: '#3AABAB', borderColor: 'rgba(58,171,171,0.3)', padding: '8px 18px' }}
                >
                  {generating ? 'Generating…' : '+ Generate Link Only'}
                </button>
              </div>
            </div>
          )}

          {/* Active invite links */}
          {isMaster && invites.filter(i => !i.used).length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>Active Invite Links</span>
                <span style={styles.count}>{invites.filter(i => !i.used).length}</span>
              </div>

              {invites.filter(i => !i.used).map(invite => {
                const url = `${window.location.origin}/admin/register?invite=${invite.token}`
                const isCopied = copied === invite.token
                const expires = invite.expiresAt?.toDate?.()?.toLocaleDateString() || '7 days'
                return (
                  <div key={invite.id} style={styles.inviteRow}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                        {invite.sentTo && (
                          <span style={{ color: '#3AABAB', fontSize: '0.75rem', fontWeight: 600 }}>
                            ✉ {invite.sentTo}
                          </span>
                        )}
                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>
                          Expires {expires}
                        </span>
                      </div>
                      <div style={styles.inviteUrl}>{url}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => copyLink(invite.token)}
                        style={{ ...styles.actionBtn, color: isCopied ? '#2A9D6A' : '#3AABAB', borderColor: isCopied ? 'rgba(42,157,106,0.4)' : 'rgba(58,171,171,0.3)' }}
                      >
                        {isCopied ? '✓ Copied!' : 'Copy Link'}
                      </button>
                      <button
                        onClick={() => revokeInvite(invite.id)}
                        style={{ ...styles.actionBtn, color: '#E05555', borderColor: 'rgba(224,85,85,0.3)' }}
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Used invites */}
              {invites.filter(i => i.used).length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10 }}>USED</div>
                  {invites.filter(i => i.used).map(invite => (
                    <div key={invite.id} style={{ ...styles.inviteRow, opacity: 0.4 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {invite.sentTo && <div style={{ color: '#3AABAB', fontSize: '0.72rem', marginBottom: 2 }}>✉ {invite.sentTo}</div>}
                        <div style={styles.inviteUrl}>{`${window.location.origin}/admin/register?invite=${invite.token}`}</div>
                        {invite.usedBy && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: 2 }}>Used by: {invite.usedBy}</div>}
                      </div>
                      <span style={{ color: '#2A9D6A', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>✓ Used</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EmailJS setup instructions */}
          {isMaster && !emailjsConfigured && (
            <div style={styles.setupBox}>
              <div style={{ color: '#D4A847', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>
                ⚡ Set up email sending (5 minutes)
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', lineHeight: 1.7 }}>
                <strong style={{ color: 'rgba(255,255,255,0.65)' }}>1.</strong> Go to <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3AABAB' }}>emailjs.com</a> → create a free account<br/>
                <strong style={{ color: 'rgba(255,255,255,0.65)' }}>2.</strong> Add an Email Service → connect your Gmail (austin@phiris.com)<br/>
                <strong style={{ color: 'rgba(255,255,255,0.65)' }}>3.</strong> Create an Email Template with these variables:<br/>
                <code style={styles.code}>{'{{to_email}}'}</code> <code style={styles.code}>{'{{invite_link}}'}</code> <code style={styles.code}>{'{{from_name}}'}</code><br/>
                <strong style={{ color: 'rgba(255,255,255,0.65)' }}>4.</strong> Copy your Service ID, Template ID, and Public Key into <code style={styles.code}>.env</code>:<br/>
                <pre style={styles.pre}>{`VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxx`}</pre>
                <strong style={{ color: 'rgba(255,255,255,0.65)' }}>5.</strong> Restart the dev server (<code style={styles.code}>npm run dev</code>)
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

const styles = {
  alertBanner: (type) => ({
    background: type === 'error' ? 'rgba(224,85,85,0.1)' : 'rgba(42,157,106,0.1)',
    border: `1px solid ${type === 'error' ? 'rgba(224,85,85,0.35)' : 'rgba(42,157,106,0.3)'}`,
    color: type === 'error' ? '#F08080' : '#2A9D6A',
    borderRadius: 12,
    padding: '14px 18px',
    fontSize: '0.85rem',
    marginBottom: 16,
    lineHeight: 1.55,
  }),
  staffBanner: {
    background: 'rgba(58,171,171,0.07)',
    border: '1px solid rgba(58,171,171,0.2)',
    color: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    padding: '12px 18px',
    fontSize: '0.82rem',
    marginBottom: 20,
    lineHeight: 1.5,
  },
  section: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: '20px 24px',
    marginBottom: 16,
  },
  sectionHeader: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.72rem', fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase',
  },
  count: {
    background: 'rgba(58,171,171,0.15)', color: '#3AABAB',
    borderRadius: 100, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 800,
  },
  row: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  avatar: {
    width: 38, height: 38, borderRadius: '50%',
    background: 'linear-gradient(135deg, #155F5F, #3AABAB)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
  },
  roleBadge: {
    borderRadius: 100, padding: '3px 11px',
    fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap',
  },
  empty: {
    color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0,
  },
  emailInviteBox: {
    background: 'rgba(58,171,171,0.06)',
    border: '1px solid rgba(58,171,171,0.15)',
    borderRadius: 12,
    padding: '16px 20px',
    marginBottom: 8,
  },
  emailInput: {
    flex: 1,
    minWidth: 200,
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '10px 14px',
    color: 'white',
    fontSize: '0.9rem',
    outline: 'none',
  },
  sendBtn: {
    background: 'linear-gradient(90deg, #155F5F, #1E8484)',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  inviteRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  inviteUrl: {
    color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem',
    fontFamily: 'monospace', overflow: 'hidden',
    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  actionBtn: {
    background: 'none', border: '1px solid', borderRadius: 8,
    padding: '6px 14px', fontSize: '0.75rem', fontWeight: 600,
    cursor: 'pointer', whiteSpace: 'nowrap',
  },
  setupBox: {
    background: 'rgba(212,168,71,0.05)',
    border: '1px solid rgba(212,168,71,0.2)',
    borderRadius: 16, padding: '20px 24px', marginBottom: 16,
  },
  code: {
    background: 'rgba(255,255,255,0.08)', borderRadius: 4,
    padding: '2px 6px', fontSize: '0.75rem', fontFamily: 'monospace',
    color: '#3AABAB',
  },
  pre: {
    background: 'rgba(0,0,0,0.3)', borderRadius: 8,
    padding: '12px 14px', fontSize: '0.75rem', fontFamily: 'monospace',
    color: 'rgba(255,255,255,0.6)', margin: '8px 0', overflowX: 'auto',
    whiteSpace: 'pre',
  },
}
