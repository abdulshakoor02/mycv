'use client'

import { useState } from 'react'
import type { Chapter } from '@/types/portfolio'

type EditorialNavProps = {
  chapters: Chapter[]
  activeIndex: number
  navigate: (index: number) => void
}

export default function EditorialNav({ chapters, activeIndex, navigate }: EditorialNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const go = (index: number) => {
    navigate(index)
    setMenuOpen(false)
  }

  return <>
    <header className="observatory-nav">
      <button className="brand-mark" onClick={() => go(0)} aria-label="Go to the beginning"><span>AS</span><small>ABDUL SHAKOOR ANSARI</small></button>
      <nav className="desktop-nav" aria-label="Chapter navigation">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={activeIndex === index ? 'step' : undefined} onClick={(event) => { event.preventDefault(); go(index) }}>{chapter.label}</a>)}</nav>
      <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-chapter-nav">{menuOpen ? 'CLOSE' : 'MENU'}</button>
    </header>
    {menuOpen && <nav id="mobile-chapter-nav" className="mobile-nav" aria-label="Mobile chapter navigation">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={activeIndex === index ? 'step' : undefined} onClick={(event) => { event.preventDefault(); go(index) }}>{String(index).padStart(2, '0')} / {chapter.label}</a>)}</nav>}
    <nav className="chapter-rail" aria-label="Chapter progress">{chapters.map((chapter, index) => <button key={chapter.id} className={activeIndex === index ? 'active' : ''} onClick={() => go(index)} aria-label={`Go to ${chapter.label}`} aria-current={activeIndex === index ? 'step' : undefined} />)}</nav>
  </>
}
