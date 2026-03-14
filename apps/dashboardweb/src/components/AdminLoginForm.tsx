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
    <div className={styles.adminCard} style={{ maxWidth: '450px', width: '100%', margin: '15vh auto', padding: '3.5rem 2.5rem', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', color: '#000', fontWeight: 800, letterSpacing: '-0.03em' }}>Admin Login</h2>
        <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '1.1rem' }}>Enter your credentials to access the OS</p>
      </div>
      
      {step === 'email' ? (
        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.75rem', color: '#444', fontWeight: 500, fontSize: '0.9rem' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@triagex.ai"
              required
              className="animate-fade-in"
              style={{ width: '100%', padding: '1.1rem', borderRadius: '14px', border: '1px solid #eee', background: '#f8f9fa', color: '#000', outline: 'none', transition: 'all 0.2s', fontSize: '1rem' }}
              onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
              onBlur={(e) => { e.target.style.borderColor = '#eee'; e.target.style.background = '#f8f9fa'; }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`${styles.actionButton} ${styles.primary}`}
            style={{ padding: '1.1rem', fontSize: '1.05rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Sending Verification...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.75rem', color: '#444', fontWeight: 500, fontSize: '0.9rem' }}>Enter 6-Digit Verification Code</label>
            <input 
              type="text" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              maxLength={6}
              required
              className="animate-fade-in"
              style={{ width: '100%', padding: '1.1rem', borderRadius: '14px', border: '1px solid #eee', background: '#f8f9fa', color: '#000', outline: 'none', letterSpacing: '8px', textAlign: 'center', fontSize: '1.75rem', fontWeight: 700, transition: 'all 0.2s' }}
              onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
              onBlur={(e) => { e.target.style.borderColor = '#eee'; e.target.style.background = '#f8f9fa'; }}
            />
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button 
                type="button" 
                onClick={() => setStep('email')}
                style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
              >
                Change login email
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`${styles.actionButton} ${styles.primary}`}
            style={{ padding: '1.1rem', fontSize: '1.05rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Verifying...' : 'Authenticate'}
          </button>
        </form>
      )}

      {error && (
        <div className="animate-fade-in" style={{ backgroundColor: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030', padding: '1rem', borderRadius: '12px', marginTop: '1.5rem', textAlign: 'center', fontSize: '0.95rem', fontWeight: 500 }}>
          {error}
        </div>
      )}
    </div>
  )
}
