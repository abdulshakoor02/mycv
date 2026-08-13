'use client'

import { Line } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { chapterConfig } from '@/components/scroll/chapter-config'
import type { ScrollWorldStore } from '@/components/scroll/scroll-store'
import { cameraWaypoints, chapterColors, clamp, damp, lerp, projectLandmarkPositions, projects } from '@/types/portfolio'
import type { CameraWaypoint } from '@/types/portfolio'
import { worldMaterials } from './materials'
import { createPostPipeline, type PostPipeline } from './postprocessing'

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
  red: '#ff6b6b',
  muted: '#5a7373',
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

/* a code/terminal window: a dark screen panel with an emissive title bar */
function CodeWindow({ width, height, position, rotation = [0, 0, 0], titleColor = palette.green, screenBright = 1 }: {
  width: number
  height: number
  position: PointTuple
  rotation?: [number, number, number]
  titleColor?: string
  screenBright?: number
}) {
  return <group position={position} rotation={rotation}>
    <mesh castShadow>
      <boxGeometry args={[width, height, 0.06]} />
      <primitive object={worldMaterials.panel()} attach="material" />
    </mesh>
    <mesh position={[0, 0, 0.035]}>
      <planeGeometry args={[width - 0.16, height - 0.34]} />
      <primitive object={worldMaterials.code()} attach="material" />
    </mesh>
    <mesh position={[0, height / 2 - 0.11, 0.04]}>
      <boxGeometry args={[width, 0.12, 0.02]} />
      <meshStandardMaterial color={palette.structureLight} emissive={titleColor} emissiveIntensity={1.4 * screenBright} roughness={0.4} />
    </mesh>
  </group>
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
  /* distant server-rack silhouettes — vertical hardware monoliths */
  const racks = useMemo(() => Array.from({ length: mobile ? 8 : 14 }, (_, index) => ({
    x: ((index * 19) % 17) - 8,
    y: 1.1 + (index % 4) * 0.55,
    z: 5 - (index % 8) * 6.6,
    width: 0.6 + (index % 3) * 0.22,
    depth: 1.6 + (index % 2) * 0.5,
    led: index % 3 === 0,
  })), [mobile])
  useFrame((_, dt) => {
    if (!group.current) return
    const state = store.getState()
    const targetRotation = store.getReducedMotion() ? 0 : Math.sin(state.smooth * 0.45) * 0.008
    group.current.rotation.y = damp(group.current.rotation.y, targetRotation, 1.8, dt)
  })
  return <group ref={group} name="environment">
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, -17]} receiveShadow>
      <planeGeometry args={[30, 92]} />
      <primitive object={worldMaterials.ground()} attach="material" />
    </mesh>
    {racks.map((rack, index) => <group key={`rack-${index}`} position={[rack.x, rack.y / 2, rack.z]}>
      <mesh castShadow>
        <boxGeometry args={[rack.width, rack.y, rack.depth]} />
        <primitive object={worldMaterials.panel()} attach="material" />
      </mesh>
      {rack.led && <mesh position={[0, rack.y * 0.42, rack.depth / 2 + 0.02]}>
        <boxGeometry args={[rack.width * 0.6, 0.05, 0.02]} />
        <meshStandardMaterial color={index % 2 ? palette.amber : palette.green} emissive={index % 2 ? palette.amber : palette.green} emissiveIntensity={2.4} roughness={0.4} />
      </mesh>}
    </group>)}
    <SignalRoute points={[[0, 0.015, 14], [0, 0.015, -52]]} color="#163943" opacity={0.28} width={0.7} />
    <mesh position={[0, 7.2, -45]}>
      <sphereGeometry args={[4.8, 24, 12]} />
      <meshBasicMaterial color="#12313a" transparent opacity={0.22} />
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
      <mesh><sphereGeometry args={[0.16, 14, 14]} /><meshStandardMaterial color={palette.amber} emissive={palette.amber} emissiveIntensity={3.4} roughness={0.4} /></mesh>
      <mesh><sphereGeometry args={[0.1, 10, 10]} /><meshStandardMaterial color={palette.cyan} emissive={palette.cyan} emissiveIntensity={3.4} roughness={0.4} /></mesh>
      <mesh><sphereGeometry args={[0.08, 10, 10]} /><meshStandardMaterial color={palette.green} emissive={palette.green} emissiveIntensity={3.4} roughness={0.4} /></mesh>
    </group>
  </group>
}

