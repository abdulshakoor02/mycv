
'use client'

import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Text } from '@react-three/drei'
import { Group, DoubleSide } from 'three'

function Figure() {
  const texture = useTexture('/avatar.png')
  return (
    <mesh position={[0, -0.5, 0.51]} castShadow>
      <planeGeometry args={[2.5, 4]} />
      <meshStandardMaterial map={texture} transparent alphaTest={0.5} />
    </mesh>
  )
}

export default function Avatar() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Blister Pack */}
      <mesh position={[0, 0, -0.5]} receiveShadow>
        <planeGeometry args={[4, 6]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 5, 1]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} roughness={0.1} metalness={0.9} side={DoubleSide} />
      </mesh>

      {/* Header */}
      <mesh position={[0, 2.5, 0]}>
        <planeGeometry args={[3.5, 0.8]} />
        <meshStandardMaterial color="#c0392b" roughness={0.5} metalness={0.5} />
      </mesh>
      <Text position={[0, 2.5, 0.51]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">
        Software Engineer
      </Text>

      {/* Action Figure Image */}
      <Suspense fallback={null}>
        <Figure />
      </Suspense>

      {/* Logos */}
      <group position={[1.5, 0, 0.55]}>
        <mesh position={[0, 1, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="#f1e05a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="#61dafb" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -1, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="#8cc84b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -2, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="#387eb8" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  )
}
