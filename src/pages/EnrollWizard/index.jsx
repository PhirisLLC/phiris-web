import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'
import Step0Consent  from './Step0Consent'
import Step1Personal from './Step1Personal'
import Step2Medical  from './Step2Medical'
import Step3Contacts from './Step3Contacts'
import Step4Photo    from './Step4Photo'

// Compress photo and return as base64 data URL (avoids Firebase Storage requirement)
function compressAndEncodePhoto(file, maxSize = 400) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.75))
    }
    img.onerror = reject
    img.src = url
  })
}

const STORAGE_KEY = 'phiris_enroll_draft'

const STEPS = [
  { id: 1, label: 'Personal Info',    short: 'Personal'  },
  { id: 2, label: 'Medical Details',  short: 'Medical'   },
  { id: 3, label: 'Emergency Contacts', short: 'Contacts' },
  { id: 4, label: 'Your Photo',       short: 'Photo'     },
]

const DEFAULT_DATA = {
  dateOfBirth: '',
  bloodType: '',
  sex: '',
  heightFt: '',
  heightIn: '',
  weightLbs: '',
  allergies: [],
  conditions: [],
  medications: [],
  dnr: false,
  organDonor: false,
  additionalNotes: '',
  contacts: [{ name: '', phone: '', relationship: '' }],
  photoFile: null,
  photoPreview: null,
}

export default function EnrollWizard() {
  const { currentUser, fetchUserProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [hasDraft, setHasDraft] = useState(false)

  // Load saved draft on mount
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...DEFAULT_DATA, ...parsed, photoFile: null, photoPreview: null }
      }
    } catch {}
    return DEFAULT_DATA
  })

  // Check if a draft exists to show resume banner
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        const hasContent = parsed.dateOfBirth || parsed.bloodType || parsed.allergies?.length
        setHasDraft(!!hasContent)
      }
    } catch {}
  }, [])

  function updateData(patch) {
    setData(prev => {
      const next = { ...prev, ...patch }
      // Save to localStorage (exclude file objects)
      try {
        const { photoFile, photoPreview, ...saveable } = next
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saveable))
      } catch {}
      return next
    })
  }

  function clearDraft() {
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
    setHasDraft(false)
  }

  function handleNext() {
    setError('')
    setStep(s => Math.min(s + 1, STEPS.length))
  }

  function handleBack() {
    setError('')
    setStep(s => Math.max(s - 1, 1))
  }

  // Consent step shown before the main wizard
  if (step === 0) {
    return (
      <div className="page" style={{ background: '#F7F5F0' }}>
        <Header />
        <main className="page-content">
          <div className="container-narrow">
            {hasDraft && (
              <div style={{
                background: '#E6F4F4', border: '1.5px solid #3AABAB', borderRadius: 10,
                padding: '12px 16px', marginBottom: 20, display: 'flex',
                alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <span style={{ fontSize: '0.88rem', color: '#155F5F', fontWeight: 600 }}>
                  You have a saved draft. Your progress will be restored after you agree below.
                </span>
                <button
                  onClick={clearDraft}
                  style={{ background: 'none', border: 'none', color: '#5A7070', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Start fresh
                </button>
              </div>
            )}
            <div style={{ marginBottom: 28 }}>
              <div className="tag tag-teal" style={{ marginBottom: 10, display: 'inline-flex' }}>
                Before You Begin
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1C2A2A' }}>
                Your Consent & Privacy
              </h1>
            </div>
            <div className="card">
              <Step0Consent onNext={() => setStep(1)} />
            </div>
          </div>
        </main>
      </div>
    )
  }

  async function handleFinish() {
    setSaving(true)
    setError('')
    try {
      let photoUrl = null

      // Convert photo to compressed base64 and store in Firestore
      if (data.photoFile) {
        photoUrl = await compressAndEncodePhoto(data.photoFile, 400)
      }

      // Save everything to Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        // Personal
        dateOfBirth: data.dateOfBirth,
        bloodType: data.bloodType,
        sex: data.sex,
        height: `${data.heightFt}'${data.heightIn}"`,
        weight: `${data.weightLbs} lbs`,
        // Medical
        allergies: data.allergies,
        conditions: data.conditions,
        medications: data.medications,
        dnr: data.dnr,
        organDonor: data.organDonor,
        additionalNotes: data.additionalNotes,
        // Contacts
        emergencyContacts: data.contacts.filter(c => c.name && c.phone),
        // Photo
        photoUrl,
        // Status
        enrollmentComplete: true,
        enrolledAt: serverTimestamp(),
        consentGivenAt: serverTimestamp(),
      })

      clearDraft()
      await fetchUserProfile(currentUser.uid)
      navigate('/profile')
    } catch (err) {
      console.error(err)
      setError('Failed to save your profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="page" style={{ background: '#F7F5F0' }}>
      <Header />
      <main className="page-content">
        <div className="container-narrow">

          {/* Progress bar */}
          <div style={styles.progressWrap}>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
            <div style={styles.stepsRow}>
              {STEPS.map((s) => (
                <div key={s.id} style={styles.stepDot(s.id, step)}>
                  <div style={styles.dot(s.id, step)}>
                    {s.id < step ? '✓' : s.id}
                  </div>
                  <span style={styles.stepLabel(s.id, step)}>{s.short}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step title */}
          <div style={{ marginBottom: 28 }}>
            <div className="tag tag-teal" style={{ marginBottom: 10, display: 'inline-flex' }}>
              Step {step} of {STEPS.length}
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1C2A2A' }}>
              {STEPS[step - 1].label}
            </h1>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="card">
            {step === 1 && (
              <Step1Personal data={data} updateData={updateData} onNext={handleNext} />
            )}
            {step === 2 && (
              <Step2Medical data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />
            )}
            {step === 3 && (
              <Step3Contacts data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />
            )}
            {step === 4 && (
              <Step4Photo
                data={data}
                updateData={updateData}
                onBack={handleBack}
                onFinish={handleFinish}
                saving={saving}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

const styles = {
  progressWrap: { marginBottom: 32 },
  progressTrack: {
    height: 4,
    background: '#D4E5E5',
    borderRadius: 4,
    marginBottom: 16,
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    top: 0, left: 0, height: '100%',
    background: 'linear-gradient(90deg, #155F5F, #3AABAB)',
    borderRadius: 4,
    transition: 'width 0.4s ease',
  },
  stepsRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  stepDot: (id, current) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    opacity: id > current ? 0.4 : 1,
    transition: 'opacity 0.2s',
  }),
  dot: (id, current) => ({
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    background: id < current
      ? 'linear-gradient(135deg, #155F5F, #3AABAB)'
      : id === current
      ? '#1E8484'
      : '#D4E5E5',
    color: id <= current ? 'white' : '#5A7070',
    transition: 'all 0.2s',
  }),
  stepLabel: (id, current) => ({
    fontSize: '0.7rem',
    fontWeight: id === current ? 700 : 500,
    color: id === current ? '#1E8484' : '#5A7070',
  }),
}
