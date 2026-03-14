import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { ShieldCheck, Lock, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.innerBlock}>
          <div className={styles.topSection}>
            <div className={styles.brandCol}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}></div>
                <span className={styles.logoText}>TriageX</span>
              </div>
              
              <div className={styles.infoBlock}>
                <h4 className={styles.blockTitle}>Headquarters</h4>
                <p className={styles.blockText}>
                  <strong>4 World Trade Center</strong><br />
                  <span className={styles.fadedText}>150 Greenwich Street, New York, NY 10007</span>
                </p>
              </div>

              <div className={styles.infoBlock}>
                <h4 className={styles.blockTitle}>Get in Touch</h4>
                <a href="mailto:hello@triageX.ai" className={styles.link}>hello@triageX.ai</a>
              </div>
            </div>

            <div className={styles.linksCol}>
              <div className={styles.linkGroup}>
                <h4 className={styles.groupTitle}>Technology</h4>
                <Link href="#work">Triage Engine</Link>
                <Link href="#features">AI Diagnostics</Link>
                <Link href="#features">Ambulance OS</Link>
                <Link href="#download">Mobile App</Link>
              </div>
              <div className={styles.linkGroup}>
                <h4 className={styles.groupTitle}>Solutions</h4>
                <a href="#">Hospitals</a>
                <a href="#">Emergency Teams</a>
                <a href="#">Governments</a>
                <a href="#">Patient Portal</a>
              </div>
              <div className={styles.linkGroup}>
                <h4 className={styles.groupTitle}>Company</h4>
                <a href="#">About TriageX</a>
                <a href="#">Security & Trust</a>
                <a href="#">HIPAA Compliance</a>
                <a href="#">Careers</a>
              </div>
              <div className={styles.linkGroup}>
                <h4 className={styles.groupTitle}>Support</h4>
                <a href="#">Help Centre</a>
                <a href="#">API Docs</a>
                <a href="#">Contact Support</a>
                <a href="#">System Status</a>
              </div>
            </div>
          </div>

          <div className={styles.bottomSection}>
            
            <div className={styles.copyrightBar}>
              <div className={styles.horizontalLine}></div>
              <p className={styles.copyText}>© 2026 TriageX, Inc. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
