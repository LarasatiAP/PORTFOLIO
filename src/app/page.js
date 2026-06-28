import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { getAllProjectsWithImages, getAllExperiences, getAllSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let projects = [];
  let experiences = [];
  let settings = {};
  let error = null;

  try {
    [projects, experiences, settings] = await Promise.all([
      getAllProjectsWithImages(),
      getAllExperiences(),
      getAllSettings(),
    ]);
  } catch (err) {
    console.error('Database error:', err);
    error = err.message;
  }

  // If there's a database error, show a user-friendly error page
  if (error) {
    return (
      <main style={{ position: 'relative', zIndex: 1, padding: '2rem', textAlign: 'center' }}>
        <h1>Database Connection Error</h1>
        <p style={{ color: '#ef4444', marginTop: '1rem' }}>
          {error}
        </p>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>
          The database might not be initialized yet. Please contact the site administrator.
        </p>
        <details style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px', margin: '2rem auto' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Technical Details</summary>
          <pre style={{ background: '#1f2937', color: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', overflow: 'auto' }}>
            {JSON.stringify({ 
              error, 
              hasDBUrl: !!process.env.DATABASE_URL,
              nodeEnv: process.env.NODE_ENV 
            }, null, 2)}
          </pre>
        </details>
      </main>
    );
  }

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <Navbar />
      <Hero settings={settings} />
      <About settings={settings} />
      <Projects projects={projects} />
      <Experience experiences={experiences} />
      <Skills />
      <Contact />
      <Footer />
    </main>
  );
}
