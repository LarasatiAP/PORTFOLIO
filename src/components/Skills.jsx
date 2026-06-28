'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Monitor, Server, Wrench, Palette } from 'lucide-react';
import styles from '@/styles/skills.module.css';

const skillCategories = [
  {
    title: 'Frontend',
    icon: <Monitor size={20} />,
    iconStyle: styles.iconFrontend,
    skills: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Vue.js', 'Framer Motion'],
  },
  {
    title: 'Backend',
    icon: <Server size={20} />,
    iconStyle: styles.iconBackend,
    skills: ['Node.js', 'Express', 'Python', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis', 'REST API'],
  },
  {
    title: 'Tools & DevOps',
    icon: <Wrench size={20} />,
    iconStyle: styles.iconTools,
    skills: ['Git', 'Docker', 'Vercel', 'AWS', 'CI/CD', 'Linux', 'Webpack', 'Vite'],
  },
  {
    title: 'Design',
    icon: <Palette size={20} />,
    iconStyle: styles.iconDesign,
    skills: ['Figma', 'UI/UX', 'Responsive Design', 'Accessibility', 'Prototyping', 'Design Systems'],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={`${styles.skills} section`} id="skills" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Skills</span>
          <h2 className="section-title">
            Technologies I <span className="gradient-text">work with</span>
          </h2>
          <p className="section-description">
            A comprehensive toolkit I use to build modern web applications.
          </p>
        </motion.div>

        <div className={styles.skillsGrid}>
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              className={styles.skillCategory}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`${styles.categoryIcon} ${category.iconStyle}`}>
                {category.icon}
              </div>
              <h3 className={styles.categoryTitle}>{category.title}</h3>
              <div className={styles.skillsList}>
                {category.skills.map((skill) => (
                  <span key={skill} className={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
