"use client"

import { useRef, useEffect } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Html } from "@react-three/drei"
import * as THREE from 'three'

// Symptom to organ mapping
const symptomToOrgans: Record<string, string[]> = {
  "cough": ["Lungs"],
  "chest pain": ["Lungs", "Heart"],
  "body ache": ["Full Body", "Hand/Foot"],
  "headache": ["Head"],
  "hand pain": ["Hand/Foot"],
  "foot pain": ["Hand/Foot"],
  "fever": ["Full Body"],
  "fatigue": ["Full Body"],
  "nausea": ["Stomach"],
  "dizziness": ["Head"],
  "shortness of breath": ["Lungs", "Heart"],
  "abdominal pain": ["Stomach"],
  "back pain": ["Spine"],
  "joint pain": ["Hand/Foot"],
  "muscle pain": ["Full Body"],
  "throat pain": ["Throat"],
  "ear pain": ["Ear"],
  "eye pain": ["Eye"],
  "tooth pain": ["Mouth"],
  "skin rash": ["Skin"]
}

interface PatientAnatomyViewerProps {
  symptoms: Array<{
    id: number;
    name: string;
    severity: string;
    date: string;
  }>;
}

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

  // Live Highlighting and Pulsing (Every Frame)
  useFrame(({ clock }) => {
    if (!highlightedOrgans) return

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
        scale={5}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
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

export function PatientAnatomyViewer({ symptoms }: PatientAnatomyViewerProps) {
  // Get unique highlighted organs based on symptoms
  const highlightedOrgans = symptoms
    .flatMap(symptom => symptomToOrgans[symptom.name.toLowerCase()] || [])
    .filter((v, i, a) => a.indexOf(v) === i)

  return (
    <div className="relative w-full h-[400px] bg-gray-50 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [-0.00, 0.05, 0.14], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          minDistance={0}
          maxDistance={30}
        />
        <Environment preset="studio" />
        <AnatomyModel highlightedOrgans={highlightedOrgans} />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-xl text-sm text-center text-gray-700 max-w-md mx-auto">
        <span className="flex items-center justify-center gap-1">
          💡 Tip: Click and drag to rotate the model. Scroll to zoom in/out.
        </span>
      </div>
    </div>
  )
}

// Preload the models to improve performance
useGLTF.preload('/models/anatomy/scene.gltf')
useGLTF.preload('/models/lungs/scene.gltf')
useGLTF.preload('/models/heart/scene.gltf')
useGLTF.preload('/models/brain/scene.gltf') 