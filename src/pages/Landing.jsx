import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Icon from '../components/Icon'
import { useIsMobile } from '../hooks/useIsMobile'

const HCP_STATS = [
  { value: '3,684', label: 'Healthcare professionals surveyed' },
  { value: '69%',   label: 'Experience patient ID failures regularly' },
  { value: '59%',   label: 'Would pay for a biometric ID solution' },
  { value: '~40%',  label: 'Volunteered as beta design partners' },
]

const PATIENT_STATS = [
  { value: '2,762', label: 'Patients surveyed' },
  { value: '87%',   label: 'Want doctors to instantly ID them if unconscious' },
  { value: '85%',   label: 'Would enroll in Phiris' },
  { value: '85%',   label: 'Would download the Phiris app' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'You Enroll',
    body: 'Create your free Phiris profile in minutes. Add your photo, medical info, allergies, and emergency contacts.',
    icon: 'eye-scan',
  },
  {
    step: '02',
    title: 'Emergency Happens',
    body: 'If you\'re ever unconscious, unresponsive, or unable to speak, first responders use Phiris to identify you instantly.',
    icon: 'siren',
  },
  {
    step: '03',
    title: 'You\'re Identified',
    body: 'A secure facial scan matches you in seconds — no wallet, no ID card, no delay. Your critical info is right there.',
    icon: 'shield-check',
  },
]

const WHY_IT_MATTERS = [
  { icon: 'zap',        title: 'Seconds matter',    body: 'Unidentified patients face delays in critical treatment. Knowing your allergies or conditions instantly can be the difference.' },
  { icon: 'lock',       title: 'Secure by design',  body: 'Your data is encrypted, stored securely, and only accessible to verified emergency responders during an active emergency.' },
  { icon: 'smartphone', title: 'Always with you',   body: 'No bracelet to forget. No card to lose. Your biometric profile is always accessible wherever you go.' },
  { icon: 'bell',       title: 'Notify your people', body: 'Emergency contacts are alerted when you\'re admitted, so your family knows immediately.' },
]

