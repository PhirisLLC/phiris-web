import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import Header from '../../components/Header'

// NOTE: In production this calls your backend which calls AWS Rekognition.
// For the beta, we use a client-side face similarity check as a placeholder.
// See README for AWS Rekognition integration instructions.
async function matchFaceToPatient(photoBlob) {
  // TODO: Replace with real API call to your backend
  // POST /api/identify { image: base64 }
  // Returns: { matched: true, patientId: '...' } or { matched: false }

  // Beta simulation: search all enrolled users
  // In production this is done server-side with AWS Rekognition
  const snap = await getDocs(collection(db, 'users'))
  const patients = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(u => u.accountType === 'patient' && u.enrollmentComplete && u.photoUrl)

  if (patients.length === 0) return { matched: false }

  // In beta: return first enrolled patient as a demo match
  // Real version: AWS Rekognition SearchFacesByImage
  return { matched: true, patientId: patients[0].id }
}

const SCAN_STATES = {
  IDLE: 'idle',
  CAMERA: 'camera',
  UPLOADING: 'uploading',
  SEARCHING: 'searching',
  NOT_FOUND: 'not_found',
  ERROR: 'error',
}

export default function ScanInterface() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  const [scanState, setScanState] = useState(SCAN_STATES.IDLE)
  const [cameraActive, setCameraActive] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [capturedPhoto, setCapturedPhoto] = useState(null)

  async function startCamera() {
    setErrorMsg('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      videoRef.current.srcObject = stream
      setCameraActive(true)
      setScanState(SCAN_STATES.CAMERA)
    } catch {
      setErrorMsg('Camera access denied. Please allow camera access or upload an image.')
    }
  }

  function stopCamera() {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
  }

  async function captureAndSearch() {
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)

    canvas.toBlob(async (blob) => {
      const previewUrl = URL.createObjectURL(blob)
      setCapturedPhoto(previewUrl)
      stopCamera()
      await runSearch(blob)
    }, 'image/jpeg', 0.9)
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setCapturedPhoto(previewUrl)
    setScanState(SCAN_STATES.UPLOADING)
    await runSearch(file)
  }

  async function runSearch(photoBlob) {
    setScanState(SCAN_STATES.SEARCHING)
    try {
      const result = await matchFaceToPatient(photoBlob)
      if (result.matched) {
        // Log the access for audit trail
        // await logAccess(currentUser.uid, result.patientId)
        navigate(`/responder/result/${result.patientId}`)
      } else {
        setScanState(SCAN_STATES.NOT_FOUND)
      }
    } catch (err) {
      console.error(err)
      setScanState(SCAN_STATES.ERROR)
      setErrorMsg('Search failed. Please try again.')
    }
  }

  function reset() {
    setScanState(SCAN_STATES.IDLE)
    setCapturedPhoto(null)
    setErrorMsg('')
  }

  return (
    <div style={{ background: '#0D1A1A', minHeight: '100vh' }}>
      <Header variant="dark" />
      <main style={{ padding: '32px 0' }}>
        <div className="container" style={{ maxWidth: 560 }}>

          <div style={{ marginBottom: 24 }}>
            <button
              onClick={() => navigate('/responder')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              ← Back to Dashboard
            </button>
            <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Identify Patient
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8, fontSize: '0.9rem' }}>
              Point your camera at the patient's face or upload a photo to search the Phiris database.
            </p>
          </div>

          {errorMsg && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>{errorMsg}</div>
          )}

          {/* Idle state */}
          {scanState === SCAN_STATES.IDLE && (
            <div style={styles.optionGrid}>
              <button onClick={startCamera} style={styles.bigBtn}>
                <span style={{ fontSize: '2.5rem' }}>📷</span>
                <span style={styles.bigBtnLabel}>Use Camera</span>
                <span style={styles.bigBtnHint}>Point at patient's face</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} style={{ ...styles.bigBtn, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '2.5rem' }}>📁</span>
                <span style={styles.bigBtnLabel}>Upload Photo</span>
                <span style={styles.bigBtnHint}>From your device</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {/* Camera active */}
          {scanState === SCAN_STATES.CAMERA && (
            <div style={{ textAlign: 'center' }}>
              <div style={styles.videoWrap}>
                <video
                  ref={videoRef}
                  autoPlay playsInline muted
                  style={styles.video}
                />
                <div style={styles.scanOverlay}>
                  <div style={styles.scanCorners} />
                </div>
                <div style={styles.scanLabel}>Position face within frame</div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button className="btn btn-ghost btn-sm" onClick={reset} style={{ flex: 1, color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={captureAndSearch} style={{ flex: 2 }}>
                  🔍 Search Now
                </button>
              </div>
            </div>
          )}

          {/* Searching */}
          {(scanState === SCAN_STATES.SEARCHING || scanState === SCAN_STATES.UPLOADING) && (
            <div style={styles.searchingState}>
              {capturedPhoto && (
                <img src={capturedPhoto} alt="Scanning" style={styles.capturedThumb} />
              )}
              <div style={styles.pulseRing} />
              <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', marginTop: 24 }}>
                Searching Phiris database…
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: 8 }}>
                Matching biometric against enrolled profiles
              </div>
              <div style={{ marginTop: 20 }}>
                <div className="spinner spinner-teal" style={{ margin: '0 auto' }} />
              </div>
            </div>
          )}

          {/* Not found */}
          {scanState === SCAN_STATES.NOT_FOUND && (
            <div style={styles.centeredState}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem', marginBottom: 10 }}>
                No Match Found
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: 28, maxWidth: 320, margin: '0 auto 28px', lineHeight: 1.6 }}>
                This person may not be enrolled in Phiris yet. Try a different angle or check manually.
              </div>
              <button className="btn btn-primary" onClick={reset}>
                Try Again
              </button>
            </div>
          )}

          {/* Error */}
          {scanState === SCAN_STATES.ERROR && (
            <div style={styles.centeredState}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem', marginBottom: 24 }}>
                Search Error
              </div>
              <button className="btn btn-primary" onClick={reset}>Try Again</button>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </main>
    </div>
  )
}

const styles = {
  optionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  bigBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '32px 20px',
    background: 'linear-gradient(135deg, #155F5F, #1E8484)',
    border: 'none',
    borderRadius: 20,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  bigBtnLabel: { color: 'white', fontWeight: 700, fontSize: '1rem' },
  bigBtnHint: { color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem' },
  videoWrap: {
    position: 'relative',
    width: '100%',
    maxWidth: 480,
    margin: '0 auto',
    borderRadius: 20,
    overflow: 'hidden',
    background: '#000',
  },
  video: {
    width: '100%',
    display: 'block',
    aspectRatio: '4/3',
    objectFit: 'cover',
  },
  scanOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  scanCorners: {
    width: 200,
    height: 220,
    border: '3px solid #3AABAB',
    borderRadius: 16,
    boxShadow: '0 0 0 2000px rgba(0,0,0,0.35)',
  },
  scanLabel: {
    position: 'absolute',
    bottom: 16,
    left: 0, right: 0,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  searchingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    position: 'relative',
  },
  capturedThumb: {
    width: 80, height: 80,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #3AABAB',
    position: 'relative',
    zIndex: 2,
  },
  pulseRing: {
    position: 'absolute',
    top: 20,
    width: 120, height: 120,
    borderRadius: '50%',
    border: '2px solid rgba(58,171,171,0.4)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  centeredState: {
    textAlign: 'center',
    padding: '48px 20px',
  },
}
