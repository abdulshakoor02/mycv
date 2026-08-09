'use client'

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { desktopDprCap, fallbackPosterPath, mobileDprCap } from '@/types/portfolio'
import type { ScrollWorldStore } from '@/components/scroll/scroll-store'
import WorldCanvas from './WorldCanvas'

export default function ScrollWorld({ store, enabled }: { store: ScrollWorldStore; enabled: boolean }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 800px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  if (!enabled) return <div className="world-fallback" style={{ backgroundImage: `linear-gradient(90deg, rgba(5, 10, 14, .58), rgba(5, 10, 14, .18) 46%, rgba(5, 10, 14, .62)), linear-gradient(0deg, rgba(5, 10, 14, .82), transparent 46%), url('${fallbackPosterPath}')` }} aria-hidden="true" />
  return <div className="world-canvas" aria-hidden="true"><Canvas camera={{ position: [0, 5.5, 18], fov: 42, near: 0.1, far: 100 }} dpr={[1, isMobile ? mobileDprCap : desktopDprCap]} shadows={!isMobile} gl={{ antialias: !isMobile, powerPreference: 'high-performance' }} onCreated={({ gl, scene }) => { gl.outputColorSpace = THREE.SRGBColorSpace; gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1; scene.background = new THREE.Color('#050a0e'); }}><Suspense fallback={null}><ambientLight intensity={0.25} color="#8fcfd0" /><directionalLight position={[5, 10, 6]} intensity={1.5} color="#c7ffff" castShadow={!isMobile} /><pointLight position={[-4, 4, -10]} intensity={4} distance={22} color="#ffbf69" /><WorldCanvas store={store} /></Suspense></Canvas></div>
}
