'use client'

import { Github, Linkedin, Mail } from 'lucide-react'
import { useWebGLSupport } from './webgl-store'
import EditorialNav from './EditorialNav'
import { useScrollWorld } from './useScrollWorld'
import ScrollWorld from '@/components/world/ScrollWorld'
import { chapters, profile } from '@/components/content/profile'
import IdentityChapter from './chapters/IdentityChapter'
import LeadershipChapter from './chapters/LeadershipChapter'
import SystemsChapter from './chapters/SystemsChapter'
import EngineeringChapter from './chapters/EngineeringChapter'
import ProjectsChapter from './chapters/ProjectsChapter'
import ContactChapter from './chapters/ContactChapter'

export default function ScrollPortfolio() {
  const { state, store, goToChapter } = useScrollWorld()
  const webgl = useWebGLSupport()

  const navigate = (index: number) => {
    goToChapter(index)
    window.history.replaceState(null, '', `#${chapters[index].id}`)
  }

  return <div className="observatory-shell" data-active-chapter={chapters[state.index].id} style={{ '--chapter-accent': `var(--chapter-${chapters[state.index].id})` } as React.CSSProperties}>
    <a className="skip-link" href="#identity">Skip to portfolio content</a>
    {webgl !== null && <ScrollWorld store={store} enabled={webgl} />}
    <EditorialNav chapters={chapters} activeIndex={state.index} navigate={navigate} />
    <main id="main-content">
      <IdentityChapter navigate={navigate} />
      <LeadershipChapter />
      <SystemsChapter />
      <EngineeringChapter />
      <ProjectsChapter activeProject={state.projectIndex} />
      <ContactChapter />
    </main>
    <footer className="observatory-footer">
      <div><strong>{profile.name}</strong><p>Software engineering across systems, interfaces, and delivery.</p></div>
      <div><a href={`mailto:${profile.email}`}><Mail size={14} /> Email</a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={14} /> LinkedIn</a></div>
      <div className="footer-note"><Github size={14} /> Original Systems Field Guide · {new Date().getFullYear()}</div>
    </footer>
    {webgl === false && <div className="webgl-notice" role="status">The complete portfolio is available in this document.</div>}
  </div>
}
