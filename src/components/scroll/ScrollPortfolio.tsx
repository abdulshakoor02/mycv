'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, ChevronDown, Github, Linkedin, Mail, MapPin } from 'lucide-react'
import ScrollWorld from '@/components/world/ScrollWorld'
import { useScrollWorld } from './useScrollWorld'
import { chapters } from '@/types/portfolio'
import { experiences } from '@/components/content/experience'
import { skillCategories } from '@/components/content/skills'
import { projects } from '@/components/content/projects'
import { profile } from '@/components/content/profile'

export default function ScrollPortfolio() {
  const { state, goToChapter } = useScrollWorld()
  const [menuOpen, setMenuOpen] = useState(false)
  const [webgl, setWebgl] = useState(true)

  useEffect(() => {
    try { const canvas = document.createElement('canvas'); setWebgl(Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))) } catch { setWebgl(false) }
  }, [])

  const navigate = (index: number) => { goToChapter(index); setMenuOpen(false) }
  return <div className="observatory-shell">
    {webgl && <ScrollWorld state={state} />}
    <header className="observatory-nav">
      <button className="brand-mark" onClick={() => navigate(0)} aria-label="Go to the beginning"><span>AS</span><small>SYSTEMS OBSERVATORY</small></button>
      <nav className="desktop-nav" aria-label="Chapter navigation">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={state.index === index ? 'page' : undefined} onClick={(event) => { event.preventDefault(); navigate(index) }}>{chapter.label}</a>)}</nav>
      <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle chapter menu">{menuOpen ? 'CLOSE' : 'MENU'}</button>
    </header>
    {menuOpen && <nav className="mobile-nav" aria-label="Mobile chapter navigation">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} onClick={(event) => { event.preventDefault(); navigate(index) }}>{String(index).padStart(2, '0')} / {chapter.label}</a>)}</nav>}
    <div className="chapter-rail" aria-label="Chapter progress">{chapters.map((chapter, index) => <button key={chapter.id} className={state.index === index ? 'active' : ''} onClick={() => navigate(index)} aria-label={`Go to ${chapter.label}`} />)}</div>
    <main>
      <section id="identity" data-cam="identity" className="story-section identity-section">
        <div className="story-content identity-content"><p className="eyebrow">{chapters[0].eyebrow}</p><h1>{chapters[0].title}</h1><p className="lede">{chapters[0].summary}</p><div className="identity-meta"><span>{profile.name}</span><span>{profile.role} · {profile.location}</span></div><a className="scroll-cue" href="#leadership" onClick={(event) => { event.preventDefault(); navigate(1) }}>{'SCROLL TO EXPLORE'} <ChevronDown size={15} /></a></div><span className="chapter-index">00</span>
      </section>
      <section id="leadership" data-cam="leadership" className="story-section split-section"><div className="story-content"><p className="eyebrow">{chapters[1].eyebrow}</p><h2>{chapters[1].title}</h2><p>{chapters[1].summary}</p><div className="leadership-list"><span>01 / SHAPE THE QUESTION</span><span>02 / DESIGN THE BOUNDARY</span><span>03 / REVIEW THE SIGNAL</span><span>04 / DELIVER THE OUTCOME</span></div></div><div className="stats-panel"><strong>04</strong><span>roles across software teams</span><strong>06+</strong><span>layers considered in a system</span><strong>01</strong><span>shared path from idea to operation</span></div><span className="chapter-index">01</span></section>
      <section id="systems" data-cam="systems" className="story-section split-section"><div className="story-content"><p className="eyebrow">{chapters[2].eyebrow}</p><h2>{chapters[2].title}</h2><p>{chapters[2].summary}</p><div className="system-pills">{['APIs', 'Services', 'Events', 'Data', 'Cloud'].map((item) => <span key={item}>{item}</span>)}</div></div><div className="experience-stack">{experiences.slice(0, 3).map((experience) => <article key={experience.id}><span>{experience.period}</span><h3>{experience.title}</h3><p>{experience.company}</p><small>{experience.technologies.join(' · ')}</small></article>)}</div><span className="chapter-index">02</span></section>
      <section id="engineering" data-cam="engineering" className="story-section engineering-section"><div className="story-content"><p className="eyebrow">{chapters[3].eyebrow}</p><h2>{chapters[3].title}</h2><p>{chapters[3].summary}</p></div><div className="layer-grid">{skillCategories.map((category) => <article key={category.name}><span className="layer-number">0{skillCategories.indexOf(category) + 1}</span><h3>{category.name}</h3><div>{category.skills.slice(0, 4).map((skill) => <span key={skill.name}>{skill.name}</span>)}</div></article>)}</div><span className="chapter-index">03</span></section>
      <section id="projects" data-cam="projects" className="story-section projects-section"><div className="story-content"><p className="eyebrow">{chapters[4].eyebrow}</p><h2>{chapters[4].title}</h2><p>{chapters[4].summary}</p></div><div className="project-grid">{projects.map((project, index) => <article key={project.id} className={state.index === 4 && state.localExact > index / projects.length && state.localExact < (index + 1) / projects.length ? 'focused' : ''}><span className="project-number">0{index + 1}</span><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.technologies.slice(0, 4).map((technology) => <span key={technology}>{technology}</span>)}</div><small>{project.impact}</small></article>)}</div><span className="chapter-index">04</span></section>
      <section id="contact" data-cam="contact" className="story-section contact-section"><div className="story-content"><p className="eyebrow">{chapters[5].eyebrow}</p><h2>{chapters[5].title}</h2><p>{chapters[5].summary}</p><div className="contact-actions"><a className="primary-action" href={`mailto:${profile.email}`}><Mail size={17} /> Email Abdulshakoor <ArrowUpRight size={16} /></a><a className="secondary-action" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> Connect on LinkedIn <ArrowUpRight size={16} /></a></div><div className="contact-location"><MapPin size={15} /> {profile.location} · Available for remote work</div></div><span className="chapter-index">05</span></section>
    </main>
    <footer className="observatory-footer"><div><strong>{profile.name}</strong><p>Software engineering across systems, interfaces, and delivery.</p></div><div><a href={`mailto:${profile.email}`}><Mail size={14} /> Email</a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={14} /> LinkedIn</a></div><div className="footer-note"><Github size={14} /> Built as an original Systems Observatory · {new Date().getFullYear()}</div></footer>
    {!webgl && <div className="webgl-notice" role="status">The animated observatory is unavailable. The complete portfolio remains available in this document.</div>}
  </div>
}

void Mail
void Linkedin
void Github
void MapPin
void ArrowUpRight
void ChevronDown
void projects
void skillCategories
void chapters
void experiences
void profile
