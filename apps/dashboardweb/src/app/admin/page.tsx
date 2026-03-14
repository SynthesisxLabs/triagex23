import styles from "./admin.module.css";
import Link from 'next/link';
import { getHospitals, getDoctors, getPatients, getDrivers } from "@/app/actions/dashboard";
import { 
  Stethoscope, 
  Hospital, 
  Users, 
  Truck, 
  Plus, 
  Settings 
} from "lucide-react";

export default async function AdminDashboard() {
  const [hospitals, doctors, patients, drivers] = await Promise.all([
    getHospitals(),
    getDoctors(),
    getPatients(),
    getDrivers(),
  ]);

  const stats = [
    { icon: <Stethoscope size={24} />, label: 'Doctors', count: doctors.length, href: '/admin/doctors' },
    { icon: <Hospital size={24} />, label: 'Hospitals', count: hospitals.length, href: '/admin/hospitals' },
    { icon: <Users size={24} />, label: 'Patients', count: patients.length, href: '/admin/patients' },
    { icon: <Truck size={24} />, label: 'Drivers', count: drivers.length, href: '/admin/drivers' },
  ];

  return (
    <>
      <header className={styles.header}>
        <h1 className="animate-fade-in">Admin Dashboard</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Manage the entire healthcare ecosystem from this control center.
        </p>
      </header>

      {/* STATS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }} className="animate-fade-in">
        {stats.map(stat => (
          <Link href={stat.href} key={stat.label} style={{ textDecoration: 'none' }}>
            <div className={styles.adminCard} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <div className={styles.cardIconWrapper} style={{ marginBottom: 0, width: '48px', height: '48px' }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#000' }}>{stat.count}</div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>{stat.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* QUICK ACTION CARDS */}
      <section className={styles.dashboardGrid}>
        <article className={styles.adminCard}>
          <div className={styles.cardIconWrapper}><Stethoscope size={24} /></div>
          <h2 className={styles.cardTitle}>Doctors</h2>
          <p className={styles.cardDesc}>Onboard medical professionals, assign specializations, and manage their consultation details.</p>
          <Link href="/admin/doctors">
            <button className={`${styles.actionButton} ${styles.primary}`}>Manage Doctors</button>
          </Link>
        </article>

        <article className={styles.adminCard}>
          <div className={styles.cardIconWrapper}><Hospital size={24} /></div>
          <h2 className={styles.cardTitle}>Hospitals</h2>
          <p className={styles.cardDesc}>Register healthcare facilities, configure departments, and manage emergency capacities.</p>
          <Link href="/admin/hospitals">
            <button className={styles.actionButton}>Manage Hospitals</button>
          </Link>
        </article>

        <article className={styles.adminCard}>
          <div className={styles.cardIconWrapper}><Users size={24} /></div>
          <h2 className={styles.cardTitle}>Patients</h2>
          <p className={styles.cardDesc}>Create patient records with medical history, blood group, emergency contacts and more.</p>
          <Link href="/admin/patients">
            <button className={styles.actionButton}>Manage Patients</button>
          </Link>
        </article>

        <article className={styles.adminCard}>
          <div className={styles.cardIconWrapper}><Truck size={24} /></div>
          <h2 className={styles.cardTitle}>Drivers</h2>
          <p className={styles.cardDesc}>Onboard transport drivers, register vehicles, and manage their verification status.</p>
          <Link href="/admin/drivers">
            <button className={styles.actionButton}>Manage Drivers</button>
          </Link>
        </article>
      </section>
    </>
  );
}
