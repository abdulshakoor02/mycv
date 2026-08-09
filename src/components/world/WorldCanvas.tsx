'use client'

import { Line } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { chapterConfig } from '@/components/scroll/chapter-config'
import type { ScrollWorldStore } from '@/components/scroll/scroll-store'
import { cameraWaypoints, chapterColors, clamp, damp, lerp, projectLandmarkPositions, projects } from '@/types/portfolio'
import type { CameraWaypoint } from '@/types/portfolio'

type PointTuple = [number, number, number]

type RegionProps = {
  store: ScrollWorldStore
  chapterIndex: number
  mobile: boolean
}

const mobileCameraWaypoints = chapterConfig.map(({ camera }) => camera.mobile)
const palette = {
  background: '#050a0e',
  structure: '#10282f',
  structureDark: '#09191f',
  structureLight: '#1b3d45',
  cyan: '#70e6e0',
  blue: '#74b9ff',
  amber: '#ffbf69',
  green: '#b8f36b',
  project: '#ffd166',
  horizon: '#f6f7eb',
}

const mainCurrent: PointTuple[] = [
  [0, 0.16, 12],
  [0.5, 0.24, 6],
  [-0.4, 0.44, 0],
  [0.5, 0.7, -8],
  [-0.35, 0.64, -16],
  [0.28, 0.86, -24],
  [-0.2, 0.48, -34],
  [0.2, 0.32, -48],
]

const leadershipRoutes: PointTuple[][] = [
  [[0, 0.42, 3], [-3.8, 1.15, -1.2], [-2.2, 1.5, -6]],
  [[0, 0.42, 1.8], [3.6, 1.05, -2], [2.5, 1.7, -7]],
  [[-2.2, 1.5, -6], [0, 2.1, -8.2], [2.5, 1.7, -7]],
]

const serviceRoutes: PointTuple[][] = [
  [[-5, 1.3, -12], [-2.4, 1.9, -14], [0, 0.8, -16]],
  [[0, 0.8, -16], [2.4, 1.8, -14], [5, 1.3, -12]],
  [[-4.6, 1, -16.5], [-1.5, 2.2, -18], [2.8, 1, -17]],
]

const projectRoutes: PointTuple[][] = [
  [[0, 0.6, -28], [-3.8, 1.6, -34]],
  [[0, 0.6, -28], [-1.2, 2.6, -35.5]],
  [[0, 0.6, -28], [1.4, 1.5, -34]],
  [[0, 0.6, -28], [3.8, 2.3, -36.2]],
]

const vectorPoints = (points: PointTuple[]) => points.map(([x, y, z]) => new THREE.Vector3(x, y, z))

function blendForChapter(progress: number, chapterIndex: number) {
  return clamp(1 - Math.abs(progress * 5 - chapterIndex) / 1.55, 0.16, 1)
}

function sampleWaypointValue(waypoints: CameraWaypoint[], progress: number, key: 'fov') {
  const position = clamp(progress, 0, 1) * (waypoints.length - 1)
  const index = Math.min(waypoints.length - 2, Math.floor(position))
  const local = position - index
  return lerp(waypoints[index][key], waypoints[index + 1][key], local)
}

function samplePolyline(data: { points: THREE.Vector3[]; lengths: number[]; total: number }, progress: number, target: THREE.Vector3) {
  const distance = clamp(progress, 0, 1) * data.total
  let segment = 0
  while (segment < data.lengths.length - 1 && distance > data.lengths[segment + 1]) segment += 1
  const startDistance = data.lengths[segment]
  const endDistance = data.lengths[segment + 1] ?? data.total
  const local = (distance - startDistance) / Math.max(0.001, endDistance - startDistance)
  return target.lerpVectors(data.points[segment], data.points[segment + 1], local)
}

function SignalRoute({ points, color, opacity = 0.5, width = 1 }: { points: PointTuple[]; color: string; opacity?: number; width?: number }) {
  const vectors = useMemo(() => vectorPoints(points), [points])
  return <Line points={vectors} color={color} lineWidth={width} transparent opacity={opacity} />
}

