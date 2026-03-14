'use client'

import { useActionState } from 'react'
import { addDriver } from '@/app/actions/dashboard'
import styles from '../admin.module.css'
import { UserPlus } from 'lucide-react'

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
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  fontWeight: 700,
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
};

const vehicleTypes = ['Ambulance', 'Car', 'Van', 'Bike', 'Other'];

export default function AddDriverForm() {
  const [state, action, isPending] = useActionState(addDriver, null);

  return (
    <div className={`${styles.adminCard} animate-fade-in`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div className={styles.cardIconWrapper} style={{ marginBottom: 0, width: '40px', height: '40px' }}>
          <UserPlus size={20} />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Add New Driver</h2>
      </div>
      
      <form action={action}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Full Name *</label>
            <input type="text" name="full_name" required style={inputStyle} placeholder="Rahul Verma" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email *</label>
            <input type="email" name="email" required style={inputStyle} placeholder="driver@example.com" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Phone</label>
            <input type="tel" name="phone" style={inputStyle} placeholder="+91 9876543210" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Driving License No.</label>
            <input type="text" name="license_number" style={inputStyle} placeholder="DL-1234567890" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Vehicle Number</label>
            <input type="text" name="vehicle_number" style={inputStyle} placeholder="MH-12-AB-1234" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Vehicle Type</label>
            <select name="vehicle_type" style={inputStyle}>
              <option value="">Select vehicle type</option>
              {vehicleTypes.map(vt => (
                <option key={vt} value={vt.toLowerCase()}>{vt}</option>
              ))}
            </select>
          </div>
        </div>

        {state?.error && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: '#fff5f5', 
            border: '1px solid #feb2b2', 
            color: '#c53030', 
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            ⚠️ {state.error}
          </div>
        )}

        {state?.success && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: '#f0fff4', 
            border: '1px solid #9ae6b4', 
            color: '#276749', 
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            ✅ Driver registered successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={`${styles.actionButton} ${styles.primary}`}
          style={{ width: 'auto', padding: '1rem 2.5rem', marginTop: '2rem', opacity: isPending ? 0.7 : 1 }}
        >
          {isPending ? 'Registering...' : 'Add Driver'}
        </button>
      </form>
    </div>
  )
}
