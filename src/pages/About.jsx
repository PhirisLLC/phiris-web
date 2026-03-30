import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Icon from '../components/Icon'
import { useIsMobile } from '../hooks/useIsMobile'

const PATIENT_FINDINGS = [
  { value: '2,762', label: 'Patients surveyed', color: '#3AABAB' },
  { value: '87%', label: 'Want doctors to instantly ID them if unconscious', color: '#3AABAB' },
  { value: '85%', label: 'Would voluntarily enroll in Phiris', color: '#3AABAB' },
  { value: '85%', label: 'Would download a secure medical identity app', color: '#3AABAB' },
  { value: '73%', label: 'Comfortable with biometric ID verification', color: '#3AABAB' },
  { value: '67%', label: 'Fill out the same medical info every visit', color: '#3AABAB' },
]

const HCP_FINDINGS = [
  { value: '3,684', label: 'Healthcare professionals surveyed', color: '#D4A847' },
  { value: '69%', label: 'Experience patient ID failures regularly', color: '#D4A847' },
  { value: '31%', label: 'Deal with ID failures frequently or constantly', color: '#D4A847' },
  { value: '59%', label: 'Rated biometric ID as highly valuable (4–5 out of 5)', color: '#D4A847' },
  { value: '59%', label: 'Said their organization would pay for a solution', color: '#D4A847' },
  { value: '~40%', label: 'Volunteered to be design partners or beta testers', color: '#D4A847' },
]

const INQUIRY_TYPES = [
  'Partnership / Pilot Program',
  'Hospital / Health System',
  'EMS / Emergency Services',
  'Insurance',
  'Research / Academic',
  'Beta Testing',
  'General Inquiry',
]

