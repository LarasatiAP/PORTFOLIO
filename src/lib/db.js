/**
 * db.js — Supabase database adapter
 * 
 * Semua data disimpan di Supabase Postgres.
 * Pakai Supabase client untuk query.
 */

import { supabase } from './supabase';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ─── Seed data constants ──────────────────────────────────────────────────────

const DEFAULT_SETTINGS = [
  ['about_paragraph1', "Hello! I'm a full-stack developer with a passion for creating beautiful, functional, and user-centered digital experiences."],
  ['about_paragraph2', 'With expertise in modern web technologies, I specialize in building responsive web applications that deliver exceptional performance.'],
  ['about_paragraph3', "When I'm not coding, you can find me exploring new technologies or enjoying a good cup of coffee ☕"],
  ['about_info_location', '🌍 Remote'],
  ['about_info_experience', '3+ Years'],
  ['about_info_speciality', 'Full-Stack'],
  ['about_info_status', '✅ Available'],
  ['about_photo', '/foto/profil.jpeg'],
  ['hero_label', 'Available for opportunities'],
  ['hero_title_line1', 'I build things'],
  ['hero_title_line2', 'for the web.'],
  ['hero_subtitle', 'A passionate full-stack developer specializing in building exceptional digital experiences.'],
  ['contact_description', "I'm always open to discussing new projects and creative ideas. Let's build something great together!"],
];

const SEED_PROJECTS = [
  { title: 'E-Commerce Platform', description: 'Full-stack e-commerce platform with real-time inventory, payments, and admin dashboard.', techStack: 'Next.js,React,Node.js,PostgreSQL,Stripe', liveUrl: 'https://example.com', githubUrl: 'https://github.com', featured: 1, sortOrder: 1 },
  { title: 'AI Task Manager', description: 'Smart task management powered by AI with natural language processing for task creation.', techStack: 'React,Python,FastAPI,OpenAI,MongoDB', liveUrl: 'https://example.com', githubUrl: 'https://github.com', featured: 1, sortOrder: 2 },
  { title: 'Real-Time Chat App', description: 'Feature-rich messaging platform with file sharing, video calls, and end-to-end encryption.', techStack: 'React,Socket.io,Express,Redis,WebRTC', liveUrl: 'https://example.com', githubUrl: 'https://github.com', featured: 1, sortOrder: 3 },
];

const SEED_EXPERIENCES = [
  { title: 'Senior Frontend Developer', company: 'Tech Corp', location: 'San Francisco, CA', startDate: '2023-01', endDate: '', description: 'Leading frontend architecture and mentoring junior developers.', type: 'work', sortOrder: 1 },
  { title: 'Full Stack Developer', company: 'StartupXYZ', location: 'Remote', startDate: '2021-06', endDate: '2022-12', description: 'Built and maintained multiple web apps, improved performance by 40%.', type: 'work', sortOrder: 2 },
  { title: 'Junior Web Developer', company: 'Digital Agency', location: 'New York, NY', startDate: '2020-01', endDate: '2021-05', description: 'Built responsive websites for various clients in an agile team.', type: 'work', sortOrder: 3 },
];

// ─── Init Database ────────────────────────────────────────────────────────────

export async function initDb() {
  try {
    // Check if settings exist
    const { data: settings } = await supabase.from('settings').select('key').limit(1);
    
    if (!settings || settings.length === 0) {
      // Insert default settings
      const settingsData = DEFAULT_SETTINGS.map(([key, value]) => ({ key, value }));
      await supabase.from('settings').insert(settingsData);
    }

    // Check if projects exist
    const { data: projects } = await supabase.from('projects').select('id').limit(1);
    
    if (!projects || projects.length === 0) {
      // Insert seed projects
      const projectsData = SEED_PROJECTS.map(p => ({
        id: generateId(),
        title: p.title,
        description: p.description,
        imageUrl: '',
        techStack: p.techStack,
        liveUrl: p.liveUrl,
        githubUrl: p.githubUrl,
        featured: p.featured,
        sortOrder: p.sortOrder,
      }));
      await supabase.from('projects').insert(projectsData);

      // Insert seed experiences
      const experiencesData = SEED_EXPERIENCES.map(e => ({
        id: generateId(),
        title: e.title,
        company: e.company,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        description: e.description,
        type: e.type,
        sortOrder: e.sortOrder,
      }));
      await supabase.from('experiences').insert(experiencesData);
    }

    return { ok: true, mode: 'supabase' };
  } catch (error) {
    console.error('Init DB error:', error);
    throw error;
  }
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getAllProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sortOrder', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getProjectById(id) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return null;
  return data;
}

