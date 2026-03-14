'use client'

import { useActionState } from 'react'
import { addHospital } from '@/app/actions/dashboard'
import styles from '../admin.module.css'
import { Plus } from 'lucide-react'

const inputStyle = {
  width: '100%',
  padding: '0.9rem',
  borderRadius: '12px',
  background: '#f8f9fa',
  border: '1px solid #eee',
  color: '#000',
  fontSize: '0.95rem',
  outline: 'none',
} as const;

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontSize: '0.8rem',
  color: '#666',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

export default function AddHospitalForm() {
  const [state, action, isPending] = useActionState(addHospital, null);

  return (
    <div className={styles.adminCard}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div className={styles.cardIconWrapper} style={{ marginBottom: 0, width: '40px', height: '40px' }}>
          <Plus size={20} />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Register New Facility</h2>
      </div>

      <form action={action} style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '250px' }}>
          <label style={labelStyle}>Hospital Name</label>
          <input 
            type="text" 
            name="name" 
            required 
            style={inputStyle} 
            placeholder="Apollo City Center" 
          />
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={labelStyle}>City</label>
          <input 
            type="text" 
            name="city" 
            required 
            style={inputStyle} 
            placeholder="New York" 
          />
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className={`${styles.actionButton} ${styles.primary}`} 
          style={{ width: 'auto', padding: '1rem 2.5rem', opacity: isPending ? 0.7 : 1 }}
        >
          {isPending ? 'Adding...' : 'Add Hospital'}
        </button>
      </form>

      {state?.error && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#fff5f5', 
          border: '1px solid #feb2b2', 
          color: '#c53030', 
          borderRadius: '12px',
          fontSize: '0.9rem'
        }}>
          ⚠️ {state.error}
        </div>
      )}
    </div>
  )
}