export default function About() {
  const { hash } = useLocation()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      }
    }
  }, [hash])

  const [form, setForm] = useState({
    name: '', organization: '', role: '', email: '',
    phone: '', inquiry_type: '', message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

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

  return (
    <div style={{ background: '#0D1A1A', minHeight: '100vh' }}>
      <Header variant="dark" />

      {/* Hero */}
      <section style={styles.hero}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 680 }}>
            <div className="tag tag-teal" style={{ display: 'inline-flex', marginBottom: 20 }}>
              About Phiris
            </div>
            <h1 style={styles.heroTitle}>
              Protecting Your<br />
              <span style={styles.heroGradient}>Health Information</span>
            </h1>
            <p style={styles.heroPassport}>Phiris — Your Healthcare Passport</p>
            <p style={styles.heroSubtitle}>
              Phiris is developing privacy-first patient identification technology to reduce
              misidentification and intake delays in emergency care. When seconds matter, identity matters.
            </p>
          </div>
        </div>
        <div style={styles.orb1} />
        <div style={styles.orb2} />
      </section>

      {/* Mission */}
      <section style={{ background: 'white', padding: 0, overflow: 'hidden', borderBottom: '1px solid rgba(28,42,42,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', minHeight: isMobile ? 'auto' : 500 }}>
          {/* Photo side */}
          <div style={{ position: 'relative', overflow: 'hidden', height: isMobile ? 220 : 'auto' }}>
            <img
              src="https://images.pexels.com/photos/5452190/pexels-photo-5452190.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Family with patient in hospital"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', filter: 'brightness(0.85)' }}
            />
            {!isMobile && (
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 50%, rgba(255,255,255,0.9) 100%)' }} />
            )}
          </div>
          {/* Text side */}
          <div style={{ padding: isMobile ? '32px 24px' : '60px 48px 60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={styles.eyebrow}>Our Mission</p>
            <h2 style={{ ...styles.sectionTitle, marginBottom: 20 }}>An identity and coordination layer for emergency care.</h2>
            <div style={styles.missionText}>
              <p>
                Phiris is an early-stage healthcare technology company focused on improving patient
                identification and data protection in emergency and hospital settings.
              </p>
              <p>
                We are conducting research with healthcare professionals to better understand
                intake workflows, misidentification risks, and opportunities to reduce administrative
                friction while maintaining strict privacy standards.
              </p>
              <p>
                Our work is guided by a commitment to patient safety, data security, and responsible
                innovation. Phiris is not an EMR — we are built to verify patient identity earlier,
                reduce downstream errors, and accelerate care coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo strip */}
      <section style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', height: isMobile ? 140 : 240 }}>
          {[
            { img: 'https://images.pexels.com/photos/8942726/pexels-photo-8942726.jpeg?auto=compress&cs=tinysrgb&w=500', label: 'EMS Response' },
            { img: 'https://images.pexels.com/photos/8942700/pexels-photo-8942700.jpeg?auto=compress&cs=tinysrgb&w=500', label: 'Emergency Care' },
            { img: 'https://images.pexels.com/photos/6754173/pexels-photo-6754173.jpeg?auto=compress&cs=tinysrgb&w=500', label: 'Patient Recovery' },
            { img: 'https://images.pexels.com/photos/6754178/pexels-photo-6754178.jpeg?auto=compress&cs=tinysrgb&w=500', label: 'Compassionate Care' },
          ].map((p, i) => (
            <div key={i} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <img src={p.img} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) saturate(0.9)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(10,21,21,0.85) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(58,171,171,0.85)', textTransform: 'uppercase' }}>{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Research — Patient Survey */}
      <section style={{ ...styles.section, background: 'white', borderTop: '1px solid rgba(28,42,42,0.07)' }}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <p style={styles.eyebrow}>Research</p>
            <h2 style={styles.sectionTitle}>
              The data doesn't lie.<br />Patients are ready.
            </h2>
            <p style={styles.sectionSubtitle}>
              We surveyed 2,762 patients — no product demo, no sales framing. Just honest questions
              about identity, emergencies, and trust.
            </p>
          </div>

          <div style={styles.surveyBadge('#3AABAB')}>
            Patient Survey · 2,762 Respondents · March 2026
          </div>

          <div style={styles.statsGrid}>
            {PATIENT_FINDINGS.map(f => (
              <div key={f.label} style={styles.statCard('#3AABAB')}>
                <div style={{ ...styles.statValue, color: f.color }}>{f.value}</div>
                <div style={styles.statLabel}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research — HCP Survey */}
      <section style={{ ...styles.section, background: 'white', borderTop: '1px solid rgba(28,42,42,0.07)' }}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Healthcare professionals<br />confirmed the problem.
            </h2>
            <p style={styles.sectionSubtitle}>
              Patient identity breakdowns are not edge cases — they are routine, costly, and system-wide.
              Our healthcare professional survey of 3,684 respondents confirmed this across hospitals,
              EMS, health systems, and revenue cycle teams.
            </p>
          </div>

          <div style={styles.surveyBadge('#D4A847')}>
            Healthcare Professional Survey · 3,684 Respondents · January 2026
          </div>

          <div style={styles.statsGrid}>
            {HCP_FINDINGS.map(f => (
              <div key={f.label} style={styles.statCard('#D4A847')}>
                <div style={{ ...styles.statValue, color: f.color }}>{f.value}</div>
                <div style={styles.statLabel}>{f.label}</div>
              </div>
            ))}
          </div>

          <div style={styles.quoteBox}>
            <p style={styles.quoteText}>
              "The data shows this is a system-level infrastructure problem, not a point-solution gap.
              Patient identification failures drive delays in emergency care, duplicate medical records,
              patient safety risks, missed organ donation opportunities, billing errors, and family
              notification delays."
            </p>
            <div style={styles.quoteAttrib}>— Phiris: Proof of Problem, January 2026</div>
          </div>
        </div>
      </section>

      {/* Company info */}
      <section style={{ ...styles.section, background: '#F7F5F0' }}>
        <div className="container">
          <div style={styles.twoCol}>
            <div>
              <p style={{ ...styles.eyebrow, color: '#155F5F' }}>The Company</p>
              <h2 style={{ ...styles.sectionTitle, color: '#1C2A2A' }}>
                Built in Texas.<br />Built for everyone.
              </h2>
            </div>
            <div style={{ ...styles.missionText, color: '#4A6060' }}>
              <p>
                Phiris LLC is a Texas-based healthcare technology startup. We are in active early-access
                beta and seeking partnerships with healthcare systems, EMS organizations, and patient
                advocacy groups to validate and refine our platform.
              </p>
              <p>
                Over 1,400 healthcare professionals have already volunteered to participate in beta
                testing and design feedback. We are guided by a single principle: responsible innovation
                in service of patient safety.
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-primary">
                  Enroll as a Patient
                </Link>
                <Link to="/responder/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#155F5F', fontWeight: 600, fontSize: '0.9rem' }}>
                  Register as HCP / First Responder →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ ...styles.section, background: '#111F1F' }} id="contact">
        <div className="container">
          <div style={styles.twoCol}>
            <div>
              <p style={styles.eyebrow}>Contact Us</p>
              <h2 style={{ ...styles.sectionTitle, color: 'white' }}>Let's talk.</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginTop: 16, maxWidth: 300 }}>
                For research, partnership, pilot programs, or general inquiries — we respond promptly.
              </p>
              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={styles.contactDetail}>
                  <span style={styles.contactIcon}><Icon name="mail" size={20} color="#3AABAB" /></span>
                  <a href="mailto:admin@phiris.com" style={{ color: '#3AABAB', fontSize: '0.9rem' }}>admin@phiris.com</a>
                </div>
                <div style={styles.contactDetail}>
                  <span style={styles.contactIcon}><Icon name="globe" size={20} color="#3AABAB" /></span>
                  <a href="https://www.phiris.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3AABAB', fontSize: '0.9rem' }}>www.phiris.com</a>
                </div>
                <div style={styles.contactDetail}>
                  <span style={styles.contactIcon}><Icon name="map-pin" size={20} color="rgba(255,255,255,0.4)" /></span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Texas, USA</span>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div style={styles.contactCard}>
              {status === 'sent' ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✅</div>
                  <h3 style={{ color: 'white', fontWeight: 700, marginBottom: 8 }}>Message received!</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    Thanks for reaching out. We'll get back to you at <strong style={{ color: '#3AABAB' }}>{form.email}</strong> within one business day.
                  </p>
                  <button
                    onClick={() => { setStatus('idle'); setForm({ name: '', organization: '', role: '', email: '', phone: '', inquiry_type: '', message: '' }) }}
                    style={{ marginTop: 24, color: '#3AABAB', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>Send us a message</h3>

                  {/* Row: Name + Organization */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={styles.formLabel}>Full Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        placeholder="Jane Doe" required style={styles.formInput} />
                    </div>
                    <div>
                      <label style={styles.formLabel}>Organization *</label>
                      <input type="text" name="organization" value={form.organization} onChange={handleChange}
                        placeholder="Memorial Hospital" required style={styles.formInput} />
                    </div>
                  </div>

                  {/* Row: Role + Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={styles.formLabel}>Title / Role *</label>
                      <input type="text" name="role" value={form.role} onChange={handleChange}
                        placeholder="Chief Medical Officer" required style={styles.formInput} />
                    </div>
                    <div>
                      <label style={styles.formLabel}>Work Email *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="you@org.com" required style={styles.formInput} />
                    </div>
                  </div>

                  {/* Row: Phone + Inquiry Type */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={styles.formLabel}>Phone (optional)</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+1 (555) 000-0000" style={styles.formInput} />
                    </div>
                    <div>
                      <label style={styles.formLabel}>Inquiry Type</label>
                      <select name="inquiry_type" value={form.inquiry_type} onChange={handleChange}
                        style={{ ...styles.formInput, cursor: 'pointer' }}>
                        <option value="">Select one…</option>
                        {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={styles.formLabel}>How can Phiris help? *</label>
                    <textarea name="message" value={form.message} onChange={handleChange}
                      placeholder="Describe your use case, current challenges, or what you'd like to explore with us…"
                      required rows={4}
                      style={{ ...styles.formInput, resize: 'vertical', minHeight: 90 }}
                    />
                  </div>

                  {status === 'error' && (
                    <p style={{ color: '#FF6B6B', fontSize: '0.8rem', marginBottom: 12 }}>
                      Something went wrong. Please email us directly at admin@phiris.com
                    </p>
                  )}

                  <button type="submit" disabled={status === 'sending'} style={{ ...styles.formBtn, opacity: status === 'sending' ? 0.7 : 1 }}>
                    {status === 'sending' ? 'Sending…' : 'Send Message →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container" style={styles.footerInner}>
          <img src="/logo-white.svg" alt="Phiris" style={{ height: 22, width: 'auto', opacity: 0.6 }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Phiris LLC. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textDecoration: 'none' }}>Home</Link>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Privacy</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const styles = {
  hero: {
    position: 'relative',
    overflow: 'hidden',
    padding: '100px 0 100px',
    background: 'linear-gradient(160deg, #0D1A1A 0%, #0D2828 60%, #0D1A1A 100%)',
  },
  heroTitle: {
    fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
    fontWeight: 800,
    lineHeight: 1.08,
    letterSpacing: '-0.03em',
    color: 'white',
    marginBottom: 14,
  },
  heroGradient: {
    background: 'linear-gradient(90deg, #1E8484, #6FC8C8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroPassport: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'rgba(58,171,171,0.6)',
    letterSpacing: '0.04em',
    marginBottom: 18,
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.6)',
    maxWidth: 540,
  },
  orb1: {
    position: 'absolute', top: -100, right: -80,
    width: 450, height: 450, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(30,132,132,0.18) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute', bottom: -60, left: '25%',
    width: 350, height: 350, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(21,95,95,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  section: { padding: '80px 0' },
  sectionHeader: { textAlign: 'center', marginBottom: 48 },
  eyebrow: {
    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: '#3AABAB', marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800,
    lineHeight: 1.15, letterSpacing: '-0.02em', color: '#0D1A1A',
  },
  sectionSubtitle: {
    color: 'rgba(28,42,42,0.62)', fontSize: '1rem', lineHeight: 1.65,
    maxWidth: 560, margin: '16px auto 0',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 60,
    alignItems: 'start',
  },
  missionText: {
    color: 'rgba(28,42,42,0.65)',
    fontSize: '1rem',
    lineHeight: 1.75,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  surveyBadge: (color) => ({
    display: 'inline-block',
    background: `rgba(${color === '#3AABAB' ? '58,171,171' : '212,168,71'},0.1)`,
    border: `1px solid rgba(${color === '#3AABAB' ? '58,171,171' : '212,168,71'},0.25)`,
    color: color,
    borderRadius: 100,
    padding: '6px 18px',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    marginBottom: 32,
  }),
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
  },
  statCard: (color) => ({
    background: 'white',
    border: `1px solid rgba(${color === '#3AABAB' ? '58,171,171' : '212,168,71'},0.2)`,
    borderRadius: 16,
    padding: '20px 22px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  }),
  statValue: {
    fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6,
  },
  statLabel: {
    color: 'rgba(28,42,42,0.6)', fontSize: '0.82rem', lineHeight: 1.4,
  },
  quoteBox: {
    marginTop: 40,
    background: 'rgba(212,168,71,0.06)',
    border: '1px solid rgba(212,168,71,0.2)',
    borderRadius: 16,
    padding: '28px 32px',
  },
  quoteText: {
    color: 'rgba(28,42,42,0.7)',
    fontSize: '0.95rem',
    lineHeight: 1.75,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  quoteAttrib: {
    color: 'rgba(212,168,71,0.6)',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  contactDetail: {
    display: 'flex', alignItems: 'center', gap: 12,
  },
  contactIcon: {
    width: 32, height: 32,
    background: 'rgba(58,171,171,0.1)',
    border: '1px solid rgba(58,171,171,0.2)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.85rem',
    flexShrink: 0,
  },
  contactCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '28px 32px',
  },
  formLabel: {
    display: 'block',
    color: 'rgba(255,255,255,0.45)',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  formInput: {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '11px 14px',
    color: 'white',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  formBtn: {
    width: '100%',
    background: 'linear-gradient(90deg, #155F5F, #1E8484)',
    border: 'none',
    borderRadius: 12,
    padding: '13px',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  footer: {
    background: '#080F0F',
    padding: '28px 0',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  footerInner: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
  },
}
