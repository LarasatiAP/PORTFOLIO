'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Upload } from 'lucide-react';
import Image from 'next/image';
import styles from '@/styles/admin.module.css';

const FIELD_GROUPS = [
  {
    title: 'Hero Section',
    fields: [
      { key: 'hero_label',       label: 'Badge text',              type: 'text',     placeholder: 'Available for opportunities' },
      { key: 'hero_title_line1', label: 'Title line 1',            type: 'text',     placeholder: 'I build things' },
      { key: 'hero_title_line2', label: 'Title line 2 (gradient)', type: 'text',     placeholder: 'for the web.' },
      { key: 'hero_subtitle',    label: 'Subtitle paragraph',      type: 'textarea', placeholder: 'A passionate full-stack developer...' },
    ],
  },
  {
    title: 'About Me — Paragraphs',
    fields: [
      { key: 'about_paragraph1', label: 'Paragraph 1', type: 'textarea', placeholder: '' },
      { key: 'about_paragraph2', label: 'Paragraph 2', type: 'textarea', placeholder: '' },
      { key: 'about_paragraph3', label: 'Paragraph 3', type: 'textarea', placeholder: '' },
    ],
  },
  {
    title: 'About Me — Info Cards',
    fields: [
      { key: 'about_info_location',   label: 'Location',   type: 'text', placeholder: '🌍 Remote' },
      { key: 'about_info_experience', label: 'Experience', type: 'text', placeholder: '3+ Years' },
      { key: 'about_info_speciality', label: 'Speciality', type: 'text', placeholder: 'Full-Stack' },
      { key: 'about_info_status',     label: 'Status',     type: 'text', placeholder: '✅ Available' },
    ],
  },
  {
    title: 'Contact Section',
    fields: [
      { key: 'contact_description', label: 'Description text', type: 'textarea', placeholder: "I'm always open to discussing new projects..." },
    ],
  },
];

export default function AdminSettingsPage() {
  const [values, setValues]         = useState({});
  const [saved, setSaved]           = useState(false);
  const [loading, setLoading]       = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setValues(data);
        setPhotoPreview(data.about_photo || '/foto/profil.jpeg');
        setLoading(false);
      });
  }, []);

  const handleChange = (key, val) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediate local preview
    setPhotoPreview(URL.createObjectURL(file));
    setUploading(true);

    const fd = new FormData();
    fd.append('file', file);

    const res  = await fetch('/api/upload/profile', { method: 'POST', body: fd });
    const data = await res.json();

    if (data.url) {
      setValues(prev => ({ ...prev, about_photo: data.url }));
      setPhotoPreview(data.url);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Settings</h1>
        <p className={styles.pageSubtitle}>Edit all content shown on the portfolio</p>
      </div>

      <form onSubmit={handleSave}>

        {/* ── Profile Photo ── */}
        <div style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '24px',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: 'var(--accent-rose)' }}>
            About Me — Profile Photo
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Preview */}
            <div style={{
              width: 120,
              height: 120,
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '2px solid var(--glass-border)',
              position: 'relative',
              flexShrink: 0,
              background: 'var(--gradient-subtle)',
            }}>
              {photoPreview && (
                <Image
                  src={photoPreview}
                  alt="Profile preview"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="120px"
                  unoptimized
                />
              )}
            </div>

            {/* Upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
              <button
                type="button"
                className={styles.addBtn}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{ marginBottom: 8 }}
              >
                <Upload size={16} />
                {uploading ? 'Uploading...' : 'Upload New Photo'}
              </button>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>
                JPG, PNG, WebP — foto langsung berubah setelah upload
              </p>
            </div>
          </div>
        </div>

        {/* ── Text field groups ── */}
        {FIELD_GROUPS.map(group => (
          <div key={group.title} style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            marginBottom: '24px',
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: 'var(--accent-rose)' }}>
              {group.title}
            </h3>
            <div className={styles.form}>
              {group.fields.map(field => (
                <div key={field.key} className={styles.inputGroup}>
                  <label className={styles.inputLabel}>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className={styles.textarea}
                      placeholder={field.placeholder}
                      value={values[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <input
                      className={styles.input}
                      type="text"
                      placeholder={field.placeholder}
                      value={values[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            type="submit"
            className={styles.saveBtn}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <Save size={16} />
            Save All Changes
          </button>
          {saved && (
            <span style={{ color: 'var(--accent-sage)', fontSize: '0.9rem' }}>
              ✓ Saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