function useRegionMotion({ store, chapterIndex, mobile }: RegionProps, ref: React.RefObject<THREE.Group | null>) {
  useFrame((_, dt) => {
    if (!ref.current) return
    const state = store.getState()
    const blend = blendForChapter(clamp(state.smooth / 5, 0, 1), chapterIndex)
    const targetScale = (mobile ? 0.96 : 0.98) + blend * 0.04
    ref.current.scale.x = damp(ref.current.scale.x, targetScale, 3.6, dt)
    ref.current.scale.y = damp(ref.current.scale.y, targetScale, 3.6, dt)
    ref.current.scale.z = damp(ref.current.scale.z, targetScale, 3.6, dt)
    ref.current.position.y = damp(ref.current.position.y, (1 - blend) * 0.12, 3.6, dt)
  })
}

function WorldEnvironment({ store, mobile }: { store: ScrollWorldStore; mobile: boolean }) {
  const group = useRef<THREE.Group>(null)
  const ribs = useMemo(() => Array.from({ length: mobile ? 5 : 9 }, (_, index) => ({
    x: index % 2 === 0 ? -7.8 : 7.8,
    y: 3.6 + (index % 3) * 0.6,
    z: 10 - index * 7.2,
    scale: 0.8 + (index % 3) * 0.18,
  })), [mobile])
  const skyline = useMemo(() => Array.from({ length: mobile ? 8 : 14 }, (_, index) => ({
    x: ((index * 19) % 17) - 8,
    y: 1.2 + (index % 4) * 0.5,
    z: 5 - (index % 8) * 6.6,
    width: 0.55 + (index % 3) * 0.2,
  })), [mobile])
  useFrame((_, dt) => {
    if (!group.current) return
    const state = store.getState()
    const targetRotation = store.getReducedMotion() ? 0 : Math.sin(state.smooth * 0.45) * 0.012
    group.current.rotation.y = damp(group.current.rotation.y, targetRotation, 1.8, dt)
  })
  return <group ref={group} name="environment">
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, -17]} receiveShadow>
      <planeGeometry args={[28, 86]} />
      <meshStandardMaterial color={palette.background} roughness={0.98} metalness={0.05} />
    </mesh>
    {ribs.map((rib, index) => <mesh key={`rib-${index}`} position={[rib.x, rib.y, rib.z]} rotation={[0, index % 2 === 0 ? -0.12 : 0.12, 0]} scale={rib.scale}>
      <torusGeometry args={[3.4, 0.055, 8, 40, Math.PI * 1.24]} />
      <meshStandardMaterial color={palette.structureLight} emissive={palette.structure} emissiveIntensity={0.5} roughness={0.82} metalness={0.22} transparent opacity={0.6} />
    </mesh>)}
    {skyline.map((building, index) => <mesh key={`silhouette-${index}`} position={[building.x, building.y / 2, building.z]} castShadow>
      <boxGeometry args={[building.width, building.y, building.width * 0.7]} />
      <meshStandardMaterial color={index % 3 === 0 ? palette.structure : palette.structureDark} emissive={index % 4 === 0 ? '#123b42' : palette.structureDark} emissiveIntensity={0.5} roughness={0.88} metalness={0.2} />
    </mesh>)}
    <SignalRoute points={[[0, 0.015, 14], [0, 0.015, -52]]} color="#163943" opacity={0.32} width={0.7} />
    <mesh position={[0, 7.2, -45]}>
      <sphereGeometry args={[4.8, 24, 12]} />
      <meshBasicMaterial color="#12313a" transparent opacity={0.24} />
    </mesh>
  </group>
}

