import { projects } from '@/components/content/projects'
import { chapters } from '@/components/content/profile'
import ChapterReveal from '../ChapterReveal'
import ChapterSection from '../ChapterSection'

type ProjectsChapterProps = {
  activeProject: number | null
}

export default function ProjectsChapter({ activeProject }: ProjectsChapterProps) {
  return <ChapterSection chapter={chapters[4]} index={4} className="projects-section projects-chapter">
    <div className="story-content">
      <ChapterReveal><p className="eyebrow">{chapters[4].eyebrow}</p></ChapterReveal>
      <ChapterReveal delay={70}><h2>{chapters[4].title}</h2></ChapterReveal>
      <ChapterReveal delay={140}><p>{chapters[4].summary}</p></ChapterReveal>
    </div>
    <ol className="project-index" aria-label="Selected projects">{projects.map((project, index) => <ChapterReveal key={project.id} delay={index * 60} as="li" className={activeProject === index ? 'is-focused' : ''}><article><div className="project-heading"><span className="project-number">0{index + 1}</span><span>{activeProject === index ? 'IN VIEW' : 'FIELD NOTE'}</span><span className="project-period">{project.period}</span></div><h3>{project.title}</h3><p>{project.description}</p><p className="project-role">{project.role}</p><div className="tag-row" aria-label={`${project.title} technologies`}>{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div><ul className="project-features">{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><small>{project.impact}</small></article></ChapterReveal>)}</ol>
  </ChapterSection>
}
