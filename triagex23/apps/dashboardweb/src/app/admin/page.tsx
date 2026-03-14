import styles from "./admin.module.css";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className={styles.adminLayout}>
      {/* Background Effect */}
      <div className={styles.bgGlow}></div>

      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className="gradient-text">MediAdmin</span>
        </div>
        
        <nav className={styles.nav}>
          <div className={`${styles.navItem} ${styles.active}`}>
            <span>📊</span> Overview
          </div>
          <div className={styles.navItem}>
            <span>👨‍⚕️</span> Doctors
          </div>
          <div className={styles.navItem}>
            <span>🏥</span> Hospitals
          </div>
          <div className={styles.navItem}>
            <span>🧑‍🤝‍🧑</span> Patients
          </div>
        </nav>
        
        <div style={{ marginTop: 'auto' }}>
          <Link href="/">
            <div className={styles.navItem}>
               <span>🔙</span> Back to Site
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className="animate-fade-in">Admin Dashboard</h1>
          <p className="animate-fade-in" style={{ animationDelay: '0.1s', color: 'var(--text-secondary)' }}>
            Manage the entire healthcare ecosystem from this control center.
          </p>
        </header>

        <section className={styles.dashboardGrid}>
          {/* Add Doctor Card */}
          <article className={`${styles.adminCard} animate-float`} style={{ animationDelay: '0s' }}>
            <div className={styles.cardIconWrapper}>
              <span>👨‍⚕️</span>
            </div>
            <h2 className={styles.cardTitle}>Add Doctor</h2>
            <p className={styles.cardDesc}>
              Onboard new medical professionals, assign them to hospitals, and manage their specialties and schedules.
            </p>
            <button className={`${styles.actionButton} ${styles.primary}`}>
              Create Profile
            </button>
          </article>

          {/* Add Hospital Card */}
          <article className={`${styles.adminCard} animate-float`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.cardIconWrapper}>
              <span>🏥</span>
            </div>
            <h2 className={styles.cardTitle}>Add Hospital</h2>
            <p className={styles.cardDesc}>
              Register new healthcare facilities, configure departments, and manage emergency capacities.
            </p>
            <button className={styles.actionButton}>
              Register Facility
            </button>
          </article>

          {/* Add Patient Card */}
          <article className={`${styles.adminCard} animate-float`} style={{ animationDelay: '0.4s' }}>
            <div className={styles.cardIconWrapper}>
              <span>🧑‍🤝‍🧑</span>
            </div>
            <h2 className={styles.cardTitle}>Add Patient</h2>
            <p className={styles.cardDesc}>
              Create new patient records, manage medical histories, and handle appointment bookings.
            </p>
            <button className={styles.actionButton}>
              New Patient
            </button>
          </article>
        </section>
      </main>
    </div>
  );
}