function EngineeringCurrent({ store }: { store: ScrollWorldStore }) {
  const packetGroup = useRef<THREE.Group>(null)
  const packetData = useMemo(() => {
    const points = vectorPoints(mainCurrent)
    const lengths = [0]
    for (let index = 1; index < points.length; index += 1) lengths.push(lengths[index - 1] + points[index - 1].distanceTo(points[index]))
    return { points, lengths, total: lengths[lengths.length - 1] }
  }, [])
  const packetPosition = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ clock }) => {
    if (!packetGroup.current) return
    const state = store.getState()
    const worldProgress = clamp(state.smooth / 5, 0, 1)
    const motionProgress = store.getReducedMotion() ? worldProgress : (worldProgress * 0.88 + clock.elapsedTime * 0.018) % 1
    packetGroup.current.children.forEach((child, index) => {
      const offset = index * 0.12
      samplePolyline(packetData, (motionProgress + offset) % 1, packetPosition)
      child.position.copy(packetPosition)
      child.position.y += 0.12 + index * 0.08
      child.scale.setScalar(index === 0 ? 1 : 0.62)
    })
  })
  return <group name="engineering-current">
    <SignalRoute points={mainCurrent} color={palette.cyan} opacity={0.78} width={1.8} />
    <SignalRoute points={mainCurrent.slice(1, 6)} color={palette.horizon} opacity={0.15} width={4} />
    <mesh position={[0, 0.16, -18]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.045, 0.045, 42, 10]} />
      <meshStandardMaterial color={palette.cyan} emissive={palette.cyan} emissiveIntensity={2.6} roughness={0.35} metalness={0.4} />
    </mesh>
    <group ref={packetGroup} name="current-packets">
      <mesh><sphereGeometry args={[0.16, 14, 14]} /><meshBasicMaterial color={palette.amber} /></mesh>
      <mesh><sphereGeometry args={[0.1, 10, 10]} /><meshBasicMaterial color={palette.cyan} /></mesh>
      <mesh><sphereGeometry args={[0.08, 10, 10]} /><meshBasicMaterial color={palette.green} /></mesh>
    </group>
  </group>
}

function SignalOrigin({ store, mobile }: RegionProps) {
  const group = useRef<THREE.Group>(null)
  useRegionMotion({ store, chapterIndex: 0, mobile }, group)
  return <group ref={group} name="origin">
    <mesh position={[0, 0.08, 8]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[2.2, 2.6, 0.14, 48]} />
      <meshStandardMaterial color={palette.structure} emissive="#123a42" emissiveIntensity={0.7} roughness={0.72} metalness={0.38} />
    </mesh>
    {[1.1, 1.6, 2.1].map((radius) => <mesh key={radius} position={[0, 0.18, 8]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.025, 8, 48]} />
      <meshStandardMaterial color={palette.cyan} emissive={palette.cyan} emissiveIntensity={1.8} roughness={0.5} metalness={0.2} transparent opacity={0.55} />
    </mesh>)}
    <mesh position={[0, 0.62, 8]}>
      <icosahedronGeometry args={[0.34, 1]} />
      <meshStandardMaterial color={palette.horizon} emissive={palette.cyan} emissiveIntensity={2.4} roughness={0.3} metalness={0.3} />
    </mesh>
    <SignalRoute points={[[0, 0.4, 8], [-2.8, 1.2, 3.5], [0, 0.42, 0]]} color={palette.cyan} opacity={0.65} width={1.1} />
  </group>
}

function CoordinationSpan({ store, mobile }: RegionProps) {
  const group = useRef<THREE.Group>(null)
  useRegionMotion({ store, chapterIndex: 1, mobile }, group)
  const junctions: PointTuple[] = [[-3.8, 1.16, -1.2], [3.6, 1.06, -2], [-2.2, 1.5, -6], [2.5, 1.7, -7]]
  return <group ref={group} name="coordination-span">
    {[-1, 0, 1].map((offset) => <mesh key={offset} position={[offset * 0.24, 0.82 + Math.abs(offset) * 0.26, -3.4 + offset * 1.5]} rotation={[0, offset * 0.12, offset * 0.16]}>
      <boxGeometry args={[mobile ? 5.5 : 7.4, 0.12, 0.48]} />
      <meshStandardMaterial color={palette.structureLight} emissive={palette.blue} emissiveIntensity={0.7} roughness={0.68} metalness={0.36} />
    </mesh>)}
    {leadershipRoutes.map((route, index) => <SignalRoute key={index} points={route} color={index === 1 ? palette.blue : palette.cyan} opacity={0.62} width={1.1} />)}
    {junctions.map((point, index) => <mesh key={index} position={point}>
      <sphereGeometry args={[index < 2 ? 0.24 : 0.18, 14, 14]} />
      <meshStandardMaterial color={palette.blue} emissive={palette.blue} emissiveIntensity={1.8} roughness={0.35} metalness={0.3} />
    </mesh>)}
  </group>
}

