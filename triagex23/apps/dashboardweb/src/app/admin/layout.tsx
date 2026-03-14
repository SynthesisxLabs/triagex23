import styles from "./admin.module.css";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getHospitals, getDoctors, getPatients, getDrivers } from "@/app/actions/dashboard";
import AdminLoginForm from "@/components/AdminLoginForm";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className={styles.adminLayout}>
        <div className={styles.bgGlow}></div>
        <main className={styles.mainContent} style={{ display: 'flex', justifyContent: 'center' }}>
          <AdminLoginForm />
        </main>
      </div>
    );
  }

  // Fetch counts for sidebar
  const [hospitals, doctors, patients, drivers] = await Promise.all([
    getHospitals(),
    getDoctors(),
    getPatients(),
    getDrivers(),
  ]);

  return (
    <div className={styles.adminLayout}>
      <div className={styles.bgGlow}></div>

      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className="gradient-text">MediAdmin</span>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navItem}>
            <span>📊</span> Overview
          </Link>
          <Link href="/admin/doctors" className={styles.navItem}>
            <span>👨‍⚕️</span> {doctors.length} Doctors
          </Link>
          <Link href="/admin/hospitals" className={styles.navItem}>
            <span>🏥</span> {hospitals.length} Hospitals
          </Link>
          <Link href="/admin/patients" className={styles.navItem}>
            <span>🧑‍🤝‍🧑</span> {patients.length} Patients
          </Link>
          <Link href="/admin/drivers" className={styles.navItem}>
            <span>🚗</span> {drivers.length} Drivers
          </Link>
        </nav>
        
        <div style={{ marginTop: 'auto' }}>
          <div className={styles.navItem} style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'default' }}>
            Logged in as Admin:<br />
            <span style={{ color: 'var(--text-primary)' }}>{user.email}</span>
          </div>
          <Link href="/">
            <div className={styles.navItem} style={{ marginTop: '1rem' }}>
              <span>🔙</span> Back to Site
            </div>
          </Link>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