export default function Landing() {
  const isMobile = useIsMobile()
  return (
    <div style={{ background: '#0D1A1A', minHeight: '100vh', overflowX: 'hidden' }}>
      <Header variant="dark" />

      {/* Hero */}
      <section style={{ ...styles.hero, padding: isMobile ? '72px 0 60px' : '100px 0 120px' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ ...styles.heroLayout, gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: isMobile ? 0 : 60 }}>
            {/* Left: copy */}
            <div style={styles.heroContent}>
              <div className="tag tag-teal" style={{ marginBottom: 20, display: 'inline-flex' }}>
                Now enrolling — Early access
              </div>
              <h1 style={styles.heroTitle}>
                <span style={{ whiteSpace: 'nowrap' }}>When seconds matter,</span><br />
                <span style={styles.heroGradientText}>identity matters.</span>
              </h1>
              <p style={styles.heroPassport}>
                Phiris — Your Healthcare Passport
              </p>
              <p style={styles.heroSubtitle}>
                Phiris lets emergency responders instantly identify you and access your
                critical medical information — even when you can't speak for yourself.
              </p>
              <div style={{ ...styles.heroCTA, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Enroll as a Patient
                </Link>
                <Link to="/responder/register" className="btn btn-ghost btn-lg" style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)', ...(isMobile ? { textAlign: 'center' } : {}) }}>
                  I'm a First Responder / HCP
                </Link>
              </div>
            </div>

            {/* Right: Phone mockup — hidden on mobile */}
            {!isMobile && <div style={styles.heroVisual}>
              <div style={styles.phoneMockup}>
                {/* Phone shell */}
                <div style={styles.phoneShell}>
                  {/* Notch */}
                  <div style={styles.phoneNotch} />
                  {/* Screen content */}
                  <div style={styles.phoneScreen}>
                    {/* App header */}
                    <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid rgba(58,171,171,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI4LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAyODggNjMuMzMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI4OCA2My4zMzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiMxRTIyMjM7fQoJLnN0MXtmaWxsOnVybCgjU1ZHSURfMV8pO30KCS5zdDJ7ZmlsbDojRkZGRkZGO30KCS5zdDN7ZmlsbDp1cmwoI1NWR0lEXzAwMDAwMDAxNjMxODA0NDM4NTQ2NzIzODEwMDAwMDEyNzI1NDcxOTQ4NzExOTc4NDE4Xyk7fQoJLnN0NHtmaWxsOnVybCgjU1ZHSURfMDAwMDAxMTc2NjMxOTM1OTI2ODg2OTIzOTAwMDAwMTE0MzU3NTU3MjUzMzkzODM3NDFfKTt9Cgkuc3Q1e2ZpbGw6dXJsKCNTVkdJRF8wMDAwMDEwNTQyMjg4ODIwODYzMzYxMTUyMDAwMDAwNzc4MjMwNTMyOTY2NzQyODQ5Ml8pO30KCS5zdDZ7ZmlsbDp1cmwoI1NWR0lEXzAwMDAwMDc5NDQ2NzI4NTM4NDk2OTA4MzEwMDAwMDAyMDM2MTY5MjgzNjg0OTg4NTU3Xyk7fQoJLnN0N3tmaWxsOnVybCgjU1ZHSURfMDAwMDAwNzgwMTc4MDMwNTAxNTk3MTc1MDAwMDAwMTIyMjMzNjkzNjc1NTQ1MzczOTlfKTt9Cgkuc3Q4e2ZpbGw6dXJsKCNTVkdJRF8wMDAwMDAzMTkxNzcwMjI2OTQ2OTAxODA2MDAwMDAwMTEyNTAwNTE1ODQ5Mzc5MjY3OF8pO30KCS5zdDl7ZmlsbDp1cmwoI1NWR0lEXzAwMDAwMTAzMjUzOTAyNTQzNjIyMTc2MzUwMDAwMDA0NDc4NTc3ODI2MTI1MzI2NzUyXyk7fQo8L3N0eWxlPgo8Zz4KCTxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iNjMuNjQ4NSIgeTE9IjMxLjY2NjUiIHgyPSItMS44MTg5ODllLTEyIiB5Mj0iMzEuNjY2NSI+CgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzM5ODA4QyIvPgoJCTxzdG9wICBvZmZzZXQ9IjAuMTE2NCIgc3R5bGU9InN0b3AtY29sb3I6IzQyODU5MSIvPgoJCTxzdG9wICBvZmZzZXQ9IjAuMzA5MyIgc3R5bGU9InN0b3AtY29sb3I6IzVDOTNBMCIvPgoJCTxzdG9wICBvZmZzZXQ9IjAuNSIgc3R5bGU9InN0b3AtY29sb3I6IzdCQTVCMiIvPgoJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNCMEQ0RDgiLz4KCTwvbGluZWFyR3JhZGllbnQ+Cgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOS4wNCw5LjQ1YzEuODUtMS45LDMuOTQtMy41Nyw2LjIyLTQuOTZjMC4yNS0wLjE1LDAuNTktMC4wNSwwLjcyLDAuMjFsNC4yNiw4Ljg1bDEuNDMtMC42OWw0LjI4LDguODkKCQljMC4xMSwwLjIzLDAuMDMsMC41LTAuMTgsMC42M2MtMC41OCwwLjM4LTEuMTIsMC44MS0xLjYyLDEuMjljLTAuMTgsMC4xOC0wLjQ2LDAuMTktMC42NiwwLjA0bC03LjcxLTYuMTVsMC45OS0xLjI0TDkuMDksMTAuMgoJCUM4Ljg2LDEwLjAyLDguODMsOS42Nyw5LjA0LDkuNDV6IE0xMC43OSwzNS40MWw5LjYxLTIuMThjMC4yNS0wLjA2LDAuNDEtMC4yOSwwLjM4LTAuNTRjLTAuMDQtMC4zNS0wLjA2LTAuNy0wLjA2LTEuMDYKCQljMC0wLjM0LDAuMDItMC42NywwLjA2LTFjMC4wMy0wLjI1LTAuMTMtMC40OC0wLjM4LTAuNTRsLTkuNjEtMi4ybC0wLjM1LDEuNTRsLTkuNTgtMi4xOWMtMC4yOS0wLjA3LTAuNTgsMC4xMy0wLjYxLDAuNDIKCQlDMC4xLDI4LjkzLDAsMzAuMjMsMCwzMS41NWMwLDEuMzgsMC4wOCwyLjczLDAuMjUsNC4wNmMwLjA0LDAuMjksMC4zMiwwLjQ5LDAuNjEsMC40M2w5LjU4LTIuMThMMTAuNzksMzUuNDF6IE0yOC4zNiwyMS4xNAoJCWMwLjY1LTAuMjEsMS4zMi0wLjM3LDIuMDEtMC40N2MwLjI1LTAuMDMsMC40NC0wLjI0LDAuNDQtMC40OWwwLTkuODVoLTEuNThWMC41MWMwLTAuMy0wLjI2LTAuNTMtMC41NS0wLjUxCgkJYy0yLjcsMC4yNi01LjMsMC44Ny03Ljc2LDEuNzZjLTAuMjgsMC4xLTAuNDEsMC40My0wLjI4LDAuNjlsNC4yNiw4Ljg1TDIzLjQ4LDEybDQuMjgsOC44OEMyNy44NiwyMS4xMSwyOC4xMiwyMS4yMiwyOC4zNiwyMS4xNHoKCQkgTTI5LjE4LDYyLjgyTDI5LjIsNTNsMS41OCwwbDAuMDItOS44NmMwLTAuMjUtMC4xOS0wLjQ2LTAuNDQtMC40OWMtMC42OS0wLjA5LTEuMzctMC4yNS0yLjAxLTAuNDdjLTAuMjQtMC4wOC0wLjUsMC4wMi0wLjYxLDAuMjUKCQlsLTQuMjksOC44OEwyNC44Nyw1MmwtNC4yOCw4Ljg1Yy0wLjEzLDAuMjcsMCwwLjU5LDAuMjgsMC42OWMyLjQ2LDAuOSw1LjA2LDEuNTEsNy43NSwxLjc3QzI4LjkyLDYzLjM1LDI5LjE4LDYzLjExLDI5LjE4LDYyLjgyegoJCSBNMTQuNTIsMTkuMTRMMTQuNTIsMTkuMTRsLTAuOTksMS4yNGwtNy42OC02LjEzYy0wLjIzLTAuMTktMC41OC0wLjEzLTAuNzQsMC4xMmMtMS40NCwyLjIxLTIuNjEsNC42Mi0zLjQ2LDcuMTYKCQljLTAuMDksMC4yOCwwLjA4LDAuNTksMC4zNywwLjY1bDkuNTksMi4ybC0wLjM1LDEuNTRsOS42LDIuMmMwLjI1LDAuMDYsMC40OS0wLjA4LDAuNTgtMC4zMmMwLjI0LTAuNjUsMC41NS0xLjI3LDAuOS0xLjg2CgkJYzAuMTMtMC4yMiwwLjA5LTAuNDktMC4xMS0wLjY1TDE0LjUyLDE5LjE0eiBNMjAuMjEsNDkuNzVsMS40MywwLjY5bDQuMjktOC44OGMwLjExLTAuMjMsMC4wMy0wLjUtMC4xOC0wLjYzCgkJYy0wLjU4LTAuMzgtMS4xMi0wLjgxLTEuNjItMS4yOWMtMC4xOC0wLjE4LTAuNDYtMC4yLTAuNjYtMC4wNGwtNy43Miw2LjE0bDAuOTksMS4yNGwtNy42OCw2LjExQzguODIsNTMuMjcsOC44LDUzLjYyLDksNTMuODMKCQljMS44NSwxLjksMy45MywzLjU4LDYuMjEsNC45N2MwLjI1LDAuMTYsMC41OSwwLjA1LDAuNzItMC4yMUwyMC4yMSw0OS43NXogTTEzLjUxLDQyLjkybDAuOTksMS4yNGw3LjcxLTYuMTMKCQljMC4yLTAuMTYsMC4yNC0wLjQzLDAuMTEtMC42NWMtMC4zNS0wLjU5LTAuNjUtMS4yMS0wLjg5LTEuODdjLTAuMDktMC4yNC0wLjMzLTAuMzgtMC41OC0wLjMybC05LjYxLDIuMThsMCwwbDAuMzUsMS41NUwyLjAxLDQxLjEKCQljLTAuMjksMC4wNy0wLjQ2LDAuMzctMC4zNywwLjY1YzAuODUsMi41NSwyLjAxLDQuOTYsMy40NSw3LjE3YzAuMTYsMC4yNSwwLjUxLDAuMywwLjc0LDAuMTJMMTMuNTEsNDIuOTJ6IE0zNC40MSwwLjUxdjkuODJoLTEuNTgKCQlsMCw5Ljg2YzAsMC4yNSwwLjE5LDAuNDYsMC40NCwwLjQ5YzAuNzEsMC4wOSwxLjM5LDAuMjUsMi4wNSwwLjQ3YzAuMjQsMC4wOCwwLjUtMC4wMiwwLjYxLTAuMjVsNC4zMS04Ljg3bDEuODEsMC44OGwtNC4zMSw4Ljg3CgkJYy0wLjExLDAuMjMtMC4wMywwLjUsMC4xOCwwLjYzYzAuNTgsMC4zOCwxLjEyLDAuODEsMS42MSwxLjI5YzAuMTgsMC4xOCwwLjQ2LDAuMiwwLjY2LDAuMDRsNy43My02LjEybDEuMjUsMS41OGwtNy43Miw2LjEyCgkJYy0wLjIsMC4xNi0wLjI0LDAuNDMtMC4xMSwwLjY1YzAuMzUsMC41OSwwLjY1LDEuMjEsMC44OSwxLjg3YzAuMDksMC4yNCwwLjMzLDAuMzgsMC41OCwwLjMybDkuNjEtMi4xN2wwLjQ0LDEuOTZsLTkuNjIsMi4xNwoJCWMtMC4yNSwwLjA2LTAuNDEsMC4yOS0wLjM4LDAuNTRjMC4wMywwLjM0LDAuMDYsMC42OSwwLjA1LDEuMDRjMCwwLjM1LTAuMDIsMC42OC0wLjA2LDEuMDJjLTAuMDMsMC4yNSwwLjEzLDAuNDgsMC4zOCwwLjU0CgkJbDkuNiwyLjIybC0wLjQ1LDEuOTZsLTkuNi0yLjIyYy0wLjI1LTAuMDYtMC40OSwwLjA4LTAuNTgsMC4zMmMtMC4yNCwwLjY1LTAuNTUsMS4yNy0wLjksMS44NmMtMC4xMywwLjIyLTAuMDksMC40OSwwLjExLDAuNjUKCQlsNy42OSw2LjE2bC0xLjI2LDEuNTdsLTcuNjktNi4xNmMtMC4yLTAuMTYtMC40OC0wLjE0LTAuNjYsMC4wNGMtMC41LDAuNDgtMS4wNCwwLjkxLTEuNjIsMS4yOGMtMC4yMSwwLjE0LTAuMjksMC40MS0wLjE4LDAuNjMKCQlsNC4yNiw4Ljg5bC0xLjgyLDAuODdsLTQuMjYtOC44OWMtMC4xMS0wLjIzLTAuMzctMC4zMy0wLjYxLTAuMjVjLTAuNjUsMC4yMS0xLjMyLDAuMzctMi4wMSwwLjQ2Yy0wLjI1LDAuMDMtMC40NCwwLjI0LTAuNDQsMC40OQoJCUwzMi43OSw1M2wxLjU4LDBsLTAuMDIsOS44MmMwLDAuMywwLjI2LDAuNTMsMC41NSwwLjUxYzE2LjA4LTEuNTUsMjguNjgtMTUuMDYsMjguNzMtMzEuNTZDNjMuNzEsMTUuMjIsNTEuMTIsMS41OSwzNC45NywwCgkJQzM0LjY3LTAuMDMsMzQuNDEsMC4yMSwzNC40MSwwLjUxeiIvPgoJPGc+CgkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3Ny43MywxMy41OWgtNi4wNGMtMC4yOCwwLTAuNSwwLjIyLTAuNSwwLjV2MzUuMTVjMCwwLjI4LDAuMjIsMC41LDAuNSwwLjVoNi4wNGMwLjI4LDAsMC41LTAuMjIsMC41LTAuNQoJCQlWMTQuMDlDMTc4LjIzLDEzLjgyLDE3OC4wMSwxMy41OSwxNzcuNzMsMTMuNTl6Ii8+CgkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTI0Mi4zMiwxMy41OWgtNi4wNGMtMC4yOCwwLTAuNSwwLjIyLTAuNSwwLjV2MzUuMTVjMCwwLjI4LDAuMjIsMC41LDAuNSwwLjVoNi4wNGMwLjI4LDAsMC41LTAuMjIsMC41LTAuNQoJCQlWMTQuMDlDMjQyLjgyLDEzLjgyLDI0Mi41OSwxMy41OSwyNDIuMzIsMTMuNTl6Ii8+CgkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE1OC44OSwxMy41OWgtNi4wNGMtMC4yOCwwLTAuNSwwLjIyLTAuNSwwLjV2MTQuMzloLTIyLjU3VjE0LjA5YzAtMC4yOC0wLjIyLTAuNS0wLjUtMC41aC02LjA0CgkJCWMtMC4yOCwwLTAuNSwwLjIyLTAuNSwwLjV2MzUuMTVjMCwwLjI4LDAuMjIsMC41LDAuNSwwLjVoNi4wNGMwLjI4LDAsMC41LTAuMjIsMC41LTAuNVYzNC4xNGgyMi41N3YxNS4xMQoJCQljMCwwLjI4LDAuMjIsMC41LDAuNSwwLjVoNi4wNGMwLjI4LDAsMC41LTAuMjIsMC41LTAuNVYxNC4wOUMxNTkuMzksMTMuODIsMTU5LjE3LDEzLjU5LDE1OC44OSwxMy41OXoiLz4KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTA5Ljg2LDE1LjA1Yy0xLjY5LTAuOTYtMy43Ny0xLjQ1LTYuMTgtMS40NWgtMjIuN2MtMC4yOCwwLTAuNSwwLjIyLTAuNSwwLjV2MTUuNDJoNy4wNHYtMTAuNmgxNC4wNQoJCQljMS4zNiwwLDIuNTQsMC4yNSwzLjUsMC43NGMxLDAuNTEsMS43NiwxLjI0LDIuMjcsMi4xOGMwLjUsMC45MiwwLjc1LDIuMDMsMC43NSwzLjMzYzAsMS45NC0wLjU5LDMuNTEtMS43NCw0LjY1CgkJCWMtMS4xNiwxLjEzLTIuNzcsMS43MS00Ljc4LDEuNzFIODguNDVjLTQuNCwwLTcuOTcsMy41Ny03Ljk3LDcuOTd2OS43NWMwLDAuMjgsMC4yMiwwLjUsMC41LDAuNWg2LjA0YzAuMjgsMCwwLjUtMC4yMiwwLjUtMC41CgkJCVYzNi43OWgxNS45M2MyLjQ0LDAsNC41NS0wLjQ5LDYuMjctMS40NWMxLjctMC45NiwzLjAzLTIuMzIsMy45NS00LjA1YzAuOTQtMS43NSwxLjQxLTMuODEsMS40MS02LjEyYzAtMi4zNS0wLjQ2LTQuNDEtMS4zNi02LjEyCgkJCUMxMTIuODQsMTcuMzUsMTExLjU0LDE2LjAxLDEwOS44NiwxNS4wNXoiLz4KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMjE5LjA0LDM1LjQzbDAuNzEtMC40NWMxLjU1LTAuOTksMi43LTIuMiwzLjUtMy43YzAuOTQtMS43NiwxLjQxLTMuODIsMS40MS02LjEyCgkJCWMwLTIuMzUtMC40Ni00LjQxLTEuMzYtNi4xMmMtMC44OS0xLjY5LTIuMTktMy4wNC0zLjg3LTRjLTEuNjktMC45Ni0zLjc3LTEuNDUtNi4xOC0xLjQ1aC0yMi42OWMtMC4yOCwwLTAuNSwwLjIyLTAuNSwwLjV2MTQuOTIKCQkJYzAsMC4yOCwwLjIyLDAuNSwwLjUsMC41aDYuMDRjMC4yOCwwLDAuNS0wLjIyLDAuNS0wLjV2LTEwLjFoMTQuMDVjMS4zNiwwLDIuNTQsMC4yNSwzLjUsMC43NGMwLjk5LDAuNTEsMS43NiwxLjI0LDIuMjcsMi4xOAoJCQljMC41LDAuOTIsMC43NSwyLjAzLDAuNzUsMy4zM2MwLDEuOTUtMC41OSwzLjUxLTEuNzQsNC42NWMtMS4xNiwxLjEzLTIuNzYsMS43MS00Ljc4LDEuNzFoLTEzLjExYy00LjQsMC03Ljk4LDMuNTctNy45OCw3Ljk4CgkJCXY5Ljc0YzAsMC4yOCwwLjIyLDAuNSwwLjUsMC41aDYuMDRjMC4yOCwwLDAuNS0wLjIyLDAuNS0wLjVWMzYuNzloMTUuMzJsNi4yOSwxMi41OGMwLjExLDAuMjMsMC4zNCwwLjM3LDAuNiwwLjM3aDYuMzUKCQkJYzAuMjUsMCwwLjQxLTAuMjYsMC4zLTAuNDhMMjE5LjA0LDM1LjQzeiIvPgoJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yODcsMzQuOTJjLTAuNjgtMS4xNC0xLjYxLTIuMTEtMi43OS0yLjg4Yy0xLjIyLTAuOC0yLjYxLTEuNDctNC4xMy0xLjk3Yy0xLjU2LTAuNTItMy4yLTAuOTYtNC44Ny0xLjMKCQkJYy0xLjcxLTAuMzUtMy4zNy0wLjY3LTQuOTYtMC45NmMtMS42NS0wLjMtMy4xMy0wLjY0LTQuNDItMC45OWMtMS4zOS0wLjM3LTIuNTItMC44Ny0zLjM3LTEuNDZjLTEuMDEtMC43Mi0xLjUzLTEuNjctMS41My0yLjg0CgkJCWMwLTAuOTgsMC40NC0xLjg2LDEuMjktMi41OWMwLjc1LTAuNjUsMS44OS0xLjE1LDMuMzctMS40OGMxLjQtMC4zMSwzLjE0LTAuNDYsNS4xOS0wLjQ2YzEuNzQsMCwzLjI5LDAuMiw0LjYxLDAuNTkKCQkJYzEuMzcsMC40MSwyLjQ3LDEsMy4yOCwxLjc2YzAuNjYsMC42MywxLjA4LDEuMzUsMS4yNSwyLjE0YzAuMDYsMC4yNywwLjI4LDAuNDgsMC41NiwwLjQ4aDUuODJjMC4yOSwwLDAuNTMtMC4yNSwwLjUxLTAuNTMKCQkJYy0wLjA5LTEuMzktMC40Ni0yLjYyLTEuMDktMy42N2MtMC43NS0xLjI0LTEuODMtMi4zMS0zLjIxLTMuMThjLTEuNDEtMC44OC0zLjE1LTEuNTQtNS4xNi0xLjk4Yy0yLjA3LTAuNDUtNC4zNy0wLjY3LTYuODYtMC42NwoJCQljLTIuNTMsMC00Ljg4LDAuMjMtNywwLjY3Yy0yLjA3LDAuNDQtMy44OCwxLjA5LTUuMzcsMS45NGMtMS40NCwwLjgzLTIuNTYsMS44OC0zLjMyLDMuMTNjLTAuNzUsMS4yNS0xLjE0LDIuNzMtMS4xNCw0LjM5CgkJCWMwLDEuNzEsMC4zNCwzLjE2LDEuMDEsNC4zMmMwLjY4LDEuMTgsMS42MSwyLjE2LDIuNzgsMi45MmMxLjIyLDAuOCwyLjYxLDEuNDcsNC4xMywyYzEuNTUsMC41MywzLjE4LDAuOTgsNC44NiwxLjMyCgkJCWMxLjcxLDAuMzUsMy4zNywwLjY3LDQuOTksMC45NmMxLjY3LDAuMzEsMy4xNywwLjY2LDQuNDUsMS4wNWMxLjM3LDAuNDIsMi41LDAuOTUsMy4zNSwxLjU4YzEuMDMsMC43NiwxLjU0LDEuNzksMS41NCwzLjA1CgkJCWMwLDAuNzktMC4yMywxLjUtMC42OSwyLjExYy0wLjQxLDAuNTQtMC45NywxLjAyLTEuNjcsMS40MWMtMC42NywwLjM3LTEuNDQsMC42Ny0yLjI5LDAuODdjLTAuOCwwLjE5LTEuNywwLjM1LTIuNjgsMC40NgoJCQljLTAuOTYsMC4xMi0xLjk4LDAuMTctMy4wMSwwLjE3Yy0yLjA2LDAtMy44OS0wLjItNS40NS0wLjU4Yy0xLjY0LTAuNC0yLjk0LTEuMDQtMy44NS0xLjg5Yy0wLjg4LTAuODEtMS4zNy0xLjg2LTEuNDctMy4xCgkJCWMtMC4wMi0wLjI4LTAuMjQtMC41Mi0wLjUzLTAuNTJoLTUuOWMtMC4yOCwwLTAuNTIsMC4yNC0wLjUxLDAuNTJjMC4wOCwxLjg2LDAuNTIsMy40NSwxLjMxLDQuNzJjMC44OSwxLjQyLDIuMTQsMi41OCwzLjcyLDMuNDQKCQkJYzEuNjQsMC44OSwzLjU4LDEuNTMsNS43NSwxLjkyYzIuMjIsMC4zOSw0LjYzLDAuNTksNy4xNCwwLjU5YzMuNDgsMCw2LjU4LTAuNCw5LjIzLTEuMThjMi41Ni0wLjc2LDQuNTgtMS45OCw2LjAxLTMuNjQKCQkJYzEuMzktMS42MiwyLjEtMy44MiwyLjEtNi41M0MyODgsMzcuNDMsMjg3LjY2LDM2LjAzLDI4NywzNC45MnoiLz4KCTwvZz4KPC9nPgo8L3N2Zz4K" alt="Phiris" style={{ height: 16, width: 'auto', display: 'block' }} />
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Health Passport</div>
                    </div>
                    {/* Profile card */}
                    <div style={{ padding: '14px 16px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #1E8484, #3AABAB)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon name="eye-scan" size={20} color="white" strokeWidth={1.5} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>Verified Identity</div>
                          <div style={{ fontSize: '11px', color: 'rgba(58,171,171,0.8)' }}>● Active Protection</div>
                        </div>
                      </div>
                      {/* Data rows */}
                      {[
                        { label: 'Blood Type', value: 'O+', icon: 'heart' },
                        { label: 'Allergies', value: 'Penicillin', icon: 'alert-triangle' },
                        { label: 'Conditions', value: 'Type 1 Diabetes', icon: 'activity' },
                      ].map(row => (
                        <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <Icon name={row.icon} size={13} color="rgba(58,171,171,0.7)" />
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{row.label}</span>
                          </div>
                          <span style={{ fontSize: '11px', color: 'white', fontWeight: 700 }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                    {/* Emergency CTA */}
                    <div style={{ margin: '0 16px 12px', background: 'linear-gradient(90deg,#155F5F,#1E8484)', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon name="shield-check" size={15} color="white" />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>Emergency Access Ready</span>
                    </div>
                    {/* Emergency contact */}
                    <div style={{ padding: '10px 16px' }}>
                      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Emergency Contact</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(58,171,171,0.12)', border: '1px solid rgba(58,171,171,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="users" size={13} color="#3AABAB" />
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>John Doe</div>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>Spouse · (512) 555-0100</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Home indicator */}
                  <div style={styles.phoneHomeBar} />
                </div>
                {/* Glow */}
                <div style={styles.phoneGlow} />
              </div>
            </div>
            }
          </div>
        </div>

        {/* Gradient orb background */}
        <div style={styles.heroOrb1} />
        <div style={styles.heroOrb2} />
      </section>


      {/* ── PHOTO TRUST STRIP ─────────────────────────────── */}
      <section style={{ background: '#0B1818', padding: '0' }}>
        <div style={{ display: 'flex', height: isMobile ? 160 : 300, overflow: 'hidden' }}>
          {[
            { img: 'https://images.pexels.com/photos/6754178/pexels-photo-6754178.jpeg?auto=compress&cs=tinysrgb&w=800', label: 'Patient Emergency', pos: 'center 40%' },
            { img: 'https://images.pexels.com/photos/8942528/pexels-photo-8942528.jpeg?auto=compress&cs=tinysrgb&w=800', label: 'First Responders', pos: 'center 30%' },
            { img: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800', label: 'Emergency Care', pos: 'center 50%' },
          ].map((p, i) => (
            <div key={i} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <img src={p.img} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: p.pos, filter: 'grayscale(20%) brightness(0.7)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(13,26,26,0.85) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(58,171,171,0.8)', textTransform: 'uppercase' }}>{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Patient Stats bar */}
      <section style={styles.statsBar}>
        <div className="container">
          <p style={{ textAlign: 'center', color: 'rgba(28,42,42,0.45)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            Patient Survey — 2,762 respondents
          </p>
          <div style={styles.statsGrid}>
            {PATIENT_STATS.map((s) => (
              <div key={s.value} style={styles.statItem}>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HCP Stats bar */}
      <section style={styles.statsBar}>
        <div className="container">
          <p style={{ textAlign: 'center', color: 'rgba(160,115,30,0.8)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            Healthcare Professional Survey — 3,684 respondents
          </p>
          <div style={styles.statsGrid}>
            {HCP_STATS.map((s) => (
              <div key={s.value} style={styles.statItem}>
                <div style={{ ...styles.statValue, background: 'linear-gradient(90deg, #D4A847, #F0C96A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <p style={styles.sectionEyebrow}>How It Works</p>
            <h2 style={styles.sectionTitle}>Three steps. One profile. <br />Lifelong protection.</h2>
          </div>
          <div style={styles.stepsGrid}>
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} style={styles.stepCard}>
                <div style={styles.stepNumber}>{item.step}</div>
                <div style={styles.stepIcon}><Icon name={item.icon} size={32} color="#3AABAB" strokeWidth={1.5} /></div>
                <h3 style={styles.stepTitle}>{item.title}</h3>
                <p style={styles.stepBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section style={{ ...styles.section, background: '#F0F7F7' }}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <p style={styles.sectionEyebrow}>Why Phiris</p>
            <h2 style={{ ...styles.sectionTitle, color: '#1C2A2A' }}>
              Built for the moment<br />everything else stops.
            </h2>
          </div>
          <div style={styles.whyGrid}>
            {WHY_IT_MATTERS.map((item) => (
              <div key={item.title} className="card card-sm" style={styles.whyCard}>
                <div style={styles.whyIcon}><Icon name={item.icon} size={28} color="#155F5F" strokeWidth={1.75} /></div>
                <h3 style={styles.whyTitle}>{item.title}</h3>
                <p style={styles.whyBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── WHO IT PROTECTS ─────────────────────────────────── */}
      <section style={{ background: '#F0F7F7', padding: isMobile ? '56px 0' : '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: '#1E8484', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Real Scenarios. Real Stakes.</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#0D1A1A', lineHeight: 1.2, marginBottom: 16 }}>
              Phiris protects the moments<br/>you cannot prepare for
            </h2>
            <p style={{ color: '#4A6B6B', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto' }}>
              Every day, people arrive at emergency rooms unable to speak, unidentified, or without anyone who knows their medical history. Phiris changes that.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(6, 1fr)', gap: isMobile ? 16 : 24 }}>
            {[
              {
                img: 'https://images.pexels.com/photos/4586683/pexels-photo-4586683.jpeg?auto=compress&cs=tinysrgb&w=600',
                tag: 'The Parent',
                headline: '"If something happens to me, will anyone know to call my kids school?"',
                body: 'Over half of survey respondents said notifying emergency contacts was their #1 needed feature. With Phiris, the moment you are admitted, your family is called automatically.',
                stat: '51.6% of respondents',
                statLabel: 'ranked emergency contact notification as a top priority',
                accent: '#1E8484',
              },
              {
                img: 'https://images.pexels.com/photos/8413176/pexels-photo-8413176.jpeg?auto=compress&cs=tinysrgb&w=600',
                tag: 'The Chronic Condition Patient',
                headline: '"Every ER visit, I start from scratch — hoping someone reads my chart in time."',
                body: 'Severe allergies. Type 1 diabetes. A heart condition. Phiris surfaces what matters most, instantly — before a well-meaning mistake becomes a dangerous one.',
                stat: '52.9% of respondents',
                statLabel: 'want doctors to instantly know their allergies and conditions',
                accent: '#D4A847',
              },
              {
                img: 'https://images.pexels.com/photos/32437427/pexels-photo-32437427.jpeg?auto=compress&cs=tinysrgb&w=600',
                tag: 'The Unconscious Patient',
                headline: '"I could not speak. They did not know my blood type, my allergies, or who to call."',
                body: 'Thousands of patients arrive at emergency rooms each year unable to communicate. Phiris speaks for you — your identity, your medical history, your emergency contacts — instantly.',
                stat: '83.7% of respondents',
                statLabel: 'said they would enroll specifically to protect themselves when unconscious',
                accent: '#C0392B',
              },
              {
                img: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&q=80&fit=crop',
                tag: 'The Solo Traveler',
                headline: '"I travel alone. If something happened far from home, would anyone know who I am?"',
                body: 'Whether you are across the country or across the world, Phiris ensures that the ER in any city has what they need — your identity, your history, and your people.',
                stat: '83.5% of respondents',
                statLabel: 'said they would download the app for peace of mind',
                accent: '#3498DB',
              },
              {
                img: 'https://images.pexels.com/photos/8500421/pexels-photo-8500421.jpeg?auto=compress&cs=tinysrgb&w=600',
                tag: 'The Child at Sports, School & Camp',
                headline: '"My son plays travel baseball. If something happened at practice, would they know to call me?"',
                body: 'Parents can enroll their children in Phiris so coaches, camp counselors, school nurses, and first responders can instantly access a childs allergies, conditions, medications, and parent contact info — even when mom or dad is not there.',
                stat: '57% of parents',
                statLabel: 'worry about their childs medical info being accessible in an emergency away from home',
                accent: '#27AE60',
              },
            ].map((card, cardIdx) => (
              <div key={card.tag} style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gridColumn: isMobile ? 'span 1' : cardIdx < 3 ? 'span 2' : 'span 3' }}>
                <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                  <img src={card.img} alt={card.tag} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,26,26,0.6) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
                    <span style={{ background: card.accent, color: 'white', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20 }}>{card.tag}</span>
                  </div>
                </div>
                <div style={{ padding: '24px 24px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1A1A', lineHeight: 1.45, marginBottom: 12, fontStyle: 'italic' }}>{card.headline}</p>
                  <p style={{ fontSize: '0.88rem', color: '#5A7070', lineHeight: 1.7, flex: 1 }}>{card.body}</p>
                  <div style={{ marginTop: 20, padding: '12px 14px', background: '#F0F7F7', borderRadius: 10, borderLeft: `3px solid ${card.accent}` }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: card.accent }}>{card.stat}</div>
                    <div style={{ fontSize: '0.78rem', color: '#4A6B6B', marginTop: 2 }}>{card.statLabel}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IN THEIR OWN WORDS ───────────────────────────────── */}
      <section style={{ background: '#F0F7F7', padding: isMobile ? '56px 0' : '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: '#1E8484', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>From Our 2,762-Person Survey</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#0D1A1A', lineHeight: 1.2 }}>
              In their own words
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: isMobile ? 14 : 20 }}>
            {[
              {
                quote: "Since it would save my life, I need less details. I'm in.",
                age: '18–24',
              },
              {
                quote: "I'd be more likely to use it if it stored my emergency contacts so doctors could quickly reach my family if something happened to me.",
                age: '35–44',
              },
              {
                quote: "I'd use it if it worked even when my phone is locked. In an emergency, doctors shouldn't have to unlock my phone to see critical medical information.",
                age: '35–44',
              },
              {
                quote: "Any system that helps doctors get your medical history on the go would really save time and lives in an emergency situation.",
                age: '35–44',
              },
              {
                quote: "If the system could quickly provide emergency staff with my medical history, allergies, and medications during a crisis, it could prevent dangerous mistakes.",
                age: '25–34',
              },
              {
                quote: "I'd also like it if the system supports unconscious patients — helps when people can't communicate. That's exactly when it matters most.",
                age: '25–34',
              },
              {
                quote: "I would enroll my whole family. If my kids were ever in an accident and I wasn't there, I'd want the ER to know who they are and how to reach me immediately.",
                age: '35–44',
              },
              {
                quote: "The ability for first responders to access my information even if my phone is locked — that is the feature that sold me. That is the moment it actually matters.",
                age: '25–34',
              },
            ].slice(0, isMobile ? 4 : 8).map((t, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid rgba(30,132,132,0.12)', borderRadius: 16, padding: isMobile ? '20px 20px 16px' : '28px 28px 24px', position: 'relative', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '2.5rem', color: 'rgba(30,132,132,0.18)', lineHeight: 1, marginBottom: 8, fontFamily: 'Georgia, serif', position: 'absolute', top: 12, left: 20 }}>"</div>
                <p style={{ fontSize: isMobile ? '0.9rem' : '0.95rem', color: '#2A3A3A', lineHeight: 1.7, fontStyle: 'italic', paddingTop: 16 }}>{t.quote}</p>
                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #1E8484, #3AABAB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>
                    {t.age.split('–')[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(28,42,42,0.5)' }}>Survey Respondent</div>
                    <div style={{ fontSize: '0.72rem', color: '#1E8484' }}>Age {t.age} · Patient Identity Survey, 2024</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(58,171,171,0.7)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            Your Healthcare Passport
          </p>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 16, color: 'white' }}>
            Ready to protect yourself?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.125rem', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            It takes less than 5 minutes to enroll. It could save your life.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Your Profile — It's Free
          </Link>
        </div>
        <div style={styles.heroOrb1} />
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container" style={styles.footerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo-white.svg" alt="Phiris" style={{ height: 22, width: 'auto', opacity: 0.7 }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Phiris LLC. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: isMobile ? 12 : 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/solutions" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textDecoration: 'none' }}>For Organizations</Link>
            <Link to="/about" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textDecoration: 'none' }}>About</Link>
            <Link to="/legal" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textDecoration: 'none' }}>Privacy</Link>
            <Link to="/legal" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textDecoration: 'none' }}>Terms</Link>
            <Link to="/admin/login" style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem' }}>Staff</Link>
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
    padding: '100px 0 120px',
    background: 'linear-gradient(160deg, #0D1A1A 0%, #0D2828 60%, #0D1A1A 100%)',
  },
  heroLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 60,
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: 560,
  },
  heroVisual: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  phoneMockup: {
    position: 'relative',
    width: 220,
    height: 440,
  },
  phoneShell: {
    position: 'relative',
    width: 220,
    height: 440,
    background: '#0D1A1A',
    borderRadius: 36,
    border: '2px solid rgba(58,171,171,0.25)',
    overflow: 'hidden',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.04)',
  },
  phoneNotch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 80,
    height: 22,
    background: '#0D1A1A',
    borderRadius: '0 0 14px 14px',
    zIndex: 10,
    border: '1px solid rgba(58,171,171,0.1)',
    borderTop: 'none',
  },
  phoneScreen: {
    marginTop: 22,
    height: 'calc(100% - 42px)',
    display: 'flex',
    flexDirection: 'column',
    background: '#0D1A1A',
    overflowY: 'hidden',
  },
  phoneHomeBar: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 70,
    height: 4,
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  phoneGlow: {
    position: 'absolute',
    bottom: -60,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 180,
    height: 180,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(30,132,132,0.35) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: -1,
  },
  heroTitle: {
    fontSize: 'clamp(1.45rem, 5vw, 3.75rem)',
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    color: 'white',
    marginBottom: 16,
  },
  heroGradientText: {
    background: 'linear-gradient(90deg, #1E8484, #6FC8C8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroPassport: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'rgba(58,171,171,0.6)',
    letterSpacing: '0.04em',
    marginBottom: 20,
  },
  heroSubtitle: {
    fontSize: '1.125rem',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 40,
    maxWidth: 500,
  },
  heroCTA: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  heroOrb1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(30,132,132,0.2) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroOrb2: {
    position: 'absolute',
    bottom: -80,
    left: '30%',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(21,95,95,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  statsBar: {
    background: 'white',
    padding: '32px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 24,
    textAlign: 'center',
  },
  statItem: { padding: '8px 0' },
  statValue: {
    fontSize: '2rem',
    fontWeight: 800,
    background: 'linear-gradient(90deg, #3AABAB, #6FC8C8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: 'rgba(28,42,42,0.55)',
    marginTop: 4,
    fontWeight: 500,
  },
  section: {
    padding: '80px 0',
    background: 'white',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: 60,
  },
  sectionEyebrow: {
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#3AABAB',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    color: '#0D1A1A',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 24,
  },
  stepCard: {
    background: '#F4F9F9',
    border: '1px solid rgba(30,132,132,0.14)',
    borderRadius: 20,
    padding: '32px 28px',
    position: 'relative',
  },
  stepNumber: {
    position: 'absolute',
    top: 20,
    right: 24,
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'rgba(58,171,171,0.4)',
    letterSpacing: '0.05em',
  },
  stepIcon: { fontSize: '2rem', marginBottom: 16 },
  stepTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#0D1A1A',
    marginBottom: 10,
  },
  stepBody: {
    fontSize: '0.9rem',
    lineHeight: 1.65,
    color: 'rgba(28,42,42,0.62)',
  },
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20,
  },
  whyCard: { background: 'white' },
  whyIcon: { fontSize: '1.75rem', marginBottom: 14 },
  whyTitle: { fontSize: '1rem', fontWeight: 700, color: '#1C2A2A', marginBottom: 8 },
  whyBody: { fontSize: '0.875rem', lineHeight: 1.65, color: '#5A7070' },
  ctaSection: {
    padding: 'clamp(56px, 8vw, 100px) 0',
    background: 'linear-gradient(160deg, #0D2828 0%, #0D1A1A 100%)',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
  },
  footer: {
    background: '#080F0F',
    padding: '28px 0',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  footerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
}
