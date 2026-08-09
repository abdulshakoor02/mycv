export type Experience = {
  id: string
  title: string
  company: string
  period: string
  location: string
  description: string[]
  technologies: string[]
}

export type SkillCategory = {
  name: string
  skills: { name: string; level: number }[]
}

export type Project = {
  id: string
  title: string
  description: string
  technologies: string[]
  features: string[]
  impact: string
}

export type ChapterId = 'identity' | 'leadership' | 'systems' | 'engineering' | 'projects' | 'contact'

export type Chapter = {
  id: ChapterId
  label: string
  eyebrow: string
  title: string
  summary: string
}

export type CameraWaypoint = {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
}

export type ScrollWorldState = {
  exact: number
  smooth: number
  index: number
  next: number
  localExact: number
  localSmooth: number
  direction: -1 | 0 | 1
}

export const profile = {
  name: 'Abdul Shakoor Ansari',
  role: 'Senior Technical Lead',
  descriptor: 'Software Engineer',
  location: 'Dubai, UAE',
  email: 'shakoor.ansari@hotmail.com',
  linkedin: 'https://www.linkedin.com/in/abdul-ansari-a271ba40',
  summary: 'I design and deliver dependable software systems across backend services, modern interfaces, cloud infrastructure, and technical leadership.',
}

