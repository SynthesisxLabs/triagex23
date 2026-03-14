import styles from "../admin.module.css";
import { getDrivers, addDriver } from "@/app/actions/dashboard";

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

const vehicleTypes = ['Ambulance', 'Car', 'Van', 'Bike', 'Other'];

export default async function DriversPage() {
  const drivers = await getDrivers();

  return (
    <>
      <header className={styles.header}>
        <h1 className="animate-fade-in">Drivers Management</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.1s', color: 'var(--text-secondary)' }}>
          Onboard and manage transport drivers for patient ride services.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* ADD DRIVER FORM */}
        <div className={`${styles.adminCard} animate-fade-in`}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            ➕ Add New Driver
          </h2>
          <form action={addDriver}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
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
                  <option value="" style={{ background: '#13141f' }}>Select vehicle type</option>
                  {vehicleTypes.map(vt => (
                    <option key={vt} value={vt.toLowerCase()} style={{ background: '#13141f' }}>{vt}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className={`${styles.actionButton} ${styles.primary}`}
              style={{ width: 'auto', padding: '0.75rem 2rem', marginTop: '1.5rem' }}
            >
              Add Driver
            </button>
          </form>
        </div>

        {/* DRIVERS LIST */}
        <div className={styles.adminCard}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            🚗 Registered Drivers ({drivers.length})
          </h2>
          {drivers.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No drivers registered yet. Add one above.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['Name', 'Email', 'Phone', 'License', 'Vehicle No.', 'Vehicle Type', 'Status', 'Verified'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((drv: any) => (
                    <tr key={drv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>{drv.profiles?.full_name || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>{drv.profiles?.email || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>{drv.profiles?.phone || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>{drv.license_number || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>{drv.vehicle_number || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>{drv.vehicle_type || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem',
                          background: drv.status === 'online' ? 'rgba(34,197,94,0.15)' : 'rgba(107,114,128,0.2)',
                          color: drv.status === 'online' ? '#4ade80' : '#9ca3af',
                        }}>{drv.status}</span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        {drv.is_verified ? (
                          <span style={{ color: '#4ade80', fontWeight: 600 }}>✔ Yes</span>
                        ) : (
                          <span style={{ color: '#f87171' }}>✖ No</span>
                        )}
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
