import styles from "../admin.module.css";
import { getPatients } from "@/app/actions/dashboard";
import { Users, Calendar, Droplets, Heart } from "lucide-react";
import AddPatientForm from "./AddPatientForm";

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <>
      <header className={styles.header}>
        <h1 className="animate-fade-in">Patients Management</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.1s', color: '#666' }}>
          Register and manage patient records across the platform.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <AddPatientForm />

        <div className={styles.adminCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div className={styles.cardIconWrapper} style={{ marginBottom: 0, width: '40px', height: '40px' }}>
              <Users size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
              Registered Patients ({patients.length})
            </h2>
          </div>

          {patients.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>No patients registered yet.</p>
          ) : (
            <div style={{ overflowX: 'auto', margin: '0 -1rem' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                <thead>
                  <tr>
                    {['Patient', 'Contact', 'Medical Info', 'Emergency', 'Registered'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((pat: any) => (
                    <tr key={pat.id}>
                      <td style={{ padding: '1rem', background: '#fcfcfc', borderRadius: '12px 0 0 12px', border: '1px solid #f0f0f0', borderRight: 'none' }}>
                        <div style={{ fontWeight: 600, color: '#000' }}>{pat.profiles?.full_name || '—'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#999' }}>{pat.profiles?.email || '—'}</div>
                      </td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', border: '1px solid #f0f0f0', borderLeft: 'none', borderRight: 'none' }}>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>{pat.profiles?.phone || '—'}</div>
                        <div style={{ color: '#999', fontSize: '0.8rem' }}>{pat.date_of_birth || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', border: '1px solid #f0f0f0', borderLeft: 'none', borderRight: 'none' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {pat.blood_group ? (
                             <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: '#fff5f5', color: '#e11d48', fontWeight: 700, fontSize: '0.75rem' }}>
                              <Droplets size={12} /> {pat.blood_group}
                             </span>
                          ) : '—'}
                          <span style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: '#f8f9fa', color: '#666', fontSize: '0.75rem', textTransform: 'capitalize' }}>{pat.gender || 'N/A'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', border: '1px solid #f0f0f0', borderLeft: 'none', borderRight: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e11d48', fontSize: '0.9rem', fontWeight: 500 }}>
                          <Heart size={14} fill="#e11d48" /> {pat.emergency_contact || 'None'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', borderRadius: '0 12px 12px 0', border: '1px solid #f0f0f0', borderLeft: 'none', color: '#999', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Calendar size={14} /> {new Date(pat.created_at).toLocaleDateString()}
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
