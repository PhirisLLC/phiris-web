import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Step0Consent({ onNext }) {
  const [checks, setChecks] = useState({
    voluntary: false,
    accurate: false,
    sharing: false,
    biometric: false,
    dnr: false,
    terms: false,
  })

  const allChecked = Object.values(checks).every(Boolean)

  function toggle(key) {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div>
      <p style={{ color: '#5A7070', marginBottom: 24, fontSize: '0.9rem', lineHeight: 1.6 }}>
        Before you enroll, please read and agree to the following. Your consent is required to continue.
      </p>

      <div style={styles.consentBox}>
        {CONSENTS.map(({ key, title, body, link }) => (
          <label key={key} style={styles.consentRow(checks[key])} onClick={() => toggle(key)}>
            <div style={styles.checkbox(checks[key])}>
              {checks[key] && <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.consentTitle}>{title}</div>
              <div style={styles.consentBody}>{body}</div>
              {link && (
                <Link
                  to={link.to}
                  target="_blank"
                  onClick={e => e.stopPropagation()}
                  style={{ display: 'inline-block', marginTop: 6, fontSize: '0.8rem', color: '#1E8484', fontWeight: 600 }}
                >
                  {link.label}
                </Link>
              )}
            </div>
          </label>
        ))}
      </div>

      <div style={styles.legalNote}>
        <strong>Note:</strong> Phiris is a voluntary, consumer-controlled health identification service. You may update or delete your information at any time from your profile. This service does not constitute medical advice and is not a substitute for professional medical care.{' '}
        <Link to="/legal" target="_blank" style={{ color: '#1E8484', fontWeight: 600 }}>
          Read our full Terms of Service &amp; Privacy Policy →
        </Link>
      </div>

      <button
        type="button"
        className="btn btn-primary btn-full"
        style={{ marginTop: 24, opacity: allChecked ? 1 : 0.5 }}
        disabled={!allChecked}
        onClick={onNext}
      >
        I Agree — Begin Enrollment →
      </button>

      {!allChecked && (
        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#5A7070', marginTop: 10 }}>
          Please acknowledge all items above to continue.
        </p>
      )}
    </div>
  )
}

const CONSENTS = [
  {
    key: 'voluntary',
    title: 'I am enrolling voluntarily',
    body: 'I understand that enrollment in Phiris is entirely voluntary and that I may withdraw at any time by deleting my account.',
  },
  {
    key: 'accurate',
    title: 'My information is accurate',
    body: 'I confirm that the health and personal information I provide is accurate to the best of my knowledge. I understand that inaccurate information could affect my emergency care.',
  },
  {
    key: 'sharing',
    title: 'I consent to emergency sharing',
    body: 'I authorize Phiris to share my health profile with verified emergency responders and healthcare professionals who scan my biometric ID in an emergency situation.',
  },
  {
    key: 'biometric',
    title: 'I consent to biometric data collection',
    body: 'I understand that Phiris collects and stores a facial photo for the purpose of biometric identification in emergencies. This data is stored securely and used solely for this purpose.',
  },
  {
    key: 'dnr',
    title: 'I understand the DNR limitation',
    body: 'If I indicate a Do Not Resuscitate (DNR) preference, I understand this is informational only and does not replace a legally valid DNR order. Emergency responders may not be legally bound by this app-based indication.',
  },
  {
    key: 'terms',
    title: 'I agree to the Terms of Service and Privacy Policy',
    body: 'I have read and agree to the Phiris Terms of Service and Privacy Policy, including how my data is collected, stored, and used.',
    link: { label: 'Read the full Terms & Privacy Policy →', to: '/legal' },
  },
]

const styles = {
  consentBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },
  consentRow: (checked) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: '14px 16px',
    borderRadius: 10,
    border: `1.5px solid ${checked ? '#3AABAB' : '#D4E5E5'}`,
    background: checked ? 'rgba(58,171,171,0.06)' : '#fff',
    cursor: 'pointer',
    transition: 'all 0.15s',
    userSelect: 'none',
  }),
  checkbox: (checked) => ({
    width: 22,
    height: 22,
    minWidth: 22,
    borderRadius: 6,
    border: `2px solid ${checked ? '#1E8484' : '#D4E5E5'}`,
    background: checked ? '#1E8484' : '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    transition: 'all 0.15s',
  }),
  consentTitle: {
    fontWeight: 700,
    fontSize: '0.88rem',
    color: '#1C2A2A',
    marginBottom: 4,
  },
  consentBody: {
    fontSize: '0.8rem',
    color: '#5A7070',
    lineHeight: 1.5,
  },
  legalNote: {
    background: '#F7F5F0',
    border: '1px solid #D4E5E5',
    borderRadius: 10,
    padding: '14px 16px',
    fontSize: '0.8rem',
    color: '#5A7070',
    lineHeight: 1.6,
  },
}
