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
  Dumbbell,
  Menu,
  User
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
      {/* Symptom Selector UI */}
      {/* Symptom selector has been moved to the floating action buttons */}

      {/* Hamburger menu removed as requested */}
      
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
      <Canvas camera={{ position: [-0.00, 0.02, 0.12], fov: 75 }} className="z-10 relative">
        {/* Enhanced lighting for better model presentation */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[-5, -5, 5]} intensity={0.3} color="#34D399" />
        <spotLight position={[0, 5, 5]} intensity={0.4} color="#60A5FA" angle={0.6} penumbra={1} />
        <spotLight position={[0, -5, 0]} intensity={0.2} color="#A78BFA" angle={0.7} penumbra={1} />
        
        {/* Enhanced controls with slow auto-rotation */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          minDistance={0.05}
          maxDistance={0.3}
          autoRotate={true} // Always auto-rotate for more life
          autoRotateSpeed={0.2} // Very slow rotation
          rotateSpeed={0.8}
          enableDamping={true}
          dampingFactor={0.05}
        />
        
        <Environment preset="studio" />
        
        {/* Shadow effect under model */}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.5, 0.5]} />
          <shadowMaterial opacity={0.2} transparent />
        </mesh>
        
        <AnatomyModel highlightedOrgans={highlightedOrgans} />
        <CameraTracker onUpdate={setCameraInfo} />
      </Canvas>

      
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#00C58E]/10 to-transparent z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#007AFF]/10 to-transparent z-0 pointer-events-none"></div>
    </div>
  )
}

// Preload the model to improve performance
useGLTF.preload('/models/anatomy/scene.gltf')
useGLTF.preload('/models/brain/scene.gltf')
useGLTF.preload('/models/heart/scene.gltf')
useGLTF.preload('/models/lungs/scene.gltf')