function ServiceDelta({ store, mobile }: RegionProps) {
  const group = useRef<THREE.Group>(null)
  useRegionMotion({ store, chapterIndex: 2, mobile }, group)
  const clusters = useMemo(() => [
    { x: -5, z: -12, height: 1.7, color: palette.cyan },
    { x: -2.5, z: -14, height: 2.4, color: palette.blue },
    { x: 0, z: -16, height: 1.5, color: palette.amber },
    { x: 2.5, z: -14, height: 2.7, color: palette.green },
    { x: 5, z: -12, height: 1.9, color: palette.project },
  ].slice(0, mobile ? 4 : 5), [mobile])
  return <group ref={group} name="service-delta">
    {clusters.map((cluster, index) => <group key={index} position={[cluster.x, 0, cluster.z]}>
      <mesh position={[0, cluster.height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.52, 0.72, cluster.height, 8]} />
        <meshStandardMaterial color={palette.structure} emissive={cluster.color} emissiveIntensity={0.8} roughness={0.74} metalness={0.35} />
      </mesh>
      {Array.from({ length: mobile ? 2 : 3 }, (_, nodeIndex) => <mesh key={nodeIndex} position={[(nodeIndex - 1) * 0.38, cluster.height + 0.22 + (nodeIndex % 2) * 0.3, 0]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshBasicMaterial color={cluster.color} />
      </mesh>)}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.025, 8, 24]} />
        <meshStandardMaterial color={cluster.color} emissive={cluster.color} emissiveIntensity={1.2} transparent opacity={0.55} />
      </mesh>
    </group>)}
    {serviceRoutes.map((route, index) => <SignalRoute key={index} points={route} color={index === 1 ? palette.amber : palette.cyan} opacity={0.6} width={1.2} />)}
  </group>
}

function EngineeringLayers({ store, mobile }: RegionProps) {
  const group = useRef<THREE.Group>(null)
  useRegionMotion({ store, chapterIndex: 3, mobile }, group)
  const layers = [
    { name: 'interface', z: -20, x: -0.6, color: palette.cyan },
    { name: 'application', z: -22.5, x: 0.8, color: palette.blue },
    { name: 'data', z: -25, x: -0.5, color: palette.amber },
    { name: 'infrastructure', z: -27.5, x: 0.75, color: palette.green },
    { name: 'observability', z: -30, x: -0.25, color: palette.horizon },
  ]
  return <group ref={group} name="stack-plates">
    {layers.map((layer, index) => <group key={layer.name} position={[layer.x, 0.5 + index * 0.28, layer.z]}>
      <mesh rotation={[0, index % 2 === 0 ? -0.045 : 0.045, 0]}>
        <boxGeometry args={[mobile ? 6.8 : 8.8, 0.12, 2.1]} />
        <meshStandardMaterial color={palette.structure} emissive={layer.color} emissiveIntensity={0.8} roughness={0.56} metalness={0.3} transparent opacity={0.62} />
      </mesh>
      {Array.from({ length: mobile ? 3 : 5 }, (_, nodeIndex) => <mesh key={nodeIndex} position={[-2.8 + nodeIndex * 1.4, 0.2, (nodeIndex % 2 ? 0.5 : -0.5)]}>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color={layer.color} emissive={layer.color} emissiveIntensity={1.8} roughness={0.4} metalness={0.2} />
      </mesh>)}
    </group>)}
    <group name="conduits">
      {[-2.6, 0, 2.6].map((x) => <mesh key={x} position={[x, 1.7, -25]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.06, 3.1, 0.06]} />
        <meshStandardMaterial color={palette.green} emissive={palette.green} emissiveIntensity={1.6} roughness={0.45} metalness={0.2} />
      </mesh>)}
    </group>
  </group>
}

