'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons';
import styles from '@/styles/contact.module.css';

const EMAIL    = process.env.NEXT_PUBLIC_EMAIL    || '';
const GITHUB   = process.env.NEXT_PUBLIC_GITHUB   || 'https://github.com';
const LINKEDIN = process.env.NEXT_PUBLIC_LINKEDIN || 'https://linkedin.com';
const LOCATION = process.env.NEXT_PUBLIC_LOCATION || '';

export default function Contact({ settings = {} }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const description = settings.contact_description || '';

  return (
    <section className={`${styles.contact} section`} id="contact" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Contact</span>
          <h2 className="section-title">
            Let&apos;s work <span className="gradient-text">together</span>
          </h2>
          <p className="section-description">
            Have a project in mind? Feel free to reach out and let&apos;s create something amazing.
          </p>
        </motion.div>

        <motion.div
          className={styles.contactInfo}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {description && (
            <p className={styles.contactText}>{description}</p>
          )}

          <div className={styles.contactCards}>
            {EMAIL && (
              <a href={`mailto:${EMAIL}`} className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <Mail size={18} />
                </div>
                <div>
                  <div className={styles.contactLabel}>Email</div>
                  <div className={styles.contactValue}>{EMAIL}</div>
                </div>
              </a>
            )}

            {LOCATION && (
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div className={styles.contactLabel}>Location</div>
                  <div className={styles.contactValue}>{LOCATION}</div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.socialLinks}>
            {GITHUB && (
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
                <GithubIcon size={20} />
              </a>
            )}
            {LINKEDIN && (
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                <LinkedinIcon size={20} />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
