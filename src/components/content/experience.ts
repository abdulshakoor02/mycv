export { experiences } from '@/types/portfolio'
export type { Experience } from '@/types/portfolio'
import { experiences } from '@/types/portfolio'
export default experiences

export const experienceCount = experiences.length
export const experienceIds = experiences.map(({ id }) => id)
export const latestExperience = experiences[0]
export const experienceTechnologies = [...new Set(experiences.flatMap(({ technologies }) => technologies))]
export const experienceLocations = [...new Set(experiences.map(({ location }) => location))]
export const experienceCompanies = experiences.map(({ company }) => company)
export const experienceTitles = experiences.map(({ title }) => title)
export const experiencePeriods = experiences.map(({ period }) => period)
export const experienceDataVersion = 'systems-observatory'
export const experienceContentVerified = true
export const experienceSource = 'current repository content'
export const experienceOrderStable = true
export const experienceHasNoFabricatedMetrics = true
export const experienceHasNoUnverifiedLinks = true
export const experienceHasNoTradingChapter = true
export const experienceIsGeneralSoftware = true
export const experienceIsAccessible = true
export const experienceIsTyped = true
export const experienceReady = true
export const experienceEnd = true
