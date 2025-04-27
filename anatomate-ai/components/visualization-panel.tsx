"use client"

import { useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { User, Sun, Moon } from 'lucide-react'
import { useTheme } from "next-themes"
import { Color, Mesh, MeshStandardMaterial, Object3D } from "three"

// Create a new component for the custom GLTF model
function AnatomyModel() {
  // Load the custom GLTF model
  const { scene: anatomyScene } = useGLTF('/models/anatomy/scene.gltf')
  
  // Make the model darker and more reddish
  useEffect(() => {
    anatomyScene.traverse((node: Object3D) => {
      // Check if the node is a mesh with material
      if ((node as Mesh).isMesh) {
        const mesh = node as Mesh;
        
        // Handle different material types
        if (mesh.material) {
          // Clone the material to avoid affecting other instances
          if (Array.isArray(mesh.material)) {
            // Handle multi-material meshes
            mesh.material = mesh.material.map(mat => mat.clone());
          } else {
            mesh.material = mesh.material.clone();
          }
          
          // Process each material (could be an array or single material)
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          
          materials.forEach(mat => {
            // Safely cast to MeshStandardMaterial or similar with color property
            const material = mat as MeshStandardMaterial;
            
            if (material.color) {
              // Store original color
              const originalColor = material.color.clone();
              
              // Mix with red (increase red, decrease blue slightly)
              const newColor = new Color(originalColor);
              newColor.r = Math.min(newColor.r * 1.2, 1.0);  // Increase red more
              newColor.g = Math.max(newColor.g * 0.9, 0.0);  // Decrease green more
              newColor.b = Math.max(newColor.b * 0.85, 0.0); // Decrease blue even more
              
              // Apply the new color
              material.color = newColor;
              
              // Make it darker overall
              material.color.multiplyScalar(0.85);
            }
            
            // Update the material
            material.needsUpdate = true;
          });
        }
      }
    });
  }, [anatomyScene]);
  
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
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed inset-0 bg-[#E0F7FA] overflow-hidden">
      {/* Simple, clean light blue background */}
      
      {/* Theme toggle button - clean professional style */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center transition-all duration-300 hover:shadow-lg active:scale-95"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-[#3498DB]" />
          ) : (
            <Moon className="w-5 h-5 text-[#3498DB]" />
          )}
        </button>
      </div>

      {/* 3D Model Canvas with natural lighting */}
      <Canvas camera={{ position: [-0.00, 0.02, 0.15], fov: 75 }} className="z-10 relative">
        {/* Lighting with reddish tint to make model darker and more red */}
        <ambientLight intensity={0.62} color="#fff0f0" />
        <directionalLight position={[10, 10, 5]} intensity={0.7} color="#ffe0e0" />
        <directionalLight position={[-5, -5, 5]} intensity={0.25} color="#ffecec" />
        <spotLight position={[0, 5, 5]} intensity={0.35} color="#ffe5e5" angle={0.6} penumbra={1} />
        <spotLight position={[0, -5, 0]} intensity={0.15} color="#ffeeee" angle={0.7} penumbra={1} />
        
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

      {/* Help tooltip */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-sm text-[#34495E]">
          <span className="text-[#3498DB] font-bold">Tip:</span> Click and drag to rotate. Scroll to zoom.
        </p>
      </div>
    </div>
  )
}

// Preload the model to improve performance
useGLTF.preload('/models/anatomy/scene.gltf')