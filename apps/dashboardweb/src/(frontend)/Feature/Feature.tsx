"use client";

import styles from "./Feature.module.css";

const features = [
  {
    title: "AI Doctor Symptom Checker",
    desc: "Input your symptoms and get an immediate AI-driven diagnosis suggestion, recommended specialization, and urgent care guidance.",
    image: "https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Instant Ambulance Dispatch",
    desc: "One-tap emergency booking with live GPS tracking for both the patient and the hospital. Optimized routing for faster response times.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Digitized Medical Records",
    desc: "Automatically sync prescriptions, lab reports, and imaging into a unified patient vault. Accessible anytime, anywhere by authorized doctors.",
    image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "AI Pharmaceutical Guard",
    desc: "Verify prescriptions and get basic medicine guidance. AI cross-checks contraindications and dosage safety for your family.",
    image: "https://plus.unsplash.com/premium_photo-1661580574627-9211124e5c3f?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Hospital Admin Dashboard",
    desc: "Seamlessly manage bed availability, staff scheduling, and emergency logistics from a single, AI-powered control center.",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Remote Patient Monitoring",
    desc: "Connect wearable devices to track vitals in real-time. Automatically alert medical teams if life-saving intervention is needed.",
    image: "https://plus.unsplash.com/premium_photo-1673953509975-576678fa6710?w=600&auto=format&fit=crop&q=60",
  },
];

export default function Feature() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Unified Platform Features</h2>
        <p className={styles.subtitle}>
          TriageX integrates the entire healthcare lifecycle into a single operational layer. From AI diagnostics to emergency dispatch, our OS ensures every second counts when lives are on the line.
        </p>
      </div>
      
      <button className={styles.button}>Get started for free</button>

      <div className={styles.grid}>
        {features.map((item, index) => (
          <div 
            key={index} 
            className={styles.card}
            style={{ 
              backgroundImage: `linear-gradient(rgba(252, 252, 252, 0.94), rgba(252, 252, 252, 0.94)), url('/9f74e4d8-4c67-4ec1-b03a-410678eaef59.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            }}
          >
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.desc}</p>
            {item.image && (
              <div className={styles.imageWrapper}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className={styles.image}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800";
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}