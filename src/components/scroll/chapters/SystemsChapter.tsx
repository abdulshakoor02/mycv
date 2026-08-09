import { experiences } from '@/components/content/experience'
import { chapters } from '@/components/content/profile'
import ChapterReveal from '../ChapterReveal'
import ChapterSection from '../ChapterSection'

export default function SystemsChapter() {
  return <ChapterSection chapter={chapters[2]} index={2} className="split-section systems-chapter">
    <div className="story-content systems-intro">
      <ChapterReveal><p className="eyebrow">{chapters[2].eyebrow}</p></ChapterReveal>
      <ChapterReveal delay={70}><h2>{chapters[2].title}</h2></ChapterReveal>
      <ChapterReveal delay={140}><p>{chapters[2].summary}</p></ChapterReveal>
      <ChapterReveal delay={210}><div className="system-pills" aria-label="System areas">{['APIs', 'Services', 'Events', 'Data', 'Cloud'].map((item) => <span key={item}>{item}</span>)}</div></ChapterReveal>
    </div>
    <ol className="experience-stack" aria-label="Professional experience">{experiences.map((experience, index) => <ChapterReveal key={experience.id} delay={index * 55} as="li"><article><div className="experience-heading"><span>{experience.period}</span><span>{String(index + 1).padStart(2, '0')} / 04</span></div><h3>{experience.title}</h3><p>{experience.company} · {experience.location}</p><ul>{experience.description.map((item) => <li key={item}>{item}</li>)}</ul><small>{experience.technologies.join(' · ')}</small></article></ChapterReveal>)}</ol>
  </ChapterSection>
}
