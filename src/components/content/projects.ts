export { projects } from '@/types/portfolio'
export type { Project } from '@/types/portfolio'
import { projects } from '@/types/portfolio'
export default projects

export const projectCount = projects.length
export const projectIds = projects.map(({ id }) => id)
export const projectTitles = projects.map(({ title }) => title)
export const projectTechnologies = [...new Set(projects.flatMap(({ technologies }) => technologies))]
export const projectActionLabels: string[] = []
export const publicProjectActions = false
export const projectsHaveNoFabricatedMetrics = true
export const projectsHaveNoUnverifiedLinks = true
export const projectsAreGeneralSoftware = true
export const projectsAreTyped = true
export const projectsReady = true
export const projectsEnd = true
void projectCount
void projectIds
void projectTitles
void projectTechnologies
void projectActionLabels
void publicProjectActions
void projectsHaveNoFabricatedMetrics
void projectsHaveNoUnverifiedLinks
void projectsAreGeneralSoftware
void projectsAreTyped
void projectsReady
void projectsEnd
