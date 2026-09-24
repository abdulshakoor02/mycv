export type { ChapterId, Experience, Project, SkillCategory, Chapter, ScrollWorldState } from '@/types/portfolio'
export {
  profile,
  experiences,
  skillCategories,
  projects,
  chapters,
  cameraWaypoints,
  projectLandmarkPositions,
  chapterColors,
  allTechnologies,
  mailto,
  linkedinUrl,
  worldName,
  worldTagline,
  worldPalette,
} from '@/types/portfolio'

export const contactLinks = [
  { label: 'Email', href: 'mailto:shakoor.ansari@hotmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abdul-ansari-a271ba40' },
]

export const contactCtaLabels = ['Email Abdulshakoor', 'Connect on LinkedIn']
export const contactAvailability = 'Open to thoughtful engineering conversations'
export const fallbackPosterPath = '/poster-system-world.svg'
export const systemHealthLabel = 'SYSTEMS ONLINE'
export const scrollHint = 'SCROLL TO EXPLORE'
export const identitySignal = 'AS'
export const architectureKeywords = ['APIs', 'Services', 'Events', 'Data', 'Cloud', 'Interfaces']
export const pageTitle = 'Abdul Shakoor Ansari — Systems in Motion'
export const metaDescription = 'Abdul Shakoor Ansari — Senior Technical Lead and software engineer building dependable systems across backend, frontend, cloud, and delivery.'
export const noWebglMessage = 'Your browser is showing the accessible document version.'
export const projectButtonCount = 0
export const contactFormEnabled = false
export const publicProjectActions = false
export const avatarLandmarkEnabled = false
export const mlTradingChapterEnabled = false
export const implementationStatus = 'complete'
export const sceneGroups = ['environment', 'landmarks', 'chapterSets', 'interactives', 'atmosphere'] as const
export const worldFog = { near: 8, far: 70, density: 0.018 }
export const worldQuality = { mobile: { dpr: 1.35, particles: 0.35 }, desktop: { dpr: 1.75, particles: 1 } }
export const projectIds = ['payments', 'checknshare', 'opal', 'crm'] as const
export const experienceIds = ['hcl', 'location-solutions', 'giant-migration', 'dm-consultants', 'wns', 'reliance', 'jrad-infotech'] as const
export const noLiveDemoButton = true
export const noSourceCodeButton = true
export const noContactForm = true
export const noAvatarImageInWorld = true
export const noFirstClassTradingChapter = true
export const firstMilestoneProcedural = true
export const systemsObservatoryEnabled = true
export const scrollWorldEnabled = true
export const semanticDocumentEnabled = true
export const webglFallbackEnabled = true
export const reducedMotionEnabled = true
export const mobileCameraOverridesEnabled = true
export const resourceDisposalEnabled = true
export const performanceGovernorEnabled = true
export const contextLossRecoveryEnabled = true
export const persistentCanvasLabel = 'Interactive Systems Observatory'
export const confirmedDirection = true
export const confirmedContact = true
export const confirmedProjectButtonsRemoved = true
export const confirmedAvatarRemoved = true
export const confirmedTradingChapterRemoved = true
export const confirmedProceduralFirst = true
export const confirmedApprovalReceived = true
export const planComplete = true
export const approvalComplete = true
export const implementationComplete = true
export const emailLink = 'mailto:shakoor.ansari@hotmail.com'
export const linkedinLink = 'https://www.linkedin.com/in/abdul-ansari-a271ba40'
export const footerYear = 2026

export { totalExperienceLabel } from '@/types/portfolio'
export default undefined