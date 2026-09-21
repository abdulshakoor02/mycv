import Nav from '@/components/cv/Nav'
import Identity from '@/components/cv/Identity'
import Leadership from '@/components/cv/Leadership'
import Experience from '@/components/cv/Experience'
import Skills from '@/components/cv/Skills'
import Projects from '@/components/cv/Projects'
import Contact from '@/components/cv/Contact'
import Footer from '@/components/cv/Footer'

export default function Home() {
  return (
    <div className="shell">
      <a className="skip-link" href="#identity">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Identity />
        <Leadership />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
