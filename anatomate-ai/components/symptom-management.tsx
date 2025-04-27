"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useSymptomStore } from "@/lib/symptom-store"
import { Stethoscope, Calendar as CalendarIcon, Loader2, AlertTriangle, CheckCircle } from "lucide-react"

// Symptom to organ mapping
const symptomToOrgans: Record<string, string[]> = {
  "cough": ["Lungs"],
  "chest pain": ["Lungs", "Heart"],
  "body ache": ["Full Body", "Hand/Foot"],
  "headache": ["Head"],
  "hand pain": ["Hand/Foot"],
  "foot pain": ["Hand/Foot"],
}

// Preliminary conditions mapping
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

export function SymptomManagement() {
  // State for symptom visualization
  const { selectedSymptoms, toggleSymptom, submitSymptoms } = useSymptomStore()
  
  // State for symptom reporting
  const [symptom, setSymptom] = useState("")
  const [severity, setSeverity] = useState([5])
  const [date, setDate] = useState<Date>()
  const [description, setDescription] = useState("")
  
  // State for diagnosis
  const [isLoading, setIsLoading] = useState(false)
  const [diagnosisResults, setDiagnosisResults] = useState<{ condition: string, description: string, confidence: number }[]>([])
  const [savedReports, setSavedReports] = useState<any[]>([])

  // Handle symptom visualization - immediately apply highlighting
  const handleVisualize = () => {
    // No need to call submitSymptoms() as the changes are applied immediately
    // The visualization panel reads directly from the symptom store
  }

  // Handle report submission
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate mock diagnoses based on the symptom
      const matchedSymptoms = Object.keys(symptomToOrgans).filter(
        s => symptom.toLowerCase().includes(s)
      )
      
      const generatedDiagnoses = matchedSymptoms
        .flatMap(symptom => preliminaryConditions[symptom] || [])
        .filter((v, i, a) => a.findIndex(t => t.condition === v.condition) === i)
        .slice(0, 4)
        .map(diagnosis => ({
          ...diagnosis,
          confidence: Math.floor(Math.random() * 41) + 50 // 50%-90%
        }))

      setDiagnosisResults(generatedDiagnoses)
      setIsLoading(false)
      
      // Save the report
      const report = {
        symptom,
        severity: severity[0],
        date: date ? format(date, "PPP") : "Not specified",
        description,
        diagnoses: generatedDiagnoses,
        timestamp: new Date().toISOString()
      }
      
      setSavedReports(prev => [report, ...prev])
    }, 2000)
  }

  // Helper: get text color based on confidence
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "#16a34a" // Strong green
    if (confidence >= 60) return "#4ade80" // Light green
    return "#9ca3af" // Gray if lower
  }

  return (
    <div className="space-y-6 pb-20">
      <Tabs defaultValue="visualize" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
          <TabsTrigger value="visualize" className="flex items-center gap-1.5 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Visualize Symptoms</span>
          </TabsTrigger>
          <TabsTrigger value="report" className="flex items-center gap-1.5 data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Report Symptom</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Visualize Symptoms Tab */}
        <TabsContent value="visualize" className="mt-4">
          <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-blue-800">Highlight Body Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Select symptoms to highlight affected areas on the 3D model.
              </p>
              
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  {Object.entries(symptomToOrgans).map(([symptom, organs]) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`vis-${symptom}`} 
                        checked={selectedSymptoms.includes(symptom)}
                        onCheckedChange={() => {
                          toggleSymptom(symptom)
                          // Immediately submit changes to update the visualization
                          submitSymptoms()
                        }}
                      />
                      <Label htmlFor={`vis-${symptom}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
                        <span className="ml-2 text-xs text-gray-500">
                          ({organs.join(", ")})
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-gray-500 italic">
                  Changes are applied immediately to the 3D model
                </div>
                <Button onClick={() => {
                  // Clear all selected symptoms
                  selectedSymptoms.forEach(symptom => toggleSymptom(symptom))
                  submitSymptoms()
                }}>Reset All</Button>
              </div>
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleVisualize}
                  className="bg-gradient-to-r from-[#007AFF] to-[#00C58E] hover:from-[#0068D6] hover:to-[#00A97A] text-white font-medium py-5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-0"
                >
                  Apply to 3D Model
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Report Symptom Tab */}
        <TabsContent value="report" className="mt-4">
          <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-green-800">Report a Symptom</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReportSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="symptom">What symptom are you experiencing?</Label>
                  <Input
                    id="symptom"
                    placeholder="e.g., Headache, Chest Pain, Fatigue"
                    value={symptom}
                    onChange={(e) => setSymptom(e.target.value)}
                    required
                    className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm focus-visible:ring-[#00C58E] rounded-xl"
                  />
                </div>

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
                
                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your symptoms in more detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm focus-visible:ring-[#00C58E] rounded-xl"
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#00C58E] to-[#007AFF] hover:from-[#00A97A] hover:to-[#0068D6] text-white font-medium py-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Submit Symptom Report"
                  )}
                </Button>
              </form>
              
              {/* Diagnosis Results */}
              {diagnosisResults.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-green-800 mb-4">Preliminary Analysis</h3>
                  
                  <div className="space-y-4">
                    {diagnosisResults.map((diagnosis, index) => (
                      <div key={index} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="font-semibold" style={{ color: getConfidenceColor(diagnosis.confidence) }}>
                          {diagnosis.condition}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{diagnosis.description}</div>

                        {/* Confidence bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-2 rounded-full"
                            style={{
                              width: `${diagnosis.confidence}%`,
                              backgroundColor: getConfidenceColor(diagnosis.confidence)
                            }}
                          />
                        </div>

                        <div className="text-right text-xs text-gray-500 mt-1">{diagnosis.confidence}% confidence</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 bg-amber-50/80 p-4 rounded-xl border border-amber-100 shadow-sm">
                    <div className="flex items-start">
                      <AlertTriangle size={18} className="text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-amber-800 mb-1">Important Disclaimer</h3>
                        <p className="text-xs text-amber-700">
                          This analysis is preliminary and based on the information you've provided. It is not a medical diagnosis.
                          Always consult with a healthcare professional for proper evaluation and advice.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Saved Reports */}
          {savedReports.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Recent Reports</h3>
              <div className="space-y-4">
                {savedReports.slice(0, 3).map((report, index) => (
                  <Card key={index} className="border-0 shadow-md overflow-hidden bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-blue-800">{report.symptom}</h4>
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          {report.date}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          Severity: {report.severity}/10
                        </span>
                      </div>
                      {report.description && (
                        <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
