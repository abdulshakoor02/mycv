import { ChevronDown, MapPin } from 'lucide-react'
import { profile } from '@/types/portfolio'
import Reveal from './Reveal'

export default function Identity() {
  return (
    <section id="identity" className="section hero">
      <div className="hero-copy">
        <Reveal><p className="eyebrow">Curriculum Vitae</p></Reveal>
        <Reveal delay={60}>
          <h1>{profile.name.split(' ').slice(0, -1).join(' ')} <span className="accent">{profile.name.split(' ').slice(-1)}</span></h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="role-line">{profile.role}<span className="dot" />{profile.descriptor}</p>
        </Reveal>
        <Reveal delay={180}><p className="lede">{profile.summary}</p></Reveal>
        <Reveal delay={240} className="hero-meta">
          <div><span>Based in</span><strong><MapPin size={14} />{profile.location}</strong></div>
          <div><span>Focus</span><strong>Backend · Frontend · Cloud</strong></div>
          <div><span>Status</span><strong>Open to conversations</strong></div>
        </Reveal>
        <Reveal delay={300} className="hero-actions">
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>Get in touch</a>
          <a className="btn btn-ghost" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </Reveal>
        <Reveal delay={360}>
          <a className="scroll-cue" href="#leadership">Scroll to explore <ChevronDown size={15} /></a>
        </Reveal>
      </div>

      <Reveal delay={200} className="hero-visual">
        <div className="sheet-scene">
          <div className="sheet" aria-hidden="true">
            <div className="sheet-head">
              <span className="sheet-mono">AS</span>
              <div>
                <div className="n">{profile.name}</div>
                <div className="r">{profile.role}</div>
              </div>
            </div>
            <div className="sheet-block">
              <div className="sheet-label">Profile</div>
              <div className="sheet-line w80" />
              <div className="sheet-line w60" />
              <div className="sheet-line w70" />
            </div>
            <div className="sheet-block">
              <div className="sheet-label">Core Stack</div>
              <div className="sheet-bars">
                <div className="sheet-bar"><small>Backend</small><span className="track"><span className="fill" style={{ width: '92%' }} /></span></div>
                <div className="sheet-bar"><small>Frontend</small><span className="track"><span className="fill" style={{ width: '88%' }} /></span></div>
                <div className="sheet-bar"><small>Cloud</small><span className="track"><span className="fill" style={{ width: '80%' }} /></span></div>
              </div>
            </div>
            <div className="sheet-block">
              <div className="sheet-label">Experience</div>
              <div className="sheet-line w70" />
              <div className="sheet-line w45" />
            </div>
          </div>
        </div>
        <span className="orb orb-1" aria-hidden="true" />
        <span className="orb orb-2" aria-hidden="true" />
        <span className="ring" aria-hidden="true" />
      </Reveal>
    </section>
  )
}
