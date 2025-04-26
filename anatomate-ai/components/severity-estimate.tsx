"use client"

import { useMemo } from "react"
import { useVisualizationStore } from "@/lib/visualization-store"

export function SeverityEstimate() {
  const { visualizationTarget } = useVisualizationStore()

  // Mock severity based on visualization target
  const severity = useMemo(() => {
    switch (visualizationTarget) {
      case "heart":
        return { level: "Moderate", description: "Requires attention but not immediately life-threatening" }
      case "lungs":
        return { level: "Severe", description: "Requires immediate medical attention" }
      case "spine":
        return { level: "Mild to Moderate", description: "May improve with proper treatment and care" }
      case "head":
        return { level: "Mild", description: "Can be managed with appropriate care" }
      default:
        return { level: "Unknown", description: "Insufficient data to determine severity" }
    }
  }, [visualizationTarget])

  const getSeverityColor = (level: string) => {
    if (level.includes("Severe")) return "bg-red-100 text-red-800 border-red-300"
    if (level.includes("Moderate")) return "bg-yellow-100 text-yellow-800 border-yellow-300"
    if (level.includes("Mild")) return "bg-green-100 text-green-800 border-green-300"
    return "bg-gray-100 text-gray-800 border-gray-300"
  }

  return (
    <div className="mt-6 p-4 rounded-md border bg-gray-50">
      <h3 className="text-sm font-medium mb-3">Condition Assessment</h3>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Estimated Severity:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(severity.level)}`}>
            {severity.level}
          </span>
        </div>
        <p className="text-xs text-gray-600">{severity.description}</p>
      </div>
    </div>
  )
}
