import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import ContactModal from '../components/ContactModal'
import Icon from '../components/Icon'
import { useIsMobile } from '../hooks/useIsMobile'

// ─── Data ────────────────────────────────────────────────────────────────────

const CRISIS_STATS = [
  { value: '$17.4M', label: 'Lost per hospital annually', sub: 'in denied claims from patient misidentification', color: '#1E8484' },
  { value: '70%',    label: 'Of adverse patient outcomes', sub: 'are traced back to patient identification errors', color: '#3AABAB' },
  { value: '28 min', label: 'Per clinician shift wasted', sub: 'tracking down mismatched or duplicate records', color: '#3AABAB' },
  { value: '35%',    label: 'Of all denied insurance claims', sub: 'result directly from inaccurate patient identification', color: '#1E8484' },
]

const SOLUTIONS = [
  {
    id: 'hospitals',
    icon: 'building',
    shortLabel: 'Hospitals',
    label: 'Hospitals & Health Systems',
    color: '#1E8484',
    tagline: 'Eliminate misidentification. Recover millions.',
    problems: [
      'Duplicate patient records cost $1,950 per inpatient stay and $1,700 per ED visit',
      '7–10% of incoming patients are misidentified at registration',
      '$900,000/year lost per hospital in staff time resolving ID errors',
      '8–12% of hospital medical records are duplicates',
    ],
    benefits: [
      { icon: 'trending-up',  title: 'Revenue Recovery',  body: 'Eliminate denied claims from misidentification — recovering up to $17.4M annually per hospital.' },
      { icon: 'zap',          title: 'Faster Admissions', body: 'Instant biometric ID reduces registration time and eliminates manual record-matching workflows.' },
      { icon: 'heart-pulse',  title: 'Better Patient Care', body: 'Responders and staff access a complete, verified health profile — allergies, medications, conditions — immediately.' },
      { icon: 'shield',       title: 'Reduced Liability', body: 'Fewer wrong-patient errors means fewer adverse events, malpractice claims, and regulatory investigations.' },
    ],
    quote: '"Patient misidentification is one of the most significant — and preventable — sources of harm in healthcare today."',
    quoteSource: '— Agency for Healthcare Research and Quality (AHRQ)',
  },
  {
    id: 'insurance',
    icon: 'clipboard',
    shortLabel: 'Insurance',
    label: 'Insurance & Payers',
    color: '#C8A04A',
    tagline: 'Stop fraud before it starts.',
    problems: [
      '$41.3 billion lost annually to medical identity theft nationwide',
      '1.85 million Americans are victims of medical ID theft each year',
      'FTC medical identity theft cases rose 532% from 2017 to 2021',
      'Average victim spends 210 hours and $13,500 resolving fraud',
    ],
    benefits: [
      { icon: 'lock',         title: 'Fraud Prevention', body: 'Biometric verification ensures the person receiving care is the actual policyholder — eliminating impersonation fraud at the point of service.' },
      { icon: 'bar-chart',    title: 'Claims Accuracy',  body: 'Verified patient identity means every claim is matched to the correct individual, reducing disputes, appeals, and administrative overhead.' },
      { icon: 'lightbulb',   title: 'Risk Reduction',   body: 'Real-time identity verification reduces exposure to high-cost fraudulent claims before authorization is granted.' },
      { icon: 'users',        title: 'Member Trust',     body: 'Offer members a verified digital health passport — a differentiating benefit that drives enrollment and retention.' },
    ],
    quote: '"Healthcare fraud costs the U.S. an estimated $60 billion per year — with medical identity theft accounting for $41.3 billion of that."',
    quoteSource: '— FBI Healthcare Fraud Division',
  },
  {
    id: 'emergency',
    icon: 'truck',
    shortLabel: 'EMS',
    label: 'EMS & First Responders',
    color: '#3AABAB',
    tagline: 'Know your patient before you arrive.',
    problems: [
      '13.2% 30-day mortality rate for unidentified emergency patients',
      '144.8 million ED visits annually — millions with unknown history',
      'Unidentified patients face critical delays in life-saving treatment',
      'Substance misuse (33%) and trauma (25%) patients often can\'t self-identify',
    ],
    benefits: [
      { icon: 'zap',          title: 'Instant ID in Seconds',           body: 'A biometric scan returns a full health profile — allergies, medications, conditions, blood type, DNR status — before the patient reaches the ER.' },
      { icon: 'pill',         title: 'Prevent Fatal Errors',            body: '44,000–98,000 people die annually from medication errors. Knowing a patient\'s allergies and current meds at the scene saves lives.' },
      { icon: 'phone',        title: 'Automatic Contact Notification',  body: 'Emergency contacts are identified and notified the moment a patient is scanned — no manual search required.' },
      { icon: 'file-text',    title: 'Documentation Ready',             body: 'Patient identity, consent status, and medical history are pre-populated for intake documentation, reducing ER workload.' },
    ],
    quote: '"Unidentified patients have a 13.2% 30-day mortality rate — nearly double that of identified patients presenting with similar conditions."',
    quoteSource: '— AHRQ Emergency Department Data',
  },
  {
    id: 'pharma',
    icon: 'pill',
    shortLabel: 'Pharmacy',
    label: 'Pharmacy & Pharmaceutical',
    color: '#6FC8C8',
    tagline: 'Right drug. Right dose. Right patient.',
    problems: [
      '6.5 medication errors per 100 hospital admissions',
      '$77 billion per year in medication error costs — morbidity and mortality combined',
      '1 in 5 doses is administered to the wrong patient or at the wrong dose',
      '1.5 million people harmed annually by preventable medication errors',
    ],
    benefits: [
      { icon: 'check-circle',    title: 'Verified Before Dispensing',     body: 'Biometric confirmation at dispensing ensures the correct medication reaches the correct, verified patient every time.' },
      { icon: 'alert-triangle',  title: 'Allergy Alerts at Point of Care', body: 'Phiris surfaces known drug allergies and contraindications before a prescription is filled or administered.' },
      { icon: 'folder',          title: 'Complete Medication History',     body: 'Access a patient\'s self-reported current medications to catch dangerous interactions that incomplete records miss.' },
      { icon: 'trending-down',   title: 'Liability Reduction',            body: 'Documented identity verification at every dispensing event provides a clear audit trail that reduces exposure to malpractice.' },
    ],
    quote: '"Medication errors harm at least 1.5 million people every year. At least $3.5 billion is spent annually on extra medical costs for those injured."',
    quoteSource: '— National Academies of Medicine',
  },
  {
    id: 'security',
    icon: 'shield-check',
    shortLabel: 'Security',
    label: 'Hospital Security',
    color: '#155F5F',
    tagline: 'Know who is in your building.',
    problems: [
      '$18.27 billion annual cost of workplace violence in healthcare',
      '91% of emergency physicians report being victims of violence',
      'Healthcare workers experience 48% of all nonfatal workplace violence',
      'Assault incidents rose 50% from 7.8 to 11.7 per 100 beds in just 4 years',
    ],
    benefits: [
      { icon: 'credit-card',    title: 'Verified Access Control', body: 'Know who is entering your facility. Phiris biometric ID verifies patients and flags individuals with prior incidents on record.' },
      { icon: 'alert-circle',   title: 'Threat Intelligence',    body: 'Cross-reference incoming patients against security flags — protecting staff before a situation escalates.' },
      { icon: 'file-text',      title: 'Audit Trails',           body: 'Every biometric scan creates a timestamped record — providing documented evidence for incident investigations and compliance.' },
      { icon: 'users',          title: 'Staff Protection',       body: 'Reduce anonymous encounters. Staff know who they are treating, reducing situations where false identities are used to evade prior bans or warrants.' },
    ],
    quote: '"Healthcare workers are assaulted more than any other profession — accounting for nearly half of all nonfatal workplace violence in the U.S."',
    quoteSource: '— CDC / NIOSH Workplace Violence Report',
  },
]

