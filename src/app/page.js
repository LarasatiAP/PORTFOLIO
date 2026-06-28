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
export const runtime = 'nodejs';

export default async function Home() {
  let projects = [];
  let experiences = [];
  let settings = {};
  let error = null;

  try {
    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please configure it in Vercel dashboard.');
    }

    [projects, experiences, settings] = await Promise.all([
      getAllProjectsWithImages(),
      getAllExperiences(),
      getAllSettings(),
    ]);
  } catch (err) {
    console.error('Database error:', err);
    error = err.message;
    
    // Return error page if database fails
    return (
      <main style={{ position: 'relative', zIndex: 1, padding: '2rem', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '4rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            ⚠️ Database Connection Error
          </h1>
          <div style={{ 
            background: '#fee2e2', 
            border: '1px solid #ef4444', 
            borderRadius: '0.5rem', 
            padding: '1rem', 
            marginBottom: '1rem',
            color: '#991b1b'
          }}>
            <strong>Error:</strong> {error}
          </div>
          
          <div style={{ 
            background: '#f3f4f6', 
            borderRadius: '0.5rem', 
            padding: '1.5rem',
            marginTop: '2rem' 
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              🔧 How to Fix:
            </h2>
            <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
              <li>Make sure <code style={{ background: '#e5e7eb', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>DATABASE_URL</code> is set (from Neon Postgres)</li>
              <li>Make sure <code style={{ background: '#e5e7eb', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>BLOB_READ_WRITE_TOKEN</code> is set (from Vercel Blob)</li>
              <li>Redeploy the project</li>
              <li>After deployment, initialize the database by visiting: 
                <code style={{ background: '#e5e7eb', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', display: 'block', marginTop: '0.5rem' }}>
                  https://your-site.vercel.app/api/init?secret=init-larasati-portfolio-2024
                </code>
              </li>
            </ol>
          </div>

          <details style={{ marginTop: '2rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', padding: '0.5rem', background: '#1f2937', color: '#fff', borderRadius: '0.25rem' }}>
              📋 Technical Details
            </summary>
            <pre style={{ 
              background: '#1f2937', 
              color: '#f3f4f6', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginTop: '0.5rem', 
              overflow: 'auto',
              fontSize: '0.875rem'
            }}>
              {JSON.stringify({ 
                error: error || 'Unknown error',
                hasDBUrl: !!process.env.DATABASE_URL,
                nodeEnv: process.env.NODE_ENV,
                timestamp: new Date().toISOString()
              }, null, 2)}
            </pre>
          </details>
        </div>
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
