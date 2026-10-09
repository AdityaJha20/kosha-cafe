import React from 'react';
import artworkImage from '../assets/images/kosha-coming-soon-artwork.jpeg';
import { BackgroundMusic } from './BackgroundMusic';
import styles from './ComingSoon.module.css';

export const ComingSoon: React.FC = () => {
  return (
    <div className={`${styles.pageContainer} fade-in-entrance`}>
      {/* Top Header Navigation */}
      <header className={styles.header} role="banner">
        <div className={styles.brandNav}>
          <span className={styles.brandLogoText}>KOSHA</span>
          <span className={styles.brandSubtext}>— Café &amp; Experience Studio</span>
        </div>
        <div className={styles.statusBadge} aria-label="Status: Coming Soon">
          <span className={styles.statusDot} aria-hidden="true" />
          <span>Coming Soon</span>
        </div>
      </header>

      {/* Main Content Presentation */}
      <main className={styles.mainContent} role="main">
        {/* Hidden Screen Reader Heading for Semantic Structure */}
        <h1 className="sr-only">KOSHA — Café &amp; Experience Studio | Coming Soon</h1>

        <div className={styles.artworkShowcase}>
          {/* Centered Dominant Artwork */}
          <div className={styles.artworkCard}>
            <img
              src={artworkImage}
              alt="KOSHA Café &amp; Experience Studio Coming Soon artwork featuring watercolor illustrations of coffee, burger, sandwich, and cakes, located at LSC C6 &amp; C7, Vasant Kunj, New Delhi, Opp DPS"
              className={styles.artworkImage}
              width="1024"
              height="576"
              fetchPriority="high"
              decoding="async"
            />
          </div>

          {/* Dedicated Mobile Details Card (Ensures complete readability on small screens) */}
          <section className={styles.mobileDetails} aria-label="Venue Overview">
            <h2 className={styles.mobileTitle}>KOSHA</h2>
            <p className={styles.mobileSubtitle}>Café &amp; Experience Studio</p>

            <p className={styles.mobilePillars}>
              <span>Meet</span>
              <span className={styles.pillarDot}>•</span>
              <span>Eat</span>
              <span className={styles.pillarDot}>•</span>
              <span>Discover</span>
            </p>

            <div className={styles.mobileBadgeWrapper}>
              <span className={styles.mobileBadge}>COMING SOON</span>
            </div>

            <div className={styles.divider} aria-hidden="true" />

            <address className={styles.locationBlock}>
              <div className={styles.locationPremises}>LSC C6 &amp; C7</div>
              <div className={styles.locationArea}>Vasant Kunj, New Delhi</div>
              <div className={styles.locationLandmark}>Opp DPS</div>
            </address>
          </section>

          {/* Desktop Summary Bar (Provides crisp text context below artwork) */}
          <section className={styles.desktopMetaBar} aria-label="Venue Highlights">
            <div className={styles.desktopPillars}>
              <span>Meet</span>
              <span className={styles.pillarDot}>•</span>
              <span>Eat</span>
              <span className={styles.pillarDot}>•</span>
              <span>Discover</span>
            </div>

            <address className={styles.desktopLocation}>
              <span className={styles.locationHighlight}>LSC C6 &amp; C7</span>
              <span aria-hidden="true">•</span>
              <span>Vasant Kunj, New Delhi</span>
              <span aria-hidden="true">•</span>
              <span className={styles.landmarkTag}>Opp DPS</span>
            </address>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerLeft}>
          &copy; {new Date().getFullYear()} KOSHA. All rights reserved.
        </div>
        <div className={styles.footerRight}>
          Vasant Kunj &bull; New Delhi
        </div>
      </footer>

      {/* Ambient Background Audio Layer */}
      <BackgroundMusic />
    </div>
  );
};

export default ComingSoon;
