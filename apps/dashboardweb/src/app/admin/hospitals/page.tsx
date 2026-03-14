import styles from "../admin.module.css";
import { getHospitals, addHospital } from "@/app/actions/dashboard";

export default async function HospitalsPage() {
  const hospitals = await getHospitals();

  return (
    <>
      <header className={styles.header}>
        <h1 className="animate-fade-in">Hospitals Management</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.1s', color: 'var(--text-secondary)' }}>
          Register and manage healthcare facilities in the network.
        </p>
      </header>
      
      <div className={styles.dashboardGrid}>
        <div className={styles.adminCard} style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0 }}>Registered Hospitals</h2>
          </div>

          <form action={addHospital} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Hospital Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} 
                placeholder="Apollo City Center" 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>City</label>
              <input 
                type="text" 
                name="city" 
                required 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} 
                placeholder="New York" 
              />
            </div>
            <button type="submit" className={`${styles.actionButton} ${styles.primary}`} style={{ width: 'auto', padding: '0.75rem 2rem' }}>
              + Add Hospital
            </button>
          </form>

          {hospitals.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No hospitals registered yet. Add one above.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Name</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>City</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((hosp: any) => (
                    <tr key={hosp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{hosp.name}</td>
                      <td style={{ padding: '1rem' }}>{hosp.city}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {new Date(hosp.created_at).toLocaleDateString()}
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