function ProjectArtifact({ id, index, color, position, store }: { id: string; index: number; color: string; position: PointTuple; store: ScrollWorldStore }) {
  const group = useRef<THREE.Group>(null)
  const glow = useRef<THREE.MeshStandardMaterial>(null)
  const secondaryGlow = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((_, dt) => {
    if (!group.current) return
    const state = store.getState()
    const active = state.index === 4 && Math.min(projects.length - 1, Math.floor(state.localExact * projects.length)) === index
    const targetScale = state.index === 4 ? (active ? 1.2 : 0.82) : 0.9
    const nextRotation = store.getReducedMotion() ? 0 : (index % 2 ? 0.15 : -0.1) * dt * 60
    group.current.scale.x = damp(group.current.scale.x, targetScale, 4.4, dt)
    group.current.scale.y = damp(group.current.scale.y, targetScale, 4.4, dt)
    group.current.scale.z = damp(group.current.scale.z, targetScale, 4.4, dt)
    group.current.rotation.y += nextRotation
    if (glow.current) glow.current.emissiveIntensity = damp(glow.current.emissiveIntensity, active ? 2.2 : 0.55, 4.4, dt)
    if (secondaryGlow.current) secondaryGlow.current.emissiveIntensity = damp(secondaryGlow.current.emissiveIntensity, active ? 1.8 : 0.35, 4.4, dt)
  })
  return <group ref={group} name={id} position={position}>
    {id === 'payments' && <>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.12, 10, 40]} />
        <meshStandardMaterial ref={glow} color={palette.structure} emissive={color} emissiveIntensity={0.55} roughness={0.42} metalness={0.45} />
      </mesh>
      {[0, 1, 2, 3].map((arm) => <mesh key={arm} position={[Math.cos(arm * Math.PI / 2) * 0.9, 0.1, Math.sin(arm * Math.PI / 2) * 0.9]} rotation={[0, arm * Math.PI / 2, Math.PI / 2]}>
        <boxGeometry args={[0.08, 1.8, 0.08]} />
        <meshStandardMaterial ref={arm === 0 ? secondaryGlow : undefined} color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>)}
    </>}
    {id === 'checknshare' && <>
      <mesh position={[-0.7, 0.7, 0]}>
        <cylinderGeometry args={[0.18, 0.28, 1.4, 12]} />
        <meshStandardMaterial ref={glow} color={palette.structure} emissive={color} emissiveIntensity={0.55} roughness={0.45} metalness={0.4} />
      </mesh>
      <mesh position={[0.7, 0.45, 0]}>
        <cylinderGeometry args={[0.14, 0.24, 0.9, 12]} />
        <meshStandardMaterial ref={secondaryGlow} color={palette.structure} emissive={color} emissiveIntensity={0.35} roughness={0.45} metalness={0.4} />
      </mesh>
      <SignalRoute points={[[-0.7, 0.65, 0], [0, 1.2, 0.7], [0.7, 0.45, 0]]} color={color} opacity={0.8} width={1.5} />
    </>}
    {id === 'opal' && <>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.12, 24]} />
        <meshStandardMaterial ref={glow} color={palette.structure} emissive={color} emissiveIntensity={0.55} roughness={0.5} metalness={0.32} />
      </mesh>
      <mesh position={[0, 0.22, 0.25]} rotation={[0.25, 0, 0]}>
        <coneGeometry args={[0.18, 0.8, 4]} />
        <meshStandardMaterial ref={secondaryGlow} color={color} emissive={color} emissiveIntensity={0.35} roughness={0.4} metalness={0.24} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.035, 8, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} transparent opacity={0.75} />
      </mesh>
    </>}
    {id === 'crm' && <>
      {[-0.75, 0, 0.75].map((x, panelIndex) => <mesh key={x} position={[x, 0.55 + panelIndex * 0.18, panelIndex % 2 ? -0.18 : 0.18]} rotation={[0, panelIndex * 0.1, panelIndex % 2 ? -0.08 : 0.08]}>
        <boxGeometry args={[0.62, 1.1 + panelIndex * 0.16, 0.12]} />
        <meshStandardMaterial ref={panelIndex === 0 ? glow : panelIndex === 1 ? secondaryGlow : undefined} color={palette.structure} emissive={color} emissiveIntensity={0.45} roughness={0.48} metalness={0.35} />
      </mesh>)}
      <SignalRoute points={[[-0.9, 0.3, 0.2], [0, 0.85, -0.2], [0.9, 0.3, 0.2]]} color={color} opacity={0.75} width={1.25} />
    </>}
  </group>
}

