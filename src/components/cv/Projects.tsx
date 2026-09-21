import { projects } from '@/types/portfolio'
import Reveal from './Reveal'

export default function Projects() {
  return (
    <section id="projects" className="section">
      <Reveal className="section-head">
        <p className="eyebrow">Selected Work</p>
        <h2>Systems built for real operational weight.</h2>
        <p>A few examples of software that moved information, decisions, and people through the world.</p>
      </Reveal>
      <div className="project-grid">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 70}>
            <article className="card project-card">
              <span className="project-num">0{i + 1}</span>
              <h3>{p.title}</h3>
              {p.role && <p className="project-role">{p.role}{p.period ? ` · ${p.period}` : ''}</p>}
              <p>{p.description}</p>
              <ul className="project-features">
                {p.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <p className="project-impact">{p.impact}</p>
              <div className="project-tags">
                {p.technologies.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
