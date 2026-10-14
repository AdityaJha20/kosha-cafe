import React, { useRef, useState, useEffect } from 'react';
import './ExperienceStudioSection.css';

/**
 * Verified KOSHĀ business phone number for WhatsApp inquiries.
 * Leave as empty string until the verified number is provided by the business owner.
 * Format with country code without plus sign (e.g., '919876543210' for India).
 */
export const KOSHA_DEFAULT_WHATSAPP_PHONE = '';

export const KOSHA_DEFAULT_INQUIRY_MESSAGE =
  "Hi KOSHĀ, I'm interested in hosting an experience at your space. Could you share more details?";

export interface ExperienceCardItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  aspectRatio: string;
  accentColor: string;
}

const COLUMN_ONE_EXPERIENCES: ExperienceCardItem[] = [
  {
    id: 'gather',
    title: 'Private & Community Gatherings',
    description:
      'Communal long tables designed for seasonal dinners, lively fellowship, and shared stories.',
    imageSrc: '/images/experience-gather.jpg',
    imageAlt: 'Communal wooden dining table at KOSHA with friends sharing ceramic plates and filter coffee',
    aspectRatio: '16 / 10',
    accentColor: '#C7684E', // Terracotta
  },
  {
    id: 'tasting',
    title: 'Curated Botanical & Culinary Tastings',
    description:
      'Guided cuppings, single-origin cacao flights, and loose-leaf herbal ceremonies.',
    imageSrc: '/images/experience-tasting.jpg',
    imageAlt: 'Artisanal dark chocolate fudge cake, spiced banana tea cake, and single-origin espresso tasting flight on handcrafted ceramics',
    aspectRatio: '4 / 3',
    accentColor: '#71836A', // Moss green
  },
  {
    id: 'design',
    title: 'Art & Design Residencies',
    description:
      'Sculptural ceramics, textile installations, and contemporary showcases under natural light.',
    imageSrc: '/images/experience-design.jpg',
    imageAlt: 'Minimalist wabi-sabi studio gallery featuring handcrafted ceramic sculptures on lime-plaster plinths',
    aspectRatio: '3 / 4',
    accentColor: '#B9A78E', // Taupe
  },
];

const COLUMN_TWO_EXPERIENCES: ExperienceCardItem[] = [
  {
    id: 'cinema',
    title: 'Intimate Evening Screenings',
    description:
      'Curated classic reels, architectural documentaries, and cinema under warm lantern light.',
    imageSrc: '/images/experience-cinema.jpg',
    imageAlt: 'Intimate evening gathering watching cinema projected in warm lime-washed studio under paper lanterns',
    aspectRatio: '4 / 3',
    accentColor: '#C7684E', // Terracotta
  },
  {
    id: 'craft',
    title: 'Hands-on Creative Workshops',
    description:
      'Tactile exploration with raw clay, potter wheels, and mindful artisanal craft practice.',
    imageSrc: '/images/experience-craft.jpg',
    imageAlt: 'Hands shaping natural wet terracotta clay on a spinning pottery wheel in sunlit ceramic atelier',
    aspectRatio: '3 / 4',
    accentColor: '#71836A', // Moss green
  },
  {
    id: 'connect',
    title: 'Conversations & Cultural Salons',
    description:
      'Unscripted dialogues, intimate acoustic sets, and quiet tea ceremonies in open space.',
    imageSrc: '/images/experience-connect.jpg',
    imageAlt: 'Two creative thinkers having an unhurried conversation over matcha and tea at a rustic timber table',
    aspectRatio: '4 / 3',
    accentColor: '#537C86', // Slate Teal
  },
];

export interface ExperienceStudioSectionProps {
  canAnimate?: boolean;
  onNavigate?: (id: string) => void;
  whatsappPhone?: string;
  inquiryMessage?: string;
}

