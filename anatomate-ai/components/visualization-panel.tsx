"use client"

import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useModeStore } from "@/lib/store"
import { Canvas, ThreeElements, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { 
  Maximize2, 
  Minimize2, 
  Sun, 
  Moon, 
  Heart, 
  Brain, 
  Wind, 
  Package, 
  Cookie, 
  Eye, 
  Bone, 
  Dumbbell 
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useVisualizationStore } from "@/lib/visualization-store"
import { MedicalScanViewer } from "@/components/medical-scan-viewer"
import { useTheme } from "next-themes"
import * as THREE from 'three'
import { useSymptomStore } from "@/lib/symptom-store"

// Create a new component for the custom GLTF model
function AnatomyModel({ highlightedOrgans }: { highlightedOrgans: string[] }) {
  // Load the custom GLTF model
  const { scene: anatomyScene } = useGLTF('/models/anatomy/scene.gltf')
  const { scene: lungsScene } = useGLTF('/models/lungs/scene.gltf')
  const { scene: brainScene } = useGLTF('/models/brain/scene.gltf')
  const { scene: heartScene } = useGLTF('/models/heart/scene.gltf')
  
  // Creating map based on model
  const objectNameMap: Record<string, string> = {
    "Object_9": "Lungs",
    "Object_7": "Full Body",
    "Object_11": "Hand/Foot",
    }
  
  // Log the entire model structure
  useEffect(() => {
    console.log('Model loaded:', anatomyScene);
    anatomyScene.traverse((child) => {
      console.log('Object:', {
        name: child.name,
        type: child.type,
        position: child.position,
        worldPosition: child.getWorldPosition(new THREE.Vector3())
      });
    });
  }, [anatomyScene]);

  // Live Highlighting and Pulsing (Every Frame)
  useFrame(({ clock }) => {
    if (!highlightedOrgans) {
        console.log('No highlightedOrgans yet')
        return
    }

    const elapsed = clock.getElapsedTime()
    const pulse = (Math.sin(elapsed * 4) + 1) / 2

    anatomyScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const organName = objectNameMap[child.name]
        const material = child.material as THREE.MeshStandardMaterial

        if (organName && highlightedOrgans.includes(organName)) {
          material.color.set("red")
          material.emissive.set("#ff0000")
          material.emissiveIntensity = 0.5 + pulse * 1.5
        } else {
          material.color.set("white")
          material.emissive.set("#000000")
          material.emissiveIntensity = 0
        }
      }
    })
  })

  return (
    <group>
      {/* Main body model */}
      <primitive 
        object={anatomyScene}
        scale={5} // Increased scale for better visibility
        position={[0, 0, 0]} // Centered position
        rotation={[0, 0, 0]} // No rotation
      />
      {/* Extra organ models */}
      {highlightedOrgans.includes('Lungs') && (
        <primitive 
          object={lungsScene}
          position={[0.042, -0.01, 0]}
          scale={0.13}
        />
      )}

      {highlightedOrgans.includes('Heart') && (
        <primitive 
          object={heartScene}
          position={[0.044, -0.01, 0]}
          scale={0.02}
        />
      )}

      {highlightedOrgans.includes('Head') && (
        <primitive 
          object={brainScene}
          position={[0.035, 0.03, 0]}
          scale={0.02}
          rotation={[0, Math.PI / 2, 0]}
        />
      )}
    </group>
  )
}

// Component to track camera info
function CameraTracker({ onUpdate }: { onUpdate: (info: { position: [number, number, number], zoom: number }) => void }) {
  const { camera } = useThree()
  
  useFrame(() => {
    onUpdate({
      position: [camera.position.x, camera.position.y, camera.position.z],
      zoom: camera.zoom
    })
  })
  
  return null
}

export function VisualizationPanel() {
  const { theme, setTheme } = useTheme()
  const [cameraInfo, setCameraInfo] = useState({ position: [0, 0, 0], zoom: 1 })
  
  // Use the symptom store instead of local state
  const { highlightedOrgans } = useSymptomStore()

  return (
    <div className="fixed inset-0 bg-gradient-radial from-white via-[#F8FBFD] to-[#E6F7F2]">
      {/* Symptom Selector UI */}
      {/* Symptom selector has been moved to the floating action buttons */}

      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 shadow-md rounded-full h-10 w-10"
        >
          {theme === "dark" ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-500" />}
        </Button>
      </div>
      <Canvas camera={{ position: [-0.00, 0.02, 0.12], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={true}
          minDistance={0}
          maxDistance={30}
        />
        <Environment preset="studio" />
        <AnatomyModel highlightedOrgans={highlightedOrgans} />
        <CameraTracker onUpdate={setCameraInfo} />
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-medium text-gray-700 shadow-md transition-opacity duration-300 hover:opacity-100 opacity-80 max-w-max">
        <span className="flex items-center gap-1">💡 Rotate: Click + Drag | Zoom: Scroll</span>
      </div>
    </div>
  )
}

// Preload the model to improve performance
useGLTF.preload('/models/anatomy/scene.gltf')
useGLTF.preload('/models/brain/scene.gltf')
useGLTF.preload('/models/heart/scene.gltf')
useGLTF.preload('/models/lungs/scene.gltf')