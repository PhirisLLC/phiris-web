/**
 * Phiris Icon System — clean SVG icons, Lucide-style (24x24, 2px stroke)
 * Usage: <Icon name="shield" size={20} color="#3AABAB" />
 */
import React from 'react'

const paths = {
  // ── Biometric / Face Scan ────────────────────────────
  'face-scan': (
    <>
      {/* Corner brackets */}
      <path d="M3 7V5a2 2 0 0 1 2-2h2" strokeLinecap="round" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" strokeLinecap="round" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" strokeLinecap="round" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" strokeLinecap="round" />
      {/* Face outline */}
      <circle cx="12" cy="11" r="4" />
      {/* Eyes */}
      <circle cx="10.5" cy="10" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="10" r="0.5" fill="currentColor" stroke="none" />
      {/* Smile */}
      <path d="M10 13c.5.8 1.5.8 2 0" strokeLinecap="round" />
      {/* Scan line */}
      <line x1="7" y1="11" x2="17" y2="11" strokeLinecap="round" strokeDasharray="1.5 1.5" />
    </>
  ),
  'eye-scan': (
    <>
      {/* Corner brackets */}
      <path d="M3 7V5a2 2 0 0 1 2-2h2" strokeLinecap="round" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" strokeLinecap="round" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" strokeLinecap="round" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" strokeLinecap="round" />
      {/* Eye shape — contained within brackets */}
      <path d="M5 12 Q12 7 19 12 Q12 17 5 12 Z" strokeLinecap="round" strokeLinejoin="round" />
      {/* Iris */}
      <circle cx="12" cy="12" r="2.5" />
      {/* Pupil */}
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  // ── Core UI ─────────────────────────────────────────
  shield: (
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"
      strokeLinecap="round" strokeLinejoin="round" />
  ),
  'shield-check': (
    <>
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"
        strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="9 12 11 14 15 10" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" ry="2" strokeLinejoin="round" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  check: (
    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
  ),
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
    </>
  ),
  'arrow-right': (
    <>
      <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
      <polyline points="12 5 19 12 12 19" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'chevron-right': (
    <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  // ── Medical / Health ─────────────────────────────────
  activity: (
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
  ),
  heart: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      strokeLinecap="round" strokeLinejoin="round" />
  ),
  'heart-pulse': (
    <>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.22 12H9.5l1.5-2 2 4 1.5-2H21" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  pill: (
    <>
      <path d="M10.5 20.5 3.5 13.5a5 5 0 1 1 7-7l7 7a5 5 0 1 1-7 7Z" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" strokeLinecap="round" />
    </>
  ),
  dna: (
    <>
      <path d="M2 15c6.667-6 13.333 0 20-6" strokeLinecap="round" />
      <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" strokeLinecap="round" />
      <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" strokeLinecap="round" />
      <path d="m17 6-2.5 2" strokeLinecap="round" />
      <path d="m14 8.7-1.5 1.2" strokeLinecap="round" />
      <path d="m9.5 15.2-1.5 1.2" strokeLinecap="round" />
      <path d="m7 17-2.5 2" strokeLinecap="round" />
      <path d="M2 9c6.667 6 13.333 0 20 6" strokeLinecap="round" />
    </>
  ),
  fingerprint: (
    <>
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" strokeLinecap="round" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" strokeLinecap="round" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" strokeLinecap="round" />
      <path d="M2 12a10 10 0 0 1 18-6" strokeLinecap="round" />
      <path d="M2 17.5A10 10 0 0 0 12 22" strokeLinecap="round" />
      <path d="M2 12a10 10 0 0 1 18-6" strokeLinecap="round" />
      <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" strokeLinecap="round" />
      <path d="M17.7 14c.9-2 .5-4-.5-6" strokeLinecap="round" />
      <path d="M9 6.8a6 6 0 0 1 9 5.2v2" strokeLinecap="round" />
    </>
  ),
  // ── Communication ────────────────────────────────────
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" strokeLinejoin="round" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.07 2H6a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 18v-.08z"
      strokeLinecap="round" strokeLinejoin="round" />
  ),
  smartphone: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeLinejoin="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" strokeLinecap="round" />
    </>
  ),
  // ── Business / Data ──────────────────────────────────
  'trending-up': (
    <>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 6 23 6 23 12" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'bar-chart': (
    <>
      <line x1="12" y1="20" x2="12" y2="10" strokeLinecap="round" />
      <line x1="18" y1="20" x2="18" y2="4" strokeLinecap="round" />
      <line x1="6" y1="20" x2="6" y2="16" strokeLinecap="round" />
    </>
  ),
  clipboard: (
    <>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" strokeLinejoin="round" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" strokeLinejoin="round" />
    </>
  ),
  'file-text': (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
      <polyline points="14 2 14 8 20 8" strokeLinejoin="round" />
      <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" />
      <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" />
      <polyline points="10 9 9 9 8 9" strokeLinecap="round" />
    </>
  ),
  lightbulb: (
    <>
      <line x1="9" y1="18" x2="15" y2="18" strokeLinecap="round" />
      <line x1="10" y1="22" x2="14" y2="22" strokeLinecap="round" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"
        strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
    </>
  ),
  // ── Location / Navigation ─────────────────────────────
  'map-pin': (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" strokeLinecap="round" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        strokeLinecap="round" />
    </>
  ),
  // ── Emergency / Safety ───────────────────────────────
  zap: (
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeLinejoin="round" />
  ),
  'alert-triangle': (
    <>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
    </>
  ),
  'alert-circle': (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
    </>
  ),
  siren: (
    <>
      <path d="M7 12a5 5 0 0 1 4.9-5" strokeLinecap="round" />
      <path d="M12 2v1" strokeLinecap="round" />
      <path d="M19.07 4.93l-.71.71" strokeLinecap="round" />
      <path d="M22 12h-1" strokeLinecap="round" />
      <path d="M3 12H2" strokeLinecap="round" />
      <path d="M5.64 5.64l-.71-.71" strokeLinecap="round" />
      <path d="M4.22 19H19.78" strokeLinecap="round" />
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  // ── Buildings ────────────────────────────────────────
  building: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="1" strokeLinejoin="round" />
      <path d="M3 9h18" strokeLinecap="round" />
      <path d="M9 21V9" strokeLinecap="round" />
    </>
  ),
  // ── Search / Scan ────────────────────────────────────
  scan: (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" strokeLinecap="round" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" strokeLinecap="round" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" strokeLinecap="round" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" strokeLinecap="round" />
      <line x1="7" y1="12" x2="17" y2="12" strokeLinecap="round" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
    </>
  ),
  // ── ID / Identity ────────────────────────────────────
  'credit-card': (
    <>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeLinejoin="round" />
      <line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round" />
    </>
  ),
  // ── Misc ─────────────────────────────────────────────
  'dollar-sign': (
    <>
      <line x1="12" y1="1" x2="12" y2="23" strokeLinecap="round" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" />
    </>
  ),
  folder: (
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
      strokeLinejoin="round" />
  ),
  'trending-down': (
    <>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 18 23 18 23 12" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  handshake: (
    <>
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"
        strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  truck: (
    <>
      <rect x="1" y="3" width="15" height="13" strokeLinejoin="round" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" strokeLinejoin="round" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" strokeLinecap="round" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" strokeLinecap="round" />
      <circle cx="20" cy="10" r="2" />
    </>
  ),
}

export default function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }) {
  const content = paths[name]
  if (!content) return null
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      {content}
    </svg>
  )
}
