import styles from "./admin.module.css";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getHospitals, getDoctors, getPatients, getDrivers } from "@/app/actions/dashboard";
import AdminLoginForm from "@/components/AdminLoginForm";
import { 
  LayoutDashboard, 
  Stethoscope, 
  Hospital, 
  Users, 
  Truck, 
  ArrowLeft 
} from "lucide-react";

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
          <span className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>TriageX</span>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navItem}>
            <LayoutDashboard size={20} /> Overview
          </Link>
          <Link href="/admin/doctors" className={styles.navItem}>
            <Stethoscope size={20} /> {doctors.length} Doctors
          </Link>
          <Link href="/admin/hospitals" className={styles.navItem}>
            <Hospital size={20} /> {hospitals.length} Hospitals
          </Link>
          <Link href="/admin/patients" className={styles.navItem}>
            <Users size={20} /> {patients.length} Patients
          </Link>
          <Link href="/admin/drivers" className={styles.navItem}>
            <Truck size={20} /> {drivers.length} Drivers
          </Link>
        </nav>
        
        <div style={{ marginTop: 'auto' }}>
          <div className={styles.navItem} style={{ color: '#666', fontSize: '0.85rem', cursor: 'default', background: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Logged in as</span>
              <span style={{ color: '#000', fontWeight: 600 }}>{user.email}</span>
            </div>
          </div>
          <Link href="/" className={styles.navItem} style={{ marginTop: '0.5rem' }}>
            <ArrowLeft size={18} /> Back to Site
          </Link>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
