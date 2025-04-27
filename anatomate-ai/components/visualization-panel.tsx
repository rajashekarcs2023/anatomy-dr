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
    <div className="fixed inset-0 bg-gradient-to-br from-[#0B132B] via-[#1C3D5A] to-[#0F2C5B] overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#6A11CB]/30 via-[#2575FC]/20 to-[#00C9FF]/30 animate-gradient-x z-0"></div>
      
      {/* Animated aurora effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10%] w-[120%] h-[120%] bg-[url('/images/aurora-mesh.svg')] bg-no-repeat bg-cover opacity-30 animate-aurora"></div>
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {/* Large gradient orbs with more vibrant colors */}
        <div className="absolute top-[5%] left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#FF3CAC]/40 via-[#784BA0]/30 to-[#2B86C5]/40 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-[#21D4FD]/40 via-[#2876F9]/30 to-[#B721FF]/40 blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-[30%] right-[15%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#08AEEA]/40 via-[#2AF598]/30 to-[#00CDAC]/40 blur-3xl animate-pulse-slow animation-delay-1000"></div>
        <div className="absolute bottom-[30%] left-[15%] w-[320px] h-[320px] rounded-full bg-gradient-to-br from-[#FEE140]/30 via-[#FA709A]/20 to-[#FA709A]/30 blur-3xl animate-pulse-slow animation-delay-3000"></div>
        
        {/* Floating particles with glow effect */}
        <div className="absolute top-[15%] left-[25%] w-3 h-3 rounded-full bg-[#21D4FD] shadow-[0_0_15px_5px_rgba(33,212,253,0.5)] animate-float"></div>
        <div className="absolute top-[35%] left-[65%] w-2 h-2 rounded-full bg-[#FF3CAC] shadow-[0_0_10px_4px_rgba(255,60,172,0.5)] animate-float animation-delay-1000"></div>
        <div className="absolute top-[55%] left-[35%] w-2.5 h-2.5 rounded-full bg-[#2AF598] shadow-[0_0_12px_5px_rgba(42,245,152,0.5)] animate-float animation-delay-2000"></div>
        <div className="absolute top-[75%] left-[55%] w-3 h-3 rounded-full bg-[#B721FF] shadow-[0_0_15px_5px_rgba(183,33,255,0.5)] animate-float animation-delay-3000"></div>
        <div className="absolute top-[25%] left-[75%] w-2 h-2 rounded-full bg-[#FEE140] shadow-[0_0_10px_4px_rgba(254,225,64,0.5)] animate-float animation-delay-4000"></div>
        <div className="absolute top-[65%] left-[15%] w-2.5 h-2.5 rounded-full bg-[#FA709A] shadow-[0_0_12px_5px_rgba(250,112,154,0.5)] animate-float animation-delay-5000"></div>
      </div>
      
      {/* Animated mesh grid overlay */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-10 animate-pulse-slow"></div>
      
      {/* Enhanced model halo glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-radial from-[#21D4FD]/50 via-[#2AF598]/30 to-transparent blur-2xl animate-pulse-slow z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-radial from-[#FF3CAC]/40 via-[#B721FF]/20 to-transparent blur-xl animate-pulse-slow animation-delay-1000 z-0"></div>
      
      {/* Profile button on top right - updated with cosmic theme */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="outline"
          size="icon"
          aria-label="Profile"
          className="bg-[#0B132B]/40 backdrop-blur-md hover:bg-[#1C3D5A]/60 transition-all duration-300 shadow-[0_0_15px_rgba(33,212,253,0.3)] hover:shadow-[0_0_20px_rgba(33,212,253,0.5)] rounded-full h-12 w-12 border border-[#21D4FD]/30 hover:border-[#21D4FD]/60 hover:scale-110"
        >
          <User size={22} className="text-[#E0F7FA]" />
        </Button>
      </div>

      {/* 3D Model Canvas with natural lighting */}
      <Canvas camera={{ position: [-0.00, 0.02, 0.15], fov: 75 }} className="z-10 relative">
        {/* Natural lighting to preserve model color */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[-5, -5, 5]} intensity={0.3} color="#ffffff" />
        <spotLight position={[0, 5, 5]} intensity={0.4} color="#ffffff" angle={0.6} penumbra={1} />
        <spotLight position={[0, -5, 0]} intensity={0.2} color="#ffffff" angle={0.7} penumbra={1} />
        
        {/* Restored original controls with proper rotation speed */}
        <OrbitControls 
          enableZoom={true} // Re-enable zoom functionality
          enablePan={false} // Keep panning disabled for simplicity
          autoRotate={true} // Keep auto-rotation
          autoRotateSpeed={0.2} // Return to original slower rotation
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.8} // Default rotation speed
          zoomSpeed={0.8} // Default zoom speed
        />
        
        <Environment preset="studio" /> {/* Return to studio for natural colors */}
        
        {/* Subtle platform under model */}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.5, 0.5]} /> 
          <shadowMaterial 
            opacity={0.2} 
            transparent 
          />
        </mesh>
        
        <AnatomyModel />
        <CameraControls />
      </Canvas>

      {/* Cosmic corner accents */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#FF3CAC]/20 to-transparent z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#21D4FD]/20 to-transparent z-0 pointer-events-none"></div>
      
      {/* Futuristic tip label */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-5 py-2.5 rounded-full bg-[#0B132B]/40 shadow-[0_0_15px_rgba(33,212,253,0.3)] backdrop-blur-md border border-[#21D4FD]/30 z-20 flex items-center space-x-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(33,212,253,0.5)] hover:bg-[#1C3D5A]/60 hover:border-[#21D4FD]/60">
        <span className="text-xs sm:text-sm font-medium text-[#E0F7FA]">✨ Explore AnatoMate.ai - Your Health Companion</span>
      </div>
    </div>
  )
}

// Preload the model to improve performance
useGLTF.preload('/models/anatomy/scene.gltf')