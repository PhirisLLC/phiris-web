import React, { useState } from 'react'

const COMMON_ALLERGIES = ['Penicillin', 'Sulfa', 'Aspirin', 'Ibuprofen', 'Latex', 'Shellfish', 'Peanuts', 'Contrast dye']
const COMMON_CONDITIONS = ['Diabetes (Type 1)', 'Diabetes (Type 2)', 'Hypertension', 'Heart disease', 'Asthma', 'Epilepsy', 'COPD', 'Kidney disease', 'Cancer']

function TagInput({ label, hint, values, onChange, suggestions }) {
  const [input, setInput] = useState('')

  function add(val) {
    const trimmed = val.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
    }
    setInput('')
  }

  function remove(val) {
    onChange(values.filter(v => v !== val))
  }

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {hint && <p className="form-hint" style={{ marginBottom: 8 }}>{hint}</p>}

      {/* Tags */}
      {values.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {values.map(v => (
            <span key={v} style={tagStyle}>
              {v}
              <button
                type="button"
                onClick={() => remove(v)}
                style={tagRemoveBtn}
              >×</button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="form-input"
          style={{ flex: 1, marginBottom: 0 }}
          type="text"
          placeholder={`Type and press Enter or Add`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); add(input) }
          }}
        />
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => add(input)}
          disabled={!input.trim()}
        >
          Add
        </button>
      </div>

      {/* Quick-add suggestions */}
      {suggestions && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {suggestions.filter(s => !values.includes(s)).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => onChange([...values, s])}
              style={suggestionBtn}
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Step2Medical({ data, updateData, onNext, onBack }) {
  function handleSubmit(e) {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ color: '#5A7070', marginBottom: 24, fontSize: '0.9rem', lineHeight: 1.6 }}>
        This is the most critical information for emergency responders. Be as complete as possible.
      </p>

      <TagInput
        label="Allergies"
        hint="Include drug, food, and environmental allergies."
        values={data.allergies}
        onChange={v => updateData({ allergies: v })}
        suggestions={COMMON_ALLERGIES}
      />

      <TagInput
        label="Medical Conditions"
        hint="Include any diagnosed conditions that affect emergency care."
        values={data.conditions}
        onChange={v => updateData({ conditions: v })}
        suggestions={COMMON_CONDITIONS}
      />

      <TagInput
        label="Current Medications"
        hint="Include any medications you take regularly."
        values={data.medications}
        onChange={v => updateData({ medications: v })}
      />

      <div className="form-group">
        <label className="form-label">Additional Notes</label>
        <textarea
          className="form-input"
          rows={3}
          placeholder="e.g. Pacemaker in left chest. Prior surgeries. Religious objections to certain treatments."
          value={data.additionalNotes}
          onChange={e => updateData({ additionalNotes: e.target.value })}
          style={{ resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 16, padding: '16px 0 20px', borderTop: '1px solid #D4E5E5', borderBottom: '1px solid #D4E5E5', marginBottom: 24 }}>
        <label style={toggleRow}>
          <input
            type="checkbox"
            checked={data.dnr}
            onChange={e => updateData({ dnr: e.target.checked })}
            style={{ accentColor: '#1E8484', width: 18, height: 18 }}
          />
          <div>
            <div style={{ fontWeight: 600, color: '#1C2A2A', fontSize: '0.9rem' }}>Do Not Resuscitate (DNR)</div>
            <div style={{ fontSize: '0.78rem', color: '#5A7070' }}>I have a valid DNR order on file</div>
          </div>
        </label>

        <label style={toggleRow}>
          <input
            type="checkbox"
            checked={data.organDonor}
            onChange={e => updateData({ organDonor: e.target.checked })}
            style={{ accentColor: '#1E8484', width: 18, height: 18 }}
          />
          <div>
            <div style={{ fontWeight: 600, color: '#1C2A2A', fontSize: '0.9rem' }}>Organ Donor</div>
            <div style={{ fontSize: '0.78rem', color: '#5A7070' }}>I am a registered organ donor</div>
          </div>
        </label>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" className="btn btn-ghost" onClick={onBack} style={{ flex: 1 }}>
          ← Back
        </button>
        <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
          Continue →
        </button>
      </div>
    </form>
  )
}

const tagStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '5px 10px 5px 12px',
  background: 'rgba(30,132,132,0.1)',
  color: '#1E8484',
  borderRadius: 100,
  fontSize: '0.85rem',
  fontWeight: 600,
}

const tagRemoveBtn = {
  background: 'none',
  border: 'none',
  color: '#1E8484',
  fontSize: '1.1rem',
  lineHeight: 1,
  cursor: 'pointer',
  padding: 0,
}

const suggestionBtn = {
  background: 'transparent',
  border: '1px solid #D4E5E5',
  borderRadius: 100,
  padding: '4px 12px',
  fontSize: '0.78rem',
  color: '#5A7070',
  cursor: 'pointer',
  transition: 'all 0.15s',
}

const toggleRow = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  cursor: 'pointer',
  flex: 1,
}
