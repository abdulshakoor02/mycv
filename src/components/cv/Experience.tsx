import { experiences } from '@/types/portfolio'
import Reveal from './Reveal'

const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

function parseMonthYear(label: string) {
  const match = label.trim().match(/^([a-z]+)\s+(\d{4})$/i)
  if (!match) return null

  const month = monthNames.indexOf(match[1].slice(0, 3).toLowerCase())
  const year = Number(match[2])
  if (month < 0 || !Number.isFinite(year)) return null

  return year * 12 + month
}

function calculateExperienceMonths() {
  const now = new Date()
  const currentMonth = now.getFullYear() * 12 + now.getMonth()

  return experiences.reduce((total, experience) => {
    const [startLabel, endLabel] = experience.period.split(/\s+[—–]\s+/)
    if (!startLabel || !endLabel) return total

    const start = parseMonthYear(startLabel)
    const end = endLabel.trim().toLowerCase() === 'present'
      ? currentMonth
      : parseMonthYear(endLabel)

    if (start === null || end === null) return total
    return total + Math.max(0, end - start)
  }, 0)
}

export default function Experience() {
  const totalMonths = calculateExperienceMonths()
  const totalYears = Math.floor(totalMonths / 12)

  return (
    <section id="experience" className="section">
      <Reveal className="section-head">
        <div className="section-kicker">
          <p className="eyebrow">Professional Experience</p>
          <p className="experience-total"><strong>{totalYears}+</strong> years total experience</p>
        </div>
        <h2>Services, events, and data with a reason to exist.</h2>
        <p>Backend systems are strongest when their boundaries, contracts, and operational behavior are explicit.</p>
      </Reveal>
      <ol className="timeline" aria-label="Professional experience">
        {experiences.map((xp, i) => (
          <Reveal as="li" key={xp.id} delay={i * 60}>
            <article className="card xp-card">
              <div className="xp-top">
                <span className="year-pill">{xp.period}</span>
                <span className="xp-count">{String(i + 1).padStart(2, '0')} / {String(experiences.length).padStart(2, '0')}</span>
              </div>
              <h3>{xp.title}</h3>
              <p className="xp-org">{xp.company} · {xp.location}</p>
              {xp.description.length > 0 && (
                <ul>
                  {xp.description.map((description) => <li key={description}>{description}</li>)}
                </ul>
              )}
              {xp.technologies.length > 0 && (
                <div className="xp-tags">
                  {xp.technologies.map((technology) => <span key={technology} className="chip">{technology}</span>)}
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
