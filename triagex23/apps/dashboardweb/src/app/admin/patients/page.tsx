import styles from "../admin.module.css";
import { getPatients, addPatient } from "@/app/actions/dashboard";

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

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <>
      <header className={styles.header}>
        <h1 className="animate-fade-in">Patients Management</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.1s', color: 'var(--text-secondary)' }}>
          Register and manage patient records across the platform.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* ADD PATIENT FORM */}
        <div className={`${styles.adminCard} animate-fade-in`}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            ➕ Add New Patient
          </h2>
          <form action={addPatient}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Full Name *</label>
                <input type="text" name="full_name" required style={inputStyle} placeholder="Riya Sharma" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Email *</label>
                <input type="email" name="email" required style={inputStyle} placeholder="patient@example.com" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Phone</label>
                <input type="tel" name="phone" style={inputStyle} placeholder="+91 9876543210" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Date of Birth</label>
                <input type="date" name="date_of_birth" style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Gender</label>
                <select name="gender" style={inputStyle}>
                  <option value="" style={{ background: '#13141f' }}>Select gender</option>
                  <option value="male" style={{ background: '#13141f' }}>Male</option>
                  <option value="female" style={{ background: '#13141f' }}>Female</option>
                  <option value="other" style={{ background: '#13141f' }}>Other</option>
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Blood Group</label>
                <select name="blood_group" style={inputStyle}>
                  <option value="" style={{ background: '#13141f' }}>Select blood group</option>
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg} style={{ background: '#13141f' }}>{bg}</option>
                  ))}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Emergency Contact</label>
                <input type="tel" name="emergency_contact" style={inputStyle} placeholder="+91 9876543211" />
              </div>
            </div>
            <button
              type="submit"
              className={`${styles.actionButton} ${styles.primary}`}
              style={{ width: 'auto', padding: '0.75rem 2rem', marginTop: '1.5rem' }}
            >
              Add Patient
            </button>
          </form>
        </div>

        {/* PATIENTS LIST */}
        <div className={styles.adminCard}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            🧑‍🤝‍🧑 Registered Patients ({patients.length})
          </h2>
          {patients.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No patients registered yet. Add one above.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['Name', 'Email', 'Phone', 'DOB', 'Gender', 'Blood Group', 'Emergency Contact', 'Registered'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((pat: any) => (
                    <tr key={pat.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>{pat.profiles?.full_name || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>{pat.profiles?.email || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>{pat.profiles?.phone || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>{pat.date_of_birth || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>{pat.gender || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        {pat.blood_group ? (
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontWeight: 600 }}>{pat.blood_group}</span>
                        ) : '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>{pat.emergency_contact || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(pat.created_at).toLocaleDateString()}</td>
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
