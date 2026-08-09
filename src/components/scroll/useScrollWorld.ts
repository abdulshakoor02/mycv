'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { ScrollConductor } from './ScrollConductor'
import { createScrollWorldStore, type ScrollWorldStore } from './scroll-store'

export function useScrollWorld() {
  const storeRef = useRef<ScrollWorldStore | null>(null)
  const conductorRef = useRef<ScrollConductor | null>(null)
  if (!storeRef.current) storeRef.current = createScrollWorldStore()
  const store = storeRef.current
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-cam]'))
    if (!sections.length) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const conductor = new ScrollConductor({
      sections,
      reducedMotion: reduced.matches,
      onUpdate: store.setState,
    })
    store.setReducedMotion(reduced.matches)
    const onPreferenceChange = (event: MediaQueryListEvent) => {
      store.setReducedMotion(event.matches)
      conductor.setReducedMotion(event.matches)
    }
    reduced.addEventListener?.('change', onPreferenceChange)
    conductor.start()
    conductorRef.current = conductor
    return () => {
      reduced.removeEventListener?.('change', onPreferenceChange)
      conductor.destroy()
      conductorRef.current = null
    }
  }, [store])

  return { state, store, goToChapter: (index: number) => conductorRef.current?.goTo(index), conductor: conductorRef.current }
}

export default useScrollWorld

export type { ScrollWorldStore }
