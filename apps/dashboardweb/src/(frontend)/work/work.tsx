import React from "react";
import styles from "./work.module.css";

export default function Work() {
  return (
    <section id="work" className={styles.section}>
      <div className={styles.card}>

        {/* ── LEFT: Content ── */}
        <div className={styles.contentPanel}>

          {/* Pill tag */}
          <span className={styles.tag}>Our Technology</span>

          {/* Big hero heading */}
          <h2 className={styles.title}>
            The Emergency<br />Intelligence Layer
          </h2>

          {/* Service list row */}
          <div className={styles.serviceList}>
            <span className={styles.serviceItem}>Triage Engine</span>
            <span className={styles.divider} />
            <span className={styles.serviceItem}>Ambulance OS</span>
            <span className={styles.divider} />
            <span className={styles.serviceItem}>Command Centre</span>
          </div>

          {/* Description */}
          <p className={styles.subtitle}>
            TriageX23 connects patients, paramedics, and hospital teams into
            one unified AI platform. From instant severity scoring to live
            dispatch routing, every second of care is optimised.
          </p>

          <button className={styles.button}>Get started for free</button>
        </div>

        {/* ── RIGHT: Video ── */}
        <div className={styles.imagePanel}>
          <video
            className={styles.image}
            src="https://cdn.dribbble.com/userupload/36689057/file/original-3dfef64ffd0c6aa8713354d31a3f06e7.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

      </div>
    </section>
  );
}