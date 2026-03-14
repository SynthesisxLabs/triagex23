import styles from "../admin.module.css";
import { getDrivers } from "@/app/actions/dashboard";
import { Truck, Calendar, ShieldCheck, ShieldAlert } from "lucide-react";
import AddDriverForm from "./AddDriverForm";

export default async function DriversPage() {
  const drivers = await getDrivers();

  return (
    <>
      <header className={styles.header}>
        <h1 className="animate-fade-in">Drivers Management</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.1s', color: '#666' }}>
          Onboard and manage transport drivers for patient ride services.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <AddDriverForm />

        <div className={styles.adminCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div className={styles.cardIconWrapper} style={{ marginBottom: 0, width: '40px', height: '40px' }}>
              <Truck size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
              Registered Drivers ({drivers.length})
            </h2>
          </div>

          {drivers.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>No drivers registered yet.</p>
          ) : (
            <div style={{ overflowX: 'auto', margin: '0 -1rem' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                <thead>
                  <tr>
                    {['Driver', 'Vehicle Info', 'License', 'Status', 'Verified', 'Registered'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((drv: any) => (
                    <tr key={drv.id}>
                      <td style={{ padding: '1rem', background: '#fcfcfc', borderRadius: '12px 0 0 12px', border: '1px solid #f0f0f0', borderRight: 'none' }}>
                        <div style={{ fontWeight: 600, color: '#000' }}>{drv.profiles?.full_name || '—'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#999' }}>{drv.profiles?.email || '—'}</div>
                      </td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', border: '1px solid #f0f0f0', borderLeft: 'none', borderRight: 'none' }}>
                        <div style={{ fontWeight: 500 }}>{drv.vehicle_number || '—'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'capitalize' }}>{drv.vehicle_type || '—'}</div>
                      </td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', border: '1px solid #f0f0f0', borderLeft: 'none', borderRight: 'none', color: '#666' }}>{drv.license_number || '—'}</td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', border: '1px solid #f0f0f0', borderLeft: 'none', borderRight: 'none' }}>
                        <span style={{
                          padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                          background: drv.status === 'online' ? '#e6fffa' : '#f8f9fa',
                          color: drv.status === 'online' ? '#059669' : '#666',
                        }}>{drv.status}</span>
                      </td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', border: '1px solid #f0f0f0', borderLeft: 'none', borderRight: 'none' }}>
                        {drv.is_verified ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 600, fontSize: '0.9rem' }}>
                            <ShieldCheck size={16} /> Verified
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e11d48', fontWeight: 600, fontSize: '0.9rem' }}>
                            <ShieldAlert size={16} /> Pending
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', borderRadius: '0 12px 12px 0', border: '1px solid #f0f0f0', borderLeft: 'none', color: '#999', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Calendar size={14} /> {new Date(drv.created_at).toLocaleDateString()}
                        </div>
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
