'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendOtpAction, verifyOtpAction } from '@/app/actions/auth'
import styles from '@/app/admin/admin.module.css'

export default function AdminLoginForm() {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError(null)

    if (email.endsWith('@example.com')) {
      alert("Test mode active for @example.com emails.\n\nYour OTP is: 123456")
    }

    try {
      const res = await sendOtpAction(email)
      if (res.success) {
        setStep('otp')
      } else {
        setError(res.error || 'Failed to send OTP')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) return

    setLoading(true)
    setError(null)
    
    try {
      const res = await verifyOtpAction(email, otp)
      if (res.success) {
        // Trigger a hard refresh to re-evaluate server components with the new session
        router.refresh()
      } else {
        setError(res.error || 'Invalid OTP entered')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.adminCard} style={{ maxWidth: '450px', width: '100%', margin: '15vh auto', padding: '3rem 2rem', borderTop: '4px solid var(--accent-blue)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Admin Login</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Secure OTP Authentication</p>
      </div>
      
      {step === 'email' ? (
        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="animate-fade-in"
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #333', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', transition: 'border-color 0.2s' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`${styles.actionButton} ${styles.primary}`}
            style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Sending Verification...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Enter 6-Digit Verification Code</label>
            <input 
              type="text" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              required
              className="animate-fade-in"
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #333', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', letterSpacing: '8px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 600 }}
            />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button 
                type="button" 
                onClick={() => setStep('email')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
              >
                Change login email
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`${styles.actionButton} ${styles.primary}`}
            style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Verifying...' : 'Authenticate'}
          </button>
        </form>
      )}

      {error && (
        <div className="animate-fade-in" style={{ backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', color: '#ff6b6b', padding: '1rem', borderRadius: '8px', marginTop: '1.5rem', textAlign: 'center', fontSize: '0.95rem' }}>
          {error}
        </div>
      )}
    </div>
  )
}
