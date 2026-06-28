/**
 * db.js — dual-mode database adapter
 *
 * Production (Vercel):  DATABASE_URL set  → Neon serverless Postgres
 * Local dev:            DATABASE_URL unset → SQLite via better-sqlite3
 *
 * All exported functions are async so callers never need to change.
 */

const USE_POSTGRES = !!process.env.DATABASE_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ─── Postgres adapter (Neon) ──────────────────────────────────────────────────

let _neon = null;
function getNeon() {
  if (!_neon) {
    const { neon } = require('@neondatabase/serverless');
    _neon = neon(process.env.DATABASE_URL);
  }
  return _neon;
}

// ─── SQLite adapter ───────────────────────────────────────────────────────────

let _sqlite = null;
function getSqlite() {
  if (!_sqlite) {
    const Database = require('better-sqlite3');
    const path = require('path');
    const fs = require('fs');
    const dbPath = path.join(process.cwd(), 'data', 'portfolio.db');
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    _sqlite = new Database(dbPath);
    _sqlite.pragma('journal_mode = WAL');
    initSqlite(_sqlite);
  }
  return _sqlite;
}

function initSqlite(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL,
      imageUrl TEXT DEFAULT '', techStack TEXT DEFAULT '',
      liveUrl TEXT DEFAULT '', githubUrl TEXT DEFAULT '',
      featured INTEGER DEFAULT 0, sortOrder INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')), updatedAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS experiences (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, company TEXT NOT NULL,
      location TEXT DEFAULT '', startDate TEXT NOT NULL, endDate TEXT DEFAULT '',
      description TEXT NOT NULL, type TEXT DEFAULT 'work', sortOrder INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')), updatedAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS project_images (
      id TEXT PRIMARY KEY, projectId TEXT NOT NULL, filename TEXT NOT NULL,
      caption TEXT DEFAULT '', sortOrder INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY, value TEXT NOT NULL,
      updatedAt TEXT DEFAULT (datetime('now'))
    );
  `);

  if (db.prepare('SELECT COUNT(*) as c FROM projects').get().c === 0) seedSqliteData(db);
  if (db.prepare('SELECT COUNT(*) as c FROM settings').get().c === 0) seedSqliteSettings(db);
}

function seedSqliteSettings(db) {
  const ins = db.prepare(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`);
  const tx  = db.transaction(() => {
    for (const [k, v] of DEFAULT_SETTINGS) ins.run(k, v);
  });
  tx();
}

function seedSqliteData(db) {
  const ip = db.prepare(`INSERT INTO projects (id,title,description,imageUrl,techStack,liveUrl,githubUrl,featured,sortOrder) VALUES (?,?,?,?,?,?,?,?,?)`);
  const ie = db.prepare(`INSERT INTO experiences (id,title,company,location,startDate,endDate,description,type,sortOrder) VALUES (?,?,?,?,?,?,?,?,?)`);
  const tx = db.transaction(() => {
    for (const p of SEED_PROJECTS)     ip.run(generateId(), p.title, p.description, '', p.techStack, p.liveUrl, p.githubUrl, p.featured, p.sortOrder);
    for (const e of SEED_EXPERIENCES)  ie.run(generateId(), e.title, e.company, e.location, e.startDate, e.endDate, e.description, e.type, e.sortOrder);
  });
  tx();
}

// ─── Seed data constants ──────────────────────────────────────────────────────

const DEFAULT_SETTINGS = [
  ['about_paragraph1', "Hello! I'm a full-stack developer with a passion for creating beautiful, functional, and user-centered digital experiences."],
  ['about_paragraph2', 'With expertise in modern web technologies, I specialize in building responsive web applications that deliver exceptional performance.'],
  ['about_paragraph3', "When I'm not coding, you can find me exploring new technologies or enjoying a good cup of coffee ☕"],
  ['about_info_location',   '🌍 Remote'],
  ['about_info_experience', '3+ Years'],
  ['about_info_speciality', 'Full-Stack'],
  ['about_info_status',     '✅ Available'],
  ['about_photo',           '/foto/profil.jpeg'],
  ['hero_label',            'Available for opportunities'],
  ['hero_title_line1',      'I build things'],
  ['hero_title_line2',      'for the web.'],
  ['hero_subtitle',         'A passionate full-stack developer specializing in building exceptional digital experiences.'],
  ['contact_description',   "I'm always open to discussing new projects and creative ideas. Let's build something great together!"],
];