export async function createProject(projectData) {
  const id = generateId();
  const { data, error } = await supabase
    .from('projects')
    .insert({
      id,
      title: projectData.title,
      description: projectData.description,
      imageUrl: projectData.imageUrl || '',
      techStack: projectData.techStack || '',
      liveUrl: projectData.liveUrl || '',
      githubUrl: projectData.githubUrl || '',
      featured: projectData.featured ? 1 : 0,
      sortOrder: projectData.sortOrder || 0,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProject(id, projectData) {
  const { data, error } = await supabase
    .from('projects')
    .update({
      title: projectData.title,
      description: projectData.description,
      imageUrl: projectData.imageUrl || '',
      techStack: projectData.techStack || '',
      liveUrl: projectData.liveUrl || '',
      githubUrl: projectData.githubUrl || '',
      featured: projectData.featured ? 1 : 0,
      sortOrder: projectData.sortOrder || 0,
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  // Delete project images first
  await supabase.from('project_images').delete().eq('projectId', id);
  
  // Delete project
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

// ─── Project Images ───────────────────────────────────────────────────────────

export async function getProjectImages(projectId) {
  const { data, error } = await supabase
    .from('project_images')
    .select('*')
    .eq('projectId', projectId)
    .order('sortOrder', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function addProjectImage(projectId, url, caption = '') {
  const id = generateId();
  
  // Get max sortOrder
  const { data: existing } = await supabase
    .from('project_images')
    .select('sortOrder')
    .eq('projectId', projectId)
    .order('sortOrder', { ascending: false })
    .limit(1);
  
  const sortOrder = (existing && existing[0] ? existing[0].sortOrder : 0) + 1;
  
  const { data, error } = await supabase
    .from('project_images')
    .insert({
      id,
      projectId,
      filename: url,
      caption,
      sortOrder,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProjectImage(id) {
  const { data, error } = await supabase
    .from('project_images')
    .delete()
    .eq('id', id)
    .select()
    .single();
  
  if (error) return null;
  return data;
}

export async function getAllProjectsWithImages() {
  const projects = await getAllProjects();
  return Promise.all(
    projects.map(async (p) => ({
      ...p,
      images: await getProjectImages(p.id),
    }))
  );
}

// ─── Experiences ──────────────────────────────────────────────────────────────

export async function getAllExperiences() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('sortOrder', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getExperienceById(id) {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return null;
  return data;
}

export async function createExperience(expData) {
  const id = generateId();
  const { data, error } = await supabase
    .from('experiences')
    .insert({
      id,
      title: expData.title,
      company: expData.company,
      location: expData.location || '',
      startDate: expData.startDate,
      endDate: expData.endDate || '',
      description: expData.description,
      type: expData.type || 'work',
      sortOrder: expData.sortOrder || 0,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateExperience(id, expData) {
  const { data, error } = await supabase
    .from('experiences')
    .update({
      title: expData.title,
      company: expData.company,
      location: expData.location || '',
      startDate: expData.startDate,
      endDate: expData.endDate || '',
      description: expData.description,
      type: expData.type || 'work',
      sortOrder: expData.sortOrder || 0,
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteExperience(id) {
  const { error } = await supabase.from('experiences').delete().eq('id', id);
  if (error) throw error;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getAllSettings() {
  const { data, error } = await supabase.from('settings').select('key, value');
  
  if (error) throw error;
  return Object.fromEntries((data || []).map((r) => [r.key, r.value]));
}

export async function upsertSetting(key, value) {
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' });
  
  if (error) throw error;
}

export async function upsertSettings(obj) {
  await Promise.all(Object.entries(obj).map(([k, v]) => upsertSetting(k, v)));
}
