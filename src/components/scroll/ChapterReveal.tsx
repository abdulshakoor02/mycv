'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'

type ChapterRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li'
}

/* Split a heading's text into masked words so it arrives at a reading pace.
   The original phrase stays as the accessible label; the visual word wrappers
   are presentational. */
function splitHeadingWords(element: HTMLElement) {
  const headings = element.querySelectorAll<HTMLElement>('h1, h2')
  headings.forEach((heading) => {
    if (heading.dataset.wordReady === 'true') return
    const phrase = heading.textContent?.replace(/\s+/g, ' ').trim()
    if (!phrase) return
    heading.dataset.wordReady = 'true'
    heading.classList.add('word-reveal')
    heading.setAttribute('aria-label', phrase)
    heading.textContent = ''
    phrase.split(' ').forEach((word, index) => {
      if (index) heading.appendChild(document.createTextNode(' '))
      const mask = document.createElement('span')
      const inner = document.createElement('span')
      mask.className = 'word-mask'
      mask.setAttribute('aria-hidden', 'true')
      inner.className = 'word'
      inner.textContent = word
      inner.style.setProperty('--word-delay', `${index * 72}ms`)
      mask.appendChild(inner)
      heading.appendChild(mask)
    })
  })
}

export default function ChapterReveal({ children, className = '', delay = 0, as = 'div' }: ChapterRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    element.classList.add('reveal-ready')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reducedMotion) splitHeadingWords(element)
    if (reducedMotion) {
      element.classList.add('is-visible')
      return
    }
    if (delay) element.style.setProperty('--reveal-delay', `${delay}ms`)
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      element.classList.add('is-visible')
      observer.disconnect()
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.04 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [delay])

  const content = <>{children}</>
  if (as === 'li') return <li ref={ref as RefObject<HTMLLIElement>} className={`chapter-reveal ${className}`} data-reveal>{content}</li>
  return <div ref={ref as RefObject<HTMLDivElement>} className={`chapter-reveal ${className}`} data-reveal>{content}</div>
}
