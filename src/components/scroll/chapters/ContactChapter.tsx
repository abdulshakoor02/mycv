import { ArrowUpRight, Linkedin, Mail, MapPin } from 'lucide-react'
import { chapters, profile } from '@/components/content/profile'
import ChapterReveal from '../ChapterReveal'
import ChapterSection from '../ChapterSection'

export default function ContactChapter() {
  return <ChapterSection chapter={chapters[5]} index={5} className="contact-section contact-chapter">
    <div className="story-content">
      <ChapterReveal><p className="eyebrow">{chapters[5].eyebrow}</p></ChapterReveal>
      <ChapterReveal delay={70}><h2>{chapters[5].title}</h2></ChapterReveal>
      <ChapterReveal delay={140}><p>{chapters[5].summary}</p></ChapterReveal>
      <ChapterReveal delay={210}><div className="contact-actions"><a className="primary-action" href={`mailto:${profile.email}`}><Mail size={17} /> Email Abdulshakoor <ArrowUpRight size={16} /></a><a className="secondary-action" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> Connect on LinkedIn <ArrowUpRight size={16} /></a></div></ChapterReveal>
      <ChapterReveal delay={280}><div className="contact-location"><MapPin size={15} /> {profile.location} · Available for remote work</div></ChapterReveal>
    </div>
  </ChapterSection>
}
