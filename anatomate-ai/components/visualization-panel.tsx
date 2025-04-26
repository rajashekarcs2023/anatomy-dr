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
  
  // Log the entire model structure
  useEffect(() => {
    console.log('Model loaded:', scene);
    scene.traverse((child) => {
      console.log('Object:', {
        name: child.name,
        type: child.type,
        position: child.position,
        worldPosition: child.getWorldPosition(new THREE.Vector3())
      });
    });
  }, [scene]);

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
  const [health, setHealth] = useState(75)

  const getHealthColor = (value: number) => {
    if (value >= 75) return 'bg-green-500'
    if (value >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="fixed inset-0">
      {/* Health Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-48">
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getHealthColor(health)}`}
            style={{ width: `${health}%` }}
          />
        </div>
        <div className="text-center mt-1 text-sm font-medium">
          Health: {health}%
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