function SignalOrigin({ store, mobile }: RegionProps) {
  const group = useRef<THREE.Group>(null)
  useRegionMotion({ store, chapterIndex: 0, mobile }, group)
  /* chapter 0 · identity — an IDE window + a git commit graph, where code begins */
  return <group ref={group} name="origin">
    <mesh position={[0, 0.05, 8]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[2.4, 2.7, 0.1, 48]} />
      <primitive object={worldMaterials.panel()} attach="material" />
    </mesh>
    <CodeWindow width={mobile ? 4.6 : 5.4} height={mobile ? 3.0 : 3.4} position={[0, 2.4, 8]} />
    {/* floating commit nodes + a branch line */}
    {[[-1.8, 1.5, 7.4], [-0.4, 2.2, 7.8], [1.2, 1.7, 7.2]].map((pos, i) => <mesh key={i} position={pos as PointTuple}>
      <sphereGeometry args={[0.1, 12, 12]} />
      <meshStandardMaterial color={i === 1 ? palette.green : palette.blue} emissive={i === 1 ? palette.green : palette.blue} emissiveIntensity={2.6} roughness={0.4} />
    </mesh>)}
    <SignalRoute points={[[-1.8, 1.5, 7.4], [-0.4, 2.2, 7.8], [1.2, 1.7, 7.2]]} color={palette.cyan} opacity={0.7} width={1.2} />
    <SignalRoute points={[[0, 0.4, 8], [-2.8, 1.2, 3.5], [0, 0.42, 0]]} color={palette.cyan} opacity={0.6} width={1.1} />
  </group>
}

function CoordinationSpan({ store, mobile }: RegionProps) {
  const group = useRef<THREE.Group>(null)
  useRegionMotion({ store, chapterIndex: 1, mobile }, group)
  /* chapter 1 · leadership — a CI/CD pipeline: build → test → review → deploy */
  const stages: { x: number; y: number; z: number; label: string; color: string }[] = [
    { x: -3.8, y: 1.15, z: -1.2, label: 'build', color: palette.cyan },
    { x: -1.2, y: 1.35, z: -3.4, label: 'test', color: palette.green },
    { x: 1.4, y: 1.15, z: -5.2, label: 'review', color: palette.blue },
    { x: 3.8, y: 1.5, z: -7.4, label: 'deploy', color: palette.amber },
  ]
  return <group ref={group} name="coordination-span">
    {stages.map((stage, index) => <group key={stage.label} position={[stage.x, stage.y, stage.z]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.34, 0.42, 0.3, 20]} />
        <primitive object={worldMaterials.panel()} attach="material" />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <torusGeometry args={[0.34, 0.03, 8, 24]} />
        <meshStandardMaterial color={stage.color} emissive={stage.color} emissiveIntensity={2.6} roughness={0.4} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={stage.color} emissive={stage.color} emissiveIntensity={3.2} roughness={0.4} />
      </mesh>
    </group>)}
    <SignalRoute points={[[-3.8, 1.15, -1.2], [-1.2, 1.35, -3.4], [1.4, 1.15, -5.2], [3.8, 1.5, -7.4]]} color={palette.cyan} opacity={0.7} width={1.2} />
    {/* build status badges */}
    {[[-2.5, 1.9, -2.4], [0, 2.1, -4.4], [2.6, 1.9, -6.4]].map((pos, i) => <mesh key={i} position={pos as PointTuple}>
      <boxGeometry args={[0.5, 0.14, 0.02]} />
      <meshStandardMaterial color={i === 1 ? palette.green : palette.amber} emissive={i === 1 ? palette.green : palette.amber} emissiveIntensity={2.0} roughness={0.4} />
    </mesh>)}
  </group>
}

