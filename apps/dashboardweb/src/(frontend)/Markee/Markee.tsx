import React from 'react';
import styles from './Markee.module.css';

const items = [
  "AI Doctor",
  "Emergency Booking",
  "Instant Booking",
  "24/7 Support",
  "Lab Tests",
  "Specialist Consult",
  "Telemedicine",
  "Health Tracking",
  "Pharmacy"
];

const PremiumStar = () => (
  <div className={styles.icon}>
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L14.7 8.3L21.5 9.5L16.7 14.5L17.7 21.4L12 18.2L6.3 21.4L7.3 14.5L2.5 9.5L9.3 8.3L12 2Z" />
    </svg>
  </div>
);

const Marquee = () => {
  return (
    <div className={styles.marqueeContainer}>
      <h3 className={styles.marqueeTitle}>Our Ecosystem</h3>
      
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          <div className={styles.marqueeContent}>
            {items.map((item, index) => (
              <div key={`item-1-${index}`} className={styles.marqueeItem}>
                <PremiumStar />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className={styles.marqueeContent} aria-hidden="true">
            {items.map((item, index) => (
              <div key={`item-2-${index}`} className={styles.marqueeItem}>
                <PremiumStar />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marquee;