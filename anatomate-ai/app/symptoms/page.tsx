"use client"

import { SymptomsPageHeader } from "@/components/symptoms-page-header"
import { SymptomsVisualizationPanel } from "@/components/symptoms-visualization-panel"

export default function SymptomsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SymptomsPageHeader title="Symptom Management" />
      <div className="relative flex-1 overflow-hidden">
        {/* The specialized visualization panel for symptoms with integrated UI */}
        <SymptomsVisualizationPanel />
      </div>
    </div>
  )
}
