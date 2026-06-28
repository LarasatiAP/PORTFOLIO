'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Star, Upload, X, Image as ImageIcon } from 'lucide-react';
import styles from '@/styles/admin.module.css';

const emptyProject = {
  title: '',
  description: '',
  imageUrl: '',
  techStack: '',
  liveUrl: '',
  githubUrl: '',
  featured: false,
  sortOrder: 0,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(null); // projectId
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [loading, setLoading] = useState(true);
  const [projectImages, setProjectImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyProject);
    setShowModal(true);
  };

  const openEdit = (project) => {
    setEditing(project.id);
    setForm({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl || '',
      techStack: project.techStack || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured === 1,
      sortOrder: project.sortOrder || 0,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = editing ? `/api/projects/${editing}` : '/api/projects';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its images?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    fetchProjects();
  };

  // --- Image Management ---
  const openImages = async (projectId) => {
    setShowImageModal(projectId);
    const res = await fetch(`/api/projects/${projectId}/images`);
    const data = await res.json();
    setProjectImages(data);
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('projectId', showImageModal);
      await fetch('/api/upload', { method: 'POST', body: fd });
    }

    // Refresh images
    const res = await fetch(`/api/projects/${showImageModal}/images`);
    setProjectImages(await res.json());
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteImage = async (imgId) => {
    await fetch(`/api/upload/${imgId}`, { method: 'DELETE' });
    const res = await fetch(`/api/projects/${showImageModal}/images`);
    setProjectImages(await res.json());
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Projects</h1>
        <p className={styles.pageSubtitle}>Manage your portfolio projects</p>
      </div>

      <div className={styles.toolbar}>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </span>
        <button className={styles.addBtn} onClick={openAdd}>
          <Plus size={18} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className={styles.emptyState}><p className={styles.emptyText}>Loading...</p></div>
      ) : projects.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📁</div>
          <p className={styles.emptyText}>No projects yet</p>
          <p className={styles.emptySubtext}>Click &quot;Add Project&quot; to create your first project</p>
        </div>
      ) : (
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Tech Stack</th>
              <th>Featured</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{project.title}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {project.techStack?.split(',').slice(0, 3).map((t, i) => (
                      <span key={i} style={{
                        padding: '2px 8px', fontSize: '0.7rem',
                        background: 'rgba(232, 114, 154, 0.08)', color: 'var(--accent-rose)',
                        borderRadius: '9999px', fontFamily: 'var(--font-mono)',
                      }}>{t.trim()}</span>
                    ))}
                  </div>
                </td>
                <td>
                  {project.featured === 1 && (
                    <span className={styles.featuredBadge}><Star size={10} /> Featured</span>
                  )}
                </td>
                <td>{project.sortOrder}</td>
                <td>
                  <div className={styles.tableActions}>
                    <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openImages(project.id)}>
                      <ImageIcon size={14} /> Images
                    </button>
                    <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEdit(project)}>
                      <Pencil size={14} /> Edit
                    </button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(project.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit/Add Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{editing ? 'Edit Project' : 'Add New Project'}</h2>
            <form className={styles.form} onSubmit={handleSave}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Title *</label>
                <input className={styles.input} placeholder="Project title" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Description *</label>
                <textarea className={styles.textarea} placeholder="Describe your project..." value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Cover Image URL (optional, or upload via Images)</label>
                <input className={styles.input} placeholder="https://example.com/image.png" value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Tech Stack (comma-separated)</label>
                <input className={styles.input} placeholder="React, Next.js, Node.js" value={form.techStack}
                  onChange={(e) => setForm({ ...form, techStack: e.target.value })} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Live URL</label>
                  <input className={styles.input} placeholder="https://myproject.com" value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>GitHub URL</label>
                  <input className={styles.input} placeholder="https://github.com/..." value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Sort Order</label>
                  <input className={styles.input} type="number" value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
                </div>
                <div className={styles.checkbox} style={{ alignSelf: 'flex-end', paddingBottom: 12 }}>
                  <input type="checkbox" id="featured" checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  <label htmlFor="featured">Featured Project</label>
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>{editing ? 'Save Changes' : 'Create Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {showImageModal && (
        <div className={styles.modalOverlay} onClick={() => setShowImageModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              <ImageIcon size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Project Images
            </h2>

            {/* Upload area */}
            <div style={{
              border: '2px dashed var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '20px',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--accent-rose)'; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                const dt = new DataTransfer();
                for (const f of e.dataTransfer.files) dt.items.add(f);
                fileInputRef.current.files = dt.files;
                handleUpload({ target: { files: dt.files } });
              }}
            >
              <Upload size={32} style={{ color: 'var(--accent-rose)', marginBottom: 8 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {uploading ? 'Uploading...' : 'Click or drag images here to upload'}
              </p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginTop: 4 }}>
                Supports JPG, PNG, WebP
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleUpload}
              />
            </div>

            {/* Image grid */}
            {projectImages.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '20px 0' }}>
                No images uploaded yet
              </p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '12px',
              }}>
                {projectImages.map((img) => (
                  <div key={img.id} style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--glass-border)',
                    aspectRatio: '1',
                  }}>
                    <img
                      src={`/uploads/${img.filename}`}
                      alt={img.caption || 'Project image'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      style={{
                        position: 'absolute', top: 4, right: 4,
                        width: 24, height: 24,
                        borderRadius: '50%', background: 'rgba(239,68,68,0.9)',
                        color: 'white', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.formActions} style={{ marginTop: 20 }}>
              <button className={styles.cancelBtn} onClick={() => setShowImageModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
