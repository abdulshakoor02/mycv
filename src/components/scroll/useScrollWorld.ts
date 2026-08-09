'use client'

import { useEffect, useRef, useState } from 'react'
import type { ScrollWorldState } from '@/types/portfolio'
import { ScrollConductor } from './ScrollConductor'

const initialState: ScrollWorldState = { exact: 0, smooth: 0, index: 0, next: 1, localExact: 0, localSmooth: 0, direction: 0 }

export function useScrollWorld() {
  const [state, setState] = useState<ScrollWorldState>(initialState)
  const conductorRef = useRef<ScrollConductor | null>(null)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-cam]'))
    if (!sections.length) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const conductor = new ScrollConductor({
      sections,
      reducedMotion: reduced.matches,
      onUpdate: setState,
      onChapterChange: (_, nextState) => setState(nextState),
    })
    const onPreferenceChange = (event: MediaQueryListEvent) => conductor.setReducedMotion(event.matches)
    reduced.addEventListener?.('change', onPreferenceChange)
    conductor.start()
    conductorRef.current = conductor
    return () => {
      reduced.removeEventListener?.('change', onPreferenceChange)
      conductor.destroy()
      conductorRef.current = null
    }
  }, [])

  return { state, goToChapter: (index: number) => conductorRef.current?.goTo(index), conductor: conductorRef.current }
}

export default useScrollWorld
