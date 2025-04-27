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
    console.log('Model loaded:', anatomyScene)
    anatomyScene.traverse((child) => {
      console.log('Object:', {
        name: child.name,
        type: child.type,
        position: child.position,
        worldPosition: child.getWorldPosition(new THREE.Vector3())
      })
    })
  }, [anatomyScene])

  // Live Highlighting and Pulsing (Every Frame)
  useFrame(({ clock }) => {
    if (!highlightedOrgans) {
        console.log('No highlightedOrgans yet')
        return
    }

    const elapsed = clock.getElapsedTime()
    const pulse = (Math.sin(elapsed * 4) + 1) / 2

    anatomyScene.traverse((child) => {
      if (child.isMesh) {
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

  // console.log('highlightedOrgans in AnatomyModel:', highlightedOrgans)

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
            rotation={[0,Math.PI / 2, 0]}
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
  const [health, setHealth] = useState(75)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [submittedSymptoms, setSubmittedSymptoms] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [diagnosisResults, setDiagnosisResults] = useState<{ condition: string, description: string, confidence: number }[]>([])
  const [customSymptom, setCustomSymptom] = useState("")
  const [longerDescription, setLongerDescription] = useState("")
  const [submittedDescription, setSubmittedDescription] = useState("")
  const [savedReports, setSavedReports] = useState<any[]>([])
  
  const report = {
    symptoms: submittedSymptoms,
    description: longerDescription,
    diagnoses: diagnosisResults,
    timestamp: new Date().toISOString()
  }

  // Symptom to organ mapping
  const symptomToOrgans: Record<string, string[]> = {
    "cough": ["Lungs"],
    "chest pain": ["Lungs", "Heart"],
    "body ache": ["Full Body", "Hand/Foot"],
    "headache": ["Head"],
    "hand pain": ["Hand/Foot"],
    "foot pain": ["Hand/Foot"],
  }

  const preliminaryConditions: Record<string, { condition: string, description: string }[]> = {
    "cough": [
      { condition: "Pneumonia", description: "Infection causing inflammation of air sacs in one or both lungs." },
      { condition: "Bronchitis", description: "Inflammation of bronchial tubes, often causing mucus." },
      { condition: "Common Cold", description: "Viral respiratory infection causing coughing and congestion." }
    ],
    "chest pain": [
      { condition: "Angina", description: "Reduced blood flow to the heart muscles causing chest pain." },
      { condition: "Heart Attack", description: "Blockage of blood flow to the heart muscle." },
      { condition: "Pleurisy", description: "Inflammation of the lining around the lungs causing sharp pain." }
    ],
    "body ache": [
      { condition: "Influenza (Flu)", description: "Viral infection causing fever, body aches, and fatigue." },
      { condition: "COVID-19", description: "Respiratory illness caused by coronavirus." },
      { condition: "Fibromyalgia", description: "Chronic disorder causing widespread muscle pain." }
    ],
    "headache": [
      { condition: "Migraine", description: "Severe headaches often with nausea and sensitivity to light." },
      { condition: "Tension Headache", description: "Mild to moderate pain like a tight band around the head." },
      { condition: "Dehydration", description: "Lack of sufficient fluids causing headache and weakness." }
    ],
    "hand pain": [
      { condition: "Carpal Tunnel Syndrome", description: "Nerve compression causing hand pain and numbness." },
      { condition: "Arthritis", description: "Joint inflammation causing pain and stiffness." }
    ],
    "foot pain": [
      { condition: "Plantar Fasciitis", description: "Inflammation of tissue causing heel pain." },
      { condition: "Gout", description: "Form of arthritis characterized by severe foot pain." }
    ]
  }
  
  // Auto-generate preliminary diagnosis list
  const possibleDiagnoses = submittedSymptoms
    .flatMap(symptom => preliminaryConditions[symptom] || [])
    .filter((v, i, a) => a.findIndex(t => t.condition === v.condition) === i) // unique conditions
    .slice(0, 4) // limit to top 4

  const highlightedOrgans = submittedSymptoms
    .flatMap(symptom => symptomToOrgans[symptom] || [])
    .filter((v, i, a) => a.indexOf(v) === i)

  const getHealthColor = (value: number) => {
    if (value >= 75) return 'bg-green-500'
    if (value >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  // Helper: sort diagnosis results by highest confidence
    const sortedDiagnoses = diagnosisResults
        .slice()
        .sort((a, b) => b.confidence - a.confidence)

    // Helper: get text color based on confidence
    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return "#16a34a"; // Strong green
        if (confidence >= 60) return "#4ade80"; // Light green
        return "#9ca3af"; // Gray if lower
    }

  return (
    <div className="fixed inset-0">
      {/* Symptom Selector UI */}
      <div className="absolute top-20 left-4 z-10 bg-white/80 backdrop-blur-sm p-4 rounded shadow-md">
        <h2 className="text-sm font-bold mb-2">Select Symptoms:</h2>
        <div className="space-y-2">
          {Object.keys(symptomToOrgans).map(symptom => (
            <label key={symptom} className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded cursor-pointer">
              <input 
                type="checkbox" 
                value={symptom}
                checked={selectedSymptoms.includes(symptom)}
                onChange={(e) => {
                  const { value, checked } = e.target
                  setSelectedSymptoms(prev =>
                    checked ? [...prev, value] : prev.filter(sym => sym !== value)
                  )
                }}
              />
              <span>{symptom}</span>
            </label>
          ))}
        </div>

        {/* Custom Symptom Input */}
        <div className="mt-4 space-y-2">
        <input 
            type="text" 
            placeholder="Enter custom symptom..."
            value={customSymptom}
            onChange={(e) => setCustomSymptom(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
        />
        <button 
            onClick={() => {
            if (customSymptom.trim()) {
                setSelectedSymptoms(prev => [...prev, customSymptom.trim()])
                setCustomSymptom("")
            }
            }}
            className="bg-blue-400 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded"
        >
            Add Symptom
        </button>
        </div>

        {/* Longer Description Textarea */}
        <div className="mt-4">
        <textarea
            placeholder="Describe your symptoms in more detail..."
            value={longerDescription}
            onChange={(e) => setLongerDescription(e.target.value)}
            className="w-full border rounded px-2 py-2 text-sm resize-none"
            rows={4}
        />
        </div>

        {/* Submit Button */}
        <button 
        onClick={() => {
            setIsLoading(true)
            setSubmittedSymptoms(selectedSymptoms)
            setSubmittedDescription(longerDescription)

            setTimeout(() => {
            const generatedDiagnoses = selectedSymptoms
                .flatMap(symptom => preliminaryConditions[symptom] || [])
                .filter((v, i, a) => a.findIndex(t => t.condition === v.condition) === i)
                .slice(0, 4)
                .map(diagnosis => ({
                ...diagnosis,
                confidence: Math.floor(Math.random() * 41) + 50 // 50%-90%
                }))

            setDiagnosisResults(generatedDiagnoses)
            setIsLoading(false)
            }, 2000) // fake 2 seconds loading
        }}
        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition-colors"
        >
            Submit
        </button>
      </div>

      {/* Diagnosis Sidebar */}
      <div className="absolute top-20 right-4 z-10 w-80 bg-white/90 backdrop-blur-sm p-4 rounded shadow-md overflow-y-auto h-[500px]">
        <h2 className="text-lg font-bold mb-4">Preliminary Report</h2>
        <div className="mb-4">
            <h3 className="font-semibold">Selected Symptoms:</h3>
            <ul className="list-disc ml-5">
                {submittedSymptoms.length > 0 ? (
                    submittedSymptoms.map(symptom => <li key={symptom}>{symptom}</li>)
                ) : (
                    <p className="text-sm text-gray-500">No symptoms selected.</p>
                )}
            </ul>
        </div>

        {submittedDescription && (
          <div className="mb-4">
            <h3 className="font-semibold">Description:</h3>
            <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                {submittedDescription}
            </div>
          </div>
        )}

        {/* Preliminary Diagnosis */}
        <div className="mt-4">
        <h3 className="font-semibold">Preliminary Diagnosis:</h3>

        {isLoading ? (
            <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Analyzing symptoms...</p>
            </div>
        ) : diagnosisResults.length > 0 ? (
            <div className="space-y-4 mt-2">
            {sortedDiagnoses.map((diagnosis, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded">
                    <div className={`font-semibold`} style={{ color: getConfidenceColor(diagnosis.confidence) }}>
                    {diagnosis.condition}
                </div>
                    <div className="text-xs text-gray-600 mb-1">{diagnosis.description}</div>

                    {/* Confidence bar */}
                    <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                    <div 
                        className="h-2 rounded-full"
                        style={{
                        width: `${diagnosis.confidence}%`,
                        backgroundColor: getConfidenceColor(diagnosis.confidence)
                        }}
                    />
                    </div>

                    <div className="text-right text-xs text-gray-500">{diagnosis.confidence}% confidence</div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-sm text-gray-500 mt-2">No preliminary diagnosis available.</p>
        )}
        </div>

        {/* Save Report Button */}
        {!isLoading && diagnosisResults.length > 0 && (
        <div className="mt-4 text-center">
            <button
            onClick={() => {
                const report = {
                    symptoms: submittedSymptoms,
                    diagnoses: diagnosisResults,
                    description: submittedDescription,
                    timestamp: new Date().toISOString()
                }
                setSavedReports(prev => [...prev, report])
                console.log("Saved report:", report)
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
            Save Report
            </button>
        </div>
        )}
    </div>
      
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
      <Canvas camera={{ position: [-0.00, 0.05, 0.14], fov: 75 }}>
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
      <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded text-sm text-center">
        Tip: Click and drag to rotate the model. Scroll to zoom in/out.
      </div>
    </div>
  )
}

// Preload the model to improve performance
useGLTF.preload('/models/anatomy/scene.gltf')
useGLTF.preload('/models/lungs/scene.gltf')
useGLTF.preload('/models/heart/scene.gltf')
useGLTF.preload('/models/brain/scene.gltf')