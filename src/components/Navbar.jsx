'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/navbar.module.css';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sections = navItems.map(item => item.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`} id="navbar">
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            Portfolio
          </Link>

          <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
            {navItems.map((item) => (
              <button
                key={item.href}
                className={`${styles.navLink} ${
                  activeSection === item.href.replace('#', '') ? styles.navLinkActive : ''
                }`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </nav>

      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayVisible : ''}`}
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
}
