"use client"

import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useModeStore } from "@/lib/store"
import { Canvas, ThreeElements, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Html } from "@react-three/drei"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  Loader2,
  AlertTriangle,
  Calendar as CalendarIcon,
  CheckCircle
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useVisualizationStore } from "@/lib/visualization-store"
import { MedicalScanViewer } from "@/components/medical-scan-viewer"
import { useTheme } from "next-themes"
import * as THREE from 'three'
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

// Function to get Gemini diagnosis
async function getGeminiDiagnosis(symptomData: {
  selectedSymptoms: string[],
  customSymptoms: string[],
  startDate: string,
  duration: string,
  severity: number,
  description: string
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    
    const prompt = `Given the following patient symptoms and information, provide a concise bullet-point diagnosis:
    Symptoms: ${[...symptomData.selectedSymptoms, ...symptomData.customSymptoms].join(", ")}
    Start Date: ${symptomData.startDate}
    Duration: ${symptomData.duration}
    Severity: ${symptomData.severity}/10
    Additional Details: ${symptomData.description}
    
    Please provide:
    1. A list of possible conditions (1-2 MAX)
    2. Brief explanation for each
    3. Recommended next steps
    Format as bullet points.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error getting Gemini diagnosis:", error)
    return "Unable to generate diagnosis at this time."
  }
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

// Symptom to organ mapping
const symptomToOrgans: Record<string, string[]> = {
  "cough": ["Lungs"],
  "chest pain": ["Lungs", "Heart"],
  "body ache": ["Full Body", "Hand/Foot"],
  "headache": ["Head"],
  "hand pain": ["Hand/Foot"],
  "foot pain": ["Hand/Foot"],
}

// // Preliminary conditions mapping
// const preliminaryConditions: Record<string, { condition: string, description: string }[]> = {
//   "cough": [
//     { condition: "Pneumonia", description: "Infection causing inflammation of air sacs in one or both lungs." },
//     { condition: "Bronchitis", description: "Inflammation of bronchial tubes, often causing mucus." },
//     { condition: "Common Cold", description: "Viral respiratory infection causing coughing and congestion." }
//   ],
//   "chest pain": [
//     { condition: "Angina", description: "Reduced blood flow to the heart muscles causing chest pain." },
//     { condition: "Heart Attack", description: "Blockage of blood flow to the heart muscle." },
//     { condition: "Pleurisy", description: "Inflammation of the lining around the lungs causing sharp pain." }
//   ],
//   "body ache": [
//     { condition: "Influenza (Flu)", description: "Viral infection causing fever, body aches, and fatigue." },
//     { condition: "COVID-19", description: "Respiratory illness caused by coronavirus." },
//     { condition: "Fibromyalgia", description: "Chronic disorder causing widespread muscle pain." }
//   ],
//   "headache": [
//     { condition: "Migraine", description: "Severe headaches often with nausea and sensitivity to light." },
//     { condition: "Tension Headache", description: "Mild to moderate pain like a tight band around the head." },
//     { condition: "Dehydration", description: "Lack of sufficient fluids causing headache and weakness." }
//   ],
//   "hand pain": [
//     { condition: "Carpal Tunnel Syndrome", description: "Nerve compression causing hand pain and numbness." },
//     { condition: "Arthritis", description: "Joint inflammation causing pain and stiffness." }
//   ],
//   "foot pain": [
//     { condition: "Plantar Fasciitis", description: "Inflammation of tissue causing heel pain." },
//     { condition: "Gout", description: "Form of arthritis characterized by severe foot pain." }
//   ]
// }

export function SymptomsVisualizationPanel() {
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
  
  // State for symptom reporting form
  const [symptom, setSymptom] = useState("")
  const [severity, setSeverity] = useState([5])
  const [date, setDate] = useState<Date>()
  const [duration, setDuration] = useState("")
  const [description, setDescription] = useState("")
  
  // Immediate visualization flag
  const [showDiagnosisPanel, setShowDiagnosisPanel] = useState(false)
  
  const report = {
    symptoms: submittedSymptoms,
    description: longerDescription,
    diagnoses: diagnosisResults,
    timestamp: new Date().toISOString()
  }

  // Auto-generate preliminary diagnosis list
  // const possibleDiagnoses = submittedSymptoms
  //   // .flatMap(symptom => preliminaryConditions[symptom] || [])
  //   .filter((v, i, a) => a.findIndex(t => t.condition === v.condition) === i) // unique conditions
  //   .slice(0, 4) // limit to top 4

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

  // Handle report submission
  const handleReportSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate mock diagnoses based on the symptom
      // const possibleConditions = preliminaryConditions[symptom.toLowerCase()] || []
      
      // Generate random confidence levels (in a real app, this would be from an AI model)
      // const results = possibleConditions.map(condition => ({
      //   ...condition,
      //   confidence: Math.floor(Math.random() * 30) + 55 // 55-85% confidence range
      // }))
      
      // // Sort by confidence
      // results.sort((a, b) => b.confidence - a.confidence)
      
      // setDiagnosisResults(results)
      
      // Save report
      const newReport = {
        symptom,
        severity: severity[0],
        date: date ? format(date, 'MMM dd, yyyy') : 'Today',
        description,
        duration
      }
      
      setSavedReports(prev => [newReport, ...prev])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 pt-16">
      {/* Symptom Input Panel */}
      <div className="absolute top-20 left-4 z-10 bg-white/80 backdrop-blur-sm rounded-xl shadow-md max-w-md h-[90vh] flex flex-col">
        <div className="p-4 overflow-y-auto flex-1">
          <h2 className="text-base font-bold mb-4">Add Symptoms</h2>
          
          {/* Symptom Checkboxes */}
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Select symptoms:</Label>
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
              {Object.entries(symptomToOrgans).map(([symptom, organs]) => (
                <label key={symptom} className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    value={symptom}
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={(e) => {
                      const { value, checked } = e.target
                      const newSymptoms = checked 
                        ? [...selectedSymptoms, value] 
                        : selectedSymptoms.filter(sym => sym !== value)
                      
                      setSelectedSymptoms(newSymptoms)
                      // Immediately update visualization
                      setSubmittedSymptoms(newSymptoms)
                    }}
                  />
                  <span>{symptom.charAt(0).toUpperCase() + symptom.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Symptom Input */}
          <div className="mb-4">
            <Label htmlFor="customSymptom" className="text-sm font-medium mb-1 block">Add other symptoms:</Label>
            <div className="flex gap-2">
              <Input 
                id="customSymptom"
                placeholder="e.g., Dizziness"
                value={customSymptom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomSymptom(e.target.value)}
                className="flex-1 bg-white/80 border-gray-100 shadow-sm focus-visible:ring-[#00C58E] rounded-xl"
              />
              <Button 
                onClick={() => {
                  if (customSymptom.trim()) {
                    const newSymptoms = [...selectedSymptoms, customSymptom.trim()]
                    setSelectedSymptoms(newSymptoms)
                    setSubmittedSymptoms(newSymptoms)
                    setCustomSymptom("")
                  }
                }}
                className="bg-blue-400 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded-xl"
                type="button"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Custom Symptoms List */}
          {selectedSymptoms.filter(symptom => !Object.keys(symptomToOrgans).includes(symptom)).length > 0 && (
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">Custom Symptoms:</Label>
              <div className="space-y-2">
                {selectedSymptoms
                  .filter(symptom => !Object.keys(symptomToOrgans).includes(symptom))
                  .map((symptom, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/80 p-2 rounded-lg border border-gray-100">
                      <span className="text-sm text-gray-700">{symptom}</span>
                      <Button
                        onClick={() => {
                          const newSymptoms = selectedSymptoms.filter(s => s !== symptom)
                          setSelectedSymptoms(newSymptoms)
                          setSubmittedSymptoms(newSymptoms)
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Symptom Details */}
          <div className="space-y-4 mt-6 border-t border-gray-100 pt-4">
            {/* Date & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">When did it start?</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal border-gray-100 shadow-sm", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 2 days"
                  value={duration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
                  className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm focus-visible:ring-[#00C58E] rounded-xl"
                />
              </div>
            </div>

            {/* Severity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="severity">Severity</Label>
                <span className="text-sm text-gray-500">{severity[0]}/10</span>
              </div>
              <Slider id="severity" min={1} max={10} step={1} value={severity} onValueChange={setSeverity} />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Mild</span>
                <span>Severe</span>
              </div>
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Additional details</Label>
              <Textarea
                id="description"
                placeholder="Describe your symptoms in more detail..."
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                rows={3}
                className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm focus-visible:ring-[#00C58E] rounded-xl resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={async () => {
              if (selectedSymptoms.length === 0) {
                alert("Please select at least one symptom")
                return
              }
              
              setIsLoading(true)
              setShowDiagnosisPanel(true)
              
              try {
                // Prepare data for Gemini
                const symptomData = {
                  selectedSymptoms,
                  customSymptoms: customSymptom ? [customSymptom] : [],
                  startDate: date ? format(date, 'MMM dd, yyyy') : 'Not specified',
                  duration,
                  severity: severity[0],
                  description
                }

                // Get Gemini diagnosis
                const geminiDiagnosis = await getGeminiDiagnosis(symptomData)
                
                // Save report
                const newReport = {
                  symptoms: selectedSymptoms,
                  severity: severity[0],
                  date: date ? format(date, 'MMM dd, yyyy') : 'Today',
                  description,
                  duration,
                  geminiDiagnosis
                }
                
                setSavedReports(prev => [newReport, ...prev])
                setDiagnosisResults([{
                  condition: "AI Analysis",
                  description: geminiDiagnosis,
                  confidence: 85
                }])
              } catch (error) {
                console.error("Error:", error)
                setDiagnosisResults([{
                  condition: "Error",
                  description: "Unable to generate diagnosis at this time.",
                  confidence: 0
                }])
              } finally {
                setIsLoading(false)
              }
            }}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Submit & Analyze"
            )}
          </Button>
          
          {/* Recent Reports */}
          {savedReports.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Recent Reports
              </h3>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                {savedReports.slice(0, 3).map((report, index) => (
                  <Card key={index} className="border-0 shadow-sm overflow-hidden bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-blue-800 text-sm">
                          {Array.isArray(report.symptoms) 
                            ? report.symptoms.join(", ") 
                            : report.symptom}
                        </h4>
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                          {report.date}
                        </span>
                      </div>
                      <div className="flex items-center mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          Severity: {report.severity}/10
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Diagnosis Sidebar - only shown when there are results */}
      {showDiagnosisPanel && diagnosisResults.length > 0 && (
        <div className="absolute top-20 right-4 z-10 w-96 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md overflow-y-auto max-h-[80vh]">
          <h2 className="text-lg font-bold mb-4">AI Analysis Report</h2>
          
          <div className="mb-4">
            <h3 className="font-semibold">Selected Symptoms:</h3>
            <ul className="list-disc pl-5 text-sm">
              {submittedSymptoms.length > 0 ? (
                submittedSymptoms.map((sym, i) => (
                  <li key={i} className="text-gray-700">{sym}</li>
                ))
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

          {/* Gemini Diagnosis */}
          <div className="mt-4">
            <h3 className="font-semibold">AI Analysis:</h3>

            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500 text-sm">Analyzing symptoms...</p>
              </div>
            ) : diagnosisResults.length > 0 ? (
              <div className="space-y-4 mt-2">
                {diagnosisResults.map((diagnosis, index) => (
                  <div key={index} className="space-y-4">
                    {/* Possible Conditions Card */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <h4 className="font-semibold text-blue-800 mb-2">Possible Conditions</h4>
                      <div className="space-y-2">
                        {diagnosis.description.split("*   **Possible Conditions:**")[1]?.split("*   **Explanation:**")[0]?.split("*   **")?.map((condition, i) => (
                          condition.trim() && (
                            <div key={i} className="bg-white/80 p-3 rounded-lg border border-blue-50">
                              <div className="font-medium text-blue-900">
                                {condition.split(":**")[0]}
                              </div>
                              <div className="text-sm text-gray-700 mt-1">
                                {condition.split(":**")[1]}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Explanation Card */}
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <h4 className="font-semibold text-green-800 mb-2">Explanation</h4>
                      <div className="space-y-2">
                        {diagnosis.description.split("*   **Explanation:**")[1]?.split("*   **Recommended Next Steps:**")[0]?.split("*   **")?.map((explanation, i) => (
                          explanation.trim() && (
                            <div key={i} className="bg-white/80 p-3 rounded-lg border border-green-50">
                              <div className="font-medium text-green-900">
                                {explanation.split(":**")[0]}
                              </div>
                              <div className="text-sm text-gray-700 mt-1">
                                {explanation.split(":**")[1]}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Recommended Next Steps Card */}
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <h4 className="font-semibold text-purple-800 mb-2">Recommended Next Steps</h4>
                      <div className="space-y-2">
                        {diagnosis.description.split("*   **Recommended Next Steps:**")[1]?.split("*   **")?.map((step, i) => (
                          step.trim() && (
                            <div key={i} className="bg-white/80 p-3 rounded-lg border border-purple-50">
                              <div className="font-medium text-purple-900">
                                {step.split(":**")[0]}
                              </div>
                              <div className="text-sm text-gray-700 mt-1">
                                {step.split(":**")[1]}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No analysis available.</p>
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 bg-amber-50/80 p-4 rounded-xl border border-amber-100 shadow-sm">
            <div className="flex items-start">
              <AlertTriangle size={18} className="text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 mb-1">Important Disclaimer</h3>
                <p className="text-xs text-amber-700">
                  This analysis is provided by an AI model and is not a medical diagnosis.
                  Always consult with a healthcare professional for proper evaluation and advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Health Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-48">
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getHealthColor(health)}`}
            style={{ width: `${health}%` }}
          />
        </div>
        <div className="text-center mt-1 text-sm font-medium text-gray-800">
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
      <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-xl text-sm text-center text-gray-700 max-w-md mx-auto">
        <span className="flex items-center justify-center gap-1">💡 Tip: Click and drag to rotate the model. Scroll to zoom in/out.</span>
      </div>
    </div>
  )
}

// Preload the model to improve performance
useGLTF.preload('/models/anatomy/scene.gltf')
useGLTF.preload('/models/lungs/scene.gltf')
useGLTF.preload('/models/heart/scene.gltf')
useGLTF.preload('/models/brain/scene.gltf')
