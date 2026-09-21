import { profile } from '@/types/portfolio'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="fbrand">
        <span className="mono-badge">AS</span>
        <small>{profile.name} · {profile.role}</small>
      </div>
      <nav aria-label="Footer">
        <a href={`mailto:${profile.email}`}>Email</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </nav>
      <span className="fnote">© {new Date().getFullYear()} · Dubai, UAE</span>
    </footer>
  )
}