const SEED_PROJECTS = [
  { title: 'E-Commerce Platform',  description: 'Full-stack e-commerce platform with real-time inventory, payments, and admin dashboard.', techStack: 'Next.js,React,Node.js,PostgreSQL,Stripe',  liveUrl: 'https://example.com', githubUrl: 'https://github.com', featured: 1, sortOrder: 1 },
  { title: 'AI Task Manager',      description: 'Smart task management powered by AI with natural language processing for task creation.', techStack: 'React,Python,FastAPI,OpenAI,MongoDB',          liveUrl: 'https://example.com', githubUrl: 'https://github.com', featured: 1, sortOrder: 2 },
  { title: 'Real-Time Chat App',   description: 'Feature-rich messaging platform with file sharing, video calls, and end-to-end encryption.', techStack: 'React,Socket.io,Express,Redis,WebRTC',    liveUrl: 'https://example.com', githubUrl: 'https://github.com', featured: 1, sortOrder: 3 },
  { title: 'Weather Dashboard',    description: 'Weather visualization with interactive maps, 7-day forecasts, and historical data.', techStack: 'Vue.js,D3.js,Node.js,OpenWeather API',             liveUrl: 'https://example.com', githubUrl: 'https://github.com', featured: 0, sortOrder: 4 },
];

const SEED_EXPERIENCES = [
  { title: 'Senior Frontend Developer', company: 'Tech Corp',        location: 'San Francisco, CA', startDate: '2023-01', endDate: '',        description: 'Leading frontend architecture and mentoring junior developers.', type: 'work',      sortOrder: 1 },
  { title: 'Full Stack Developer',      company: 'StartupXYZ',       location: 'Remote',            startDate: '2021-06', endDate: '2022-12', description: 'Built and maintained multiple web apps, improved performance by 40%.', type: 'work', sortOrder: 2 },
  { title: 'Junior Web Developer',      company: 'Digital Agency',   location: 'New York, NY',      startDate: '2020-01', endDate: '2021-05', description: 'Built responsive websites for various clients in an agile team.', type: 'work',      sortOrder: 3 },
  { title: 'Bachelor of Computer Science', company: 'State University', location: 'California',    startDate: '2016-08', endDate: '2020-05', description: 'Graduated with honors, focused on software engineering and web tech.', type: 'education', sortOrder: 4 },
];

// ─── Unified query helpers ────────────────────────────────────────────────────

// Run a Postgres query OR a SQLite prepared statement
// pgFn  : (sql) => Promise<rows[]>   — receives the neon tagged-template function
// sqlFn : (db)  => any               — receives the better-sqlite3 db instance
async function query(pgFn, sqlFn) {
  if (USE_POSTGRES) {
    return pgFn(getNeon());
  }
  return sqlFn(getSqlite());
}

// ─── Init (Postgres only — SQLite auto-inits in getSqlite()) ─────────────────