export const ExperienceStudioSection: React.FC<ExperienceStudioSectionProps> = ({
  canAnimate = true,
  whatsappPhone = KOSHA_DEFAULT_WHATSAPP_PHONE,
  inquiryMessage = KOSHA_DEFAULT_INQUIRY_MESSAGE,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12 }
    );

    const elem = sectionRef.current;
    if (elem) {
      observer.observe(elem);
    }

    return () => {
      if (elem) observer.unobserve(elem);
    };
  }, []);

  const shouldAnimate = canAnimate && isVisible;

  // Format WhatsApp Link
  const trimmedPhone = whatsappPhone.trim().replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(inquiryMessage.trim());
  const whatsappUrl = trimmedPhone
    ? `https://wa.me/${trimmedPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  const renderCard = (item: ExperienceCardItem, keySuffix: string) => (
    <article
      key={`${item.id}-${keySuffix}`}
      className="kosha-exp-card"
      style={{ '--card-accent': item.accentColor } as React.CSSProperties}
    >
      <div
        className="kosha-exp-card-media"
        style={{ aspectRatio: item.aspectRatio }}
      >
        <img
          src={item.imageSrc}
          alt={item.imageAlt}
          className="kosha-exp-card-img"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="kosha-exp-card-meta">
        <h4 className="kosha-exp-card-title">{item.title}</h4>
        <p className="kosha-exp-card-desc">{item.description}</p>
      </div>
    </article>
  );

  return (
    <section
      id="experiences"
      ref={sectionRef}
      className={`kosha-exp-section ${shouldAnimate ? 'is-revealed' : ''}`}
      aria-labelledby="experiences-headline"
    >
      <div className="kosha-exp-inner">
        {/* Editorial Section Header */}
        <header className="kosha-exp-header">
          <div className="kosha-exp-index-row">
            <span className="kosha-exp-index-left">
              <span className="kosha-exp-index-dot" aria-hidden="true" />
              04 / THE EXPERIENCE STUDIO
            </span>
            <span className="kosha-exp-index-right">GATHER · CREATE · DISCOVER</span>
          </div>
          <div className="kosha-exp-divider" aria-hidden="true" />
        </header>

        {/* Main Split Grid: Left Editorial Pillar + Right Opposing Tracks */}
        <div className="kosha-exp-main-grid">
          {/* Left Column: Stationary Editorial Pillar */}
          <div className="kosha-exp-editorial-col">
            <h2 id="experiences-headline" className="kosha-exp-headline">
              <span className="kosha-exp-line">Made for moments </span>
              <span className="kosha-exp-line kosha-exp-italic">that bring us </span>
              <span className="kosha-exp-line">together.</span>
            </h2>

            <h3 className="kosha-exp-subheading">Eat. Meet. Create. Discover.</h3>

            <p className="kosha-exp-intro">
              A space for creativity, connection, and unhurried discovery.
            </p>

            <div className="kosha-exp-body-group">
              <p className="kosha-exp-body">
                More than dining, KOSHĀ opens its doors to tactile craft, sensory tasting flights,
                community salons, and intimate cultural celebrations. Here, time stretches
                generously to welcome hands shaped by raw clay, conversation unscripted by
                agendas, and twilight cinema under warm lime-washed plaster.
              </p>
              <p className="kosha-exp-body">
                Designed with conscious wabi-sabi principles: natural reclaimed timber, linen
                textures, and daylight acoustics calibrated for genuine presence.
              </p>
            </div>
          </div>

          {/* Right Column: Dual Opposing Photographic Motion Gallery */}
          <div className="kosha-exp-gallery-wrapper">
            {/* Gallery Dual Opposing Tracks Viewport */}
            <div
              className="kosha-exp-gallery-viewport"
              role="region"
              aria-label="Experience studio interactive photographic stream"
              tabIndex={0}
            >
              {/* Column 01: Downward Drift Track */}
              <div
                className="kosha-exp-column"
                aria-label="Downward photographic filmstrip: Gatherings, Tastings and Design"
              >
                <div className="kosha-exp-track-inner kosha-exp-track-down">
                  {/* Primary Loop Group */}
                  <div className="kosha-exp-track-group">
                    {COLUMN_ONE_EXPERIENCES.map((item) => renderCard(item, 'c1-p'))}
                  </div>
                  {/* Secondary Clone Group for Zero-Jitter Infinite Loop */}
                  <div className="kosha-exp-track-group" aria-hidden="true">
                    {COLUMN_ONE_EXPERIENCES.map((item) => renderCard(item, 'c1-s'))}
                  </div>
                </div>
              </div>

              {/* Column 02: Upward Drift Track */}
              <div
                className="kosha-exp-column"
                aria-label="Upward photographic filmstrip: Screenings, Craft and Conversations"
              >
                <div className="kosha-exp-track-inner kosha-exp-track-up">
                  {/* Primary Loop Group */}
                  <div className="kosha-exp-track-group">
                    {COLUMN_TWO_EXPERIENCES.map((item) => renderCard(item, 'c2-p'))}
                  </div>
                  {/* Secondary Clone Group for Zero-Jitter Infinite Loop */}
                  <div className="kosha-exp-track-group" aria-hidden="true">
                    {COLUMN_TWO_EXPERIENCES.map((item) => renderCard(item, 'c2-s'))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing CTA Separator */}
        <div className="kosha-exp-bottom-divider" aria-hidden="true" />

        {/* Closing "Host an Experience" CTA */}
        <div className="kosha-exp-cta-row">
          <div className="kosha-exp-cta-text">
            <h3 className="kosha-exp-cta-heading">Have something in mind?</h3>
            <p className="kosha-exp-cta-sub">
              The space adapts to private gatherings, workshops, brand shoots, and custom retreats.
            </p>
          </div>

          <div className="kosha-exp-cta-action">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="kosha-exp-cta-btn"
              aria-label="Host an Experience at KOSHA - Inquire via WhatsApp"
            >
              <span>Host an Experience</span>
              <span className="kosha-exp-cta-arrow" aria-hidden="true">↗</span>
            </a>
            <div className="kosha-exp-cta-note">
              <span className="kosha-exp-cta-note-dot" aria-hidden="true" />
              <span>Direct intent via WhatsApp: &ldquo;Hi KOSHĀ, I&rsquo;m interested...&rdquo;</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceStudioSection;
