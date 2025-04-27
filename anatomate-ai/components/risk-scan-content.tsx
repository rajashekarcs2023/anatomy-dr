"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, AlertTriangle, CheckCircle, Heart, Activity, BarChart4 } from "lucide-react"

type RiskLevel = "low" | "medium" | "high"

interface Risk {
  id: string
  name: string
  level: RiskLevel
  description: string
  recommendation: string
}

// Mock risks
const mockRisks: Risk[] = [
  {
    id: "r1",
    name: "Heart Disease",
    level: "low",
    description: "Based on your health history and lifestyle, your risk for heart disease is low.",
    recommendation: "Continue with regular exercise and a balanced diet low in saturated fats.",
  },
  {
    id: "r2",
    name: "Type 2 Diabetes",
    level: "medium",
    description: "Your family history and recent blood sugar readings suggest a moderate risk for type 2 diabetes.",
    recommendation: "Consider reducing sugar intake and increasing physical activity. Schedule a blood glucose test.",
  },
  {
    id: "r3",
    name: "Hypertension",
    level: "high",
    description: "Your recent blood pressure readings and family history indicate a higher risk for hypertension.",
    recommendation: "Schedule a follow-up with your doctor to discuss blood pressure management strategies.",
  },
]

export function RiskScanContent() {
  const [scanning, setScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [risks, setRisks] = useState<Risk[]>([])

  const handleScan = () => {
    setScanning(true)

    // Simulate scan delay
    setTimeout(() => {
      setScanning(false)
      setScanComplete(true)
      setRisks(mockRisks)
    }, 3000)
  }

  const resetScan = () => {
    setScanComplete(false)
    setRisks([])
  }

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "high":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getRiskProgressColor = (level: RiskLevel) => {
    switch (level) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRiskProgressValue = (level: RiskLevel) => {
    switch (level) {
      case "low":
        return 25
      case "medium":
        return 50
      case "high":
        return 85
      default:
        return 0
    }
  }

  return (
    <div className="space-y-6 pb-20">
      {!scanComplete ? (
        <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            {/* Subtle background pattern - DNA helix and heartbeat */}
            <div className="absolute top-10 left-10 text-blue-800">
              <BarChart4 size={80} strokeWidth={1} />
            </div>
            <div className="absolute bottom-10 right-10 text-blue-800">
              <Heart size={60} strokeWidth={1} />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-800">
              <Activity size={120} strokeWidth={1} />
            </div>
          </div>
          
          <CardHeader>
            <CardTitle className="text-center text-blue-800 text-xl sm:text-2xl">Health Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center relative z-10">
            <p className="text-center mb-8 text-gray-600 max-w-md mx-auto">
              Run a quick health risk assessment based on your health records, symptoms, and family history.
            </p>
            <div className="w-full max-w-xs">
              <Button 
                onClick={handleScan} 
                disabled={scanning} 
                className="w-full bg-gradient-to-r from-[#007AFF] to-[#00C58E] hover:from-[#0068D6] hover:to-[#00A97A] text-white font-medium py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-0"
              >
                {scanning ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing your health data...
                  </>
                ) : (
                  "Run Health Risk Scan"
                )}
              </Button>
            </div>
            {scanning && (
              <div className="mt-8 w-full max-w-xs">
                <Progress value={45} className="h-3 mb-3 rounded-full bg-gray-100" />
                <p className="text-sm text-center text-gray-500">
                  Analyzing your health data and comparing with similar profiles...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm py-3 z-10 rounded-lg px-2">
            <h2 className="text-xl font-bold text-blue-800">Your Risk Assessment</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetScan}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
            >
              Run New Scan
            </Button>
          </div>

          <div className="space-y-5">
            {risks.map((risk) => (
              <Card key={risk.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                <CardHeader className="py-4 pb-3">
                  <CardTitle className="text-base flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      {risk.level === "high" ? (
                        <AlertTriangle size={16} className="text-red-500" />
                      ) : risk.level === "medium" ? (
                        <Activity size={16} className="text-yellow-500" />
                      ) : (
                        <Heart size={16} className="text-green-500" />
                      )}
                      {risk.name}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getRiskColor(risk.level)}`}>
                      {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)} Risk
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-3">
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1 px-1">
                      <span className="text-green-600 font-medium">Low</span>
                      <span className="text-red-600 font-medium">High</span>
                    </div>
                    <Progress
                      value={getRiskProgressValue(risk.level)}
                      className={`h-2.5 rounded-full ${getRiskProgressColor(risk.level)}`}
                    />
                  </div>
                  <p className="text-sm mb-4 text-gray-600">{risk.description}</p>
                  <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-start">
                      <CheckCircle size={18} className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-sm text-blue-800 leading-relaxed">{risk.recommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 bg-amber-50/80 p-5 rounded-xl border border-amber-100 shadow-sm">
            <div className="flex items-start">
              <AlertTriangle size={22} className="text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 mb-2">Important Disclaimer</h3>
                <p className="text-sm text-amber-700 leading-relaxed">
                  This risk assessment is based on the information you've provided and is not a medical diagnosis.
                  Always consult with a healthcare professional for proper evaluation and advice.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
