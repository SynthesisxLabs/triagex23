import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.glowBlob}></div>
      <div className={styles.glowBlob2}></div>
      
      <section className={`${styles.hero} animate-fade-in`}>
        <h1 className={styles.title}>
          Discover the Architecture of the <br />
          <span className="gradient-text">Whole Web</span>
        </h1>
        <p className={styles.subtitle}>
          A premium conceptual overview of how frontend interfaces, backend infrastructures, and intricate network protocols seamlessly unite to deliver the modern digital experience.
        </p>
        
        <div className={styles.buttonGroup}>
          <a href="#explore" className="btn btn-primary">Start Exploring</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">View Architecture</a>
        </div>
      </section>

      <section id="explore" className={styles.grid}>
        <div className={`${styles.card} animate-float`} style={{ animationDelay: '0s' }}>
          <span className={styles.cardIcon}>✨</span>
          <h3>The Frontend</h3>
          <p>
            The presentation layer where users interact. Built with HTML for structure, CSS for aesthetics, and JavaScript for dynamic, responsive behavior. It's what you see and feel.
          </p>
        </div>

        <div className={`${styles.card} animate-float`} style={{ animationDelay: '0.2s' }}>
          <span className={styles.cardIcon}>⚙️</span>
          <h3>The Backend</h3>
          <p>
            The unseen engine room. Servers process requests, execute complex business logic, handle authentication, and communicate securely with databases to persist state.
          </p>
        </div>

        <div className={`${styles.card} animate-float`} style={{ animationDelay: '0.4s' }}>
          <span className={styles.cardIcon}>🗄️</span>
          <h3>The Database</h3>
          <p>
            The persistent memory of the web. Relational SQL databases or flexible NoSQL document stores keep user data, application states, and relational records secure and accessible.
          </p>
        </div>

        <div className={`${styles.card} animate-float`} style={{ animationDelay: '0.6s' }}>
          <span className={styles.cardIcon}>🌐</span>
          <h3>The Network</h3>
          <p>
            The connective tissue. Protocols like HTTP/HTTPS transmit data packets globally while DNS translates human-readable domain names into precise IP addresses.
          </p>
        </div>
      </section>
    </main>
  );
}
