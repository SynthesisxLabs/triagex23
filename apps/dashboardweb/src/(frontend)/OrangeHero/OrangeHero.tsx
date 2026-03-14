'use client';

import styles from './OrangeHero.module.css';

const OrangeHero = () => {
  return (
    <div className={styles.heroSection}>
      <div className={styles.innerContainer}>
        {/* Left Content Side */}
        <div className={styles.leftContent}>
          <div className={styles.taglineBlock}>
            <span className={styles.tag}>OUR MISSION</span>
          </div>
          
          <h1 className={styles.title}>
            The AI-Powered <br /> Healthcare OS
          </h1>

          <div className={styles.serviceList}>
            <span className={styles.serviceItem}>PATIENT APP</span>
            <span className={styles.divider} />
            <span className={styles.serviceItem}>DRIVER SUITE</span>
            <span className={styles.divider} />
            <span className={styles.serviceItem}>ADMIN PANEL</span>
          </div>
          
          <div className={styles.description}>
            triageX unifies patient care, emergency logistics, and hospital 
            administration into a single autonomous platform. From AI triage to 
            revenue analytics, your entire facility moves faster.
          </div>

          <button className={styles.ctaButton}>
            Book a demo
          </button>

          <div className={styles.logos}>
            <div className={styles.logoCircle}>HIPAA</div>
            <div className={styles.logoCircle}>SOC2</div>
            <div className={styles.logoCircle}>FDA</div>
          </div>
        </div>

        {/* Right Media Side */}
        <div className={styles.rightMedia}>
          <img 
            src="https://cdn.dribbble.com/userupload/26623970/file/original-d3e9676027fab805281f254e2f72d7a2.gif" 
            alt="Healthcare AI Animation" 
            className={styles.heroGif}
          />
        </div>
      </div>
    </div>
  );
};

export default OrangeHero;
