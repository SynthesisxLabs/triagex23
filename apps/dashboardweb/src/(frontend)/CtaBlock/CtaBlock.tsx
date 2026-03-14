import React from 'react';
import styles from './CtaBlock.module.css';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, Download } from 'lucide-react';

const CtaBlock = () => {
  return (
    <section id="download" className={styles.container}>
      <div className={styles.innerWrapper}>
        <div className={styles.contentLeft}>
          <span className={styles.topLabel}>AVAILABLE NOW FOR ANDROID</span>
          <h2 className={styles.heading}>
            Scan and Download <br /> TriageX
          </h2>
          <p className={styles.subtext}>
            Get the world's most advanced AI Healthcare OS on your Android device. 
            Real-time diagnostics, emergency logistics, and patient management 
            right at your fingertips.
          </p>

          <div className={styles.downloadGroup}>
            <button className={`${styles.badgeButton} ${styles.primaryBadge}`}>
              <Smartphone size={20} />
              <div className={styles.badgeButtonText}>
                <span>Get started</span>
                <strong>Scan & Download the App</strong>
              </div>
            </button>
            <button className={styles.badgeButton}>
              <Download size={20} />
              <div className={styles.badgeButtonText}>
                <span>Direct Link</span>
                <strong>Android APK</strong>
              </div>
            </button>
          </div>
          
          <p className={styles.bottomLabel}>
            VERSION 2.4.0 • SECURE & ENCRYPTED • CLOUD SYNC READY
          </p>
        </div>

        <div className={styles.contentRight}>
          <div className={styles.qrCard}>
            <div className={styles.qrWrapper}>
              <div className={styles.scanLine} />
              <QRCodeSVG 
                value="https://triagex.app/download-android" 
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className={styles.qrInfo}>
              <Download className={styles.downIcon} size={20} />
              <p className={styles.qrText}>Scan to download <strong>TriageX</strong> mobile</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBlock;
