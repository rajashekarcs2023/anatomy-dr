"use client"

import { Button } from "@/components/ui/button"
import { useModeStore } from "@/lib/store"
import { UserRound, Stethoscope } from "lucide-react"

export function ModeToggle() {
  const { mode, setMode } = useModeStore()

  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <Button
        variant={mode === "patient" ? "default" : "outline"}
        className={`rounded-l-md ${
          mode === "patient" ? "bg-teal-600 hover:bg-teal-700" : ""
        } px-6 py-6 flex items-center gap-2`}
        onClick={() => setMode("patient")}
        aria-pressed={mode === "patient"}
      >
        <UserRound size={18} />
        <span>I am a Patient</span>
      </Button>
      <Button
        variant={mode === "doctor" ? "default" : "outline"}
        className={`rounded-r-md ${
          mode === "doctor" ? "bg-blue-600 hover:bg-blue-700" : ""
        } px-6 py-6 flex items-center gap-2`}
        onClick={() => setMode("doctor")}
        aria-pressed={mode === "doctor"}
      >
        <Stethoscope size={18} />
        <span>I am a Doctor</span>
      </Button>
    </div>
  )
}