function ServiceDelta({ store, mobile }: RegionProps) {
  const group = useRef<THREE.Group>(null)
  useRegionMotion({ store, chapterIndex: 2, mobile }, group)
  /* chapter 2 · systems — an API gateway, four services, and a database core */
  const services = useMemo(() => [
    { x: -5, z: -12, height: 1.6, color: palette.cyan, tag: 'API' },
    { x: -2.6, z: -14, height: 2.2, color: palette.blue, tag: 'SVC' },
    { x: 0, z: -16, height: 1.4, color: palette.amber, tag: 'SVC' },
    { x: 2.6, z: -14, height: 2.5, color: palette.green, tag: 'SVC' },
    { x: 5, z: -12, height: 1.8, color: palette.project, tag: 'SVC' },
  ].slice(0, mobile ? 4 : 5), [mobile])
  return <group ref={group} name="service-delta">
    {/* event stream bus along the ground */}
    <SignalRoute points={[[-5, 0.35, -12], [0, 0.6, -16], [5, 0.35, -12]]} color={palette.cyan} opacity={0.5} width={1.1} />
    {services.map((service, index) => <group key={index} position={[service.x, 0, service.z]}>
      {/* service container: a cylinder + a lit status ring */}
      <mesh position={[0, service.height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.68, service.height, 8]} />
        <primitive object={worldMaterials.panel()} attach="material" />
      </mesh>
      <mesh position={[0, service.height + 0.16, 0]}>
        <torusGeometry args={[0.5, 0.03, 8, 24]} />
        <meshStandardMaterial color={service.color} emissive={service.color} emissiveIntensity={2.6} roughness={0.4} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.68, 0.02, 8, 24]} />
        <meshStandardMaterial color={service.color} emissive={service.color} emissiveIntensity={1.4} transparent opacity={0.5} />
      </mesh>
    </group>)}
    {/* database cylinder in the centre */}
    <group position={[0, 0, -16]}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 2.0, 24]} />
        <primitive object={worldMaterials.panel()} attach="material" />
      </mesh>
      {[0.6, 1.1, 1.6].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.9, 0.015, 8, 24]} />
        <meshStandardMaterial color={palette.amber} emissive={palette.amber} emissiveIntensity={1.8} transparent opacity={0.7} />
      </mesh>)}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={palette.green} emissive={palette.green} emissiveIntensity={3.2} roughness={0.4} />
      </mesh>
    </group>
  </group>
}

function EngineeringLayers({ store, mobile }: RegionProps) {
  const group = useRef<THREE.Group>(null)
  useRegionMotion({ store, chapterIndex: 3, mobile }, group)
  /* chapter 3 · engineering — a full-stack cross-section: UI → API → service → data → infra */
  const layers = [
    { name: 'interface', z: -20, x: -0.6, color: palette.cyan, label: 'UI' },
    { name: 'api', z: -22.5, x: 0.8, color: palette.blue, label: 'API' },
    { name: 'service', z: -25, x: -0.5, color: palette.amber, label: 'SVC' },
    { name: 'data', z: -27.5, x: 0.75, color: palette.green, label: 'DB' },
    { name: 'infra', z: -30, x: -0.25, color: palette.horizon, label: 'OPS' },
  ]
  return <group ref={group} name="stack-plates">
    {layers.map((layer, index) => <group key={layer.name} position={[layer.x, 0.55 + index * 0.62, layer.z]}>
      <mesh rotation={[0, index % 2 === 0 ? -0.045 : 0.045, 0]} castShadow>
        <boxGeometry args={[mobile ? 6.8 : 8.8, 0.16, 2.4]} />
        <primitive object={worldMaterials.panel()} attach="material" />
      </mesh>
      {/* service "pills" on each plate */}
      {Array.from({ length: mobile ? 3 : 5 }, (_, nodeIndex) => <mesh key={nodeIndex} position={[-2.8 + nodeIndex * 1.4, 0.18, (nodeIndex % 2 ? 0.6 : -0.6)]}>
        <boxGeometry args={[0.34, 0.14, 0.14]} />
        <meshStandardMaterial color={layer.color} emissive={layer.color} emissiveIntensity={2.0} roughness={0.4} />
      </mesh>)}
      {/* label chip */}
      <mesh position={[mobile ? -3.2 : -4.1, 0.2, 0]}>
        <boxGeometry args={[0.62, 0.16, 0.06]} />
        <meshStandardMaterial color={palette.structure} emissive={layer.color} emissiveIntensity={1.4} roughness={0.4} />
      </mesh>
    </group>)}
    {/* data flow conduit connecting the layers */}
    <group name="conduits">
      {[-2.6, 0, 2.6].map((x) => <mesh key={x} position={[x, 1.9, -25]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.06, 3.4, 0.06]} />
        <meshStandardMaterial color={palette.green} emissive={palette.green} emissiveIntensity={1.6} roughness={0.45} metalness={0.2} />
      </mesh>)}
    </group>
    <SignalRoute points={[[0, 0.7, -20], [0, 1.5, -22.5], [0, 2.3, -25], [0, 3.1, -27.5], [0, 3.9, -30]]} color={palette.cyan} opacity={0.6} width={1.1} />
  </group>
}

