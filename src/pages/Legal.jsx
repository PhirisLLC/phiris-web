import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

const LAST_UPDATED = 'March 28, 2026'

export default function Legal() {
  const [tab, setTab] = useState('terms')

  return (
    <div className="page" style={{ background: '#F7F5F0' }}>
      <Header />
      <main className="page-content">
        <div className="container-narrow" style={{ maxWidth: 760 }}>

          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1C2A2A', marginBottom: 8 }}>
              Legal
            </h1>
            <p style={{ color: '#5A7070', fontSize: '0.9rem' }}>Last updated: {LAST_UPDATED}</p>
          </div>

          {/* Tab switcher */}
          <div style={styles.tabs}>
            <button
              style={styles.tab(tab === 'terms')}
              onClick={() => setTab('terms')}
            >
              Terms of Service
            </button>
            <button
              style={styles.tab(tab === 'privacy')}
              onClick={() => setTab('privacy')}
            >
              Privacy Policy
            </button>
          </div>

          <div className="card" style={{ padding: '36px 40px', lineHeight: 1.8, color: '#1C2A2A' }}>
            {tab === 'terms' ? <TermsOfService /> : <PrivacyPolicy />}
          </div>

          <p style={{ textAlign: 'center', color: '#5A7070', fontSize: '0.85rem', marginTop: 24 }}>
            Questions? Contact us at <a href="mailto:admin@phiris.com" style={{ color: '#1E8484' }}>admin@phiris.com</a>
          </p>
        </div>
      </main>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C2A2A', marginBottom: 12, borderBottom: '2px solid #D4E5E5', paddingBottom: 8 }}>
        {title}
      </h2>
      <div style={{ fontSize: '0.9rem', color: '#3A5050', lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  )
}

function TermsOfService() {
  return (
    <div>
      <p style={{ fontSize: '0.9rem', color: '#5A7070', marginBottom: 32 }}>
        These Terms of Service ("Terms") govern your use of the Phiris platform, including our website, mobile app, and any associated services (collectively, the "Service"), operated by Phiris LLC ("Phiris," "we," "us," or "our"). By creating an account or using the Service, you agree to these Terms.
      </p>

      <Section title="1. About Phiris">
        Phiris is a voluntary, consumer-controlled health identification service. We help users store personal and medical information that can be accessed by authorized emergency responders and healthcare professionals in emergency situations. Phiris is not a healthcare provider, does not provide medical advice, and is not a substitute for professional medical care.
      </Section>

      <Section title="2. Eligibility">
        You must be at least 18 years of age to create a Phiris account. By using the Service, you represent that you are 18 or older and have the legal capacity to enter into these Terms.
      </Section>

      <Section title="3. Your Account">
        You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, complete, and current information during registration and to update your information as needed. You are solely responsible for all activity that occurs under your account.
      </Section>

      <Section title="4. Voluntary Enrollment and Data Accuracy">
        Enrollment in Phiris is entirely voluntary. You choose what information to include in your profile. You represent that all information you provide — including medical conditions, allergies, medications, and emergency contacts — is accurate to the best of your knowledge. Inaccurate information could affect the quality of emergency care you receive. Phiris is not liable for outcomes resulting from inaccurate or incomplete user-provided information.
      </Section>

      <Section title="5. Emergency Data Sharing">
        By enrolling, you expressly authorize Phiris to share your health profile with verified emergency responders and healthcare professionals who identify you through the Phiris system during an emergency. You understand and consent to this sharing as the core purpose of the Service.
      </Section>

      <Section title="6. DNR and Organ Donor Preferences">
        Any Do Not Resuscitate (DNR) preference or organ donor status indicated in your Phiris profile is <strong>informational only</strong>. It does not constitute a legally valid DNR order or legally binding organ donation authorization. Emergency responders may not be legally bound by preferences indicated solely through this app. You should maintain properly executed legal documents for these purposes.
      </Section>

      <Section title="7. Biometric Data">
        Phiris collects a facial photograph for the purpose of biometric identification in emergencies. By enrolling, you consent to the collection, storage, and use of this biometric data solely for emergency identification purposes. We do not sell or share your biometric data with third parties except as required by law or as described in our Privacy Policy.
      </Section>

      <Section title="8. No Medical Advice">
        Phiris does not provide medical advice, diagnosis, or treatment recommendations. Information stored on Phiris is intended solely to assist emergency responders in understanding your medical background. Always consult a qualified healthcare professional for medical decisions.
      </Section>

      <Section title="9. Account Deletion and Data Removal">
        You may delete your account at any time through your profile settings. Upon deletion, your personal and health data will be removed from our active systems. Some data may be retained in backup systems for a limited period as required by law or for legitimate business purposes, after which it will be permanently deleted.
      </Section>

      <Section title="10. Limitation of Liability">
        To the fullest extent permitted by law, Phiris LLC, its officers, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Phiris does not guarantee that emergency responders will access or act upon information stored in your profile.
      </Section>

      <Section title="11. Changes to These Terms">
        We may update these Terms from time to time. We will notify you of material changes via email or in-app notification. Your continued use of the Service after changes take effect constitutes your acceptance of the revised Terms.
      </Section>

      <Section title="12. Governing Law">
        These Terms are governed by the laws of the State of Texas, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts of Texas.
      </Section>

      <Section title="13. Contact">
        For questions about these Terms, contact us at <a href="mailto:admin@phiris.com" style={{ color: '#1E8484' }}>admin@phiris.com</a> or visit <a href="https://phiris.com" style={{ color: '#1E8484' }}>phiris.com</a>.
      </Section>
    </div>
  )
}

function PrivacyPolicy() {
  return (
    <div>
      <p style={{ fontSize: '0.9rem', color: '#5A7070', marginBottom: 32 }}>
        This Privacy Policy explains how Phiris LLC ("Phiris," "we," "us," or "our") collects, uses, and protects your personal information when you use the Phiris Service. By using Phiris, you agree to the practices described in this policy.
      </p>

      <Section title="1. Information We Collect">
        We collect the following categories of information that you voluntarily provide:
        <ul style={{ marginTop: 12, paddingLeft: 20 }}>
          <li><strong>Account information:</strong> Name, email address, and password</li>
          <li><strong>Personal information:</strong> Date of birth, sex, height, weight, blood type</li>
          <li><strong>Medical information:</strong> Allergies, medical conditions, medications, additional medical notes, DNR status, organ donor preference</li>
          <li><strong>Emergency contacts:</strong> Names, phone numbers, and relationships of designated contacts</li>
          <li><strong>Biometric data:</strong> A facial photograph used for emergency identification</li>
          <li><strong>Usage data:</strong> Log data, device information, and interaction data collected automatically</li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Information">
        We use your information solely to provide and improve the Phiris Service, including:
        <ul style={{ marginTop: 12, paddingLeft: 20 }}>
          <li>Identifying you in emergency situations via biometric matching</li>
          <li>Sharing your health profile with authorized emergency responders</li>
          <li>Notifying your emergency contacts when you are identified</li>
          <li>Communicating with you about your account and the Service</li>
          <li>Improving the Service through anonymized usage analytics</li>
        </ul>
        We do not sell your personal or medical data to third parties. We do not use your health data for advertising purposes.
      </Section>

      <Section title="3. Data Storage and Security">
        Your data is stored securely using Google Firebase infrastructure. We use industry-standard encryption and security practices to protect your information. However, no system is completely secure, and we cannot guarantee absolute security of your data.
      </Section>

      <Section title="4. Biometric Data">
        Your facial photograph is stored and used exclusively for emergency biometric identification. We do not share biometric data with third parties except as required by law. In states with specific biometric privacy laws (including Illinois BIPA, Texas CUBI, and Washington My Health MY Data Act), we comply with applicable requirements.
      </Section>

      <Section title="5. Data Sharing">
        We share your health profile only with verified emergency responders and healthcare professionals who identify you through the Phiris system during an emergency. We may also share data with:
        <ul style={{ marginTop: 12, paddingLeft: 20 }}>
          <li>Service providers who help us operate the platform (under confidentiality obligations)</li>
          <li>Law enforcement or legal authorities when required by law</li>
          <li>Successor entities in the event of a merger, acquisition, or sale of assets</li>
        </ul>
      </Section>

      <Section title="6. Your Rights">
        You have the right to:
        <ul style={{ marginTop: 12, paddingLeft: 20 }}>
          <li>Access and review your personal data through your profile</li>
          <li>Correct inaccurate information at any time</li>
          <li>Delete your account and associated data</li>
          <li>Withdraw consent for data processing (which will require account deletion)</li>
          <li>Request a copy of your data by contacting us at admin@phiris.com</li>
        </ul>
      </Section>

      <Section title="7. Children's Privacy">
        Phiris is not intended for users under the age of 18. We do not knowingly collect personal information from minors. If we learn that we have collected information from a minor, we will delete it promptly.
      </Section>

      <Section title="8. Changes to This Policy">
        We may update this Privacy Policy periodically. We will notify you of significant changes via email or in-app notification. Your continued use of the Service constitutes acceptance of the updated policy.
      </Section>

      <Section title="9. Contact">
        For privacy-related questions or requests, contact us at <a href="mailto:admin@phiris.com" style={{ color: '#1E8484' }}>admin@phiris.com</a>.
      </Section>
    </div>
  )
}

const styles = {
  tabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
    background: '#fff',
    padding: 6,
    borderRadius: 12,
    border: '1px solid #D4E5E5',
  },
  tab: (active) => ({
    flex: 1,
    padding: '10px 0',
    borderRadius: 8,
    border: 'none',
    background: active ? '#1E8484' : 'transparent',
    color: active ? '#fff' : '#5A7070',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
  }),
}
