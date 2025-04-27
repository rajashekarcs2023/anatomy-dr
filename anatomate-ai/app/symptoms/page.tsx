"use client"

import { PageHeader } from "@/components/page-header"
import { SymptomsVisualizationPanel } from "@/components/symptoms-visualization-panel"



export default function SymptomsPage() {

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Symptom Management" />
      <div className="relative flex-1 overflow-hidden">
        {/* The specialized visualization panel for symptoms with integrated UI */}
        <SymptomsVisualizationPanel />
      </div>
    </div>
  )
}
