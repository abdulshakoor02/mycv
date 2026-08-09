import { chapters } from '@/components/content/profile'
import ChapterReveal from '../ChapterReveal'
import ChapterSection from '../ChapterSection'

const leadershipSteps = [
  ['01', 'Shape the question'],
  ['02', 'Design the boundary'],
  ['03', 'Review the signal'],
  ['04', 'Deliver the outcome'],
]

export default function LeadershipChapter() {
  return <ChapterSection chapter={chapters[1]} index={1} className="split-section leadership-chapter">
    <div className="story-content">
      <ChapterReveal><p className="eyebrow">{chapters[1].eyebrow}</p></ChapterReveal>
      <ChapterReveal delay={70}><h2>{chapters[1].title}</h2></ChapterReveal>
      <ChapterReveal delay={140}><p>{chapters[1].summary}</p></ChapterReveal>
      <ol className="leadership-list" aria-label="Leadership approach">{leadershipSteps.map(([number, label], index) => <ChapterReveal key={label} delay={180 + index * 50} as="li"><span>{number}</span><strong>{label}</strong></ChapterReveal>)}</ol>
    </div>
    <ChapterReveal className="stats-panel" delay={160}>
      <strong>04</strong><span>roles across software teams</span>
      <strong>06+</strong><span>layers considered in a system</span>
      <strong>01</strong><span>shared path from idea to operation</span>
    </ChapterReveal>
  </ChapterSection>
}
