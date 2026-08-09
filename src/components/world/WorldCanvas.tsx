'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { Line, Text } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { cameraWaypoints, chapterColors, damp, lerp, projectLandmarkPositions, projects } from '@/types/portfolio'
import type { ScrollWorldState } from '@/types/portfolio'

function lerpPoint(a: [number, number, number], b: [number, number, number], t: number) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)] as [number, number, number]
}

function WorldEnvironment({ state }: { state: ScrollWorldState }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, state.smooth * 0.025, 2, dt)
  })
  const towers = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ x: ((i * 17) % 13) - 6, z: -4 - (i % 6) * 5, h: 1.5 + (i % 5) * 0.55, w: 0.45 + (i % 3) * 0.18 })), [])
  return <group ref={group} name="environment">
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, -12]} receiveShadow>
      <planeGeometry args={[30, 70]} />
      <meshStandardMaterial color="#071116" roughness={0.92} metalness={0.12} />
    </mesh>
    <gridHelper args={[30, 30, '#17323a', '#0d2027']} position={[0, 0, -14]} rotation={[0, 0, 0]} />
    {towers.map((tower, i) => <mesh key={i} position={[tower.x, tower.h / 2, tower.z]} castShadow>
      <boxGeometry args={[tower.w, tower.h, tower.w]} />
      <meshStandardMaterial color={i % 4 === 0 ? '#122c32' : '#0b1b22'} emissive={i % 4 === 0 ? '#123e48' : '#07161a'} emissiveIntensity={0.5} roughness={0.72} metalness={0.4} />
    </mesh>)}
    <mesh position={[0, 6, -38]}>
      <sphereGeometry args={[5.5, 32, 16]} />
      <meshBasicMaterial color="#142c35" transparent opacity={0.32} />
    </mesh>
    <fog attach="fog" args={['#050a0e', 10 + state.smooth * 0.4, 58]} />
  </group>
}

function SignalSpine({ state }: { state: ScrollWorldState }) {
  const packet = useRef<THREE.Mesh>(null)
  const linePoints = useMemo(() => [new THREE.Vector3(0, 0.08, 10), new THREE.Vector3(0, 0.08, -42)], [])
  useFrame(({ clock }) => {
    if (!packet.current) return
    const t = (clock.elapsedTime * 0.18 + state.smooth * 0.17) % 1
    packet.current.position.z = 10 - t * 52
    packet.current.position.x = Math.sin(clock.elapsedTime * 1.8) * 0.12
  })
  return <group name="signal-spine">
    <Line points={linePoints} color={chapterColors[state.index]} lineWidth={1.2} transparent opacity={0.55} />
    <mesh position={[0, 0.08, -16]}><cylinderGeometry args={[0.08, 0.08, 52, 12]} /><meshStandardMaterial color="#79d9d3" emissive="#1b6a70" emissiveIntensity={2} /></mesh>
    <mesh ref={packet} position={[0, 0.18, 8]}><sphereGeometry args={[0.13, 12, 12]} /><meshBasicMaterial color="#ffbf69" /></mesh>
  </group>
}

function Architecture({ state }: { state: ScrollWorldState }) {
  const routes = useMemo(() => [
    [[-5, 0.8, -12], [-2, 2.8, -18], [0, 0.8, -26]],
    [[5, 0.8, -10], [2, 3.3, -16], [0, 0.8, -26]],
    [[-4, 1.2, -30], [0, 4.5, -34], [4, 1.2, -30]],
  ] as [number, number, number][][], [])
  return <group name="landmarks">
    {routes.map((points, index) => <Line key={index} points={points.map((p) => new THREE.Vector3(...p))} color={index === 1 ? '#ffbf69' : '#2c7680'} lineWidth={1} transparent opacity={0.7} />)}
    <mesh position={[0, 2.5, -20]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[3.4, 3.4, 0.12]} /><meshStandardMaterial color="#152d35" emissive="#0e4049" emissiveIntensity={0.8} transparent opacity={0.75} /></mesh>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-3.2 + (i % 3) * 3.2, 1 + Math.floor(i / 3) * 1.8, -24 - (i % 2) * 2]}>
      <boxGeometry args={[0.6, 0.6, 0.6]} /><meshStandardMaterial color={i % 3 === 0 ? '#70e6e0' : '#233b42'} emissive={i % 3 === 0 ? '#247b7f' : '#08191e'} emissiveIntensity={1.2} />
    </mesh>)}
    <Text position={[0, 6.2, -20]} fontSize={0.5} color="#8d9b9b" anchorX="center" letterSpacing={0.12}>SYSTEMS / SERVICES / OUTCOMES</Text>
    <Text position={[0, 0.25, -34]} fontSize={0.32} color="#ffbf69" anchorX="center" letterSpacing={0.2}>SHIP WITH INTENT</Text>
    <group position={[0, 0.7, -37]}>{projects.map((project, index) => <mesh key={project.id} position={projectLandmarkPositions[project.id]} scale={state.index === 4 ? 1 + (index === 0 ? 0.1 : 0) : 0.9}>
      <octahedronGeometry args={[0.7 + index * 0.12, 1]} /><meshStandardMaterial color={chapterColors[index + 1]} emissive={chapterColors[index + 1]} emissiveIntensity={state.index === 4 ? 1.2 : 0.45} roughness={0.35} metalness={0.65} />
    </mesh>)}</group>
  </group>
}

function Atmosphere({ state }: { state: ScrollWorldState }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => { const data = new Float32Array(260 * 3); for (let i = 0; i < 260; i += 1) { data[i * 3] = ((i * 37) % 140 - 70) / 10; data[i * 3 + 1] = ((i * 19) % 80) / 10; data[i * 3 + 2] = -((i * 29) % 520) / 10 } return data }, [])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.008 + state.smooth * 0.01 })
  return <points ref={ref} name="atmosphere"><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} array={positions} itemSize={3} /></bufferGeometry><pointsMaterial color="#a9dcd6" size={0.035} transparent opacity={0.32} sizeAttenuation /></points>
}

export default function WorldCanvas({ state }: { state: ScrollWorldState }) {
  const { camera } = useThree()
  const position = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame((_, dt) => {
    const index = Math.min(cameraWaypoints.length - 2, Math.floor(state.smooth))
    const local = Math.max(0, Math.min(1, state.smooth - index))
    const a = cameraWaypoints[index]
    const b = cameraWaypoints[index + 1]
    position.set(...lerpPoint(a.position, b.position, local))
    target.set(...lerpPoint(a.target, b.target, local))
    camera.position.x = damp(camera.position.x, position.x, 5.2, dt)
    camera.position.y = damp(camera.position.y, position.y, 5.2, dt)
    camera.position.z = damp(camera.position.z, position.z, 5.2, dt)
    camera.lookAt(target)
    const fov = lerp(a.fov, b.fov, local)
    if ('fov' in camera) { camera.fov = damp(camera.fov, fov, 5.2, dt); camera.updateProjectionMatrix() }
  })
  return <><WorldEnvironment state={state} /><SignalSpine state={state} /><Architecture state={state} /><Atmosphere state={state} /></>
}
