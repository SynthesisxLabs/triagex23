"use client";

import React from 'react';
import styles from './pricing.module.css';
import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      type: "Individual",
      price: "$0",
      desc: "Essential AI care for individuals and small families.",
      features: [
        "AI Symptom Checker",
        "Personal Health Vault",
        "Basic GPS Dispatch",
        "Verified Rx Guard",
        "Direct APK Access"
      ],
      featured: false,
      cta: "Get Started"
    },
    {
      type: "Hospital Pro",
      price: "$499",
      period: "per month",
      desc: "Professional OS for medical centers and response teams.",
      features: [
        "Live Bed Management",
        "Hospital Admin Panel",
        "Staff Smart-Scheduling",
        "Instant Route Optimization",
        "Wearable Integration",
        "24/7 Priority Support"
      ],
      featured: true,
      popular: true,
      cta: "Contact Sales"
    },
    {
      type: "Enterprise",
      price: "Custom",
      desc: "City-wide healthcare infrastructure for governments.",
      features: [
        "Nation-wide Network",
        "Governance Analytics",
        "API Data Streaming",
        "White-label Deployment",
        "Dedicated Server Nodes",
        "Military-grade Encryption"
      ],
      featured: false,
      cta: "Request Demo"
    }
  ];

  return (
    <section id="pricing" className={styles.container}>
      <div className={styles.header}>
        <span className={styles.tag}>Flexible Plans</span>
        <h2 className={styles.title}>Scalable Healthcare Intelligence</h2>
        <p className={styles.subtitle}>
          Choose the right operational layer for your healthcare needs. 
          From personal care to city-wide emergency infrastructure.
        </p>
      </div>

      <div className={styles.grid}>
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`${styles.card} ${plan.featured ? styles.cardFeatured : ''}`}
          >
            {plan.popular && <div className={styles.popularTag}>Most Popular</div>}
            <span className={styles.planType}>{plan.type}</span>
            <div className={styles.price}>
              {plan.price}
              {plan.period && <span> / {plan.period}</span>}
            </div>
            <p className={styles.planDesc}>{plan.desc}</p>
            
            <ul className={styles.featureList}>
              {plan.features.map((feature, i) => (
                <li key={i} className={styles.featureItem}>
                  <Check className={styles.check} size={18} />
                  {feature}
                </li>
              ))}
            </ul>

            <button className={styles.ctaButton}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
