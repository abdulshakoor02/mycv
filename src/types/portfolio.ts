export type Experience = {
  id: string
  title: string
  company: string
  period: string
  location: string
  description: string[]
  technologies: string[]
}

export type Skill = {
  name: string
  proficiency: 'Leading' | 'Proficient' | 'Working knowledge'
}

export type SkillCategory = {
  name: string
  skills: Skill[]
}

export type Project = {
  id: string
  title: string
  description: string
  role: string
  period: string
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
  yearsExperience: '6+ years',
  availability: 'Based in Dubai · Open to thoughtful engineering collaborations',
}

export const experiences: Experience[] = [
  {
    id: 'hcl',
    title: 'Senior Technical Lead',
    company: 'HCL Tech (onsite ENBD Bank)',
    period: 'MAR 2024 — Present',
    location: 'Dubai, UAE',
    description: [
      'Lead a cross-functional squad delivering payment-reconciliation microservices for ENBD — turning ambiguous product requirements into bounded services with clear contracts and runbooks',
      'Shape service boundaries, Kafka event flows and operational playbooks with architects and BAs to reduce hand-offs and review churn',
      'Ship and review production Go / Node.js code, own testing, observability and incident follow-ups across sprints',
    ],
    technologies: ['Go', 'Node.js', 'Microservices', 'Azure', 'Kafka'],
  },
  {
    id: 'location-solutions',
    title: 'Senior Software Engineer',
    company: 'Location Solutions',
    period: 'Dec 2021 — Feb 2024',
    location: 'Dubai, UAE',
    description: [
      'Built and reviewed microservices owning booking lifecycle, vehicle telematics and OAuth (Ory Hydra) for a corporate car-sharing platform',
      'Developed resilient Next.js client experiences tuned for real device and network variance across coordinated service releases',
      'Introduced review and integration standards that improved delivery consistency across distributed teams',
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Redis'],
  },
  {
    id: 'giant-migration',
    title: 'Software Engineer',
    company: 'Giant Migration UAE',
    period: 'Jan 2021 — Nov 2021',
    location: 'Dubai, UAE',
    description: [
      'Designed and shipped a CRM from zero for GCC lead and sales operations (leads, contracts, performance reporting) on Node.js / React / PostgreSQL / AWS',
      'Integrated third-party APIs and automated stakeholder reporting — improving operator productivity and operational visibility',
      'Owned delivery and hardened regional websites for reliability and fast iteration',
    ],
    technologies: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'dm-consultants',
    title: 'Software Engineer',
    company: 'DM Consultants UAE',
    period: 'May 2019 — Dec 2020',
    location: 'Dubai, UAE',
    description: [
      'Built and evolved a multi-tenant CRM on Node.js / MySQL / React / Docker supporting HR, leads and sales workflows',
      'Shipped quickly with a maintainable architecture under tight timelines — establishing patterns reused across GCC and India',
      'Partnered directly with stakeholders to close feedback loops and keep delivery aligned with operations',
    ],
    technologies: ['Node.js', 'MySQL', 'React', 'Docker'],
  },
  {
    id: 'wns',
    title: 'Senior Associate',
    company: 'WNS Global Services India',
    period: 'Aug 2017 — Nov 2018',
    location: 'India',
    description: [
      'Contributed to a healthcare application by developing operational dashboards and reports that made business data easier to review and act on',
      'Built and maintained reusable user-interface components in React and Vue.js, translating reporting requirements into clear application views',
      'Supported ongoing application enhancements and issue resolution to keep dashboards accurate, usable, and aligned with operational needs',
    ],
    technologies: ['React', 'Vue.js', 'Dashboards', 'Reporting'],
  },
  {
    id: 'reliance',
    title: 'Technical Support Engineer',
    company: 'Reliance India',
    period: 'May 2015 — Mar 2016',
    location: 'India',
    description: [
      'Provided technical support for database-related incidents, investigating reported issues and helping restore normal service',
      'Assisted with routine database checks, data validation, and SQL-based troubleshooting to identify the source of application and data issues',
      'Documented findings and coordinated issue resolution with relevant technical teams, keeping users informed through the support lifecycle',
    ],
    technologies: ['Database Support', 'SQL', 'Troubleshooting', 'Incident Support'],
  },
  {
    id: 'jrad-infotech',
    title: 'Junior DBA',
    company: 'Jrad Infotech India',
    period: 'Jun 2012 — Jul 2013',
    location: 'India',
    description: [
      'Supported day-to-day database administration, monitoring database health and assisting with routine maintenance activities',
      'Managed RMAN backup tasks and helped verify backup availability to support reliable recovery when required',
      'Assisted with database migrations and recovery activities, following established procedures to protect data integrity and service continuity',
    ],
    technologies: ['Database Administration', 'RMAN', 'Backup & Recovery', 'Database Migration'],
  },
]

export const skillCategories: SkillCategory[] = [
  { name: 'Backend', skills: [{ name: 'Node.js', proficiency: 'Leading' }, { name: 'Go', proficiency: 'Proficient' }, { name: 'Microservices', proficiency: 'Leading' }, { name: 'Socket.io', proficiency: 'Proficient' }, { name: 'Multi-threading', proficiency: 'Proficient' }] },
  { name: 'Data', skills: [{ name: 'PostgreSQL', proficiency: 'Leading' }, { name: 'MySQL', proficiency: 'Proficient' }, { name: 'MongoDB', proficiency: 'Proficient' }, { name: 'Redis', proficiency: 'Proficient' }] },
  { name: 'Frontend', skills: [{ name: 'React', proficiency: 'Leading' }, { name: 'Next.js', proficiency: 'Proficient' }, { name: 'Redux', proficiency: 'Working knowledge' }, { name: 'TypeScript', proficiency: 'Proficient' }] },
  { name: 'Cloud & Delivery', skills: [{ name: 'Docker', proficiency: 'Proficient' }, { name: 'AWS', proficiency: 'Proficient' }, { name: 'Azure', proficiency: 'Working knowledge' }, { name: 'CI/CD', proficiency: 'Proficient' }] },
]

export const projects: Project[] = [
  {
    id: 'payments',
    title: 'Real-Time Payment Tracker',
    description: 'Go microservices that consume Kafka payment events and consolidate the lifecycle of inward and outward payments across banking channels.',
    role: 'Technical Lead — designed ingestion and consistency layer, owned state machine and PostgreSQL persistence',
    period: '2024 — Present · ENBD',
    technologies: ['Go', 'Kafka', 'PostgreSQL', 'React', 'Microservices'],
    features: ['Consolidated events from multiple Kafka topics', 'Enforced payment-state consistency across channels', 'Real-time lifecycle tracking and reconciliation', 'Multi-channel flow correlation'],
    impact: 'Gave operations a single, trustworthy view of payment state across a complex ecosystem.',
  },
  {
    id: 'checknshare',
    title: 'ChecknShare',
    description: 'Corporate car-sharing platform coordinating booking, telematics, OAuth, notifications and a Next.js operations experience.',
    role: 'Senior Engineer — owned booking and telematics services, Ory Hydra integration and cross-service coordination',
    period: '2021 — 2024 · Location Solutions',
    technologies: ['Go', 'Node.js', 'React', 'MongoDB', 'Redis'],
    features: ['OAuth with Ory Hydra', 'Telematics service for live vehicle data', 'Booking lifecycle and conflict management', 'Third-party integrations and notifications'],
    impact: 'Connected corporate mobility workflows into one dependable operations surface.',
  },
  {
    id: 'opal',
    title: 'Opal Driver Behavior App',
    description: 'Trip and driver-behavior platform for Oman oil & gas — detecting movement, violations and operational risk from vehicle telemetry.',
    role: 'Full-stack — built trip detection engine and violation logic on Node.js / MySQL with stored procedures',
    period: '2022 — 2024 · OPAL',
    technologies: ['MySQL', 'Node.js', 'React', 'Stored Procedures'],
    features: ['Reliable trip start/end detection', 'Speeding and harsh-acceleration detection', 'Idling-time and violation surfacing', 'Operational safety dashboards'],
    impact: 'Turned raw telemetry into actionable safety signals for field operations.',
  },
  {
    id: 'crm',
    title: 'Multi-Region CRM System',
    description: 'CRM and operations platform supporting HR, leads, contracts, marketing sources and reporting across GCC and India.',
    role: 'Engineer — designed multi-region architecture, dynamic contract generation and reporting',
    period: '2019 — 2021 · GCC',
    technologies: ['Node.js', 'Go', 'PostgreSQL', 'React', 'Docker'],
    features: ['Multi-region tenant architecture', 'Dynamic contract generation', 'Marketing-source attribution', 'Operational performance reports'],
    impact: 'Standardized how regions sell, hire and report — one system, consistent outcomes.',
  },
]

export const education = [
  { degree: 'Bachelor of Technology', field: 'Computer Science / Software Engineering', period: '—', note: 'Professional experience 6+ years across GCC banking, mobility and operations systems' },
]

export const chapters: Chapter[] = [
  { id: 'identity', label: 'Identity', eyebrow: '00 — SYSTEMS OBSERVATORY', title: 'Software that stays clear under pressure.', summary: profile.summary },
  { id: 'leadership', label: 'Leadership', eyebrow: '01 — TECHNICAL LEADERSHIP', title: 'Align the people, the architecture, and the outcome.', summary: 'From requirements to reviewed code, I help teams turn ambiguous work into dependable delivery.' },
  { id: 'systems', label: 'Systems', eyebrow: '02 — DISTRIBUTED SYSTEMS', title: 'Services, events, and data with a reason to exist.', summary: 'Backend systems are strongest when their boundaries, contracts, and operational behavior are explicit.' },
  { id: 'engineering', label: 'Engineering', eyebrow: '03 — FULL-STACK CRAFT', title: 'A practical view across the entire stack.', summary: 'APIs, interfaces, persistence, cloud delivery, and observability are one connected engineering problem.' },
  { id: 'projects', label: 'Projects', eyebrow: '04 — SELECTED WORK', title: 'Systems built for real operational weight.', summary: 'A few examples of software that moved information, decisions, and people through the world.' },
  { id: 'contact', label: 'Contact', eyebrow: '05 — OPEN CHANNEL', title: "Let's build the next reliable system.", summary: 'Based in Dubai and open to thoughtful engineering conversations and collaborations.' },
]

export const cameraWaypoints: CameraWaypoint[] = [
  { position: [0, 3.8, 16], target: [0, 1.8, 2], fov: 48 },
  { position: [-5.2, 3.9, 9.5], target: [0, 1.9, -5.5], fov: 51 },
  { position: [4.2, 3.2, -2.5], target: [0, 2.1, -14], fov: 53 },
  { position: [-3.6, 4.6, -11.5], target: [0, 2.4, -23], fov: 50 },
  { position: [0.5, 6.2, -21], target: [0, 2.1, -33.5], fov: 54 },
  { position: [0, 4.8, -33], target: [0, 2, -46], fov: 57 },
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
export const footerYear = 2026
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
export const resumeUrl = '/resume.pdf'
export const totalExperienceLabel = '6+ years · 4 teams · GCC & banking'

export default profile
