import React, { ReactNode } from "react";
import styles from "./work.module.css";
import { Sparkles, Activity, Settings, Zap, Globe, Shield, Cpu } from "lucide-react";
import bgImage from "../../../public/abstract-geometric-background-shapes-texture.jpg";

interface OrbitingCirclesProps {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  className?: string;
}

const OrbitingCircles = ({
  children,
  reverse = false,
  duration = 20,
  delay = 0,
  radius = 160,
  path = true,
  iconSize = 40,
  className = "",
}: OrbitingCirclesProps) => {
  const childrenArray = React.Children.toArray(children);
  const count = childrenArray.length;

  return (
    <>
      {path && (
        <svg xmlns="http://www.w3.org/2000/svg" className={styles.orbitPath}>
          <circle
            className={styles.orbitCircleStroke}
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      {childrenArray.map((child, index) => {
        const itemDelay = delay + (duration / count) * index;
        return (
          <div
            key={index}
            style={{
              "--duration": `${duration}s`,
              "--radius": radius,
              "--delay": `${itemDelay}`,
              "--icon-size": `${iconSize}px`,
            } as React.CSSProperties}
            className={`${styles.orbitItem} ${reverse ? styles.orbitItemReverse : ""} ${className}`}
          >
            {child}
          </div>
        );
      })}
    </>
  );
};

export default function Work() {
  return (
    <section className={styles.container} style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%), url(${bgImage.src})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Built for marketers & <br/> SEO specialists</h2>
          <p className={styles.subtitle}>
            Designed by experienced GEO and SEO experts, link builders, and marketers who understand the search industry inside and out. RankinAI is built on real-world expertise, not empty promises.
          </p>
          <button className={styles.button}>Get started for free</button>
        </div>

        <div className={styles.contentGrid}>
          {/* Left Column: Visual Radar */}
          <div className={styles.rightColumn}>
            <div className={styles.radarWrapper}>
              <div className={styles.radarScan}></div>
              
              <OrbitingCircles radius={85} duration={20} iconSize={48}>
                <div className={styles.glassIcon}><Zap size={22} color="#60a5fa" /></div>
                <div className={styles.glassIcon}><Cpu size={22} color="#60a5fa" /></div>
              </OrbitingCircles>

              <OrbitingCircles radius={165} duration={35} reverse iconSize={56}>
                <div className={styles.glassIcon}><Globe size={26} color="#60a5fa" /></div>
                <div className={styles.glassIcon}><Shield size={26} color="#60a5fa" /></div>
                <div className={styles.glassIcon}><Activity size={26} color="#60a5fa" /></div>
              </OrbitingCircles>

              <div className={styles.centerGlow}></div>
            </div>
          </div>

          {/* Right Column: Features */}
          <div className={styles.leftColumn}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><Sparkles size={20} /></div>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>Actionable AI analytics</h3>
                <p className={styles.featureDesc}>See analytics, run website audits, and get action items without guesswork.</p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}><Activity size={20} /></div>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>Citation intelligence</h3>
                <p className={styles.featureDesc}>Stop chasing random backlinks. Spot gaps and build a focused plan.</p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}><Settings size={20} /></div>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>Strategic AI insights</h3>
                <p className={styles.featureDesc}>See the full competitive picture and get insights your team can act on.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}