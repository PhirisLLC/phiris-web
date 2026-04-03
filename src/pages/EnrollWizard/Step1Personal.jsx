import React from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

const BLOOD_TYPES = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−', 'Unknown']

export default function Step1Personal({ data, updateData, onNext }) {
  const isMobile = useIsMobile()
  function handleSubmit(e) {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ color: '#5A7070', marginBottom: 24, fontSize: '0.9rem', lineHeight: 1.6 }}>
        This information helps emergency responders quickly understand your basic medical profile.
      </p>

      <div className="form-group">
        <label className="form-label">Date of Birth</label>
        <input
          className="form-input"
          type="date"
          value={data.dateOfBirth}
          onChange={e => updateData({ dateOfBirth: e.target.value })}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Sex</label>
          <select
            className="form-input form-select"
            value={data.sex}
            onChange={e => updateData({ sex: e.target.value })}
            required
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Prefer not to say</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Blood Type</label>
          <select
            className="form-input form-select"
            value={data.bloodType}
            onChange={e => updateData({ bloodType: e.target.value })}
            required
          >
            <option value="">Select</option>
            {BLOOD_TYPES.map(bt => <option key={bt}>{bt}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Height</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                className="form-input"
                type="number"
                placeholder="5"
                min="1" max="8"
                value={data.heightFt}
                onChange={e => updateData({ heightFt: e.target.value })}
                style={{ paddingRight: 32 }}
              />
              <span style={unitStyle}>ft</span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                className="form-input"
                type="number"
                placeholder="10"
                min="0" max="11"
                value={data.heightIn}
                onChange={e => updateData({ heightIn: e.target.value })}
                style={{ paddingRight: 32 }}
              />
              <span style={unitStyle}>in</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Weight</label>
          <div style={{ position: 'relative' }}>
            <input
              className="form-input"
              type="number"
              placeholder="175"
              min="1"
              value={data.weightLbs}
              onChange={e => updateData({ weightLbs: e.target.value })}
              style={{ paddingRight: 40 }}
            />
            <span style={unitStyle}>lbs</span>
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 8 }}>
        Continue →
      </button>
    </form>
  )
}

const unitStyle = {
  position: 'absolute',
  right: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '0.8rem',
  color: '#5A7070',
  fontWeight: 600,
  pointerEvents: 'none',
}
