import Hero from '@/components/sections/Hero'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Contact from '@/components/sections/Contact'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div id="home">
        <Hero />
      </div>
      
      <div id="experience">
        <Experience />
      </div>
      
      <div id="skills">
        <Skills />
      </div>
      
      <div id="projects">
        <Projects />
      </div>
      
      <div id="contact">
        <Contact />
      </div>
      
      <Footer />
    </main>
  );
}