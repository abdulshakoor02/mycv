import { experiences } from '@/types/portfolio'
import Reveal from './Reveal'

export default function Experience() {
  return (
    <section id="experience" className="section">
      <Reveal className="section-head">
        <p className="eyebrow">Professional Experience</p>
        <h2>Services, events, and data with a reason to exist.</h2>
        <p>Backend systems are strongest when their boundaries, contracts, and operational behavior are explicit.</p>
      </Reveal>
      <ol className="timeline" aria-label="Professional experience">
        {experiences.map((xp, i) => (
          <Reveal as="li" key={xp.id} delay={i * 60}>
            <span className="node" aria-hidden="true" />
            <article className="card xp-card">
              <div className="xp-top">
                <span className="year-pill">{xp.period}</span>
                <span className="xp-count">{String(i + 1).padStart(2, '0')} / {String(experiences.length).padStart(2, '0')}</span>
              </div>
              <h3>{xp.title}</h3>
              <p className="xp-org">{xp.company} · {xp.location}</p>
              <ul>
                {xp.description.map((d) => <li key={d}>{d}</li>)}
              </ul>
              <div className="xp-tags">
                {xp.technologies.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
            </article>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
