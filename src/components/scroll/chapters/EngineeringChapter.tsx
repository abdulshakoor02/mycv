import { skillCategories, totalExperienceLabel } from '@/types/portfolio'
import { chapters } from '@/components/content/profile'
import ChapterReveal from '../ChapterReveal'
import ChapterSection from '../ChapterSection'

export default function EngineeringChapter() {
  return <ChapterSection chapter={chapters[3]} index={3} className="engineering-section engineering-chapter">
    <div className="story-content">
      <ChapterReveal><p className="eyebrow">{chapters[3].eyebrow}</p></ChapterReveal>
      <ChapterReveal delay={70}><h2>{chapters[3].title}</h2></ChapterReveal>
      <ChapterReveal delay={140}><p>{chapters[3].summary}</p></ChapterReveal>
      <ChapterReveal delay={210}><p className="engineering-note">The stack is connected by the decisions between its layers. — {totalExperienceLabel}</p></ChapterReveal>
    </div>
    <ol className="layer-grid" aria-label="Engineering skills">{skillCategories.map((category, index) => <ChapterReveal key={category.name} delay={index * 70} as="li"><article><span className="layer-number">0{index + 1}</span><h3>{category.name}</h3><ul>{category.skills.map((skill) => <li key={skill.name} title={skill.proficiency}>{skill.name}<span className="skill-proficiency">{skill.proficiency}</span></li>)}</ul></article></ChapterReveal>)}</ol>
  </ChapterSection>
}
