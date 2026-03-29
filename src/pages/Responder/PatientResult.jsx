import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import Header from '../../components/Header'

export default function PatientResult() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchPatient() {
      try {
        const ref = doc(db, 'users', patientId)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          setError('Patient record not found.')
        } else {
          setPatient({ id: snap.id, ...snap.data() })
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load patient data.')
      } finally {
        setLoading(false)
      }
    }
    fetchPatient()
  }, [patientId])

  if (loading) {
    return (
      <div style={{ background: '#0D1A1A', minHeight: '100vh' }}>
        <Header variant="dark" />
        <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner spinner-teal" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Loading patient data…</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div style={{ background: '#0D1A1A', minHeight: '100vh' }}>
        <Header variant="dark" />
        <main style={{ padding: '32px 0' }}>
          <div className="container" style={{ maxWidth: 560, textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
            <h2 style={{ color: 'white', fontWeight: 700, marginBottom: 12 }}>Patient Not Found</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>
              {error || 'This patient record could not be loaded.'}
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/responder/scan')}>
              New Scan
            </button>
          </div>
        </main>
      </div>
    )
  }

  const {
    fullName, photoUrl, bloodType, sex, dateOfBirth, height, weight,
    allergies = [], conditions = [], medications = [], additionalNotes,
    dnr, organDonor, emergencyContacts = []
  } = patient

  const age = dateOfBirth ? getAge(dateOfBirth) : null

  return (
    <div style={{ background: '#0D1A1A', minHeight: '100vh' }}>
      <Header variant="dark" />
      <main style={{ padding: '24px 0 48px' }}>
        <div className="container" style={{ maxWidth: 680 }}>

          {/* Nav */}
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/responder/scan')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              ← New Scan
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3AABAB', boxShadow: '0 0 8px #3AABAB' }} />
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: 500 }}>Match confirmed</span>
            </div>
          </div>

          {/* Patient identity card */}
          <div style={styles.identityCard}>
            <div style={styles.avatarArea}>
              {photoUrl
                ? <img src={photoUrl} alt={fullName} style={styles.avatar} />
                : <div style={styles.avatarFallback}>{fullName?.[0]?.toUpperCase()}</div>
              }
            </div>

            <div style={styles.identityInfo}>
              <div style={styles.matchBadge}>✓ PHIRIS MATCH</div>
              <h1 style={styles.patientName}>{fullName}</h1>
              <div style={styles.vitalsRow}>
                {age && <span style={styles.vitalPill}>{age} yrs</span>}
                {sex && <span style={styles.vitalPill}>{sex}</span>}
                {bloodType && <span style={{ ...styles.vitalPill, background: 'rgba(224,85,85,0.2)', borderColor: 'rgba(224,85,85,0.4)', color: '#F08080' }}>🩸 {bloodType}</span>}
                {height && <span style={styles.vitalPill}>{height}</span>}
                {weight && <span style={styles.vitalPill}>{weight}</span>}
              </div>
            </div>

            {/* Critical flags */}
            <div style={styles.flagsArea}>
              {dnr && (
                <div style={styles.dnrBadge}>
                  <span style={{ fontSize: '1.1rem' }}>🚫</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em' }}>DNR ON FILE</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Do Not Resuscitate</div>
                  </div>
                </div>
              )}
              {organDonor && (
                <div style={styles.donorBadge}>
                  <span style={{ fontSize: '1.1rem' }}>💙</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em' }}>ORGAN DONOR</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Registered donor</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Allergies — highlighted at top for emergency priority */}
          {allergies.length > 0 && (
            <div style={styles.allergySection}>
              <div style={styles.sectionHeaderAlert}>
                <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                <span style={{ fontWeight: 800, letterSpacing: '0.04em', fontSize: '0.85rem' }}>KNOWN ALLERGIES</span>
              </div>
              <div style={styles.tagRow}>
                {allergies.map(a => (
                  <span key={a} style={styles.allergyTag}>{a}</span>
                ))}
              </div>
            </div>
          )}

          <div style={styles.grid}>

            {/* Medical conditions */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>🏥</span>
                <span style={styles.cardTitle}>Medical Conditions</span>
              </div>
              {conditions.length > 0
                ? <div style={styles.tagRow}>
                    {conditions.map(c => (
                      <span key={c} style={styles.conditionTag}>{c}</span>
                    ))}
                  </div>
                : <p style={styles.empty}>None on file</p>
              }
            </div>

            {/* Medications */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>💊</span>
                <span style={styles.cardTitle}>Current Medications</span>
              </div>
              {medications.length > 0
                ? <div style={styles.tagRow}>
                    {medications.map(m => (
                      <span key={m} style={styles.medTag}>{m}</span>
                    ))}
                  </div>
                : <p style={styles.empty}>None on file</p>
              }
            </div>

          </div>

          {/* Additional notes */}
          {additionalNotes && (
            <div style={{ ...styles.card, marginTop: 0 }}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>📋</span>
                <span style={styles.cardTitle}>Additional Notes</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
                {additionalNotes}
              </p>
            </div>
          )}

          {/* Emergency contacts */}
          <div style={{ ...styles.card, marginTop: 16 }}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>📞</span>
              <span style={styles.cardTitle}>Emergency Contacts</span>
            </div>
            {emergencyContacts.length > 0
              ? <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {emergencyContacts.map((c, i) => (
                    <div key={i} style={styles.contactRow}>
                      <div style={styles.contactAvatar}>{c.name?.[0]?.toUpperCase()}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{c.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginTop: 2 }}>
                          {c.relationship}
                        </div>
                      </div>
                      <a
                        href={`tel:${c.phone}`}
                        style={styles.callBtn}
                      >
                        📞 {c.phone}
                      </a>
                    </div>
                  ))}
                </div>
              : <p style={styles.empty}>No emergency contacts on file</p>
            }
          </div>

          {/* Audit footer */}
          <div style={styles.auditFooter}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.9rem' }}>🔒</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                This lookup has been logged for audit and compliance purposes.
              </span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>
              {new Date().toLocaleString()}
            </span>
          </div>

        </div>
      </main>
    </div>
  )
}

function getAge(dateOfBirth) {
  if (!dateOfBirth) return null
  const today = new Date()
  const birth = new Date(dateOfBirth)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

const styles = {
  identityCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(58,171,171,0.25)',
    borderRadius: 20,
    padding: '24px',
    marginBottom: 16,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 20,
    alignItems: 'flex-start',
  },
  avatarArea: { flexShrink: 0 },
  avatar: {
    width: 88, height: 88,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #3AABAB',
  },
  avatarFallback: {
    width: 88, height: 88,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #155F5F, #3AABAB)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', fontWeight: 800, color: 'white',
  },
  identityInfo: { flex: 1, minWidth: 180 },
  matchBadge: {
    display: 'inline-block',
    background: 'rgba(58,171,171,0.2)',
    border: '1px solid rgba(58,171,171,0.4)',
    color: '#3AABAB',
    fontSize: '0.65rem',
    fontWeight: 800,
    letterSpacing: '0.1em',
    padding: '3px 10px',
    borderRadius: 100,
    marginBottom: 8,
  },
  patientName: {
    color: 'white',
    fontSize: '1.75rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    marginBottom: 12,
    lineHeight: 1.1,
  },
  vitalsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  vitalPill: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.75)',
    fontSize: '0.78rem',
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: 100,
  },
  flagsArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    flexShrink: 0,
  },
  dnrBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(224,85,85,0.15)',
    border: '1.5px solid rgba(224,85,85,0.5)',
    borderRadius: 12,
    padding: '10px 14px',
    color: '#F08080',
  },
  donorBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(58,171,171,0.12)',
    border: '1.5px solid rgba(58,171,171,0.3)',
    borderRadius: 12,
    padding: '10px 14px',
    color: '#3AABAB',
  },
  allergySection: {
    background: 'rgba(224,85,85,0.1)',
    border: '1.5px solid rgba(224,85,85,0.35)',
    borderRadius: 16,
    padding: '16px 20px',
    marginBottom: 16,
  },
  sectionHeaderAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#F08080',
    marginBottom: 12,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
    marginBottom: 14,
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '18px 20px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardIcon: { fontSize: '1rem' },
  cardTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  allergyTag: {
    background: 'rgba(224,85,85,0.2)',
    border: '1px solid rgba(224,85,85,0.4)',
    color: '#F08080',
    fontSize: '0.82rem',
    fontWeight: 600,
    padding: '5px 12px',
    borderRadius: 100,
  },
  conditionTag: {
    background: 'rgba(200,160,74,0.15)',
    border: '1px solid rgba(200,160,74,0.35)',
    color: '#D4A847',
    fontSize: '0.82rem',
    fontWeight: 600,
    padding: '5px 12px',
    borderRadius: 100,
  },
  medTag: {
    background: 'rgba(58,171,171,0.15)',
    border: '1px solid rgba(58,171,171,0.3)',
    color: '#3AABAB',
    fontSize: '0.82rem',
    fontWeight: 600,
    padding: '5px 12px',
    borderRadius: 100,
  },
  empty: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: '0.85rem',
    fontStyle: 'italic',
    margin: 0,
  },
  contactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  contactAvatar: {
    width: 38, height: 38,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #155F5F, #3AABAB)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: 700, fontSize: '0.875rem',
    flexShrink: 0,
  },
  callBtn: {
    background: 'rgba(58,171,171,0.15)',
    border: '1px solid rgba(58,171,171,0.3)',
    color: '#3AABAB',
    borderRadius: 10,
    padding: '7px 14px',
    fontSize: '0.82rem',
    fontWeight: 600,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  auditFooter: {
    marginTop: 24,
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
}
