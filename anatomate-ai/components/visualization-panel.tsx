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

// Create a new component for the custom GLTF model
function AnatomyModel(props: Omit<ThreeElements['primitive'], 'object'>) {
  // Load the custom GLTF model
  const { scene } = useGLTF('/models/scene.gltf')
  
  return (
    <primitive 
      object={scene}
      scale={4.5} // Increased scale for better visibility
      position={[0, 0, 0]} // Centered position
      rotation={[0, 0, 0]} // No rotation
      {...props}
    />
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
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null)

  const systems = [
    { id: 'heart', icon: Heart, label: 'Cardiovascular' },
    { id: 'brain', icon: Brain, label: 'Nervous' },
    { id: 'lungs', icon: Wind, label: 'Respiratory' },
    { id: 'liver', icon: Package, label: 'Digestive' },
    { id: 'stomach', icon: Cookie, label: 'Digestive' },
    { id: 'eye', icon: Eye, label: 'Sensory' },
    { id: 'bone', icon: Bone, label: 'Skeletal' },
    { id: 'muscle', icon: Dumbbell, label: 'Muscular' },
  ]

  return (
    <div className="fixed inset-0">
      {/* Left Dashboard */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div className="flex flex-col gap-2">
            {systems.map((system) => {
              const Icon = system.icon
              return (
                <Button
                  key={system.id}
                  variant={selectedSystem === system.id ? "default" : "ghost"}
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setSelectedSystem(system.id)}
                  title={system.label}
                >
                  <Icon size={16} />
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="bg-white/80 backdrop-blur-sm"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>
      <div className="absolute top-4 left-20 bg-white/80 backdrop-blur-sm p-2 rounded text-sm z-10">
        <div>Position: [{cameraInfo.position.map(n => n.toFixed(2)).join(', ')}]</div>
        <div>Zoom: {cameraInfo.zoom.toFixed(2)}</div>
      </div>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          minDistance={-30}
          maxDistance={30}
        />
        <Environment preset="studio" />
        <AnatomyModel />
        <CameraTracker onUpdate={setCameraInfo} />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded text-sm text-center">
        Tip: Click and drag to rotate the model. Scroll to zoom in/out.
      </div>
    </div>
  )
}

// Preload the model to improve performance
useGLTF.preload('/models/scene.gltf')