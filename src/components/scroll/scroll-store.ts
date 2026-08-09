import type { ScrollWorldState } from '@/types/portfolio'

export type ScrollSemanticState = {
  index: number
  next: number
  direction: -1 | 0 | 1
  projectIndex: number | null
  reducedMotion: boolean
}

const initialState: ScrollWorldState = {
  exact: 0,
  smooth: 0,
  index: 0,
  next: 1,
  localExact: 0,
  localSmooth: 0,
  direction: 0,
}

const semanticFromState = (state: ScrollWorldState, reducedMotion: boolean): ScrollSemanticState => ({
  index: state.index,
  next: state.next,
  direction: state.direction,
  projectIndex: state.index === 4 ? Math.min(3, Math.floor(state.localExact * 4)) : null,
  reducedMotion,
})

const sameSemanticState = (a: ScrollSemanticState, b: ScrollSemanticState) => (
  a.index === b.index &&
  a.next === b.next &&
  a.direction === b.direction &&
  a.projectIndex === b.projectIndex &&
  a.reducedMotion === b.reducedMotion
)

export class ScrollWorldStore {
  private state = initialState
  private semanticState: ScrollSemanticState = semanticFromState(initialState, false)
  private readonly listeners = new Set<() => void>()

  getState = () => this.state

  getSnapshot = () => this.semanticState

  getServerSnapshot = () => this.semanticState

  getReducedMotion = () => this.semanticState.reducedMotion

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  setState = (state: ScrollWorldState) => {
    this.state = state
    const nextSemanticState = semanticFromState(state, this.semanticState.reducedMotion)
    if (sameSemanticState(this.semanticState, nextSemanticState)) return
    this.semanticState = nextSemanticState
    this.listeners.forEach((listener) => listener())
  }

  setReducedMotion = (reducedMotion: boolean) => {
    if (this.semanticState.reducedMotion === reducedMotion) return
    this.semanticState = { ...this.semanticState, reducedMotion }
    this.listeners.forEach((listener) => listener())
  }
}

export const createScrollWorldStore = () => new ScrollWorldStore()
