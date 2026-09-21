'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'article' | 'section'
}

/** Lightweight scroll-in reveal. Adds .reveal, flips to .is-visible when in view.
 *  Respects prefers-reduced-motion (renders immediately, no transition). */
export default function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return // already visible by default; nothing to do
    el.classList.add('reveal-armed') // opt in to hidden-then-reveal only when JS + motion are available
    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`)
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      el.classList.add('is-visible')
      io.disconnect()
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  const Tag = as as 'div'
  const style = (delay ? { '--reveal-delay': `${delay}ms` } : undefined) as CSSProperties | undefined
  return <Tag ref={ref as never} style={style} className={`reveal ${className}`}>{children}</Tag>
}
