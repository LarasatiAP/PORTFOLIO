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
  const [projects, experiences, settings] = await Promise.all([
    getAllProjectsWithImages(),
    getAllExperiences(),
    getAllSettings(),
  ]);

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
