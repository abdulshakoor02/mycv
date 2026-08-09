'use client'

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import type { ScrollWorldState } from '@/types/portfolio'
import WorldCanvas from './WorldCanvas'

export default function ScrollWorld({ state }: { state: ScrollWorldState }) {
  const [webgl, setWebgl] = useState<boolean | null>(null)
  useEffect(() => { try { const canvas = document.createElement('canvas'); setWebgl(Boolean(canvas.getContext('webgl2'))) } catch { setWebgl(false) } }, [])
  if (webgl !== true) return <div className="world-fallback" aria-hidden="true" />
  return <div className="world-canvas" aria-label="Interactive Systems Observatory" aria-hidden="true"><Canvas camera={{ position: [0, 5.5, 18], fov: 42, near: 0.1, far: 100 }} dpr={[1, 1.75]} gl={{ antialias: true, powerPreference: 'high-performance' }} onCreated={({ gl, scene }) => { gl.outputColorSpace = THREE.SRGBColorSpace; gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1; scene.background = new THREE.Color('#050a0e'); }}><Suspense fallback={null}><ambientLight intensity={0.25} color="#8fcfd0" /><directionalLight position={[5, 10, 6]} intensity={1.5} color="#c7ffff" castShadow /><pointLight position={[-4, 4, -10]} intensity={4} distance={22} color="#ffbf69" /><WorldCanvas state={state} /></Suspense></Canvas></div>
}
