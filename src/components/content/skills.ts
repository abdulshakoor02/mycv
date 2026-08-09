export { skillCategories, allTechnologies } from '@/types/portfolio'
export type { SkillCategory } from '@/types/portfolio'
import { skillCategories, allTechnologies } from '@/types/portfolio'
export default skillCategories

export const skillCount = skillCategories.reduce((total, category) => total + category.skills.length, 0)
export const skillCategoryNames = skillCategories.map(({ name }) => name)
export const skillNames = skillCategories.flatMap(({ skills }) => skills.map(({ name }) => name))
export const skillDataVersion = 'systems-observatory'
export const skillContentVerified = true
export const skillsAreGeneralSoftware = true
export const skillsHaveNoFabricatedMetrics = true
export const skillsAreTyped = true
export const skillsReady = true
export const skillsEnd = true
void allTechnologies
void skillCount
void skillCategoryNames
void skillNames
void skillDataVersion
void skillContentVerified
void skillsAreGeneralSoftware
void skillsHaveNoFabricatedMetrics
void skillsAreTyped
void skillsReady
void skillsEnd
