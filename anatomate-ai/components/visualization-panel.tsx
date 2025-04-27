"use client"

import { useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { User } from 'lucide-react'
import { useTheme } from "next-themes"
import * as THREE from 'three'

// Create a new component for the custom GLTF model
function AnatomyModel() {
  // Load the custom GLTF model
  const { scene: anatomyScene } = useGLTF('/models/anatomy/scene.gltf')
  
  // For the landing page, we just need a simple auto-rotation effect
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    // Apply a gentle rotation to the model
    anatomyScene.rotation.y = time * 0.1
  })

  return (
    <group>
      {/* Main body model */}
      <primitive 
        object={anatomyScene}
        scale={5} // Increased scale for better visibility
        position={[0, 0, 0]} // Centered position
      />
    </group>
  )
}

// Simple component for camera controls - not needed for detailed tracking on landing page
function CameraControls() {
  return null
}

export function VisualizationPanel() {
  const { theme } = useTheme()

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#E0F7FA] via-[#E1F5FE] to-[#E8F5E9] dark:from-[#0D47A1]/20 dark:via-[#01579B]/20 dark:to-[#004D40]/20 overflow-hidden">
      {/* Floating particles background effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {/* Larger gradient blobs */}
        <div className="absolute top-[10%] left-[15%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#00C58E]/20 to-[#00C58E]/5 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] rounded-full bg-gradient-to-br from-[#007AFF]/20 to-[#007AFF]/5 blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[#FFC107]/10 to-[#FFC107]/5 blur-3xl animate-pulse-slow"></div>
        
        {/* Tiny floating particles */}
        <div className="absolute top-[15%] left-[25%] w-2 h-2 rounded-full bg-[#34D399]/30 animate-float"></div>
        <div className="absolute top-[35%] left-[65%] w-1.5 h-1.5 rounded-full bg-[#60A5FA]/30 animate-float animation-delay-1000"></div>
        <div className="absolute top-[55%] left-[35%] w-1 h-1 rounded-full bg-[#A78BFA]/30 animate-float animation-delay-2000"></div>
        <div className="absolute top-[75%] left-[55%] w-2 h-2 rounded-full bg-[#FBBF24]/30 animate-float animation-delay-3000"></div>
        <div className="absolute top-[25%] left-[75%] w-1.5 h-1.5 rounded-full bg-[#4ADE80]/30 animate-float animation-delay-4000"></div>
        <div className="absolute top-[65%] left-[15%] w-1 h-1 rounded-full bg-[#818CF8]/30 animate-float animation-delay-5000"></div>
        
        {/* DNA helix shapes (very faint) */}
        <div className="absolute top-[5%] right-[10%] w-[100px] h-[300px] bg-gradient-to-b from-[#60A5FA]/5 to-[#34D399]/5 rounded-full blur-xl transform rotate-45 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-[15%] left-[10%] w-[80px] h-[250px] bg-gradient-to-b from-[#A78BFA]/5 to-[#FBBF24]/5 rounded-full blur-xl transform -rotate-45 animate-float animation-delay-3000"></div>
      </div>
      
      {/* Model halo glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-radial from-[#34D399]/30 to-transparent blur-xl animate-pulse-slow z-0"></div>
      
      {/* Profile button on top right */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="outline"
          size="icon"
          aria-label="Profile"
          className="bg-white/80 backdrop-blur-md hover:bg-white/95 transition-all duration-300 shadow-lg hover:shadow-xl rounded-full h-12 w-12 border border-white/50 hover:border-white/80 hover:scale-110"
        >
          <User size={22} className="text-gray-700" />
        </Button>
      </div>

      {/* 3D Model Canvas */}
      <Canvas camera={{ position: [-0.00, 0.02, 0.15], fov: 75 }} className="z-10 relative">
        {/* Enhanced lighting for better model presentation */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[-5, -5, 5]} intensity={0.3} color="#34D399" />
        <spotLight position={[0, 5, 5]} intensity={0.4} color="#60A5FA" angle={0.6} penumbra={1} />
        <spotLight position={[0, -5, 0]} intensity={0.2} color="#A78BFA" angle={0.7} penumbra={1} />
        
        {/* Enhanced controls with slow auto-rotation */}
        <OrbitControls 
          enableZoom={false} // Disable zoom for landing page
          enablePan={false} // Disable panning for landing page
          autoRotate={true} // Always auto-rotate for more life
          autoRotateSpeed={0.2} // Very slow rotation
          enableDamping={true}
          dampingFactor={0.05}
        />
        
        <Environment preset="studio" />
        
        {/* Shadow effect under model */}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.5, 0.5]} />
          <shadowMaterial opacity={0.2} transparent />
        </mesh>
        
        <AnatomyModel />
        <CameraControls />
      </Canvas>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#00C58E]/10 to-transparent z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#007AFF]/10 to-transparent z-0 pointer-events-none"></div>
      
      {/* Mini tip label */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-[#D1FAE5] shadow-lg backdrop-blur-sm border border-[#A7F3D0]/50 z-20 flex items-center space-x-2 transition-all duration-300 hover:shadow-xl hover:bg-[#A7F3D0]">
        <span className="text-xs sm:text-sm font-medium text-[#065F46]">🌿 Explore AnatoMate.ai - Your Health Companion</span>
      </div>
    </div>
  )
}

// Preload the model to improve performance
useGLTF.preload('/models/anatomy/scene.gltf')