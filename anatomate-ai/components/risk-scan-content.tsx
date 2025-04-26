"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react"

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
    <div className="space-y-6">
      {!scanComplete ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Health Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-center mb-6">
              Run a quick health risk assessment based on your health records, symptoms, and family history.
            </p>
            <div className="w-full max-w-xs">
              <Button onClick={handleScan} disabled={scanning} className="w-full bg-teal-600 hover:bg-teal-700">
                {scanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing your health data...
                  </>
                ) : (
                  "Run Health Risk Scan"
                )}
              </Button>
            </div>
            {scanning && (
              <div className="mt-6 w-full max-w-xs">
                <Progress value={45} className="h-2 mb-2" />
                <p className="text-xs text-center text-gray-500">
                  Analyzing your health data and comparing with similar profiles...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Risk Assessment</h2>
            <Button variant="outline" size="sm" onClick={resetScan}>
              Run New Scan
            </Button>
          </div>

          <div className="space-y-4">
            {risks.map((risk) => (
              <Card key={risk.id}>
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex justify-between items-center">
                    <span>{risk.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(risk.level)}`}>
                      {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)} Risk
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                    <Progress
                      value={getRiskProgressValue(risk.level)}
                      className={`h-2 ${getRiskProgressColor(risk.level)}`}
                    />
                  </div>
                  <p className="text-sm mb-3">{risk.description}</p>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <CheckCircle size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-blue-800">{risk.recommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 bg-amber-50 p-4 rounded-md">
            <div className="flex items-start">
              <AlertTriangle size={20} className="text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 mb-1">Important Disclaimer</h3>
                <p className="text-sm text-amber-700">
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
