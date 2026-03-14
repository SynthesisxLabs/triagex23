import React from 'react';
import styles from './CtaBlock.module.css';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, Download } from 'lucide-react';

const CtaBlock = () => {
  return (
    <section className={styles.container}>
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
          
          <div className={styles.androidBadge}>
            <Smartphone size={24} color="#000000" />
            <div className={styles.badgeText}>
              <span>Optimized for</span>
              <strong>Android Devices</strong>
            </div>
          </div>
          
          <p className={styles.bottomLabel}>
            VERSION 2.4.0 • APK DOWNLOAD • SECURE & ENCRYPTED
          </p>
        </div>

        <div className={styles.contentRight}>
          <div className={styles.qrCard}>
            <div className={styles.qrWrapper}>
              <QRCodeSVG 
                value="https://triagex.app/download-android" 
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className={styles.qrInfo}>
              <Download className={styles.downIcon} size={24} />
              <p className={styles.qrText}>Scan to download <strong>TriageX</strong> for Android</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBlock;
