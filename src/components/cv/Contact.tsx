import { ArrowUpRight, Linkedin, Mail, MapPin } from 'lucide-react'
import { profile } from '@/types/portfolio'
import Reveal from './Reveal'

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="contact-wrap">
        <Reveal>
          <div className="card contact-card">
            <p className="eyebrow">Open Channel</p>
            <h2>Let&apos;s build the next reliable system.</h2>
            <p>Based in {profile.location} and open to thoughtful engineering conversations and collaborations.</p>
            <p className="contact-loc"><MapPin size={15} /> {profile.location} · Available for remote work</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="contact-actions">
            <a className="contact-row" href={`mailto:${profile.email}`}>
              <span className="l"><span className="ic"><Mail size={18} /></span><span><strong>Email</strong><span>{profile.email}</span></span></span>
              <ArrowUpRight size={18} />
            </a>
            <a className="contact-row" href={profile.linkedin} target="_blank" rel="noreferrer">
              <span className="l"><span className="ic"><Linkedin size={18} /></span><span><strong>LinkedIn</strong><span>Connect professionally</span></span></span>
              <ArrowUpRight size={18} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
