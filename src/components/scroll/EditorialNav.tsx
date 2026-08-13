'use client'

import { useEffect, useRef, useState } from 'react'
import type { Chapter } from '@/types/portfolio'

type EditorialNavProps = {
  chapters: Chapter[]
  activeIndex: number
  navigate: (index: number) => void
}

export default function EditorialNav({ chapters, activeIndex, navigate }: EditorialNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const go = (index: number) => {
    navigate(index)
    setMenuOpen(false)
  }

  /* hide the bar on scroll-down, reveal on scroll-up (Kage nav behaviour) */
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const el = headerRef.current
      if (!el) return
      el.classList.toggle('is-stuck', y > 40)
      if (!menuOpen && y > last + 4 && y > window.innerHeight * 0.8) el.classList.add('is-hidden')
      else if (y < last - 4 || y <= window.innerHeight * 0.8) el.classList.remove('is-hidden')
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  return <>
    <header ref={headerRef} className="observatory-nav">
      <button className="brand-mark" onClick={() => go(0)} aria-label="Go to the beginning"><span>AS</span><small>ABDUL SHAKOOR ANSARI</small></button>
      <nav className="desktop-nav" aria-label="Chapter navigation">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={activeIndex === index ? 'step' : undefined} onClick={(event) => { event.preventDefault(); go(index) }}>{chapter.label}</a>)}</nav>
      <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-chapter-nav">{menuOpen ? 'CLOSE' : 'MENU'}</button>
    </header>
    {menuOpen && <nav id="mobile-chapter-nav" className="mobile-nav" aria-label="Mobile chapter navigation">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={activeIndex === index ? 'step' : undefined} onClick={(event) => { event.preventDefault(); go(index) }}>{String(index).padStart(2, '0')} / {chapter.label}</a>)}</nav>}
  </>
}
