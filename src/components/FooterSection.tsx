import React from 'react';
import './FooterSection.css';

/**
 * Verified KOSHĀ defaults.
 * Update when client confirms specific street addresses, phone numbers, or social handles.
 */
export const KOSHA_DEFAULT_LOCATION = 'Vasant Kunj, New Delhi';
export const KOSHA_DEFAULT_WHATSAPP_PHONE = '';
export const KOSHA_DEFAULT_VISIT_MESSAGE =
  "Hi KOSHĀ, I'd like to plan a visit to your café and experience studio. Could you share your current hours and availability?";

export interface FooterSectionProps {
  onNavigate?: (id: string) => void;
  location?: string;
  mapsUrl?: string;
  cafeHours?: string;
  studioHours?: string;
  whatsappPhone?: string;
  instagramHandle?: string;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onNavigate,
  location = KOSHA_DEFAULT_LOCATION,
  mapsUrl,
  cafeHours = 'Hours to be announced',
  studioHours = 'By appointment & reservation',
  whatsappPhone = KOSHA_DEFAULT_WHATSAPP_PHONE,
  instagramHandle,
}) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(id);
    } else {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Format WhatsApp Link
  const trimmedPhone = whatsappPhone.trim().replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(KOSHA_DEFAULT_VISIT_MESSAGE);
  const whatsappUrl = trimmedPhone
    ? `https://wa.me/${trimmedPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  return (
    <footer id="visit" className="kosha-footer-root" role="contentinfo" aria-label="KOSHA Footer">
      <div className="kosha-footer-inner">
        {/* Main Three-Column Grid */}
        <div className="kosha-footer-grid">
          {/* Column 1: Brand Signature */}
          <div className="kosha-footer-col kosha-footer-brand-col">
            <a
              href="#top"
              className="kosha-footer-brand-link"
              aria-label="KOSHĀ — Return to top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img
                src="/kosha-logo.png"
                alt="KOSHĀ"
                className="kosha-footer-logo"
                loading="lazy"
              />
            </a>

            <div className="kosha-footer-brand-titles">
              <h3 className="kosha-footer-brand-heading">CAFÉ &amp; EXPERIENCE STUDIO</h3>
              <p className="kosha-footer-brand-tagline">Meet. Eat. Discover.</p>
            </div>

            <p className="kosha-footer-brand-statement">
              A space for good food, meaningful gatherings, and thoughtful discovery.
            </p>

            <div className="kosha-footer-editorial-pill">
              <span className="kosha-footer-pill-dot" aria-hidden="true" />
              <span>Good food. Good company. Room to discover.</span>
            </div>
          </div>

          {/* Column 2: Explore Navigation */}
          <div className="kosha-footer-col kosha-footer-explore-col">
            <h4 className="kosha-footer-col-heading">01 / EXPLORE</h4>
            <nav className="kosha-footer-nav" aria-label="Footer Navigation">
              <ul className="kosha-footer-nav-list">
                <li>
                  <a
                    href="#about"
                    className="kosha-footer-nav-link"
                    onClick={(e) => handleLinkClick(e, 'about')}
                  >
                    <span>About the Studio</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#menu"
                    className="kosha-footer-nav-link"
                    onClick={(e) => handleLinkClick(e, 'menu')}
                  >
                    <span>Culinary &amp; Botanical Menu</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#experiences"
                    className="kosha-footer-nav-link has-dot"
                    onClick={(e) => handleLinkClick(e, 'experiences')}
                  >
                    <span>Gatherings &amp; Workshops</span>
                    <span className="kosha-footer-nav-dot" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="kosha-footer-nav-link"
                    onClick={(e) => handleLinkClick(e, 'about')}
                  >
                    <span>The Physical Space</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#visit"
                    className="kosha-footer-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById('visit');
                      if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span>Hours &amp; Reservations</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 3: Come Experience KOSHĀ */}
          <div className="kosha-footer-col kosha-footer-visit-col">
            <h4 className="kosha-footer-col-heading">02 / COME EXPERIENCE KOSHĀ</h4>

            <div className="kosha-footer-info-cards">
              {/* Sanctuary Address Card */}
              <div className="kosha-footer-panel">
                <span className="kosha-footer-panel-label">SANCTUARY LOCATION</span>
                <div className="kosha-footer-panel-body">
                  <span className="kosha-footer-panel-value">{location}</span>
                  {mapsUrl ? (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="kosha-footer-panel-link"
                      aria-label="View KOSHA sanctuary location on Google Maps"
                    >
                      <span>View on Google Maps</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="kosha-footer-panel-muted">Directions available soon</span>
                  )}
                </div>
              </div>

              {/* Hours Grid Panel */}
              <div className="kosha-footer-hours-grid">
                <div className="kosha-footer-subpanel">
                  <span className="kosha-footer-panel-label">CAFÉ &amp; HEARTH</span>
                  <span className="kosha-footer-panel-subvalue">{cafeHours}</span>
                </div>
                <div className="kosha-footer-subpanel">
                  <span className="kosha-footer-panel-label">STUDIO EXPERIENCES</span>
                  <span className="kosha-footer-panel-subvalue">{studioHours}</span>
                </div>
              </div>

              {/* Direct Inquiries & Visual Chronicles */}
              <div className="kosha-footer-connect-rows">
                <div className="kosha-footer-connect-item">
                  <span className="kosha-footer-connect-label">Direct Inquiries</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kosha-footer-connect-link"
                    aria-label="Inquire directly with KOSHA via WhatsApp"
                  >
                    <span>WhatsApp Inquiry</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>

                <div className="kosha-footer-connect-item">
                  <span className="kosha-footer-connect-label">Visual Chronicles</span>
                  {instagramHandle ? (
                    <a
                      href={`https://instagram.com/${instagramHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="kosha-footer-connect-link"
                      aria-label={`Visit KOSHA Instagram @${instagramHandle.replace('@', '')}`}
                    >
                      <span>{instagramHandle}</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="kosha-footer-connect-muted">Instagram coming soon</span>
                  )}
                </div>
              </div>
            </div>

            {/* Primary Plan Your Visit CTA */}
            <div className="kosha-footer-cta-wrap">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="kosha-footer-cta-btn"
                aria-label="Plan your visit to KOSHA"
              >
                <span>PLAN YOUR VISIT</span>
                <span className="kosha-footer-cta-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="kosha-footer-divider" aria-hidden="true" />

        <div className="kosha-footer-bottom-strip">
          <div className="kosha-footer-copyright">
            <span className="kosha-footer-copyright-dot" aria-hidden="true" />
            <span>&copy; {currentYear} KOSHĀ. All rights reserved.</span>
          </div>
          <div className="kosha-footer-bottom-right">
            <span>Café &amp; Experience Studio</span>
            <span className="kosha-footer-sep" aria-hidden="true">
              ·
            </span>
            <span>Crafted with care</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
