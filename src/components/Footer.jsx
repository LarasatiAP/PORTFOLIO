'use client';

import { ArrowUp, Heart } from 'lucide-react';
import styles from '@/styles/footer.module.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} Portfolio. Built with{' '}
            <span className={styles.footerHeart}><Heart size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /></span>{' '}
            using Next.js & React
          </p>

          <div className={styles.footerLinks}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
              GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
              LinkedIn
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
              Twitter
            </a>
          </div>

          <button className={styles.backToTop} onClick={scrollToTop} aria-label="Back to top">
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}
