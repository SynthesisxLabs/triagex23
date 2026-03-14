import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">TriageX</Link>
        </div>

        <div className={styles.navLinks}>
          <Link href="#work" className={styles.navLink}>Technology</Link>
          <Link href="#features" className={styles.navLink}>Features</Link>
          <Link href="#pricing" className={styles.navLink}>Pricing</Link>
          <Link href="#download" className={styles.navLink}>Download</Link>
        </div>

        <div className={styles.actions}>
          <Link href="/admin">
            <button className={styles.ctaButton}>Get Started</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const ChevronDown = () => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={styles.chevron}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default Navbar;
