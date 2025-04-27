"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, AlertTriangle, CheckCircle, Heart, Activity, BarChart4 } from "lucide-react"
import { generateRandomHealthData, analyzeHealthData } from "@/lib/health-data-generator"
import { HealthTimeSeries } from "@/components/health-time-series"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type HealthMetric = 
  | "heartRate"
  | "respiratoryRate"
  | "bodyTemperature"
  | "oxygenSaturation"
  | "systolicBP"
  | "diastolicBP"
  | "weight"
  | "hrv"
  | "pulsePressure"
  | "bmi"
  | "map"

type AnalysisItem = string | string[]

interface Analysis {
  green: AnalysisItem;
  yellow: AnalysisItem;
  red: AnalysisItem;
}

export function RiskScanContent() {
  const [scanning, setScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [healthData, setHealthData] = useState<any>(null)
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric>("heartRate")
  const [analysis, setAnalysis] = useState<Analysis | null>(null)

  const handleScan = async () => {
    setScanning(true)

    try {
      // Generate random health data
      const data = generateRandomHealthData()
      setHealthData(data)

      // Simulate ML model prediction (0 for low risk, 1 for high risk)
      const modelPrediction = Math.random() < 0.3 ? 1 : 0

      // Get AI analysis
      const aiAnalysis = await analyzeHealthData(data, modelPrediction)
      setAnalysis(aiAnalysis)

      setScanning(false)
      setScanComplete(true)
    } catch (error) {
      console.error("Error during scan:", error)
      setScanning(false)
    }
  }

  const resetScan = () => {
    setScanComplete(false)
    setHealthData(null)
    setAnalysis(null)
  }

  const metrics: { value: HealthMetric; label: string }[] = [
    { value: "heartRate", label: "Heart Rate" },
    { value: "respiratoryRate", label: "Respiratory Rate" },
    { value: "bodyTemperature", label: "Body Temperature" },
    { value: "oxygenSaturation", label: "Oxygen Saturation" },
    { value: "systolicBP", label: "Systolic Blood Pressure" },
    { value: "diastolicBP", label: "Diastolic Blood Pressure" },
    { value: "weight", label: "Weight" },
    { value: "hrv", label: "Heart Rate Variability" },
    { value: "pulsePressure", label: "Pulse Pressure" },
    { value: "bmi", label: "BMI" },
    { value: "map", label: "Mean Arterial Pressure" }
  ]

  const renderAnalysisContent = (content: AnalysisItem) => {
    if (Array.isArray(content)) {
      return (
        <ul className="list-disc pl-4 space-y-2">
          {content.map((item, index) => (
            <li key={index} className="text-sm">{item}</li>
          ))}
        </ul>
      )
    }
    return <p className="text-sm">{content}</p>
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

          {analysis && (
            <div className="space-y-4">
              {analysis.green && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base text-green-600">Healthy Indicators</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    {renderAnalysisContent(analysis.green)}
                  </CardContent>
                </Card>
              )}

              {analysis.yellow && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base text-yellow-600">Warning Signs</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    {renderAnalysisContent(analysis.yellow)}
                  </CardContent>
                </Card>
              )}

              {analysis.red && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base text-red-600">Critical Issues</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    {renderAnalysisContent(analysis.red)}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {healthData && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Select
                  value={selectedMetric}
                  onValueChange={(value) => setSelectedMetric(value as HealthMetric)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {metrics.map((metric) => (
                      <SelectItem key={metric.value} value={metric.value}>
                        {metric.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <HealthTimeSeries data={healthData} selectedMetric={selectedMetric} />
            </div>
          )}

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
