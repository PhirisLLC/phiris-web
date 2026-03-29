import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import Header from '../../components/Header'

export default function AdminUserDetail() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  useEffect(() => { fetchUser() }, [userId])

  async function fetchUser() {
    const snap = await getDoc(doc(db, 'users', userId))
    if (snap.exists()) setUser({ id: snap.id, ...snap.data() })
    setLoading(false)
  }

  async function updateApproval(status) {
    setActing(true)
    await updateDoc(doc(db, 'users', userId), { approvalStatus: status })
    await fetchUser()
    setActing(false)
  }

  if (loading) return (
    <div style={{ background: '#0D1A1A', minHeight: '100vh' }}>
      <Header variant="dark" />
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <div className="spinner spinner-teal" />
      </div>
    </div>
  )

  if (!user) return null

  const isHCP = user.accountType === 'responder'
  const isPending = isHCP && user.approvalStatus === 'pending'
  const joinedDate = user.createdAt?.toDate?.()?.toLocaleDateString() || '—'
  const enrolledDate = user.enrolledAt?.toDate?.()?.toLocaleDateString() || '—'

  return (
    <div style={{ background: '#0D1A1A', minHeight: '100vh' }}>
      <Header variant="dark" />
      <main style={{ padding: '28px 0 56px' }}>
        <div className="container" style={{ maxWidth: 680 }}>

          <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: 20 }}>
            ← Back to Dashboard
          </button>

          {/* Identity */}
          <div style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={styles.avatar}>
                {user.photoUrl
                  ? <img src={user.photoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : <span style={{ color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>{user.fullName?.[0]}</span>
                }
              </div>
              <div>
                <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.4rem', marginBottom: 4 }}>{user.fullName}</h1>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>{user.email}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                {isHCP
                  ? <span style={styles.tagGold}>HCP / Responder</span>
                  : <span style={styles.tagTeal}>Patient</span>
                }
              </div>
            </div>

            <div style={styles.infoGrid}>
              <InfoRow label="Joined" value={joinedDate} />
              <InfoRow label="UID" value={user.uid} mono />
              {user.accountType === 'patient' && <>
                <InfoRow label="Enrollment" value={user.enrollmentComplete ? `Complete (${enrolledDate})` : 'Incomplete'} />
                <InfoRow label="Blood Type" value={user.bloodType || '—'} />
                <InfoRow label="DOB" value={user.dateOfBirth || '—'} />
              </>}
              {isHCP && <>
                <InfoRow label="Agency" value={user.agencyName || '—'} />
                <InfoRow label="Role" value={user.hcpRole || '—'} />
                <InfoRow label="Badge #" value={user.badgeNumber || '—'} />
                <InfoRow label="NPI Number" value={user.npiNumber || '—'} />
                <InfoRow label="NPI Verified" value={user.npiVerified ? '✓ Yes' : 'No'} />
                <InfoRow label="Approval Status" value={user.approvalStatus || 'none'} />
              </>}
            </div>
          </div>

          {/* HCP Approval Actions */}
          {isHCP && (
            <div style={styles.card}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 16 }}>
                APPROVAL ACTIONS
              </div>

              {isPending && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => updateApproval('approved')}
                    disabled={acting}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    ✓ Approve — Grant Scan Access
                  </button>
                  <button
                    onClick={() => updateApproval('rejected')}
                    disabled={acting}
                    style={{ flex: 1, background: 'rgba(224,85,85,0.15)', border: '1px solid rgba(224,85,85,0.4)', color: '#E05555', borderRadius: 12, padding: '12px', cursor: 'pointer', fontWeight: 700 }}
                  >
                    ✗ Reject Application
                  </button>
                </div>
              )}
              {user.approvalStatus === 'approved' && (
                <div>
                  <div style={{ color: '#2A9D6A', fontWeight: 700, marginBottom: 12 }}>✓ Account is approved — scan access granted</div>
                  <button onClick={() => updateApproval('rejected')} disabled={acting} style={{ background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.3)', color: '#E05555', borderRadius: 10, padding: '8px 18px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    Revoke Access
                  </button>
                </div>
              )}
              {user.approvalStatus === 'rejected' && (
                <div>
                  <div style={{ color: '#E05555', fontWeight: 700, marginBottom: 12 }}>✗ Application rejected</div>
                  <button onClick={() => updateApproval('approved')} disabled={acting} style={{ background: 'rgba(42,157,106,0.1)', border: '1px solid rgba(42,157,106,0.3)', color: '#2A9D6A', borderRadius: 10, padding: '8px 18px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    Re-approve Account
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Medical info for patients */}
          {user.accountType === 'patient' && user.enrollmentComplete && (
            <div style={styles.card}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 16 }}>
                MEDICAL PROFILE
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {(user.allergies || []).map(a => <span key={a} style={styles.tagRed}>{a}</span>)}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {(user.conditions || []).map(c => <span key={c} style={styles.tagAmber}>{c}</span>)}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(user.medications || []).map(m => <span key={m} style={styles.tagTeal}>{m}</span>)}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

function InfoRow({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>{label}</span>
      <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontFamily: mono ? 'monospace' : 'inherit', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
    </div>
  )
}

const styles = {
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '20px 24px',
    marginBottom: 16,
  },
  avatar: {
    width: 56, height: 56,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #155F5F, #3AABAB)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, overflow: 'hidden',
  },
  infoGrid: { display: 'flex', flexDirection: 'column' },
  tagTeal: { background: 'rgba(58,171,171,0.15)', border: '1px solid rgba(58,171,171,0.3)', color: '#3AABAB', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 },
  tagGold: { background: 'rgba(212,168,71,0.15)', border: '1px solid rgba(212,168,71,0.3)', color: '#D4A847', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 },
  tagGreen: { background: 'rgba(42,157,106,0.15)', border: '1px solid rgba(42,157,106,0.3)', color: '#2A9D6A', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 },
  tagRed: { background: 'rgba(224,85,85,0.15)', border: '1px solid rgba(224,85,85,0.3)', color: '#F08080', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 },
  tagAmber: { background: 'rgba(212,168,71,0.15)', border: '1px solid rgba(212,168,71,0.3)', color: '#D4A847', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 },
}