function ProjectArtifact({ id, index, color, position, store }: { id: string; index: number; color: string; position: PointTuple; store: ScrollWorldStore }) {
  const group = useRef<THREE.Group>(null)
  const glow = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((_, dt) => {
    if (!group.current) return
    const state = store.getState()
    const active = state.index === 4 && Math.min(projects.length - 1, Math.floor(state.localExact * projects.length)) === index
    const targetScale = state.index === 4 ? (active ? 1.16 : 0.82) : 0.9
    const nextRotation = store.getReducedMotion() ? 0 : (index % 2 ? 0.06 : -0.05) * dt * 60
    group.current.scale.x = damp(group.current.scale.x, targetScale, 4.4, dt)
    group.current.scale.y = damp(group.current.scale.y, targetScale, 4.4, dt)
    group.current.scale.z = damp(group.current.scale.z, targetScale, 4.4, dt)
    group.current.rotation.y += nextRotation
    if (glow.current) glow.current.emissiveIntensity = damp(glow.current.emissiveIntensity, active ? 2.4 : 0.55, 4.4, dt)
  })
  /* each project is a recognizable software artifact — a browser/console window */
  const isApp = id === 'payments' || id === 'checknshare' || id === 'crm'
  const isTelemetry = id === 'opal'
  return <group ref={group} name={id} position={position}>
    {isApp && <>
      {/* browser chrome: a code window with a project-specific accent */}
      <CodeWindow width={2.4} height={1.7} position={[0, 1.1, 0]} titleColor={color} />
      {/* a data-table of rows under the window */}
      {[0, 1, 2].map((row) => <mesh key={row} position={[0, 0.55 - row * 0.16, 0]}>
        <boxGeometry args={[2.0, 0.06, 0.04]} />
        <meshStandardMaterial ref={row === 0 ? glow : undefined} color={palette.structure} emissive={color} emissiveIntensity={0.4} roughness={0.5} />
      </mesh>)}
    </>}
    {isTelemetry && <>
      {/* telemetry dashboard: a gauge + live needle */}
      <CodeWindow width={2.0} height={1.5} position={[0, 1.2, 0]} titleColor={color} />
      <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.05, 8, 24, Math.PI]} />
        <meshStandardMaterial ref={glow} color={palette.structure} emissive={color} emissiveIntensity={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.55, 0.04, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} roughness={0.4} />
      </mesh>
    </>}
  </group>
}

