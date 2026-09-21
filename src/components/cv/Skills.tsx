import { skillCategories } from '@/types/portfolio'
import type { Skill } from '@/types/portfolio'
import Reveal from './Reveal'

/** Map a proficiency label to a 5-dot rating (single consistent meter). */
const toDots = (proficiency: Skill['proficiency']) =>
  proficiency === 'Leading' ? 5 : proficiency === 'Proficient' ? 4 : 3

export default function Skills() {
  return (
    <section id="skills" className="section">
      <Reveal className="section-head">
        <p className="eyebrow">Full-Stack Craft</p>
        <h2>A practical view across the entire stack.</h2>
        <p>APIs, interfaces, persistence, cloud delivery, and observability are one connected engineering problem.</p>
      </Reveal>
      <div className="skill-grid">
        {skillCategories.map((cat, i) => (
          <Reveal key={cat.name} delay={i * 70}>
            <div className="card skill-card">
              <div className="head">
                <span className="knum">0{i + 1}</span>
                <h3>{cat.name}</h3>
              </div>
              <ul className="skill-list">
                {cat.skills.map((s) => {
                  const on = toDots(s.proficiency)
                  return (
                    <li key={s.name}>
                      <span className="sname">{s.name}</span>
                      <span className="dots" role="img" aria-label={`${s.name}: ${s.proficiency} (${on} out of 5)`}>
                        {Array.from({ length: 5 }, (_, d) => <i key={d} className={d < on ? 'on' : ''} />)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