function ProjectConstellation({ store, mobile }: RegionProps) {
  const group = useRef<THREE.Group>(null)
  useRegionMotion({ store, chapterIndex: 4, mobile }, group)
  return <group ref={group} name="project-constellation">
    <SignalRoute points={[[0, 0.6, -28], [-3.8, 1.6, -34]]} color={palette.project} opacity={0.42} width={1} />
    {projectRoutes.slice(1).map((route, index) => <SignalRoute key={index} points={route} color={chapterColors[index + 1]} opacity={0.34} width={0.9} />)}
    {projects.map((project, index) => <ProjectArtifact key={project.id} id={project.id} index={index} color={chapterColors[index + 1]} position={projectLandmarkPositions[project.id]} store={store} />)}
    <mesh position={[0, 0.55, -28]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.2, 0.06, 8, 32]} />
      <meshStandardMaterial color={palette.project} emissive={palette.project} emissiveIntensity={1.4} transparent opacity={0.55} />
    </mesh>
  </group>
}

function OpenHorizon({ store, mobile }: RegionProps) {
  const group = useRef<THREE.Group>(null)
  useRegionMotion({ store, chapterIndex: 5, mobile }, group)
  return <group ref={group} name="open-horizon">
    <SignalRoute points={[[0.2, 0.32, -34], [0, 0.34, -42], [0.6, 0.3, -54]]} color={palette.horizon} opacity={0.58} width={1.1} />
    <mesh position={[0.6, 1.7, -47]}>
      <sphereGeometry args={[0.32, 16, 16]} />
      <meshBasicMaterial color={palette.horizon} transparent opacity={0.8} />
    </mesh>
    <mesh position={[0.6, 1.7, -47]}>
      <sphereGeometry args={[1.25, 16, 16]} />
      <meshBasicMaterial color={palette.amber} transparent opacity={0.08} />
    </mesh>
    <mesh position={[0, 3.8, -52]} rotation={[0, 0, 0]}>
      <planeGeometry args={[18, 5]} />
      <meshBasicMaterial color={palette.horizon} transparent opacity={0.035} />
    </mesh>
  </group>
}

function EngineeringAtmosphere({ store, mobile }: { store: ScrollWorldStore; mobile: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const count = mobile ? 160 : 360
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      const lane = index % 4
      data[index * 3] = ((index * 37) % 160 - 80) / 10 + (lane - 1.5) * 0.35
      data[index * 3 + 1] = 0.2 + ((index * 19) % 76) / 10
      data[index * 3 + 2] = 14 - ((index * 29) % 680) / 10
    }
    return data
  }, [count])
  useFrame(({ clock }) => {
    if (!ref.current) return
    const state = store.getState()
    ref.current.rotation.y = store.getReducedMotion() ? 0 : clock.elapsedTime * 0.004 + state.smooth * 0.004
    ref.current.position.z = store.getReducedMotion() ? 0 : Math.sin(clock.elapsedTime * 0.18) * 0.12
  })
  return <group name="atmosphere">
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} array={positions} itemSize={3} /></bufferGeometry>
      <pointsMaterial color="#b4e8df" size={mobile ? 0.045 : 0.055} transparent opacity={0.38} sizeAttenuation />
    </points>
    <mesh position={[-5, 4, -24]}>
      <sphereGeometry args={[3.4, 20, 12]} />
      <meshBasicMaterial color={palette.cyan} transparent opacity={0.025} />
    </mesh>
    <mesh position={[4, 3.5, -39]}>
      <sphereGeometry args={[4.6, 20, 12]} />
      <meshBasicMaterial color={palette.amber} transparent opacity={0.022} />
    </mesh>
  </group>
}

