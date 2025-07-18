'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export default function Avatar() {
  const meshRef = useRef<Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1.5, 0.5]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          transparent 
          opacity={0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={0.7}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      <mesh position={[0.4, 0.2, 0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          transparent 
          opacity={0.6}
        />
      </mesh>
      
      <mesh position={[-0.4, 0.2, 0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          transparent 
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}