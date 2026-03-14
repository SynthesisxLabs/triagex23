'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './OrangeHero.module.css';

const slides = [
  {
    tag: "Patient Experience",
    title: "AI Doctor & Patient App",
    description: "24/7 AI diagnostics, instant doctor booking, and live ambulance tracking in one sleek mobile interface.",
    image: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=1000"
  },
  {
    tag: "Logistics & Response",
    title: "Ambulance Driver Suite",
    description: "Dedicated driver app with real-time navigation, trip earnings, and intelligent patient-matching logistics.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1000"
  },
  {
    tag: "Internal Operations",
    title: "Admin Control Center",
    description: "Comprehensive hospital dashboard for doctor management, revenue analytics, and AI system monitoring.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
  }
];

const OrangeHero = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-play feature
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [activeSlide]);

  return (
    <div className={styles.heroSection}>
      <div className={styles.innerContainer}>
        <div className={styles.backgroundWrapper}>
          <Image 
            src="/image.png" 
            alt="Premium Background" 
            fill
            priority
            className={styles.bgImage}
          />
        </div>
        
        <div className={styles.overlay}>
          <div className={styles.content}>
            
            
            <h1 className={styles.title}>
              The AI-Powered <br /> Healthcare OS
            </h1>
            
            <button className={styles.ctaButton}>
              Book a demo
            </button>
            
            <div className={styles.bottomSection}>
              <div className={styles.description}>
                triageX unifies patient care, emergency logistics, and hospital <br />
                administration into a single autonomous platform. From AI triage to <br />
                revenue analytics, your entire facility moves faster.
              </div>
              
              <div className={styles.footerCol}>
                <div className={styles.logos}>
                  <div className={styles.logoCircle}>HIPAA</div>
                  <div className={styles.logoCircle}>SOC2</div>
                  <div className={styles.logoCircle}>FDA</div>
                </div>

                {/* Integrated Feature Showcase */}
                <div className={styles.showcaseBlock}>
                  <div className={styles.showcaseContent}>
                    <div className={styles.showcaseText}>
                      <span className={styles.showcaseTag}>{slides[activeSlide].tag}</span>
                      <h3 className={styles.showcaseTitle}>{slides[activeSlide].title}</h3>
                      <p className={styles.showcaseDesc}>{slides[activeSlide].description}</p>
                    </div>
                    
                    <div className={styles.showcasePreview}>
                      <div className={styles.previewImageWrapper}>
                        <Image 
                          src={slides[activeSlide].image} 
                          alt={slides[activeSlide].title}
                          fill
                          className={styles.previewImage}
                        />
                      </div>
                      
                      <div className={styles.showcaseControls}>
                        <button className={styles.arrow} onClick={prevSlide}>
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5"/></svg>
                        </button>
                        <div className={styles.pill}>
                          {slides.map((_, i) => (
                            <div key={i} className={`${styles.pDot} ${activeSlide === i ? styles.activePDot : ''}`} onClick={() => setActiveSlide(i)} />
                          ))}
                        </div>
                        <button className={styles.arrow} onClick={nextSlide}>
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrangeHero;