export const experiences: Experience[] = [
  { id: 'hcl', title: 'Senior Technical Lead', company: 'HCL Tech (onsite ENBD Bank)', period: 'MAR 2024 - Present', location: 'Dubai, UAE', description: ['Coordinate day-to-day project delivery across the team', 'Shape solutions with architects and business analysts', 'Code, test, and review sprint work'], technologies: ['Go', 'Node.js', 'Microservices', 'Azure', 'Kafka'] },
  { id: 'location-solutions', title: 'Senior Software Engineer', company: 'Location Solutions', period: 'Dec 2021 - Feb 2024', location: 'Dubai, UAE', description: ['Coordinate implementation across the team', 'Build and review microservices', 'Develop client-facing React components'], technologies: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Redis'] },
  { id: 'giant-migration', title: 'Software Engineer', company: 'Giant Migration UAE', period: 'Jan 2021 - Nov 2021', location: 'Dubai, UAE', description: ['Designed and built CRM for leads and sales management', 'Integrated APIs to improve user productivity', 'Built stakeholder reports and managed websites'], technologies: ['Node.js', 'React', 'PostgreSQL', 'AWS'] },
  { id: 'dm-consultants', title: 'Software Engineer', company: 'DM Consultants UAE', period: 'May 2019 - Dec 2020', location: 'Dubai, UAE', description: ['Designed and built CRM for leads and sales management'], technologies: ['Node.js', 'MySQL', 'React', 'Docker'] },
]

export const skillCategories: SkillCategory[] = [
  { name: 'Backend', skills: [{ name: 'Node.js', level: 95 }, { name: 'Go', level: 90 }, { name: 'Microservices', level: 92 }, { name: 'Socket.io', level: 85 }, { name: 'Multi-threading', level: 88 }] },
  { name: 'Data', skills: [{ name: 'PostgreSQL', level: 90 }, { name: 'MySQL', level: 88 }, { name: 'MongoDB', level: 85 }, { name: 'Redis', level: 87 }] },
  { name: 'Frontend', skills: [{ name: 'React', level: 92 }, { name: 'Next.js', level: 90 }, { name: 'Redux', level: 85 }, { name: 'TypeScript', level: 88 }] },
  { name: 'Cloud & Delivery', skills: [{ name: 'Docker', level: 85 }, { name: 'AWS', level: 82 }, { name: 'Azure', level: 80 }, { name: 'CI/CD', level: 85 }] },
]

export const projects: Project[] = [
  { id: 'payments', title: 'Real-Time Payment Tracker', description: 'A Go-based microservice platform that consumes Kafka events and consolidates the lifecycle of inward and outward payments across channels.', technologies: ['Go', 'Kafka', 'PostgreSQL', 'React', 'Microservices'], features: ['Consumes data from multiple topics', 'Maintains payment consistency', 'Tracks payment state in real time', 'Connects multi-channel flows'], impact: 'Improved visibility across a complex payment ecosystem.' },
  { id: 'checknshare', title: 'ChecknShare', description: 'A corporate car-sharing platform with booking, telematics, OAuth, notifications, and a Next.js client experience.', technologies: ['Go', 'Node.js', 'React', 'MongoDB', 'Redis'], features: ['Authentication with Ory Hydra', 'Telematics service for vehicle data', 'Booking lifecycle management', 'Third-party integrations'], impact: 'Connected corporate mobility workflows through coordinated services.' },
  { id: 'opal', title: 'Opal Driver Behavior App', description: 'A trip and driver-behavior platform for the Oman oil and gas industry, with detection logic for vehicle movement and violations.', technologies: ['MySQL', 'Node.js', 'React', 'Stored Procedures'], features: ['Trip detection', 'Speeding violation detection', 'Harsh acceleration monitoring', 'Idling time tracking'], impact: 'Turned vehicle telemetry into operational safety signals.' },
  { id: 'crm', title: 'Multi-Region CRM System', description: 'A CRM and operations platform supporting human resources, lead management, contracts, marketing sources, and reporting across multiple regions.', technologies: ['Node.js', 'Go', 'PostgreSQL', 'React', 'Docker'], features: ['Multi-region architecture', 'Dynamic contract generation', 'Marketing source integration', 'Performance reports'], impact: 'Standardized operational workflows across GCC and India.' },
]

export const chapters: Chapter[] = [
  { id: 'identity', label: 'Identity', eyebrow: '00 — SYSTEMS OBSERVATORY', title: 'Software that stays clear under pressure.', summary: profile.summary },
  { id: 'leadership', label: 'Leadership', eyebrow: '01 — TECHNICAL LEADERSHIP', title: 'Align the people, the architecture, and the outcome.', summary: 'From requirements to reviewed code, I help teams turn ambiguous work into dependable delivery.' },
  { id: 'systems', label: 'Systems', eyebrow: '02 — DISTRIBUTED SYSTEMS', title: 'Services, events, and data with a reason to exist.', summary: 'Backend systems are strongest when their boundaries, contracts, and operational behavior are explicit.' },
  { id: 'engineering', label: 'Engineering', eyebrow: '03 — FULL-STACK CRAFT', title: 'A practical view across the entire stack.', summary: 'APIs, interfaces, persistence, cloud delivery, and observability are one connected engineering problem.' },
  { id: 'projects', label: 'Projects', eyebrow: '04 — SELECTED WORK', title: 'Systems built for real operational weight.', summary: 'A few examples of software that moved information, decisions, and people through the world.' },
  { id: 'contact', label: 'Contact', eyebrow: '05 — OPEN CHANNEL', title: 'Let’s build the next reliable system.', summary: 'Based in Dubai and open to thoughtful engineering conversations and collaborations.' },
]

export const cameraWaypoints: CameraWaypoint[] = [
  { position: [0, 3.8, 16], target: [0, 1.8, 2], fov: 48 },
  { position: [-4.8, 3.4, 8], target: [0, 2, -6], fov: 50 },
  { position: [3.2, 2.8, -1], target: [0, 2.2, -14], fov: 52 },
  { position: [-2.4, 4.1, -10], target: [0, 2.3, -23], fov: 50 },
  { position: [0.5, 5, -20], target: [0, 2.2, -33], fov: 52 },
  { position: [0, 4.2, -31], target: [0, 2, -44], fov: 55 },
]

export const projectLandmarkPositions: Record<string, [number, number, number]> = {
  payments: [-3.8, 1.6, -34], checknshare: [-1.2, 2.6, -35.5], opal: [1.4, 1.5, -34], crm: [3.8, 2.3, -36.2],
}

export const chapterColors = ['#70e6e0', '#74b9ff', '#ffbf69', '#b8f36b', '#ffd166', '#f6f7eb']
export const allTechnologies = ['Go', 'Node.js', 'TypeScript', 'React', 'Next.js', 'Microservices', 'Kafka', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS', 'Azure', 'CI/CD']
export const mailto = `mailto:${profile.email}`

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
export const damp = (current: number, target: number, lambda: number, dt: number) => current + (target - current) * (1 - Math.exp(-lambda * dt))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const normalizeScrollProgress = (scrollY: number, anchors: number[], maxScroll: number) => {
  if (!anchors.length) return 0
  const y = clamp(scrollY, 0, Math.max(1, maxScroll))
  if (y <= anchors[0]) return 0
  for (let index = 0; index < anchors.length - 1; index += 1) {
    if (y <= anchors[index + 1]) return index + clamp((y - anchors[index]) / Math.max(1, anchors[index + 1] - anchors[index]), 0, 1)
  }
  return anchors.length - 1
}

export const scrollWorldState = (exact: number, smooth: number, direction: -1 | 0 | 1): ScrollWorldState => {
  const last = chapters.length - 1
  const index = clamp(Math.floor(exact), 0, last)
  const next = Math.min(last, index + 1)
  return { exact, smooth, index, next, localExact: next === index ? 0 : exact - index, localSmooth: next === index ? 0 : smooth - Math.floor(smooth), direction }
}

export const worldPalette = { background: '#050a0e', ink: '#edf3f1', muted: '#8d9b9b', cyan: '#70e6e0', amber: '#ffbf69', green: '#b8f36b', red: '#ff6b6b' }
export const worldName = 'The Systems Observatory'
export const worldTagline = 'A software engineering portfolio in motion.'
export const linkedinUrl = profile.linkedin
export const contactLinks = [{ label: 'Email', href: mailto }, { label: 'LinkedIn', href: linkedinUrl }]
export const footerYear = new Date().getFullYear()
export const fallbackPosterPath = '/poster-system-world.svg'
export const profileName = profile.name
export const profileRole = profile.role
export const profileDescriptor = profile.descriptor
export const profileSummary = profile.summary
export const pageTitle = 'Abdul Shakoor Ansari — Systems in Motion'
export const metaDescription = 'Abdul Shakoor Ansari — Senior Technical Lead and software engineer building dependable systems across backend, frontend, cloud, and delivery.'
export const contactFormEnabled = false
export const publicProjectActions = false
export const avatarLandmarkEnabled = false
export const mlTradingChapterEnabled = false
export const visualDirection = 'Systems in Motion'
export const systemLayers = ['Interface', 'Application', 'Data', 'Infrastructure', 'Observability']
export const systemSignals = ['request', 'event', 'state', 'health', 'outcome']
export const sceneGroups = ['environment', 'landmarks', 'chapterSets', 'interactives', 'atmosphere'] as const
export const mobileDprCap = 1.35
export const desktopDprCap = 1.75
export const scrollDamping = 5.2
export const maxFrameDelta = 1 / 30
export const performanceBudgetMs = 25

export default profile
