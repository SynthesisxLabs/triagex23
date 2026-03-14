import React from 'react';
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
                <h4 className={styles.groupTitle}>Platform</h4>
                <a href="#">Compose</a>
                <a href="#">Guard</a>
                <a href="#">Command</a>
              </div>
              <div className={styles.linkGroup}>
                <h4 className={styles.groupTitle}>Solutions</h4>
                <a href="#">Workflow</a>
                <a href="#">Team</a>
                <a href="#">Industry</a>
              </div>
              <div className={styles.linkGroup}>
                <h4 className={styles.groupTitle}>Company</h4>
                <a href="#">About</a>
                <a href="#">Security</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
              </div>
              <div className={styles.linkGroup}>
                <h4 className={styles.groupTitle}>Legal</h4>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">DPA</a>
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