const ROI_STATS = [
  { value: '$17.4M', label: 'Recovered per hospital', sub: 'in annual denied claim revenue' },
  { value: '$900K',  label: 'Saved per hospital', sub: 'in staff productivity per year' },
  { value: '28 min', label: 'Returned per shift', sub: 'to direct patient care per clinician' },
  { value: '35%',    label: 'Fewer denied claims', sub: 'when patient ID is verified at point of care' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function Solutions() {
  const [activeTab, setActiveTab] = useState('hospitals')
  const [modalOpen, setModalOpen] = useState(false)
  const active = SOLUTIONS.find(s => s.id === activeTab)
  const isMobile = useIsMobile()

  return (
    <div className="page" style={{ background: '#F7F5F0', overflowX: 'hidden' }}>
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Header />

      {/* Hero */}
      <section style={{ ...styles.hero, padding: isMobile ? '72px 0 48px' : '100px 0 80px' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <div className="tag tag-teal" style={{ marginBottom: 20, display: 'inline-flex' }}>
            For Healthcare Organizations
          </div>
          <h1 style={styles.heroTitle}>
            The patient identification crisis<br />
            <span style={styles.heroGradient}>is costing you millions.</span>
          </h1>
          <p style={styles.heroSub}>
            Phiris is the biometric health identity platform that eliminates misidentification errors, prevents fraud, protects staff, and saves lives — at every point of care.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-lg" style={{ cursor: 'pointer' }}>
              Schedule a Demo
            </button>
            <Link to="/about" className="btn btn-ghost btn-lg" style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.2)' }}>
              See the Research →
            </Link>
          </div>
        </div>
      </section>


      {/* ── PHOTO STRIP ───────────────────────────────────────── */}
      <section style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', height: isMobile ? 160 : 280 }}>
          {[
            { img: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=600', flex: 1, label: 'Hospitals', mobileShow: true },
            { img: 'https://images.pexels.com/photos/7089620/pexels-photo-7089620.jpeg?auto=compress&cs=tinysrgb&w=500', flex: 1, label: 'Insurance', mobileShow: true },
            { img: 'https://images.pexels.com/photos/6754146/pexels-photo-6754146.jpeg?auto=compress&cs=tinysrgb&w=500', flex: 1, label: 'First Responders', mobileShow: true },
            { img: 'https://images.pexels.com/photos/9629685/pexels-photo-9629685.jpeg?auto=compress&cs=tinysrgb&w=500', flex: 1, label: 'Pharmacy', mobileShow: false },
            { img: 'https://images.pexels.com/photos/5996980/pexels-photo-5996980.jpeg?auto=compress&cs=tinysrgb&w=600', flex: 1, label: 'Hospital Security', mobileShow: false },
          ].filter(p => !isMobile || p.mobileShow).map((p, i) => (
            <div key={i} style={{ flex: p.flex, position: 'relative', overflow: 'hidden' }}>
              <img src={p.img} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(10,21,21,0.9) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontSize: isMobile ? '0.55rem' : '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(58,171,171,0.9)', textTransform: 'uppercase' }}>{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Crisis Stats */}
      <section style={styles.crisisSection}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={styles.sectionTitle}>The cost of getting identity wrong</h2>
            <p style={styles.sectionSub}>These aren't estimates. They're industry-wide data from AHRQ, the American Hospital Association, and the FBI.</p>
          </div>
          <div style={styles.statsGrid}>
            {CRISIS_STATS.map((s, i) => (
              <div key={i} style={styles.statCard}>
                <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
                <div style={styles.statSub}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Tabs */}
      <section style={styles.solutionsSection}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={styles.sectionTitle}>Built for every stakeholder</h2>
            <p style={styles.sectionSub}>Phiris creates value across the entire healthcare ecosystem — from the ER to the boardroom.</p>
          </div>

          {/* Tab bar */}
          <div style={{ ...styles.tabBar, overflowX: isMobile ? 'auto' : 'visible', flexWrap: isMobile ? 'nowrap' : 'wrap', justifyContent: isMobile ? 'flex-start' : 'center', paddingBottom: isMobile ? 8 : 0 }}>
            {SOLUTIONS.map(s => (
              <button
                key={s.id}
                style={{ ...styles.tabBtn(activeTab === s.id, s.color), minWidth: isMobile ? 64 : 110, padding: isMobile ? '10px 8px' : '12px 16px', flexShrink: 0 }}
                onClick={() => setActiveTab(s.id)}
              >
                <Icon name={s.icon} size={isMobile ? 20 : 24} color={activeTab === s.id ? s.color : 'rgba(255,255,255,0.5)'} strokeWidth={1.75} />
                <span style={{ fontSize: isMobile ? '0.65rem' : '0.78rem', fontWeight: 700, lineHeight: 1.2 }}>{isMobile ? s.shortLabel : s.label}</span>
              </button>
            ))}
          </div>

          {/* Active solution panel */}
          <div style={styles.solutionPanel}>
            <div style={{ ...styles.panelHeader(active.color), padding: isMobile ? '20px 20px' : '28px 36px' }}>
              <div>
                <div style={styles.panelTagline}>{active.tagline}</div>
                <h3 style={{ ...styles.panelTitle, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name={active.icon} size={28} color={active.color} strokeWidth={1.5} />
                  {active.label}
                </h3>
              </div>
            </div>

            <div style={{ ...styles.panelBody, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
              {/* Problem column */}
              <div style={{ ...styles.problemCol, borderRight: isMobile ? 'none' : '1px solid #D4E5E5', borderBottom: isMobile ? '1px solid #D4E5E5' : 'none', padding: isMobile ? '24px 20px' : '32px 36px' }}>
                <div style={styles.colLabel}>THE PROBLEM</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {active.problems.map((p, i) => (
                    <li key={i} style={styles.problemItem}>
                      <span style={styles.problemBullet}>✗</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div style={styles.quoteBlock(active.color)}>
                  <div style={styles.quoteText}>{active.quote}</div>
                  <div style={styles.quoteSource}>{active.quoteSource}</div>
                </div>
              </div>

              {/* Benefits column */}
              <div style={{ ...styles.benefitsCol, padding: isMobile ? '24px 20px' : '32px 36px' }}>
                <div style={styles.colLabel}>HOW PHIRIS HELPS</div>
                <div style={{ ...styles.benefitsGrid, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                  {active.benefits.map((b, i) => (
                    <div key={i} style={styles.benefitCard(active.color)}>
                      <div style={styles.benefitIcon}><Icon name={b.icon} size={26} color={active.color} strokeWidth={1.75} /></div>
                      <div style={{ ...styles.benefitTitle, color: active.color }}>{b.title}</div>
                      <div style={styles.benefitBody}>{b.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section style={styles.roiSection}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ ...styles.sectionTitle, color: '#fff' }}>The ROI is immediate</h2>
            <p style={{ ...styles.sectionSub, color: 'rgba(255,255,255,0.6)' }}>
              Phiris pays for itself. The financial case is clear.
            </p>
          </div>
          <div style={styles.roiGrid}>
            {ROI_STATS.map((s, i) => (
              <div key={i} style={styles.roiCard}>
                <div style={styles.roiValue}>{s.value}</div>
                <div style={styles.roiLabel}>{s.label}</div>
                <div style={styles.roiSub}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── REAL SCENARIOS PHOTO ───────────────────────────── */}
      <section style={{ background: '#F4F9F9', padding: isMobile ? '48px 0' : '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
            {!isMobile && (
            <div style={{ position: 'relative', minHeight: 420 }}>
              <img
                src="https://images.pexels.com/photos/4531306/pexels-photo-4531306.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Labeled blood bags in a medical facility"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(244,249,249,0.35) 100%)' }} />
            </div>
            )}
            <div style={{ background: '#F4F9F9', padding: isMobile ? '36px 24px' : '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ color: '#1E8484', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>The difference Phiris makes</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0D1A1A', lineHeight: 1.3, marginBottom: 20 }}>
                "They didn't know his blood type.<br />They didn't know about the allergy.<br />He almost didn't make it."
              </h3>
              <p style={{ color: 'rgba(28,42,42,0.62)', lineHeight: 1.75, marginBottom: 28, fontSize: '0.95rem' }}>
                Stories like this happen every day across the country. Patient misidentification isn't a rare edge case — it's a systemic failure that costs lives and money at every point of care.
              </p>
              <div style={{ borderTop: '1px solid rgba(28,42,42,0.1)', paddingTop: 24 }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E8484' }}>250,000+</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(28,42,42,0.5)', marginTop: 4 }}>preventable deaths annually linked to medical errors — many starting with patient ID</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}

      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={styles.sectionTitle}>How Phiris works</h2>
            <p style={styles.sectionSub}>A seamless, three-step process at every point of care.</p>
          </div>
          <div style={styles.howGrid}>
            {[
              { step: '01', icon: 'eye-scan', title: 'Patient enrolls once', body: 'Patients self-enroll through the Phiris app — entering their medical profile and emergency contacts. Enrollment captures a multi-angle face and iris scan, rotating to build a 3D biometric map for maximum accuracy. Consent is documented.' },
              { step: '02', icon: 'scan',        title: 'Responder scans at scene', body: 'In any emergency, a verified responder opens the Phiris platform and performs a biometric scan — face, iris, or both. Identity is confirmed in seconds, even for unconscious patients.' },
              { step: '03', icon: 'file-text',   title: 'Full profile surfaces instantly', body: 'The patient\'s complete health passport appears — allergies, medications, conditions, DNR status, blood type, and emergency contacts. No guessing.' },
            ].map((s, i) => (
              <div key={i} style={styles.howCard}>
                <div style={styles.howStep}>{s.step}</div>
                <div style={styles.howIcon}><Icon name={s.icon} size={30} color="#3AABAB" strokeWidth={1.5} /></div>
                <div style={styles.howTitle}>{s.title}</div>
                <div style={styles.howBody}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ ...styles.sectionTitle, color: '#fff', marginBottom: 16 }}>
            Ready to eliminate patient misidentification?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', marginBottom: 36, lineHeight: 1.7 }}>
            Phiris is currently in beta and actively partnering with health systems, EMS organizations, and insurers. Let's talk about what this looks like for your organization.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-lg" style={{ cursor: 'pointer' }}>
              Contact Us for a Demo
            </button>
            <Link to="/about" className="btn btn-ghost btn-lg" style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.25)' }}>
              View Our Research
            </Link>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', marginTop: 24 }}>
            Currently operating in Texas · Expanding nationally · HIPAA-conscious design
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container" style={styles.footerInner}>
          <img src="/logo-white.svg" alt="Phiris" style={{ height: 22, opacity: 0.6 }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>© {new Date().getFullYear()} Phiris LLC. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/about" style={styles.footerLink}>About</Link>
            <Link to="/legal" style={styles.footerLink}>Privacy & Terms</Link>
            <a href="mailto:admin@phiris.com" style={styles.footerLink}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #0D1A1A 0%, #155F5F 60%, #1E8484 100%)',
    padding: '100px 0 80px',
    color: '#fff',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 900,
    letterSpacing: '-0.03em',
    color: '#fff',
    marginBottom: 20,
    lineHeight: 1.15,
  },
  heroGradient: {
    background: 'linear-gradient(90deg, #3AABAB, #6FC8C8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '1.15rem',
    lineHeight: 1.7,
    marginBottom: 40,
    maxWidth: 650,
    margin: '0 auto 40px',
  },
  crisisSection: {
    padding: '80px 0',
    background: 'white',
    borderTop: '1px solid rgba(28,42,42,0.07)',
    borderBottom: '1px solid rgba(28,42,42,0.07)',
  },
  sectionTitle: {
    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
    fontWeight: 800,
    color: '#1C2A2A',
    marginBottom: 12,
    letterSpacing: '-0.02em',
  },
  sectionSub: {
    color: '#5A7070',
    fontSize: '1rem',
    maxWidth: 600,
    margin: '0 auto',
    lineHeight: 1.7,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 20,
  },
  statCard: {
    background: '#F4F9F9',
    border: '1px solid rgba(28,42,42,0.09)',
    borderRadius: 16,
    padding: '28px 24px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 900,
    letterSpacing: '-0.02em',
    marginBottom: 8,
  },
  statLabel: {
    color: '#1C2A2A',
    fontWeight: 700,
    fontSize: '0.95rem',
    marginBottom: 6,
  },
  statSub: {
    color: 'rgba(28,42,42,0.5)',
    fontSize: '0.8rem',
    lineHeight: 1.5,
  },
  solutionsSection: {
    padding: '60px 0 80px',
    background: '#F7F5F0',
  },
  tabBar: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
  },
  tabBtn: (active, color) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '12px 16px',
    borderRadius: 12,
    border: `2px solid ${active ? color : '#D4E5E5'}`,
    background: active ? color : '#fff',
    color: active ? '#fff' : '#5A7070',
    cursor: 'pointer',
    transition: 'all 0.15s',
    minWidth: 110,
    fontFamily: 'inherit',
  }),
  solutionPanel: {
    background: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    border: '1px solid #D4E5E5',
  },
  panelHeader: (color) => ({
    background: color,
    padding: '28px 36px',
  }),
  panelTagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  panelTitle: {
    color: '#fff',
    fontSize: '1.6rem',
    fontWeight: 800,
    margin: 0,
  },
  panelBody: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 0,
  },
  problemCol: {
    padding: '32px 36px',
    borderRight: '1px solid #D4E5E5',
    background: '#fafafa',
  },
  benefitsCol: {
    padding: '32px 36px',
  },
  colLabel: {
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.1em',
    color: '#5A7070',
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  problemItem: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 14,
    fontSize: '0.88rem',
    color: '#3A5050',
    lineHeight: 1.5,
  },
  problemBullet: {
    color: '#E05555',
    fontWeight: 700,
    fontSize: '1rem',
    marginTop: 1,
    flexShrink: 0,
  },
  quoteBlock: (color) => ({
    marginTop: 24,
    padding: '16px 20px',
    borderLeft: `4px solid ${color}`,
    background: 'rgba(0,0,0,0.03)',
    borderRadius: '0 8px 8px 0',
  }),
  quoteText: {
    fontSize: '0.85rem',
    color: '#1C2A2A',
    fontStyle: 'italic',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  quoteSource: {
    fontSize: '0.75rem',
    color: '#5A7070',
    fontWeight: 600,
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  benefitCard: (color) => ({
    background: '#F7F5F0',
    borderRadius: 12,
    padding: '18px 16px',
    border: `1px solid #D4E5E5`,
    transition: 'border-color 0.15s',
  }),
  benefitIcon: {
    fontSize: '1.4rem',
    marginBottom: 8,
  },
  benefitTitle: {
    fontWeight: 700,
    fontSize: '0.88rem',
    marginBottom: 6,
  },
  benefitBody: {
    fontSize: '0.8rem',
    color: '#5A7070',
    lineHeight: 1.6,
  },
  roiSection: {
    background: 'linear-gradient(135deg, #0D1A1A 0%, #155F5F 100%)',
    padding: '80px 0',
  },
  roiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 24,
  },
  roiCard: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: '28px 24px',
    textAlign: 'center',
  },
  roiValue: {
    fontSize: '2.2rem',
    fontWeight: 900,
    color: '#3AABAB',
    letterSpacing: '-0.02em',
    marginBottom: 8,
  },
  roiLabel: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    marginBottom: 6,
  },
  roiSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.78rem',
    lineHeight: 1.5,
  },
  howGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 32,
  },
  howCard: {
    textAlign: 'center',
    padding: '0 16px',
  },
  howStep: {
    fontSize: '0.75rem',
    fontWeight: 800,
    letterSpacing: '0.1em',
    color: '#3AABAB',
    marginBottom: 12,
  },
  howIcon: {
    fontSize: '2.5rem',
    marginBottom: 16,
  },
  howTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#1C2A2A',
    marginBottom: 10,
  },
  howBody: {
    fontSize: '0.88rem',
    color: '#5A7070',
    lineHeight: 1.7,
  },
  ctaSection: {
    background: '#0D1A1A',
    padding: '80px 0',
  },
  footer: {
    background: '#0A1414',
    padding: '24px 0',
  },
  footerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  footerLink: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '0.8rem',
    textDecoration: 'none',
  },
}
