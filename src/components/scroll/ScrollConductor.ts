import { damp, normalizeScrollProgress } from '@/types/portfolio'
import type { ScrollWorldState } from '@/types/portfolio'

type ConductorOptions = {
  sections: HTMLElement[]
  damping?: number
  reducedMotion?: boolean
  onUpdate?: (state: ScrollWorldState) => void
  onChapterChange?: (index: number, state: ScrollWorldState) => void
}

export class ScrollConductor {
  private readonly sections: HTMLElement[]
  private readonly damping: number
  private reducedMotion: boolean
  private readonly onUpdate: (state: ScrollWorldState) => void
  private readonly onChapterChange: (index: number, state: ScrollWorldState) => void
  private anchors: number[] = []
  private exact = 0
  private smooth = 0
  private direction: -1 | 0 | 1 = 0
  private previousY = 0
  private active = -1
  private running = false
  private frame = 0
  private lastTime = 0
  private dirty = true
  private widthAtMeasure = 0
  private resizeObserver?: ResizeObserver

  constructor(options: ConductorOptions) {
    if (!options.sections.length) throw new Error('ScrollConductor requires at least one section')
    this.sections = options.sections
    this.damping = options.damping ?? 5.2
    this.reducedMotion = Boolean(options.reducedMotion)
    this.onUpdate = options.onUpdate ?? (() => undefined)
    this.onChapterChange = options.onChapterChange ?? (() => undefined)
  }

  private maxScroll() {
    return Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  }

  measure() {
    const max = this.maxScroll()
    this.widthAtMeasure = window.innerWidth
    this.anchors = this.sections.map((section, index) => {
      if (index === 0) return 0
      if (index === this.sections.length - 1) return max
      return Math.min(max, Math.max(0, section.offsetTop + section.offsetHeight * 0.5 - window.innerHeight * 0.5))
    })
    for (let index = 1; index < this.anchors.length; index += 1) this.anchors[index] = Math.max(this.anchors[index], this.anchors[index - 1] + 1)
    this.dirty = true
    return [...this.anchors]
  }

  private progressAt(scrollY: number) {
    return normalizeScrollProgress(scrollY, this.anchors, this.maxScroll())
  }

  private readScroll() {
    const y = window.scrollY || window.pageYOffset || 0
    const delta = y - this.previousY
    if (Math.abs(delta) > 0.25) this.direction = delta > 0 ? 1 : -1
    this.previousY = y
    this.exact = this.progressAt(y)
    this.dirty = true
  }

  private state(): ScrollWorldState {
    const index = Math.max(0, Math.min(this.sections.length - 1, Math.floor(this.exact)))
    const next = Math.min(this.sections.length - 1, index + 1)
    const smoothIndex = Math.floor(this.smooth)
    return {
      exact: this.exact,
      smooth: this.smooth,
      index,
      next,
      localExact: next === index ? 0 : this.exact - index,
      localSmooth: next === index ? 0 : this.smooth - smoothIndex,
      direction: this.direction,
    }
  }

  private tick = (now: number) => {
    if (!this.running) return
    const dt = this.lastTime ? Math.min((now - this.lastTime) / 1000, 1 / 30) : 1 / 60
    this.lastTime = now
    const previousSmooth = this.smooth
    this.smooth = this.reducedMotion ? this.exact : damp(this.smooth, this.exact, this.damping, dt)
    if (Math.abs(this.smooth - this.exact) < 0.0001) this.smooth = this.exact
    const nextState = this.state()
    if (nextState.index !== this.active) {
      this.active = nextState.index
      this.onChapterChange(this.active, nextState)
    }
    if (this.dirty || previousSmooth !== this.smooth) {
      this.dirty = false
      this.onUpdate(nextState)
    }
    this.frame = requestAnimationFrame(this.tick)
  }

  private onScroll = () => this.readScroll()
  private onResize = () => {
    const widthChanged = window.innerWidth !== this.widthAtMeasure
    if (window.matchMedia?.('(pointer: coarse)').matches && !widthChanged) return
    this.measure()
    this.readScroll()
  }
  private onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.frame)
      this.frame = 0
      this.lastTime = 0
    } else if (this.running && !this.frame) {
      this.readScroll()
      this.frame = requestAnimationFrame(this.tick)
    }
  }

  start() {
    if (this.running) return this
    this.running = true
    this.measure()
    this.previousY = window.scrollY || window.pageYOffset || 0
    this.exact = this.progressAt(this.previousY)
    this.smooth = this.exact
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize, { passive: true })
    window.addEventListener('orientationchange', this.onResize, { passive: true })
    window.addEventListener('hashchange', this.onResize)
    document.addEventListener('visibilitychange', this.onVisibility)
    this.resizeObserver = new ResizeObserver(() => { this.measure(); this.readScroll() })
    this.sections.forEach((section) => this.resizeObserver?.observe(section))
    this.active = -1
    this.frame = requestAnimationFrame(this.tick)
    return this
  }

  stop() {
    if (!this.running) return
    this.running = false
    cancelAnimationFrame(this.frame)
    this.frame = 0
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('orientationchange', this.onResize)
    window.removeEventListener('hashchange', this.onResize)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.resizeObserver?.disconnect()
    this.resizeObserver = undefined
  }

  setReducedMotion(value: boolean) {
    this.reducedMotion = value
    if (value) this.smooth = this.exact
    this.dirty = true
  }

  goTo(index: number) {
    const safeIndex = Math.max(0, Math.min(this.anchors.length - 1, Math.round(index)))
    window.scrollTo({ top: this.anchors[safeIndex] ?? 0, behavior: this.reducedMotion ? 'auto' : 'smooth' })
  }

  getState() { return this.state() }
  destroy() { this.stop() }
}
