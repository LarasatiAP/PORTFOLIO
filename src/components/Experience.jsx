'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Briefcase, GraduationCap, Heart } from 'lucide-react';
import styles from '@/styles/experience.module.css';

function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  const [year, month] = dateStr.split('-');
  const date = new Date(year, (month || 1) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function getTypeStyle(type) {
  switch (type) {
    case 'education': return styles.typeEducation;
    case 'volunteer': return styles.typeVolunteer;
    default: return styles.typeWork;
  }
}

function getTypeIcon(type) {
  switch (type) {
    case 'education': return <GraduationCap size={14} />;
    case 'volunteer': return <Heart size={14} />;
    default: return <Briefcase size={14} />;
  }
}

export default function Experience({ experiences = [] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={`${styles.experience} section`} id="experience" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Experience</span>
          <h2 className="section-title">
            My <span className="gradient-text">journey</span> so far
          </h2>
          <p className="section-description">
            A timeline of my professional experience and education.
          </p>
        </motion.div>

        <div className={styles.timeline}>
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className={styles.timelineItem}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className={styles.timelineDot} />
              <div className={styles.timelineCard}>
                <div className={styles.timelineHeader}>
                  <div>
                    <h3 className={styles.timelineTitle}>{exp.title}</h3>
                    <div className={styles.timelineCompany}>{exp.company}</div>
                  </div>
                  <div className={styles.timelineMeta}>
                    <span className={`${styles.timelineType} ${getTypeStyle(exp.type)}`}>
                      {exp.type}
                    </span>
                    <span className={styles.timelineDate}>
                      {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                    </span>
                  </div>
                </div>
                {exp.location && (
                  <div className={styles.timelineLocation}>
                    <MapPin size={14} />
                    {exp.location}
                  </div>
                )}
                <p className={styles.timelineDescription}>{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
