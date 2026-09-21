'use client'

import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'identity', label: 'Intro' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [active, setActive] = useState('identity')
  const [menuOpen, setMenuOpen] = useState(false)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect() }
  }, [])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }

  return <>
    <header className={`nav ${stuck ? 'is-stuck' : ''}`}>
      <a className="brand" href="#identity" onClick={go('identity')} aria-label="Back to top">
        <span className="mono-badge">AS</span>
        <small>Abdul Shakoor Ansari</small>
      </a>
      <nav className="nav-links" aria-label="Sections">
        {SECTIONS.map((s) => <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined} onClick={go(s.id)}>{s.label}</a>)}
      </nav>
      <button className="menu-toggle" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-controls="mobile-nav">{menuOpen ? 'Close' : 'Menu'}</button>
    </header>
    {menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile sections">
      {SECTIONS.map((s) => <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined} onClick={go(s.id)}>{s.label}</a>)}
    </nav>}
  </>
}
