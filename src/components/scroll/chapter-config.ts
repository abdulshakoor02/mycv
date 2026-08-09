import { chapters, chapterColors, cameraWaypoints } from '@/types/portfolio'
import type { ChapterId } from '@/types/portfolio'

export type ChapterConfig = {
  id: ChapterId
  index: number
  label: string
  eyebrow: string
  title: string
  summary: string
  scrollWeight: number
  camera: {
    position: [number, number, number]
    target: [number, number, number]
    fov: number
    mobile: { position: [number, number, number]; target: [number, number, number]; fov: number }
  }
  accent: string
  focus: string[]
  interactions: string[]
}

const mobileCamera = (position: [number, number, number], target: [number, number, number], fov: number) => ({
  position: [position[0] * 0.7, position[1] + 1.25, position[2] + 4] as [number, number, number],
  target: [target[0], target[1], target[2]] as [number, number, number],
  fov: fov + 7,
})

const chapterFocus = [
  ['origin', 'current'],
  ['coordination-span', 'junctions'],
  ['service-delta', 'event-routes'],
  ['stack-plates', 'conduits'],
  ['payments', 'checknshare', 'opal', 'crm'],
  ['open-horizon'],
]

export const chapterConfig: ChapterConfig[] = chapters.map((chapter, index) => {
  const waypoint = cameraWaypoints[index]
  return {
    ...chapter,
    index,
    scrollWeight: index === 0 || index === chapters.length - 1 ? 1.1 : 1,
    camera: {
      ...waypoint,
      mobile: mobileCamera(waypoint.position, waypoint.target, waypoint.fov),
    },
    accent: chapterColors[index],
    focus: chapterFocus[index],
    interactions: index === 4 ? ['focus-project', 'reveal-routes'] : ['world-travel'],
  }
})

export const chapterById = Object.fromEntries(chapterConfig.map((chapter) => [chapter.id, chapter])) as Record<ChapterId, ChapterConfig>
export const chapterIds = chapterConfig.map(({ id }) => id)
export const chapterCount = chapterConfig.length
export const chapterWeights = chapterConfig.map(({ scrollWeight }) => scrollWeight)

export default chapterConfig
