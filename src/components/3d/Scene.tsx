'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import Avatar from './Avatar'

export default function Scene() {
  return (
    <div className="h-[500px] w-full relative">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        className="w-full h-full"
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <spotLight 
            position={[10, 15, 10]} 
            angle={0.3} 
            penumbra={1} 
            intensity={2} 
            castShadow 
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Avatar />
          
          <Environment preset="apartment" />
          
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            autoRotate
            autoRotateSpeed={0.4}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}