import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Navbar.css';

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'menu', label: 'Menu', href: '#menu' },
  { id: 'experiences', label: 'Experiences', href: '#experiences' },
  { id: 'space', label: 'Space', href: '#space' },
  { id: 'visit', label: 'Visit', href: '#visit' },
];

export interface NavbarProps {
  activeSection?: string;
  onNavigate?: (id: string) => void;
  logoRef?: React.RefObject<HTMLImageElement | null>;
  headerRef?: React.RefObject<HTMLElement | null>;
  introState?: 'playing' | 'revealing' | 'ready';
  isLogoDormant?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection = 'about',
  onNavigate,
  logoRef,
  headerRef,
  introState = 'ready',
  isLogoDormant = false,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const mobileCardRef = useRef<HTMLDivElement | null>(null);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    closeMobileMenu();
    if (onNavigate) {
      onNavigate(id);
    } else {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Keyboard accessibility: Escape closes mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        closeMobileMenu();
        toggleBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, closeMobileMenu]);

  // Prevent scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const wrapperStateClass =
    introState === 'playing'
      ? 'intro-hidden'
      : introState === 'revealing'
      ? 'intro-revealing'
      : 'intro-ready';

  return (
    <>
      <header
        ref={headerRef}
        className={`kosha-header-wrapper ${wrapperStateClass}`}
        role="banner"
      >
        <div className="kosha-navbar-capsule">
          {/* Brand Logo */}
          <a
            href="#top"
            className="kosha-navbar-brand"
            aria-label="KOSHĀ — Café &amp; Experience Studio Home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              ref={logoRef}
              src="/kosha-logo.png"
              alt="KOSHĀ"
              className={`kosha-navbar-logo ${isLogoDormant ? 'logo-dormant' : ''}`}
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="kosha-desktop-nav" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <div key={item.id} className="kosha-nav-item">
                  <a
                    href={item.href}
                    className={`kosha-nav-link ${isActive ? 'active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => handleLinkClick(e, item.id)}
                  >
                    {item.label}
                  </a>
                </div>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="kosha-navbar-cta-wrapper">
            <a
              href="#visit"
              className="kosha-navbar-cta"
              onClick={(e) => handleLinkClick(e, 'visit')}
            >
              <span>Visit KOSHĀ</span>
              <span className="kosha-cta-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            ref={toggleBtnRef}
            type="button"
            className="kosha-mobile-toggle"
            aria-expanded={mobileOpen}
            aria-controls="kosha-mobile-nav"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span
              className={`kosha-toggle-icon ${mobileOpen ? 'is-open' : ''}`}
              aria-hidden="true"
            >
              <span className="kosha-toggle-bar" />
              <span className="kosha-toggle-bar" />
              <span className="kosha-toggle-bar" />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`kosha-mobile-drawer-backdrop ${mobileOpen ? 'is-open' : ''}`}
        aria-hidden="true"
        onClick={closeMobileMenu}
      />

      {/* Mobile Navigation Card */}
      <div
        id="kosha-mobile-nav"
        ref={mobileCardRef}
        className={`kosha-mobile-menu-card ${mobileOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-label="Mobile Navigation"
        aria-modal={mobileOpen}
      >
        <ul className="kosha-mobile-nav-list">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`kosha-mobile-nav-link ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => handleLinkClick(e, item.id)}
                >
                  <span>{item.label}</span>
                  {isActive && <span aria-hidden="true">•</span>}
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="#visit"
          className="kosha-mobile-cta"
          onClick={(e) => handleLinkClick(e, 'visit')}
        >
          <span>Visit KOSHĀ →</span>
        </a>
      </div>
    </>
  );
};

export default Navbar;
