import React from 'react';
import styles from './Markee.module.css';

const items = [
  "AI Doctor",
  "Emergency Booking",
  "Instant Booking",
  "24/7 Support",
  "Lab Tests",
  "Specialist Consult",
  "Telemedicine"
];

const VectorIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="black" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: '10px' }}
  >
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
);

const Marquee = () => {
  return (
    <div className={styles.marqueeContainer}>
      <h3 className={styles.marqueeTitle}>Our Services</h3>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          <div className={styles.marqueeContent}>
            {items.map((item, index) => (
              <div key={`item-1-${index}`} className={styles.marqueeItem}>
                <VectorIcon />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className={styles.marqueeContent} aria-hidden="true">
            {items.map((item, index) => (
              <div key={`item-2-${index}`} className={styles.marqueeItem}>
                <VectorIcon />
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