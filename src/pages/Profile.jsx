import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'

export default function Profile() {
  const { currentUser, userProfile, fetchUserProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!userProfile) return null

  const {
    fullName, email, photoUrl, bloodType, sex, dateOfBirth, height, weight,
    allergies = [], conditions = [], medications = [], additionalNotes,
    dnr, organDonor, emergencyContacts = [], enrolledAt, enrollmentComplete
  } = userProfile

  if (!enrollmentComplete) {
    return (
      <div className="page" style={{ background: '#F7F5F0' }}>
        <Header />
        <main className="page-content" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="container-narrow" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🧬</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>
              Complete Your Enrollment
            </h2>
            <p style={{ color: '#5A7070', marginBottom: 28 }}>
              You haven't finished setting up your Phiris profile yet.
            </p>
            <Link to="/enroll" className="btn btn-primary">
              Continue Enrollment
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="page" style={{ background: '#F7F5F0' }}>
      <Header />
      <main className="page-content">
        <div className="container" style={{ maxWidth: 800 }}>

          {/* Header card */}
          <div style={styles.profileHeader}>
            <div style={styles.avatarWrap}>
              {photoUrl
                ? <img src={photoUrl} alt={fullName} style={styles.avatar} />
                : <div style={styles.avatarPlaceholder}>{fullName?.[0]?.toUpperCase()}</div>
              }
              <div style={styles.enrolledBadge}>✓ Enrolled</div>
            </div>
            <div style={styles.profileMeta}>
              <h1 style={styles.profileName}>{fullName}</h1>
              <p style={styles.profileEmail}>{email}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {bloodType && <span className="tag tag-teal">Blood Type: {bloodType}</span>}
                {organDonor && <span className="tag tag-teal">Organ Donor</span>}
                {dnr && <span className="tag tag-red">DNR on File</span>}
              </div>
            </div>
            <Link to="/enroll" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }}>
              Edit Profile
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>

            {/* Vitals */}
            <div className="card card-sm">
              <h3 style={styles.cardTitle}>Personal Info</h3>
              <InfoRow label="Date of Birth" value={dateOfBirth || '—'} />
              <InfoRow label="Sex" value={sex || '—'} />
              <InfoRow label="Height" value={height || '—'} />
              <InfoRow label="Weight" value={weight || '—'} />
            </div>

            {/* Allergies */}
            <div className="card card-sm">
              <h3 style={styles.cardTitle}>Allergies</h3>
              {allergies.length > 0
                ? <div style={styles.tagList}>
                    {allergies.map(a => (
                      <span key={a} className="tag tag-red">{a}</span>
                    ))}
                  </div>
                : <p style={styles.empty}>No allergies on file</p>
              }
            </div>

            {/* Conditions */}
            <div className="card card-sm">
              <h3 style={styles.cardTitle}>Medical Conditions</h3>
              {conditions.length > 0
                ? <div style={styles.tagList}>
                    {conditions.map(c => (
                      <span key={c} className="tag tag-gold">{c}</span>
                    ))}
                  </div>
                : <p style={styles.empty}>No conditions on file</p>
              }
            </div>

            {/* Medications */}
            <div className="card card-sm">
              <h3 style={styles.cardTitle}>Medications</h3>
              {medications.length > 0
                ? <div style={styles.tagList}>
                    {medications.map(m => (
                      <span key={m} className="tag tag-teal">{m}</span>
                    ))}
                  </div>
                : <p style={styles.empty}>No medications on file</p>
              }
            </div>
          </div>

          {/* Additional notes */}
          {additionalNotes && (
            <div className="card card-sm" style={{ marginTop: 20 }}>
              <h3 style={styles.cardTitle}>Additional Notes</h3>
              <p style={{ color: '#5A7070', fontSize: '0.9rem', lineHeight: 1.65 }}>{additionalNotes}</p>
            </div>
          )}

          {/* Emergency contacts */}
          <div className="card card-sm" style={{ marginTop: 20 }}>
            <h3 style={styles.cardTitle}>Emergency Contacts</h3>
            {emergencyContacts.length > 0
              ? <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {emergencyContacts.map((c, i) => (
                    <div key={i} style={styles.contactRow}>
                      <div style={styles.contactIcon}>{c.name?.[0]?.toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1C2A2A' }}>{c.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#5A7070' }}>
                          {c.relationship} · {c.phone}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              : <p style={styles.empty}>No emergency contacts on file</p>
            }
          </div>

          {/* QR/share section placeholder */}
          <div className="card card-sm" style={{ marginTop: 20, textAlign: 'center', background: 'linear-gradient(135deg, #0D1A1A, #155F5F)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔒</div>
            <h3 style={{ color: 'white', marginBottom: 8, fontWeight: 700 }}>Your Profile is Protected</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 400, margin: '0 auto' }}>
              Your information is encrypted and only accessible to verified Phiris first responders during an active emergency.
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F0EDED' }}>
      <span style={{ fontSize: '0.85rem', color: '#5A7070', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1C2A2A' }}>{value}</span>
    </div>
  )
}

const styles = {
  profileHeader: {
    background: 'white',
    borderRadius: 20,
    padding: '28px 32px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #D4E5E5',
  },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: {
    width: 90, height: 90,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #3AABAB',
  },
  avatarPlaceholder: {
    width: 90, height: 90,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #155F5F, #3AABAB)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', fontWeight: 800, color: 'white',
  },
  enrolledBadge: {
    position: 'absolute',
    bottom: -4, right: -4,
    background: '#3AABAB',
    color: 'white',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 100,
    border: '2px solid white',
  },
  profileMeta: { flex: 1 },
  profileName: { fontSize: '1.5rem', fontWeight: 800, color: '#1C2A2A', letterSpacing: '-0.02em' },
  profileEmail: { color: '#5A7070', fontSize: '0.875rem', marginTop: 4 },
  cardTitle: {
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#5A7070',
    marginBottom: 14,
  },
  tagList: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  empty: { fontSize: '0.875rem', color: '#AAC0C0', fontStyle: 'italic' },
  contactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    width: 36, height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #155F5F, #3AABAB)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: 700, fontSize: '0.875rem',
    flexShrink: 0,
  },
}