function ProjectConstellation({ store, mobile }: RegionProps) {
  const group = useRef<THREE.Group>(null)
  useRegionMotion({ store, chapterIndex: 4, mobile }, group)
  return <group ref={group} name="project-constellation">
    {/* release/deploy hub — a central "shipped" terminal */}
    <CodeWindow width={2.6} height={1.9} position={[0, 1.5, -28]} titleColor={palette.project} />
    <SignalRoute points={[[0, 0.6, -28], [-3.8, 1.6, -34]]} color={palette.project} opacity={0.42} width={1} />
    {projectRoutes.slice(1).map((route, index) => <SignalRoute key={index} points={route} color={chapterColors[index + 1]} opacity={0.34} width={0.9} />)}
    {projects.map((project, index) => <ProjectArtifact key={project.id} id={project.id} index={index} color={chapterColors[index + 1]} position={projectLandmarkPositions[project.id]} store={store} />)}
    <mesh position={[0, 0.55, -28]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.4, 0.05, 8, 32]} />
      <meshStandardMaterial color={palette.project} emissive={palette.project} emissiveIntensity={1.5} transparent opacity={0.5} />
    </mesh>
  </group>
}

function OpenHorizon({ store, mobile }: RegionProps) {
  const group = useRef<THREE.Group>(null)
  useRegionMotion({ store, chapterIndex: 5, mobile }, group)
  /* chapter 5 · contact — a deploy-to-cloud horizon: an upward path to a calm cloud beacon */
  return <group ref={group} name="open-horizon">
    <SignalRoute points={[[0.2, 0.32, -34], [0, 1.4, -42], [0.6, 2.6, -54]]} color={palette.horizon} opacity={0.6} width={1.1} />
    {/* cloud beacon */}
    <mesh position={[0.6, 2.9, -47]}>
      <sphereGeometry args={[0.34, 16, 16]} />
      <meshStandardMaterial color={palette.horizon} emissive={palette.horizon} emissiveIntensity={3.6} roughness={0.3} />
    </mesh>
    <mesh position={[0.6, 2.9, -47]}>
      <sphereGeometry args={[1.3, 16, 16]} />
      <meshBasicMaterial color={palette.amber} transparent opacity={0.08} />
    </mesh>
    {/* cloud shape: stacked translucent discs */}
    {[[-0.2, 3.4, -52, 1.1], [0.9, 3.6, -52, 0.9], [0.4, 3.2, -52, 1.3]].map(([cx, cy, cz, cr], i) => <mesh key={i} position={[cx, cy, cz]}>
      <sphereGeometry args={[cr, 16, 12]} />
      <meshBasicMaterial color={palette.horizon} transparent opacity={0.05} />
    </mesh>)}
    <mesh position={[0, 3.8, -52]} rotation={[0, 0, 0]}>
      <planeGeometry args={[18, 5]} />
      <meshBasicMaterial color={palette.horizon} transparent opacity={0.03} />
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
  const { size, gl, scene, camera } = useThree()
  const mobile = size.width < 800
  const positionCurve = useMemo(() => new THREE.CatmullRomCurve3(vectorPoints((mobile ? mobileCameraWaypoints : cameraWaypoints).map(({ position }) => position)), false, 'catmullrom', 0.45), [mobile])
  const targetCurve = useMemo(() => new THREE.CatmullRomCurve3(vectorPoints((mobile ? mobileCameraWaypoints : cameraWaypoints).map(({ target }) => target)), false, 'catmullrom', 0.45), [mobile])
  const desiredPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredTarget = useMemo(() => new THREE.Vector3(), [])
  const tangent = useMemo(() => new THREE.Vector3(), [])
  const viewDir = useMemo(() => new THREE.Vector3(), [])

  /* pointer parallax — a damped hand-held drift, never enough to break the frame */
  const parallax = useRef({ x: 0, y: 0, tx: 0, ty: 0, enabled: false })
  const intro = useRef(0)

  useEffect(() => {
    const reduced = store.getReducedMotion()
    if (reduced || window.matchMedia('(hover: none)').matches) {
      parallax.current.enabled = false
      return
    }
    parallax.current.enabled = true
    const onMove = (e: PointerEvent) => {
      parallax.current.tx = (e.clientX / window.innerWidth) * 2 - 1
      parallax.current.ty = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [store])

  /* post-processing pipeline — takes over the frame render so R3F's auto
     render is skipped (renderPriority > 0 sets internal.priority). */
  const postRef = useRef<PostPipeline | null>(null)
  const mobileRef = useRef(mobile)
  mobileRef.current = mobile
  const lastSize = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const activeCamera = camera as THREE.PerspectiveCamera
    const prevTone = gl.toneMapping
    gl.toneMapping = THREE.NoToneMapping
    const pipeline = createPostPipeline(gl, scene, activeCamera, {
      reducedMotion: store.getReducedMotion(),
      low: mobile,
    })
    pipeline.resize(size.width, size.height, gl.getPixelRatio())
    postRef.current = pipeline
    return () => {
      pipeline.dispose()
      postRef.current = null
      gl.toneMapping = prevTone
    }
  }, [gl, scene, camera, store, mobile])

  const aspectFix = () => clamp((1.62 - size.width / size.height) / 1.05, 0, 1)

  useFrame(({ camera: activeCamera }, dt) => {
    const state = store.getState()
    const progress = clamp(state.smooth / 5, 0, 1)
    positionCurve.getPointAt(progress, desiredPosition)
    targetCurve.getPointAt(progress, desiredTarget)
    positionCurve.getTangentAt(progress, tangent)
    const reducedMotion = store.getReducedMotion()

    /* opening dolly — a long lens easing in from further back */
    if (intro.current < 1) intro.current = reducedMotion ? 1 : clamp(intro.current + dt / 2.4, 0, 1)
    const io = 1 - intro.current

    /* tall-screen correction: step back along the view axis and open FOV */
    const nf = reducedMotion ? 0 : aspectFix()
    if (nf > 0) {
      viewDir.subVectors(desiredPosition, desiredTarget).normalize()
      desiredPosition.addScaledVector(viewDir, nf * 8.2)
      desiredPosition.y += nf * 1.1
    }

    /* opening dolly offsets */
    desiredPosition.z += io * 5.6
    desiredPosition.y += io * 0.65

    /* pointer parallax */
    if (parallax.current.enabled && !reducedMotion) {
      parallax.current.x = damp(parallax.current.x, parallax.current.tx, 2.6, dt)
      parallax.current.y = damp(parallax.current.y, parallax.current.ty, 2.6, dt)
      const t = clamp(state.smooth / 1.6, 0, 1)
      const par = 1 - (t * t * (3 - 2 * t)) * 0.55
      desiredPosition.x += parallax.current.x * 0.62 * par
      desiredPosition.y += parallax.current.y * 0.34 * par
      desiredTarget.x -= parallax.current.x * 0.2 * par
      desiredTarget.y -= parallax.current.y * 0.12 * par
    }

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
      const fov = sampleWaypointValue(mobile ? mobileCameraWaypoints : cameraWaypoints, progress, 'fov') * (1 + nf * 0.4) + io * 8
      activeCamera.fov = reducedMotion ? fov : damp(activeCamera.fov, fov, 4.8, dt)
      activeCamera.updateProjectionMatrix()
    }
  })

  /* render via the composer on a priority-1 frame (runs after priority-0
     camera/world updates; skips R3F's own gl.render). */
  useFrame(({ clock }) => {
    const pipeline = postRef.current
    if (!pipeline) return
    const w = size.width
    const h = size.height
    if (lastSize.current.w !== w || lastSize.current.h !== h) {
      lastSize.current = { w, h }
      pipeline.resize(w, h, gl.getPixelRatio())
    }
    pipeline.finish.uniforms.uTime.value = clock.elapsedTime
    pipeline.finish.uniforms.uGrain.value = store.getReducedMotion() ? 0 : mobileRef.current ? 0.035 : 0.045
    pipeline.composer.render()
  }, 1)

  return <>
    <fogExp2 attach="fog" args={[palette.background, mobile ? 0.024 : 0.018]} />
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
