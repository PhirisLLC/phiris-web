import React, { useState, useEffect } from 'react'

const INQUIRY_TYPES = [
  'Partnership / Pilot Program',
  'Hospital / Health System',
  'EMS / Emergency Services',
  'Insurance',
  'Research / Academic',
  'Beta Testing',
  'General Inquiry',
]

const EMPTY_FORM = {
  name: '', organization: '', role: '', email: '',
  phone: '', inquiry_type: '', message: '',
}

export default function ContactModal({ isOpen, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id:  import.meta.env.VITE_EMAILJS_SERVICE_ID,
          template_id: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
          user_id:     import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
          template_params: {
            from_name:    form.name,
            from_email:   form.email,
            organization: form.organization,
            role:         form.role,
            phone:        form.phone || 'Not provided',
            inquiry_type: form.inquiry_type || 'Not specified',
            message:      form.message,
          },
        }),
      })
      if (!res.ok) throw new Error('Send failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  function handleReset() {
    setStatus('idle')
    setForm(EMPTY_FORM)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div style={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Get in Touch</p>
            <h2 style={styles.title}>Schedule a Demo</h2>
          </div>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.25rem', marginBottom: 10 }}>Message received!</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 28 }}>
                Thanks for reaching out. We'll get back to you at{' '}
                <strong style={{ color: '#3AABAB' }}>{form.email}</strong> within one business day.
              </p>
              <button onClick={handleReset} style={styles.submitBtn}>Done</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Row: Name + Organization */}
              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Full Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Jane Doe" required style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Organization *</label>
                  <input type="text" name="organization" value={form.organization} onChange={handleChange}
                    placeholder="Memorial Hospital" required style={styles.input} />
                </div>
              </div>

              {/* Row: Role + Email */}
              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Title / Role *</label>
                  <input type="text" name="role" value={form.role} onChange={handleChange}
                    placeholder="Chief Medical Officer" required style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Work Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="you@org.com" required style={styles.input} />
                </div>
              </div>

              {/* Row: Phone + Inquiry Type */}
              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Phone (optional)</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+1 (555) 000-0000" style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Inquiry Type</label>
                  <select name="inquiry_type" value={form.inquiry_type} onChange={handleChange}
                    style={{ ...styles.input, cursor: 'pointer' }}>
                    <option value="">Select one…</option>
                    {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: 20 }}>
                <label style={styles.label}>How can Phiris help? *</label>
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder="Describe your use case, current challenges, or what you'd like to explore with us…"
                  required rows={4}
                  style={{ ...styles.input, resize: 'vertical', minHeight: 90 }}
                />
              </div>

              {status === 'error' && (
                <p style={{ color: '#FF6B6B', fontSize: '0.8rem', marginBottom: 12 }}>
                  Something went wrong. Email us directly at admin@phiris.com
                </p>
              )}

              <button type="submit" disabled={status === 'sending'}
                style={{ ...styles.submitBtn, opacity: status === 'sending' ? 0.7 : 1 }}>
                {status === 'sending' ? 'Sending…' : 'Send Message →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
  },
  modal: {
    background: '#111F1F',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    width: '100%',
    maxWidth: 620,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
  },
  header: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: '28px 32px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'sticky', top: 0,
    background: '#111F1F',
    zIndex: 1,
  },
  eyebrow: {
    margin: '0 0 4px',
    color: '#3AABAB',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  title: {
    margin: 0,
    color: 'white',
    fontSize: '1.4rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '50%',
    width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    flexShrink: 0,
    marginLeft: 16,
  },
  body: {
    padding: '24px 32px 32px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 14,
  },
  field: { display: 'flex', flexDirection: 'column' },
  label: {
    display: 'block',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '11px 14px',
    color: 'white',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  submitBtn: {
    width: '100%',
    background: 'linear-gradient(90deg, #155F5F, #1E8484)',
    border: 'none',
    borderRadius: 12,
    padding: '14px',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.01em',
  },
}
