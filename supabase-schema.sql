-- Portfolio Database Schema untuk Supabase
-- Jalankan script ini di Supabase SQL Editor

-- Table: projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "imageUrl" TEXT DEFAULT '',
  "techStack" TEXT DEFAULT '',
  "liveUrl" TEXT DEFAULT '',
  "githubUrl" TEXT DEFAULT '',
  featured INTEGER DEFAULT 0,
  "sortOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- Table: experiences
CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT '',
  "startDate" TEXT NOT NULL,
  "endDate" TEXT DEFAULT '',
  description TEXT NOT NULL,
  type TEXT DEFAULT 'work',
  "sortOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- Table: project_images
CREATE TABLE IF NOT EXISTS project_images (
  id TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  filename TEXT NOT NULL,
  caption TEXT DEFAULT '',
  "sortOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Table: settings
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- Indexes untuk performance
CREATE INDEX IF NOT EXISTS idx_projects_sortOrder ON projects("sortOrder");
CREATE INDEX IF NOT EXISTS idx_experiences_sortOrder ON experiences("sortOrder");
CREATE INDEX IF NOT EXISTS idx_project_images_projectId ON project_images("projectId");
