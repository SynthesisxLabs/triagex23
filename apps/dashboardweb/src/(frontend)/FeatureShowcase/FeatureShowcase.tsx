'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './FeatureShowcase.module.css';

const slides = [
  {
    tag: "Triage & Diagnose",
    title: "AI Medical Assistant",
    description: "Analyze symptoms in real-time using clinical-grade AI models. Get prioritized guidance and specialist recommendations instantly.",
    image: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=1200"
  },
  {
    tag: "Track & Coordinate",
    title: "Ambulance Logistics",
    description: "Real-time fleet tracking and intelligent routing for emergency responders. Minimize response times with predictive traffic analysis.",
    image: "https://images.unsplash.com/photo-1587350859728-117622bc71cb?auto=format&fit=crop&q=80&w=1200"
  },
  {
    tag: "Admin & Insights",
    title: "Health Systems Panel",
    description: "Unify hospital data into a single source of truth. Monitor patient flows, doctor availability, and AI diagnostic accuracy at scale.",
    image: "https://images.unsplash.com/photo-1504813184591-015526838e5f?auto=format&fit=crop&q=80&w=1200"
  }
];

const FeatureShowcase = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className={styles.showcaseSection}>
      <div className={styles.container}>
        <div className={styles.mainCard}>
          <div className={styles.textSide}>
            <span className={styles.tag}>{slides[activeSlide].tag}</span>
            <h2 className={styles.title}>{slides[activeSlide].title}</h2>
            <p className={styles.description}>
              {slides[activeSlide].description}
            </p>
          </div>
          
          <div className={styles.previewSide}>
            <div className={styles.imageContainer}>
              <Image 
                src={slides[activeSlide].image} 
                alt={slides[activeSlide].title}
                fill
                className={styles.displayImage}
              />
            </div>
            
            {/* Vertical Slider Control */}
            <div className={styles.sliderControl}>
              <button className={styles.arrowBtn} onClick={prevSlide}>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 7L6 2L11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              <div className={styles.dotsPill}>
                {slides.map((_, index) => (
                  <div 
                    key={index} 
                    className={`${styles.dot} ${activeSlide === index ? styles.activeDot : ''}`}
                    onClick={() => setActiveSlide(index)}
                  />
                ))}
              </div>
              
              <button className={styles.arrowBtn} onClick={nextSlide}>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 1L6 6L1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
