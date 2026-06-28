'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Star, X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import styles from '@/styles/projects.module.css';

// Helper function to get image URL (handle both full URLs from Supabase and relative paths)
const getImageUrl = (filename) => {
  if (!filename) return '';
  return filename.startsWith('http') ? filename : `/uploads/${filename}`;
};

export default function Projects({ projects = [] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });

  const openLightbox = (images, index) => {
    setLightbox({ open: true, images, index });
  };

  const closeLightbox = () => setLightbox({ open: false, images: [], index: 0 });

  const prevImage = () => {
    setLightbox(prev => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length,
    }));
  };

  const nextImage = () => {
    setLightbox(prev => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length,
    }));
  };

  return (
    <section className={`${styles.projects} section`} id="projects" ref={ref}>
      <div className="container">
        <motion.div
          className={styles.projectsHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="section-label">Projects</span>
            <h2 className="section-title">
              Things I&apos;ve <span className="gradient-text">built</span>
            </h2>
            <p className="section-description">
              A collection of projects that showcase my skills and passion for development.
            </p>
          </div>
        </motion.div>

        <div className={styles.projectsGrid}>
          {projects.map((project, index) => {
            const images = project.images || [];
            const hasImages = images.length > 0;
            const coverImage = project.imageUrl || (hasImages ? getImageUrl(images[0].filename) : '');

            return (
              <motion.div
                key={project.id}
                className={styles.projectCard}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.projectImageWrapper}>
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={project.title}
                      className={styles.projectImage}
                    />
                  ) : (
                    <div className={styles.projectImagePlaceholder}>💻</div>
                  )}
                  <div className={styles.projectOverlay}>
                    {hasImages && (
                      <button
                        className={styles.overlayBtn}
                        onClick={() => openLightbox(images, 0)}
                      >
                        <Images size={14} />
                        Gallery ({images.length})
                      </button>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.overlayBtn}>
                        <ExternalLink size={14} />
                        Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.overlayBtn}>
                        <GithubIcon size={14} />
                        Code
                      </a>
                    )}
                  </div>
                </div>

                <div className={styles.projectBody}>
                  {project.featured === 1 && (
                    <span className={styles.featuredBadge}>
                      <Star size={12} />
                      Featured
                    </span>
                  )}
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDescription}>{project.description}</p>

                  {/* Thumbnail gallery */}
                  {hasImages && (
                    <div className={styles.thumbnailRow}>
                      {images.slice(0, 4).map((img, i) => (
                        <button
                          key={img.id}
                          className={styles.thumbnail}
                          onClick={() => openLightbox(images, i)}
                        >
                          <img src={getImageUrl(img.filename)} alt={img.caption || `Screenshot ${i + 1}`} />
                          {i === 3 && images.length > 4 && (
                            <span className={styles.thumbnailMore}>+{images.length - 4}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={styles.techList}>
                    {project.techStack?.split(',').map((tech, i) => (
                      <span key={i} className={styles.techTag}>{tech.trim()}</span>
                    ))}
                  </div>

                  <div className={styles.projectLinks}>
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                        <GithubIcon size={14} /> Source Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div
            className={styles.lightboxOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button className={styles.lightboxClose} onClick={closeLightbox}><X size={24} /></button>

            <motion.div
              className={styles.lightboxContent}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <img
                src={getImageUrl(lightbox.images[lightbox.index]?.filename)}
                alt={lightbox.images[lightbox.index]?.caption || 'Project screenshot'}
                className={styles.lightboxImage}
              />
              {lightbox.images[lightbox.index]?.caption && (
                <p className={styles.lightboxCaption}>{lightbox.images[lightbox.index].caption}</p>
              )}
              <div className={styles.lightboxCounter}>
                {lightbox.index + 1} / {lightbox.images.length}
              </div>
            </motion.div>

            {lightbox.images.length > 1 && (
              <>
                <button className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                  <ChevronLeft size={28} />
                </button>
                <button className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
