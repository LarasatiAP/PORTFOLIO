'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import styles from '@/styles/about.module.css';

export default function About({ settings = {} }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const p1         = settings.about_paragraph1   || '';
  const p2         = settings.about_paragraph2   || '';
  const p3         = settings.about_paragraph3   || '';
  const location   = settings.about_info_location   || '';
  const experience = settings.about_info_experience || '';
  const speciality = settings.about_info_speciality || '';
  const status     = settings.about_info_status     || '';
  const photo      = settings.about_photo           || '/foto/profil.jpeg';

  return (
    <section className={`${styles.about} section`} id="about" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">About Me</span>
          <h2 className="section-title">
            A glimpse into <span className="gradient-text">who I am</span>
          </h2>
        </motion.div>

        <div className={styles.aboutGrid}>
          {/* Photo */}
          <motion.div
            className={styles.aboutImageWrapper}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.aboutImage}>
              <Image
                src={photo}
                alt="Profile photo"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 968px) 280px, 400px"
                priority
              />
            </div>
            <div className={styles.aboutImageDecor} />
          </motion.div>

          {/* Text */}
          <motion.div
            className={styles.aboutContent}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {p1 && <p className={styles.aboutText}>{p1}</p>}
            {p2 && <p className={styles.aboutText}>{p2}</p>}
            {p3 && <p className={styles.aboutText}>{p3}</p>}

            <div className={styles.infoGrid}>
              {location && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Location</div>
                  <div className={styles.infoValue}>{location}</div>
                </div>
              )}
              {experience && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Experience</div>
                  <div className={styles.infoValue}>{experience}</div>
                </div>
              )}
              {speciality && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Speciality</div>
                  <div className={styles.infoValue}>{speciality}</div>
                </div>
              )}
              {status && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Status</div>
                  <div className={styles.infoValue}>{status}</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
