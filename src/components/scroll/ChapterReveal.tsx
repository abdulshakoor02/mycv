'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'

type ChapterRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li'
}

export default function ChapterReveal({ children, className = '', delay = 0, as = 'div' }: ChapterRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    element.classList.add('reveal-ready')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      element.classList.add('is-visible')
      return
    }
    if (delay) element.style.setProperty('--reveal-delay', `${delay}ms`)
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      element.classList.add('is-visible')
      observer.disconnect()
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [delay])

  const content = <>{children}</>
  if (as === 'li') return <li ref={ref as RefObject<HTMLLIElement>} className={`chapter-reveal ${className}`} data-reveal>{content}</li>
  return <div ref={ref as RefObject<HTMLDivElement>} className={`chapter-reveal ${className}`} data-reveal>{content}</div>
}
