import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'

const TABS = ['All', 'Patients', 'HCPs — Pending', 'HCPs — Approved']

export default function AdminDashboard() {
  const { logout, userProfile } = useAuth()
  const isMaster = userProfile?.adminRole === 'master'
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'users'))
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      // Sort by createdAt descending client-side (avoids needing a Firestore index)
      all.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0
        const bTime = b.createdAt?.toMillis?.() || 0
        return bTime - aTime
      })
      setUsers(all)
    } catch (e) {
      console.error('Admin fetch error:', e)
      setError('Failed to load users. Check Firestore rules.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = !search || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    if (tab === 'Patients') return u.accountType === 'patient'
    if (tab === 'HCPs — Pending') return u.accountType === 'responder' && u.approvalStatus === 'pending'
    if (tab === 'HCPs — Approved') return u.accountType === 'responder' && u.approvalStatus === 'approved'
    return u.accountType !== 'admin'
  })

  const stats = {
    patients: users.filter(u => u.accountType === 'patient').length,
    enrolled: users.filter(u => u.accountType === 'patient' && u.enrollmentComplete).length,
    hcpPending: users.filter(u => u.accountType === 'responder' && u.approvalStatus === 'pending').length,
    hcpApproved: users.filter(u => u.accountType === 'responder' && u.approvalStatus === 'approved').length,
  }

  return (
    <div style={{ background: '#0D1A1A', minHeight: '100vh' }}>
      <Header variant="dark" />
      <main style={{ padding: '32px 0 64px' }}>
        <div className="container" style={{ maxWidth: 960 }}>

          {/* Header */}
          <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>ADMIN PORTAL</div>
              <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>User Management</h1>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {/* All admins can VIEW team; only masters can manage it */}
              <Link
                to="/admin/team"
                style={{ background: 'rgba(58,171,171,0.1)', border: '1px solid rgba(58,171,171,0.3)', color: '#3AABAB', borderRadius: 10, padding: '8px 18px', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}
              >
                👥 {isMaster ? 'Team & Access' : 'View Team'}
              </Link>
              <button onClick={fetchUsers} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '8px 18px', cursor: 'pointer', fontSize: '0.85rem' }}>
                ↻ Refresh
              </button>
            </div>
            {/* Role indicator */}
            {!isMaster && (
              <div style={{ width: '100%', marginTop: -8 }}>
                <span style={{ background: 'rgba(58,171,171,0.08)', border: '1px solid rgba(58,171,171,0.2)', color: 'rgba(58,171,171,0.6)', borderRadius: 100, padding: '3px 12px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em' }}>
                  STAFF ADMIN
                </span>
              </div>
            )}
            {isMaster && (
              <div style={{ width: '100%', marginTop: -8 }}>
                <span style={{ background: 'rgba(212,168,71,0.08)', border: '1px solid rgba(212,168,71,0.25)', color: 'rgba(212,168,71,0.7)', borderRadius: 100, padding: '3px 12px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em' }}>
                  ★ MASTER ADMIN
                </span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={styles.statsGrid}>
            {[
              { label: 'Total Patients', value: stats.patients, color: '#3AABAB' },
              { label: 'Enrolled', value: stats.enrolled, color: '#2A9D6A' },
              { label: 'HCPs Pending', value: stats.hcpPending, color: '#D4A847', alert: stats.hcpPending > 0 },
              { label: 'HCPs Approved', value: stats.hcpApproved, color: '#3AABAB' },
            ].map(s => (
              <div key={s.label} style={{ ...styles.statCard, borderColor: s.alert ? 'rgba(212,168,71,0.5)' : 'rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', marginTop: 4 }}>{s.label}</div>
                {s.alert && <div style={{ fontSize: '0.7rem', color: '#D4A847', marginTop: 4 }}>⚠ Needs review</div>}
              </div>
            ))}
          </div>

          {/* Tabs + Search */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    ...styles.tabBtn,
                    background: tab === t ? 'rgba(58,171,171,0.2)' : 'rgba(255,255,255,0.04)',
                    borderColor: tab === t ? 'rgba(58,171,171,0.5)' : 'rgba(255,255,255,0.08)',
                    color: tab === t ? '#3AABAB' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {t}
                  {t === 'HCPs — Pending' && stats.hcpPending > 0 && (
                    <span style={{ background: '#D4A847', color: '#0D1A1A', borderRadius: 100, padding: '1px 7px', fontSize: '0.65rem', fontWeight: 800, marginLeft: 6 }}>
                      {stats.hcpPending}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <input
              type="search"
              placeholder="Search name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* User Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div className="spinner spinner-teal" style={{ margin: '0 auto' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.3)' }}>No users found.</div>
          ) : (
            <div style={styles.table}>
              <div style={styles.tableHeader}>
                <span>User</span>
                <span>Type</span>
                <span>Status</span>
                <span>Joined</span>
                <span></span>
              </div>
              {filtered.map(user => (
                <UserRow key={user.id} user={user} onRefresh={fetchUsers} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function UserRow({ user, onRefresh }) {
  const [acting, setActing] = useState(false)

  async function updateApproval(status) {
    setActing(true)
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      await updateDoc(doc(db, 'users', user.id), { approvalStatus: status })
      await onRefresh()
    } finally {
      setActing(false)
    }
  }

  const isPatient = user.accountType === 'patient'
  const isHCP = user.accountType === 'responder'
  const isPending = isHCP && user.approvalStatus === 'pending'
  const isApproved = isHCP && user.approvalStatus === 'approved'
  const isRejected = isHCP && user.approvalStatus === 'rejected'

  const joinedDate = user.createdAt?.toDate?.()?.toLocaleDateString() || '—'

  return (
    <div style={styles.tableRow}>
      {/* User info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={styles.avatar}>
          {user.photoUrl
            ? <img src={user.photoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            : <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{user.fullName?.[0]?.toUpperCase()}</span>
          }
        </div>
        <div>
          <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{user.fullName}</div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{user.email}</div>
          {isHCP && user.agencyName && (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>{user.agencyName}</div>
          )}
        </div>
      </div>

      {/* Type */}
      <div>
        {isPatient && <span style={styles.tagTeal}>Patient</span>}
        {isHCP && (
          <div>
            <span style={styles.tagGold}>HCP / Responder</span>
            {user.hcpRole && <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', marginTop: 3 }}>{user.hcpRole}</div>}
            {user.npiVerified && <div style={{ color: '#2A9D6A', fontSize: '0.7rem', marginTop: 2 }}>✓ NPI verified</div>}
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        {isPatient && (
          user.enrollmentComplete
            ? <span style={styles.tagGreen}>Enrolled</span>
            : <span style={styles.tagGray}>Not enrolled</span>
        )}
        {isPending && <span style={styles.tagAmber}>⏳ Pending</span>}
        {isApproved && <span style={styles.tagGreen}>✓ Approved</span>}
        {isRejected && <span style={styles.tagRed}>✗ Rejected</span>}
      </div>

      {/* Joined */}
      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>{joinedDate}</div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link
          to={`/admin/users/${user.id}`}
          style={{ ...styles.actionBtn, color: '#3AABAB', borderColor: 'rgba(58,171,171,0.3)' }}
        >
          View
        </Link>
        {isPending && (
          <>
            <button
              onClick={() => updateApproval('approved')}
              disabled={acting}
              style={{ ...styles.actionBtn, color: '#2A9D6A', borderColor: 'rgba(42,157,106,0.4)', cursor: 'pointer' }}
            >
              ✓ Approve
            </button>
            <button
              onClick={() => updateApproval('rejected')}
              disabled={acting}
              style={{ ...styles.actionBtn, color: '#E05555', borderColor: 'rgba(224,85,85,0.3)', cursor: 'pointer' }}
            >
              ✗ Reject
            </button>
          </>
        )}
        {isApproved && (
          <button
            onClick={() => updateApproval('rejected')}
            disabled={acting}
            style={{ ...styles.actionBtn, color: '#E05555', borderColor: 'rgba(224,85,85,0.3)', cursor: 'pointer' }}
          >
            Revoke
          </button>
        )}
        {isRejected && (
          <button
            onClick={() => updateApproval('approved')}
            disabled={acting}
            style={{ ...styles.actionBtn, color: '#2A9D6A', borderColor: 'rgba(42,157,106,0.4)', cursor: 'pointer' }}
          >
            Re-approve
          </button>
        )}
      </div>
    </div>
  )
}

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid',
    borderRadius: 14,
    padding: '18px 20px',
  },
  tabBtn: {
    border: '1px solid',
    borderRadius: 10,
    padding: '7px 16px',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '8px 14px',
    color: 'white',
    fontSize: '0.85rem',
    outline: 'none',
    width: 220,
  },
  table: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1.2fr 1fr 1.8fr',
    padding: '12px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    gap: 12,
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1.2fr 1fr 1.8fr',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #155F5F, #3AABAB)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  tagTeal: { background: 'rgba(58,171,171,0.15)', border: '1px solid rgba(58,171,171,0.3)', color: '#3AABAB', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 },
  tagGold: { background: 'rgba(212,168,71,0.15)', border: '1px solid rgba(212,168,71,0.3)', color: '#D4A847', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 },
  tagGreen: { background: 'rgba(42,157,106,0.15)', border: '1px solid rgba(42,157,106,0.3)', color: '#2A9D6A', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 },
  tagGray: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 },
  tagAmber: { background: 'rgba(212,168,71,0.15)', border: '1px solid rgba(212,168,71,0.4)', color: '#D4A847', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 },
  tagRed: { background: 'rgba(224,85,85,0.15)', border: '1px solid rgba(224,85,85,0.3)', color: '#E05555', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 },
  actionBtn: { background: 'none', border: '1px solid', borderRadius: 8, padding: '5px 12px', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' },
}
