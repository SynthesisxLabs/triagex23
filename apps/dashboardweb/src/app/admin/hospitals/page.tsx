import styles from "../admin.module.css";
import { getHospitals } from "@/app/actions/dashboard";
import { Hospital as HospitalIcon, MapPin, Calendar } from "lucide-react";
import AddHospitalForm from "./AddHospitalForm";

export default async function HospitalsPage() {
  const hospitals = await getHospitals();

  return (
    <>
      <header className={styles.header}>
        <h1 className="animate-fade-in">Hospitals Management</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.1s', color: '#666' }}>
          Register and manage healthcare facilities in the network.
        </p>
      </header>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <AddHospitalForm />

        <div className={styles.adminCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div className={styles.cardIconWrapper} style={{ marginBottom: 0, width: '40px', height: '40px' }}>
              <HospitalIcon size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Registered Network ({hospitals.length})</h2>
          </div>

          {hospitals.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>No hospitals registered yet.</p>
          ) : (
            <div style={{ overflowX: 'auto', margin: '0 -1rem' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Facility Name</th>
                    <th style={{ padding: '0.75rem 1rem', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Location</th>
                    <th style={{ padding: '0.75rem 1rem', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((hosp: any) => (
                    <tr key={hosp.id}>
                      <td style={{ padding: '1.25rem 1rem', background: '#fcfcfc', borderRadius: '12px 0 0 12px', border: '1px solid #f0f0f0', borderRight: 'none', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }}></div>
                          {hosp.name}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1rem', background: '#fcfcfc', border: '1px solid #f0f0f0', borderLeft: 'none', borderRight: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
                          <MapPin size={16} /> {hosp.city}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1rem', background: '#fcfcfc', borderRadius: '0 12px 12px 0', border: '1px solid #f0f0f0', borderLeft: 'none', color: '#999', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={16} /> {new Date(hosp.created_at).toLocaleDateString()}
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
