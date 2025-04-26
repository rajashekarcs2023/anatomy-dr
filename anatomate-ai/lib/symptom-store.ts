"use client"

import { create } from "zustand"

// Symptom to organ mapping
const symptomToOrgans: Record<string, string[]> = {
  cough: ["Lungs"],
  "chest pain": ["Full Body"],
  "body ache": ["Full Body", "Lungs", "Hand/Foot"],
  headache: ["Full Body"],
  "hand pain": ["Hand/Foot"],
  "foot pain": ["Hand/Foot"],
}

interface SymptomState {
  selectedSymptoms: string[]
  highlightedOrgans: string[]
  setSelectedSymptoms: (symptoms: string[]) => void
  toggleSymptom: (symptom: string) => void
  submitSymptoms: () => void
}

export const useSymptomStore = create<SymptomState>((set, get) => ({
  selectedSymptoms: [],
  highlightedOrgans: [],

  setSelectedSymptoms: (symptoms) => set({ selectedSymptoms: symptoms }),

  toggleSymptom: (symptom) =>
    set((state) => {
      const isSelected = state.selectedSymptoms.includes(symptom)
      return {
        selectedSymptoms: isSelected
          ? state.selectedSymptoms.filter((s) => s !== symptom)
          : [...state.selectedSymptoms, symptom],
      }
    }),

  submitSymptoms: () =>
    set((state) => {
      // Calculate highlighted organs based on selected symptoms
      const organs = state.selectedSymptoms
        .flatMap((symptom) => symptomToOrgans[symptom] || [])
        .filter((v, i, a) => a.indexOf(v) === i)

      return { highlightedOrgans: organs }
    }),
}))
