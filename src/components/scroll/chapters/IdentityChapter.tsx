import { ChevronDown } from 'lucide-react'
import { profile, chapters } from '@/components/content/profile'
import ChapterReveal from '../ChapterReveal'
import ChapterSection from '../ChapterSection'

type IdentityChapterProps = {
  navigate: (index: number) => void
}

export default function IdentityChapter({ navigate }: IdentityChapterProps) {
  return <ChapterSection chapter={chapters[0]} index={0} className="identity-section">
    <div className="story-content identity-content">
      <ChapterReveal><p className="eyebrow">{chapters[0].eyebrow}</p></ChapterReveal>
      <ChapterReveal delay={70}><h1>{chapters[0].title}</h1></ChapterReveal>
      <ChapterReveal delay={140}><p className="lede">{chapters[0].summary}</p></ChapterReveal>
      <ChapterReveal delay={210} className="identity-meta"><div><span>{profile.name}</span><span>{profile.role} · {profile.location}</span></div></ChapterReveal>
      <ChapterReveal delay={280}><a className="scroll-cue" href="#leadership" onClick={(event) => { event.preventDefault(); navigate(1) }}>SCROLL TO EXPLORE <ChevronDown size={15} /></a></ChapterReveal>
    </div>
  </ChapterSection>
}
