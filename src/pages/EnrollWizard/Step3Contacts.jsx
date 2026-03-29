import React from 'react'

const RELATIONSHIPS = ['Spouse', 'Partner', 'Parent', 'Child', 'Sibling', 'Friend', 'Coworker', 'Other']

export default function Step3Contacts({ data, updateData, onNext, onBack }) {
  function updateContact(idx, field, value) {
    const updated = data.contacts.map((c, i) =>
      i === idx ? { ...c, [field]: value } : c
    )
    updateData({ contacts: updated })
  }

  function addContact() {
    updateData({ contacts: [...data.contacts, { name: '', phone: '', relationship: '' }] })
  }

  function removeContact(idx) {
    updateData({ contacts: data.contacts.filter((_, i) => i !== idx) })
  }

  function handleSubmit(e) {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ color: '#5A7070', marginBottom: 24, fontSize: '0.9rem', lineHeight: 1.6 }}>
        When Phiris identifies you in an emergency, these contacts will be notified immediately.
      </p>

      {data.contacts.map((contact, idx) => (
        <div key={idx} style={styles.contactCard}>
          <div style={styles.contactHeader}>
            <div style={styles.contactNum}>Contact {idx + 1}</div>
            {idx > 0 && (
              <button
                type="button"
                onClick={() => removeContact(idx)}
                style={styles.removeBtn}
              >
                Remove
              </button>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Jane Gibson"
              value={contact.name}
              onChange={e => updateContact(idx, 'name', e.target.value)}
              required={idx === 0}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                className="form-input"
                type="tel"
                placeholder="(214) 555-1234"
                value={contact.phone}
                onChange={e => updateContact(idx, 'phone', e.target.value)}
                required={idx === 0}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Relationship</label>
              <select
                className="form-input form-select"
                value={contact.relationship}
                onChange={e => updateContact(idx, 'relationship', e.target.value)}
                required={idx === 0}
              >
                <option value="">Select</option>
                {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}

      {data.contacts.length < 3 && (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={addContact}
          style={{ marginBottom: 24, width: '100%' }}
        >
          + Add Another Contact
        </button>
      )}

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

const styles = {
  contactCard: {
    background: '#F7F5F0',
    borderRadius: 12,
    padding: '20px 20px 4px',
    marginBottom: 16,
    border: '1px solid #D4E5E5',
  },
  contactHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactNum: {
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#1E8484',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#E05555',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
  },
}
