import type { CSSProperties, ReactNode } from 'react'
import type { Chapter } from '@/types/portfolio'

type ChapterSectionProps = {
  chapter: Chapter
  index: number
  className?: string
  children: ReactNode
}

export default function ChapterSection({ chapter, index, className = '', children }: ChapterSectionProps) {
  return <section id={chapter.id} data-cam={chapter.id} data-chapter={chapter.id} className={`story-section chapter-section chapter-${chapter.id} ${className}`} style={{ '--chapter-accent': `var(--chapter-${chapter.id})` } as CSSProperties}>
    {children}
    <span className="chapter-index" aria-hidden="true">{String(index).padStart(2, '0')}</span>
  </section>
}
