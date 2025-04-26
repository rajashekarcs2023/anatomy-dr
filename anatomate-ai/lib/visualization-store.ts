"use client"

import { create } from "zustand"

interface VisualizationState {
  visualizationTarget: string
  showScan: boolean
  setVisualizationTarget: (target: string) => void
  setShowScan: (show: boolean) => void
}

export const useVisualizationStore = create<VisualizationState>((set) => ({
  visualizationTarget: "general",
  showScan: false,
  setVisualizationTarget: (target) => set({ visualizationTarget: target }),
  setShowScan: (show) => set({ showScan: show }),
}))
