import { FolderKanban, Briefcase, Eye } from 'lucide-react';
import { getAllProjects, getAllExperiences } from '@/lib/db';
import styles from '@/styles/admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [projects, experiences] = await Promise.all([
    getAllProjects(),
    getAllExperiences(),
  ]);
  const featuredCount = projects.filter(p => p.featured === 1).length;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Overview of your portfolio content</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardIcon} style={{ background: 'rgba(232,114,154,0.1)', color: 'var(--accent-rose)' }}>
            <FolderKanban size={20} />
          </div>
          <div className={styles.statCardValue}>{projects.length}</div>
          <div className={styles.statCardLabel}>Total Projects</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardIcon} style={{ background: 'rgba(155,126,200,0.1)', color: 'var(--accent-lavender)' }}>
            <Briefcase size={20} />
          </div>
          <div className={styles.statCardValue}>{experiences.length}</div>
          <div className={styles.statCardLabel}>Experience Items</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardIcon} style={{ background: 'rgba(138,191,160,0.1)', color: 'var(--accent-sage)' }}>
            <Eye size={20} />
          </div>
          <div className={styles.statCardValue}>{featuredCount}</div>
          <div className={styles.statCardLabel}>Featured Projects</div>
        </div>
      </div>

      <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
        <h3 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/admin/projects"   className="btn btn-primary"   style={{ fontSize: '0.85rem', padding: '10px 20px' }}><FolderKanban size={16} /> Manage Projects</a>
          <a href="/admin/experience" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '10px 20px' }}><Briefcase size={16} /> Manage Experience</a>
          <a href="/" target="_blank" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '10px 20px' }}><Eye size={16} /> View Portfolio</a>
        </div>
      </div>
    </div>
  );
}