function WorldLighting({ store }: { store: ScrollWorldStore }) {
  const cool = useRef<THREE.PointLight>(null)
  const warm = useRef<THREE.PointLight>(null)
  const edge = useRef<THREE.PointLight>(null)
  useFrame((_, dt) => {
    const progress = clamp(store.getState().smooth / 5, 0, 1)
    const chapter = store.getState().index
    if (cool.current) cool.current.intensity = damp(cool.current.intensity, 1.2 + (1 - progress) * 1.2, 3, dt)
    if (warm.current) warm.current.intensity = damp(warm.current.intensity, chapter === 4 ? 4.5 : chapter === 5 ? 2.8 : 1.5 + progress * 1.2, 3, dt)
    if (edge.current) edge.current.intensity = damp(edge.current.intensity, 1.1 + progress * 1.8, 3, dt)
  })
  return <>
    <pointLight ref={cool} position={[-5, 5, 1]} color={palette.cyan} distance={24} intensity={2} />
    <pointLight ref={warm} position={[4, 3, -32]} color={palette.amber} distance={20} intensity={1.5} />
    <pointLight ref={edge} position={[0, 6, -48]} color={palette.horizon} distance={26} intensity={1.2} />
  </>
}

export default function WorldCanvas({ store }: { store: ScrollWorldStore }) {
  const { size } = useThree()
  const mobile = size.width < 800
  const positionCurve = useMemo(() => new THREE.CatmullRomCurve3(vectorPoints((mobile ? mobileCameraWaypoints : cameraWaypoints).map(({ position }) => position)), false, 'catmullrom', 0.45), [mobile])
  const targetCurve = useMemo(() => new THREE.CatmullRomCurve3(vectorPoints((mobile ? mobileCameraWaypoints : cameraWaypoints).map(({ target }) => target)), false, 'catmullrom', 0.45), [mobile])
  const desiredPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredTarget = useMemo(() => new THREE.Vector3(), [])
  const tangent = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera: activeCamera }, dt) => {
    const state = store.getState()
    const progress = clamp(state.smooth / 5, 0, 1)
    positionCurve.getPointAt(progress, desiredPosition)
    targetCurve.getPointAt(progress, desiredTarget)
    positionCurve.getTangentAt(progress, tangent)
    const reducedMotion = store.getReducedMotion()
    if (reducedMotion) {
      activeCamera.position.copy(desiredPosition)
    } else {
      activeCamera.position.x = damp(activeCamera.position.x, desiredPosition.x, 4.8, dt)
      activeCamera.position.y = damp(activeCamera.position.y, desiredPosition.y, 4.8, dt)
      activeCamera.position.z = damp(activeCamera.position.z, desiredPosition.z, 4.8, dt)
    }
    activeCamera.lookAt(desiredTarget)
    const targetRoll = reducedMotion ? 0 : clamp(-tangent.x * 0.035, -0.045, 0.045)
    activeCamera.rotation.z = reducedMotion ? 0 : damp(activeCamera.rotation.z, targetRoll, 3.8, dt)
    if ('fov' in activeCamera) {
      const fov = sampleWaypointValue(mobile ? mobileCameraWaypoints : cameraWaypoints, progress, 'fov')
      activeCamera.fov = reducedMotion ? fov : damp(activeCamera.fov, fov, 4.8, dt)
      activeCamera.updateProjectionMatrix()
    }
  })
  return <>
    <fog attach="fog" args={[palette.background, mobile ? 6.5 : 8, mobile ? 50 : 62]} />
    <WorldLighting store={store} />
    <WorldEnvironment store={store} mobile={mobile} />
    <EngineeringCurrent store={store} />
    <SignalOrigin store={store} chapterIndex={0} mobile={mobile} />
    <CoordinationSpan store={store} chapterIndex={1} mobile={mobile} />
    <ServiceDelta store={store} chapterIndex={2} mobile={mobile} />
    <EngineeringLayers store={store} chapterIndex={3} mobile={mobile} />
    <ProjectConstellation store={store} chapterIndex={4} mobile={mobile} />
    <OpenHorizon store={store} chapterIndex={5} mobile={mobile} />
    <EngineeringAtmosphere store={store} mobile={mobile} />
  </>
}
