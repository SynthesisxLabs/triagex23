import styles from "../admin.module.css";
import { getDoctors } from "@/app/actions/dashboard";
import { Stethoscope } from "lucide-react";
import AddDoctorForm from "./AddDoctorForm";

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <>
      <header className={styles.header}>
        <h1 className="animate-fade-in">Doctors Management</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.1s', color: '#666' }}>
          Onboard and manage medical professionals across hospitals.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* ADD DOCTOR FORM (Client Component) */}
        <AddDoctorForm />

        {/* DOCTORS LIST */}
        <div className={styles.adminCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div className={styles.cardIconWrapper} style={{ marginBottom: 0, width: '40px', height: '40px' }}>
              <Stethoscope size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
              Registered Doctors ({doctors.length})
            </h2>
          </div>

          {doctors.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>No doctors registered yet. Add one above.</p>
          ) : (
            <div style={{ overflowX: 'auto', margin: '0 -1rem' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                <thead>
                  <tr>
                    {['Name', 'Specialization', 'License', 'Exp', 'Fee', 'Status'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc: any) => (
                    <tr key={doc.id} style={{ transition: 'background 0.2s' }}>
                      <td style={{ padding: '1rem', background: '#fcfcfc', borderRadius: '12px 0 0 12px', border: '1px solid #f0f0f0', borderRight: 'none' }}>
                        <div style={{ fontWeight: 600, color: '#000' }}>{doc.profiles?.full_name || '—'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#999' }}>{doc.profiles?.email || '—'}</div>
                      </td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', border: '1px solid #f0f0f0', borderLeft: 'none', borderRight: 'none' }}>
                        <div style={{ fontWeight: 500 }}>{doc.specialization || '—'}</div>
                      </td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', border: '1px solid #f0f0f0', borderLeft: 'none', borderRight: 'none', color: '#666' }}>{doc.license_number || '—'}</td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', border: '1px solid #f0f0f0', borderLeft: 'none', borderRight: 'none', color: '#666' }}>{doc.experience_years ?? '—'}y</td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', border: '1px solid #f0f0f0', borderLeft: 'none', borderRight: 'none', fontWeight: 600 }}>₹{doc.consultation_fee ?? '—'}</td>
                      <td style={{ padding: '1rem', background: '#fcfcfc', borderRadius: '0 12px 12px 0', border: '1px solid #f0f0f0', borderLeft: 'none' }}>
                        <span style={{
                          padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                          background: doc.status === 'active' ? '#e6fffa' : '#fff5f5',
                          color: doc.status === 'active' ? '#059669' : '#e11d48',
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
