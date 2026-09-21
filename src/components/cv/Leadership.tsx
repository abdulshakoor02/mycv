import Reveal from './Reveal'

const STEPS = [
  { num: '01', title: 'Shape the question', body: 'Start from the real problem before reaching for a solution.' },
  { num: '02', title: 'Design the boundary', body: 'Make service, data, and team boundaries explicit and owned.' },
  { num: '03', title: 'Review the signal', body: 'Read requirements, code, and telemetry for what actually matters.' },
  { num: '04', title: 'Deliver the outcome', body: 'Turn ambiguous work into reviewed, dependable delivery.' },
]

const STATS = [
  { value: '04', label: 'roles across software teams' },
  { value: '06+', label: 'layers considered in a system' },
  { value: '01', label: 'shared path from idea to operation' },
]

export default function Leadership() {
  return (
    <section id="leadership" className="section">
      <Reveal className="section-head">
        <p className="eyebrow">Technical Leadership</p>
        <h2>Align the people, the architecture, and the outcome.</h2>
        <p>From requirements to reviewed code, I help teams turn ambiguous work into dependable delivery.</p>
      </Reveal>
      <div className="leadership-grid">
        {STEPS.map((s, i) => (
          <Reveal key={s.num} delay={i * 70}>
            <div className="card lead-card">
              <span className="num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="stat-strip">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 80}>
            <div className="card stat"><strong>{s.value}</strong><span>{s.label}</span></div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
