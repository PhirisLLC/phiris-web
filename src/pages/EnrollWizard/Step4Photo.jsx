import React, { useRef, useState, useCallback } from 'react'

export default function Step4Photo({ data, updateData, onBack, onFinish, saving }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState('')

  async function startCamera() {
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }
      })
      videoRef.current.srcObject = stream
      setCameraActive(true)
    } catch (err) {
      setCameraError('Camera access denied. Please allow camera access or upload a photo.')
    }
  }

  function stopCamera() {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      const previewUrl = URL.createObjectURL(blob)
      updateData({ photoFile: blob, photoPreview: previewUrl })
      stopCamera()
    }, 'image/jpeg', 0.9)
  }

  function retake() {
    updateData({ photoFile: null, photoPreview: null })
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const previewUrl = URL.createObjectURL(file)
    updateData({ photoFile: file, photoPreview: previewUrl })
  }

  return (
    <div>
      <p style={{ color: '#5A7070', marginBottom: 24, fontSize: '0.9rem', lineHeight: 1.6 }}>
        Your photo is used to identify you in emergencies. Use a clear, front-facing photo with good lighting.
      </p>

      {/* Tips */}
      <div className="alert alert-info" style={{ marginBottom: 24 }}>
        <strong>Photo tips:</strong> Face the camera directly, good lighting, no sunglasses or hats. Same quality as a passport photo works perfectly.
      </div>

      {cameraError && <div className="alert alert-error">{cameraError}</div>}

      {/* Preview or camera */}
      {data.photoPreview ? (
        <div style={styles.previewWrap}>
          <img src={data.photoPreview} alt="Your photo" style={styles.preview} />
          <div className="tag tag-teal" style={{ marginTop: 12 }}>Photo captured ✓</div>
          <button type="button" onClick={retake} className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>
            Retake Photo
          </button>
        </div>
      ) : cameraActive ? (
        <div style={styles.cameraWrap}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={styles.video}
          />
          <div style={styles.cameraControls}>
            <button type="button" className="btn btn-primary" onClick={capturePhoto}>
              📷 Capture
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={stopCamera}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.photoOptions}>
          <button type="button" className="btn btn-primary" onClick={startCamera} style={{ flex: 1 }}>
            📷 Use Camera
          </button>
          <button type="button" className="btn btn-outline" onClick={() => fileInputRef.current?.click()} style={{ flex: 1 }}>
            📁 Upload Photo
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

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
        <button type="button" className="btn btn-ghost" onClick={onBack} style={{ flex: 1 }} disabled={saving}>
          ← Back
        </button>
        <button
          type="button"
          className="btn btn-primary"
          style={{ flex: 2 }}
          onClick={onFinish}
          disabled={saving || !data.photoFile}
        >
          {saving ? <><span className="spinner" /> Saving…</> : 'Complete Enrollment ✓'}
        </button>
      </div>

      {!data.photoFile && (
        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#5A7070', marginTop: 12 }}>
          A photo is required to complete enrollment.
        </p>
      )}
    </div>
  )
}

const styles = {
  photoOptions: {
    display: 'flex',
    gap: 12,
    marginBottom: 8,
  },
  cameraWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  video: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    background: '#000',
    aspectRatio: '1',
    objectFit: 'cover',
  },
  cameraControls: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  previewWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #3AABAB',
    boxShadow: '0 4px 20px rgba(58,171,171,0.3)',
  },
}