export async function initDb() {
  if (!USE_POSTGRES) return { ok: true, mode: 'sqlite' };
  const db = getNeon();
  await db`CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL,
    "imageUrl" TEXT DEFAULT '', "techStack" TEXT DEFAULT '',
    "liveUrl" TEXT DEFAULT '', "githubUrl" TEXT DEFAULT '',
    featured INTEGER DEFAULT 0, "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT now(), "updatedAt" TIMESTAMPTZ DEFAULT now()
  )`;
  await db`CREATE TABLE IF NOT EXISTS experiences (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, company TEXT NOT NULL,
    location TEXT DEFAULT '', "startDate" TEXT NOT NULL, "endDate" TEXT DEFAULT '',
    description TEXT NOT NULL, type TEXT DEFAULT 'work', "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT now(), "updatedAt" TIMESTAMPTZ DEFAULT now()
  )`;
  await db`CREATE TABLE IF NOT EXISTS project_images (
    id TEXT PRIMARY KEY, "projectId" TEXT NOT NULL, filename TEXT NOT NULL,
    caption TEXT DEFAULT '', "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT now()
  )`;
  await db`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY, value TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT now()
  )`;

  const [{ count }] = await db`SELECT COUNT(*)::int AS count FROM settings`;
  if (count === 0) {
    for (const [k, v] of DEFAULT_SETTINGS)
      await db`INSERT INTO settings (key, value) VALUES (${k}, ${v}) ON CONFLICT (key) DO NOTHING`;
  }
  const [{ pcount }] = await db`SELECT COUNT(*)::int AS pcount FROM projects`;
  if (pcount === 0) {
    for (const p of SEED_PROJECTS)
      await db`INSERT INTO projects (id,title,description,"imageUrl","techStack","liveUrl","githubUrl",featured,"sortOrder")
               VALUES (${generateId()},${p.title},${p.description},'',${p.techStack},${p.liveUrl},${p.githubUrl},${p.featured},${p.sortOrder})`;
    for (const e of SEED_EXPERIENCES)
      await db`INSERT INTO experiences (id,title,company,location,"startDate","endDate",description,type,"sortOrder")
               VALUES (${generateId()},${e.title},${e.company},${e.location},${e.startDate},${e.endDate},${e.description},${e.type},${e.sortOrder})`;
  }
  return { ok: true, mode: 'postgres' };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getAllProjects() {
  return query(
    db => db`SELECT * FROM projects ORDER BY "sortOrder" ASC`,
    db => db.prepare('SELECT * FROM projects ORDER BY sortOrder ASC').all()
  );
}

export async function getProjectById(id) {
  return query(
    async db => { const r = await db`SELECT * FROM projects WHERE id = ${id}`; return r[0] ?? null; },
    db => db.prepare('SELECT * FROM projects WHERE id = ?').get(id) ?? null
  );
}

export async function createProject(data) {
  const id = generateId();
  await query(
    db => db`INSERT INTO projects (id,title,description,"imageUrl","techStack","liveUrl","githubUrl",featured,"sortOrder")
             VALUES (${id},${data.title},${data.description},${data.imageUrl||''},${data.techStack||''},
                    ${data.liveUrl||''},${data.githubUrl||''},${data.featured?1:0},${data.sortOrder||0})`,
    db => db.prepare(`INSERT INTO projects (id,title,description,imageUrl,techStack,liveUrl,githubUrl,featured,sortOrder) VALUES (?,?,?,?,?,?,?,?,?)`)
            .run(id, data.title, data.description, data.imageUrl||'', data.techStack||'', data.liveUrl||'', data.githubUrl||'', data.featured?1:0, data.sortOrder||0)
  );
  return getProjectById(id);
}

export async function updateProject(id, data) {
  await query(
    db => db`UPDATE projects SET title=${data.title},description=${data.description},"imageUrl"=${data.imageUrl||''},
             "techStack"=${data.techStack||''},"liveUrl"=${data.liveUrl||''},"githubUrl"=${data.githubUrl||''},
             featured=${data.featured?1:0},"sortOrder"=${data.sortOrder||0},"updatedAt"=now() WHERE id=${id}`,
    db => db.prepare(`UPDATE projects SET title=?,description=?,imageUrl=?,techStack=?,liveUrl=?,githubUrl=?,featured=?,sortOrder=?,updatedAt=datetime('now') WHERE id=?`)
            .run(data.title,data.description,data.imageUrl||'',data.techStack||'',data.liveUrl||'',data.githubUrl||'',data.featured?1:0,data.sortOrder||0,id)
  );
  return getProjectById(id);
}

export async function deleteProject(id) {
  await query(
    async db => { await db`DELETE FROM project_images WHERE "projectId"=${id}`; await db`DELETE FROM projects WHERE id=${id}`; },
    db => { db.prepare('DELETE FROM project_images WHERE projectId=?').run(id); db.prepare('DELETE FROM projects WHERE id=?').run(id); }
  );
}

// ─── Project Images ───────────────────────────────────────────────────────────

export async function getProjectImages(projectId) {
  return query(
    db => db`SELECT * FROM project_images WHERE "projectId"=${projectId} ORDER BY "sortOrder" ASC`,
    db => db.prepare('SELECT * FROM project_images WHERE projectId=? ORDER BY sortOrder ASC').all(projectId)
  );
}

export async function addProjectImage(projectId, url, caption = '') {
  const id = generateId();
  const sortOrder = await query(
    async db => { const r = await db`SELECT MAX("sortOrder") AS m FROM project_images WHERE "projectId"=${projectId}`; return (r[0]?.m ?? 0) + 1; },
    db => { const r = db.prepare('SELECT MAX(sortOrder) as m FROM project_images WHERE projectId=?').get(projectId); return (r?.m ?? 0) + 1; }
  );
  await query(
    db => db`INSERT INTO project_images (id,"projectId",filename,caption,"sortOrder") VALUES (${id},${projectId},${url},${caption},${sortOrder})`,
    db => db.prepare('INSERT INTO project_images (id,projectId,filename,caption,sortOrder) VALUES (?,?,?,?,?)').run(id,projectId,url,caption,sortOrder)
  );
  return { id, projectId, filename: url, caption, sortOrder };
}

export async function deleteProjectImage(id) {
  return query(
    async db => { const r = await db`SELECT * FROM project_images WHERE id=${id}`; await db`DELETE FROM project_images WHERE id=${id}`; return r[0]??null; },
    db => { const r = db.prepare('SELECT * FROM project_images WHERE id=?').get(id); db.prepare('DELETE FROM project_images WHERE id=?').run(id); return r??null; }
  );
}

export async function getAllProjectsWithImages() {
  const projects = await getAllProjects();
  return Promise.all(projects.map(async p => ({ ...p, images: await getProjectImages(p.id) })));
}

// ─── Experiences ──────────────────────────────────────────────────────────────

export async function getAllExperiences() {
  return query(
    db => db`SELECT * FROM experiences ORDER BY "sortOrder" ASC`,
    db => db.prepare('SELECT * FROM experiences ORDER BY sortOrder ASC').all()
  );
}

export async function getExperienceById(id) {
  return query(
    async db => { const r = await db`SELECT * FROM experiences WHERE id=${id}`; return r[0]??null; },
    db => db.prepare('SELECT * FROM experiences WHERE id=?').get(id) ?? null
  );
}

export async function createExperience(data) {
  const id = generateId();
  await query(
    db => db`INSERT INTO experiences (id,title,company,location,"startDate","endDate",description,type,"sortOrder")
             VALUES (${id},${data.title},${data.company},${data.location||''},${data.startDate},${data.endDate||''},${data.description},${data.type||'work'},${data.sortOrder||0})`,
    db => db.prepare(`INSERT INTO experiences (id,title,company,location,startDate,endDate,description,type,sortOrder) VALUES (?,?,?,?,?,?,?,?,?)`)
            .run(id,data.title,data.company,data.location||'',data.startDate,data.endDate||'',data.description,data.type||'work',data.sortOrder||0)
  );
  return getExperienceById(id);
}

export async function updateExperience(id, data) {
  await query(
    db => db`UPDATE experiences SET title=${data.title},company=${data.company},location=${data.location||''},
             "startDate"=${data.startDate},"endDate"=${data.endDate||''},description=${data.description},
             type=${data.type||'work'},"sortOrder"=${data.sortOrder||0},"updatedAt"=now() WHERE id=${id}`,
    db => db.prepare(`UPDATE experiences SET title=?,company=?,location=?,startDate=?,endDate=?,description=?,type=?,sortOrder=?,updatedAt=datetime('now') WHERE id=?`)
            .run(data.title,data.company,data.location||'',data.startDate,data.endDate||'',data.description,data.type||'work',data.sortOrder||0,id)
  );
  return getExperienceById(id);
}

export async function deleteExperience(id) {
  await query(
    db => db`DELETE FROM experiences WHERE id=${id}`,
    db => db.prepare('DELETE FROM experiences WHERE id=?').run(id)
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getAllSettings() {
  const rows = await query(
    db => db`SELECT key, value FROM settings`,
    db => db.prepare('SELECT key, value FROM settings').all()
  );
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}

export async function upsertSetting(key, value) {
  await query(
    db => db`INSERT INTO settings (key, value) VALUES (${key}, ${value})
             ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, "updatedAt"=now()`,
    db => db.prepare(`INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updatedAt=datetime('now')`).run(key, value)
  );
}

export async function upsertSettings(obj) {
  await Promise.all(Object.entries(obj).map(([k, v]) => upsertSetting(k, v)));
}
