"use client"

import { useState } from "react"
import { Stethoscope } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useSymptomStore } from "@/lib/symptom-store"

// Symptom to organ mapping
const symptomToOrgans: Record<string, string[]> = {
  cough: ["Lungs"],
  "chest pain": ["Full Body"],
  "body ache": ["Full Body", "Lungs", "Hand/Foot"],
  headache: ["Full Body"],
  "hand pain": ["Hand/Foot"],
  "foot pain": ["Hand/Foot"],
}

export function SymptomSelectorButton() {
  const [open, setOpen] = useState(false)
  const { selectedSymptoms, toggleSymptom, submitSymptoms } = useSymptomStore()

  const handleSubmit = () => {
    submitSymptoms()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="absolute bottom-[50%] left-8 w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group"
          aria-label="Select Symptoms"
        >
          <Stethoscope size={22} className="text-gray-700" />
          <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap left-16">
            Select Symptoms
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Symptoms</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            {Object.keys(symptomToOrgans).map((symptom) => (
              <div key={symptom} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                <Checkbox
                  id={`symptom-${symptom}`}
                  checked={selectedSymptoms.includes(symptom)}
                  onCheckedChange={() => toggleSymptom(symptom)}
                />
                <Label htmlFor={`symptom-${symptom}`} className="flex-1 cursor-pointer">
                  {symptom}
                </Label>
              </div>
            ))}
          </div>

          <Button onClick={handleSubmit} className="w-full bg-teal-600 hover:bg-teal-700">
            Apply Symptoms
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
