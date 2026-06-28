'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Briefcase, GraduationCap, Heart } from 'lucide-react';
import styles from '@/styles/admin.module.css';

const emptyExperience = {
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
  type: 'work',
  sortOrder: 0,
};

function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  const [year, month] = dateStr.split('-');
  const date = new Date(year, (month || 1) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function getTypeIcon(type) {
  switch (type) {
    case 'education': return <GraduationCap size={14} />;
    case 'volunteer': return <Heart size={14} />;
    default: return <Briefcase size={14} />;
  }
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyExperience);
  const [loading, setLoading] = useState(true);

  const fetchExperiences = async () => {
    const res = await fetch('/api/experience');
    const data = await res.json();
    setExperiences(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyExperience);
    setShowModal(true);
  };

  const openEdit = (exp) => {
    setEditing(exp.id);
    setForm({
      title: exp.title,
      company: exp.company,
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      description: exp.description,
      type: exp.type || 'work',
      sortOrder: exp.sortOrder || 0,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = editing ? `/api/experience/${editing}` : '/api/experience';
    const method = editing ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setShowModal(false);
    fetchExperiences();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    await fetch(`/api/experience/${id}`, { method: 'DELETE' });
    fetchExperiences();
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Experience</h1>
        <p className={styles.pageSubtitle}>Manage your work history and education</p>
      </div>

      <div className={styles.toolbar}>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          {experiences.length} item{experiences.length !== 1 ? 's' : ''}
        </span>
        <button className={styles.addBtn} onClick={openAdd}>
          <Plus size={18} />
          Add Experience
        </button>
      </div>

      {loading ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Loading...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💼</div>
          <p className={styles.emptyText}>No experience items yet</p>
          <p className={styles.emptySubtext}>Click &quot;Add Experience&quot; to create your first entry</p>
        </div>
      ) : (
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Type</th>
              <th>Period</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {exp.title}
                </td>
                <td>{exp.company}</td>
                <td>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderRadius: '9999px',
                    background: exp.type === 'education'
                      ? 'rgba(124, 58, 237, 0.1)'
                      : exp.type === 'volunteer'
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(0, 212, 255, 0.1)',
                    color: exp.type === 'education'
                      ? 'var(--accent-purple)'
                      : exp.type === 'volunteer'
                        ? 'var(--accent-emerald)'
                        : 'var(--accent-cyan)',
                  }}>
                    {getTypeIcon(exp.type)}
                    {exp.type}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                  {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                </td>
                <td>{exp.sortOrder}</td>
                <td>
                  <div className={styles.tableActions}>
                    <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEdit(exp)}>
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(exp.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editing ? 'Edit Experience' : 'Add New Experience'}
            </h2>
            <form className={styles.form} onSubmit={handleSave}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Title / Position *</label>
                <input
                  className={styles.input}
                  placeholder="Senior Frontend Developer"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Company / Institution *</label>
                  <input
                    className={styles.input}
                    placeholder="Company Name"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Location</label>
                  <input
                    className={styles.input}
                    placeholder="City, Country"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Start Date *</label>
                  <input
                    className={styles.input}
                    type="month"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>End Date (empty = Present)</label>
                  <input
                    className={styles.input}
                    type="month"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Description *</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe your role and achievements..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Type</label>
                  <input
                    className={styles.input}
                    placeholder="work, education, volunteer, etc."
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  />
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginTop: '4px' }}>
                    e.g., work, education, volunteer, internship, freelance
                  </small>
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Sort Order</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editing ? 'Save Changes' : 'Create Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
