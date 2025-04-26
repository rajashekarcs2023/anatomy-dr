"use client"

import { useMemo } from "react"
import { useVisualizationStore } from "@/lib/visualization-store"

interface Case {
  id: string
  summary: string
  condition: string
  outcome: string
}

export function SimilarCases() {
  const { visualizationTarget } = useVisualizationStore()

  // Mock similar cases based on visualization target
  const similarCases = useMemo(() => {
    switch (visualizationTarget) {
      case "heart":
        return [
          {
            id: "C-1023",
            summary: "58-year-old with chest pain and shortness of breath",
            condition: "Coronary artery disease",
            outcome: "Improved with medication and lifestyle changes",
          },
          {
            id: "C-0872",
            summary: "42-year-old with palpitations and fatigue",
            condition: "Atrial fibrillation",
            outcome: "Managed with anticoagulants and rhythm control",
          },
        ]
      case "lungs":
        return [
          {
            id: "C-2145",
            summary: "35-year-old with sudden chest pain and difficulty breathing",
            condition: "Pulmonary embolism",
            outcome: "Recovered with anticoagulation therapy",
          },
          {
            id: "C-1987",
            summary: "62-year-old smoker with persistent cough",
            condition: "COPD exacerbation",
            outcome: "Improved with bronchodilators and steroids",
          },
        ]
      case "spine":
        return [
          {
            id: "C-3421",
            summary: "45-year-old with lower back pain radiating to leg",
            condition: "Lumbar disc herniation",
            outcome: "Improved with physical therapy and pain management",
          },
          {
            id: "C-3156",
            summary: "29-year-old athlete with acute back pain after lifting",
            condition: "Muscle strain with disc bulge",
            outcome: "Full recovery after rest and rehabilitation",
          },
        ]
      case "head":
        return [
          {
            id: "C-4532",
            summary: "38-year-old with recurrent headaches and visual disturbances",
            condition: "Migraine with aura",
            outcome: "Managed with preventive medication and lifestyle changes",
          },
          {
            id: "C-4217",
            summary: "52-year-old with sudden severe headache",
            condition: "Tension headache",
            outcome: "Resolved with pain management and stress reduction",
          },
        ]
      default:
        return [
          {
            id: "C-5001",
            summary: "Patient with similar symptoms",
            condition: "Related condition",
            outcome: "Positive outcome with appropriate treatment",
          },
          {
            id: "C-5002",
            summary: "Patient with comparable presentation",
            condition: "Similar diagnosis",
            outcome: "Improved with standard care protocol",
          },
        ]
    }
  }, [visualizationTarget])

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-3">🧬 Similar Past Cases</h3>
      <div className="space-y-3">
        {similarCases.map((case_) => (
          <div key={case_.id} className="p-3 bg-blue-50 rounded-md border border-blue-100">
            <div className="flex justify-between items-start">
              <div className="text-sm font-medium text-blue-800">{case_.summary}</div>
              <div className="text-xs text-gray-500">{case_.id}</div>
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:justify-between text-xs">
              <div>
                <span className="font-medium">Condition:</span> {case_.condition}
              </div>
              <div>
                <span className="font-medium">Outcome:</span> {case_.outcome}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
