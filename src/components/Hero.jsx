'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import styles from '@/styles/hero.module.css';

export default function Hero({ settings = {} }) {
  const label     = settings.hero_label     || 'Available for opportunities';
  const titleLine1 = settings.hero_title_line1 || 'I build things';
  const titleLine2 = settings.hero_title_line2 || 'for the web.';
  const subtitle   = settings.hero_subtitle  || '';

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={`${styles.hero} section`} id="hero">
      <div className="container">
        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroLabel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.heroDot} />
            {label}
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className={styles.heroTitleLine}>{titleLine1}</span>
            <span className={`${styles.heroTitleLine} gradient-text`}>{titleLine2}</span>
          </motion.h1>

          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className={styles.heroButtons}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button className="btn btn-primary" onClick={scrollToProjects}>
              View My Work
              <ArrowDown size={18} />
            </button>
            <button className="btn btn-secondary" onClick={scrollToContact}>
              Get In Touch
            </button>
          </motion.div>
        </div>

        {/* Decorative code snippet */}
        <motion.div
          className={styles.codeSnippet}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className={styles.codeLine}>
            <span className={styles.codeComment}>{'// Welcome to my portfolio'}</span>
          </span>
          <span className={styles.codeLine}>
            <span className={styles.codeKeyword}>const </span>
            <span className={styles.codeFunc}>developer</span>
            {' = {'}
          </span>
          <span className={styles.codeLine}>
            {'  name: '}
            <span className={styles.codeString}>{'"Creative Dev"'}</span>,
          </span>
          <span className={styles.codeLine}>
            {'  passion: '}
            <span className={styles.codeString}>{'"Building UIs"'}</span>,
          </span>
          <span className={styles.codeLine}>
            {'  coffee: '}
            <span className={styles.codeString}>{'"Always ☕"'}</span>,
          </span>
          <span className={styles.codeLine}>{'};'}</span>
        </motion.div>

        {/* Floating shapes */}
        <div className={styles.floatingShapes}>
          <div className={`${styles.shape} ${styles.shape1}`} />
          <div className={`${styles.shape} ${styles.shape2}`} />
          <div className={`${styles.shape} ${styles.shape3}`} />
        </div>
      </div>
    </section>
  );
}
