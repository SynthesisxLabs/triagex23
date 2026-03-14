import styles from "../admin.module.css";
import { getDoctors, addDoctor } from "@/app/actions/dashboard";

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
  fontSize: '0.9rem',
} as const;

const labelStyle = {
  display: 'block',
  marginBottom: '0.4rem',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  fontWeight: 600,
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
};

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <>
      <header className={styles.header}>
        <h1 className="animate-fade-in">Doctors Management</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.1s', color: 'var(--text-secondary)' }}>
          Onboard and manage medical professionals across hospitals.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* ADD DOCTOR FORM */}
        <div className={`${styles.adminCard} animate-fade-in`}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            ➕ Add New Doctor
          </h2>
          <form action={addDoctor}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Full Name *</label>
                <input type="text" name="full_name" required style={inputStyle} placeholder="Dr. Rajan Mehta" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Email *</label>
                <input type="email" name="email" required style={inputStyle} placeholder="doctor@hospital.com" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Phone</label>
                <input type="tel" name="phone" style={inputStyle} placeholder="+91 9876543210" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Specialization *</label>
                <input type="text" name="specialization" required style={inputStyle} placeholder="Cardiology" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>License Number</label>
                <input type="text" name="license_number" style={inputStyle} placeholder="MCI-12345" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Experience (years)</label>
                <input type="number" name="experience_years" min="0" style={inputStyle} placeholder="5" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Consultation Fee (₹)</label>
                <input type="number" name="consultation_fee" min="0" step="0.01" style={inputStyle} placeholder="500" />
              </div>
            </div>
            <button
              type="submit"
              className={`${styles.actionButton} ${styles.primary}`}
              style={{ width: 'auto', padding: '0.75rem 2rem', marginTop: '1.5rem' }}
            >
              Add Doctor
            </button>
          </form>
        </div>

        {/* DOCTORS LIST */}
        <div className={styles.adminCard}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            👨‍⚕️ Registered Doctors ({doctors.length})
          </h2>
          {doctors.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No doctors registered yet. Add one above.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['Name', 'Email', 'Specialization', 'License', 'Experience', 'Fee', 'Status'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc: any) => (
                    <tr key={doc.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>{doc.profiles?.full_name || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>{doc.profiles?.email || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>{doc.specialization || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>{doc.license_number || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>{doc.experience_years ?? '—'} yrs</td>
                      <td style={{ padding: '0.875rem 1rem' }}>₹{doc.consultation_fee ?? '—'}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem',
                          background: doc.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                          color: doc.status === 'active' ? '#4ade80' : '#f87171',
                        }}>{doc.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
