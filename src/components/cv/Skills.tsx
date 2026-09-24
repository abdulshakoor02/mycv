import { skillCategories } from '@/types/portfolio'
import Reveal from './Reveal'

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
                {cat.skills.map((skill) => (
                  <li key={skill.name}>
                    <span className="sname">{skill.name}</span>
                    <span className="proficiency">{skill.proficiency}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
