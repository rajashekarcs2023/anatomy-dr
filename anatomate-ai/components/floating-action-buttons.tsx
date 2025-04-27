"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { FileText, LineChart, Brain, Share2, Stethoscope, Plus, ClipboardList, User, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { useSymptomStore } from "@/lib/symptom-store"

interface FloatingButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  href: string
  position: string
  label: string
}

function FloatingButton({ icon: Icon, href, position, label, color = "blue" }: FloatingButtonProps & { color?: "blue" | "mint" }) {
  const colorClasses = {
    blue: "text-[#007AFF]",
    mint: "text-[#00C58E]"
  }
  
  return (
    <Link
      href={href}
      className={`absolute ${position} w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group`}
      aria-label={label}
    >
      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colorClasses[color]}`} />
      <span className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 bg-white/90 backdrop-blur-md text-gray-800 text-[10px] sm:text-xs rounded-full py-1.5 sm:py-2 px-3 sm:px-4 pointer-events-none whitespace-nowrap shadow-md border border-gray-100/50">
        {label}
      </span>
    </Link>
  )
}

// Symptom to organ mapping
const symptomToOrgans: Record<string, string[]> = {
  cough: ["Lungs"],
  "chest pain": ["Full Body"],
  "body ache": ["Full Body", "Lungs", "Hand/Foot"],
  headache: ["Full Body"],
  "hand pain": ["Hand/Foot"],
  "foot pain": ["Hand/Foot"],
}

function SymptomManagementButton() {
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
          className="absolute top-[50%] -translate-y-1/2 left-[8%] sm:left-[10%] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
          aria-label="Symptom Management"
        >
          <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-[#00C58E]" />
          <span className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 bg-white/90 backdrop-blur-md text-gray-800 text-[10px] sm:text-xs rounded-full py-1.5 sm:py-2 px-3 sm:px-4 pointer-events-none whitespace-nowrap right-full mr-2 shadow-md border border-gray-100/50">
            Symptom Management
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Symptom Management</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="visualize" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visualize">Visualize Symptoms</TabsTrigger>
            <TabsTrigger value="add">Add Symptom</TabsTrigger>
          </TabsList>
          
          {/* Visualize Symptoms Tab - For highlighting organs on the 3D model */}
          <TabsContent value="visualize" className="mt-4">
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                {Object.entries(symptomToOrgans).map(([symptom, organs]) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox 
                      id={symptom} 
                      checked={selectedSymptoms.includes(symptom)}
                      onCheckedChange={() => toggleSymptom(symptom)}
                    />
                    <Label htmlFor={symptom} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleSubmit}>Apply Highlights</Button>
            </div>
          </TabsContent>
          
          {/* Add Symptom Tab - Original report symptom functionality */}
          <TabsContent value="add" className="mt-4">
            <AddSymptomForm onClose={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function AddSymptomForm({ onClose }: { onClose: () => void }) {
  const [symptom, setSymptom] = useState("")
  const [severity, setSeverity] = useState([5])
  const [date, setDate] = useState<Date>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the symptom to the user's health record
    console.log({ symptom, severity: severity[0], date })
    onClose()

    // Reset form
    setSymptom("")
    setSeverity([5])
    setDate(undefined)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="symptom">What symptom are you experiencing?</Label>
        <Input
          id="symptom"
          placeholder="e.g., Headache, Chest Pain, Fatigue"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">When did it start?</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="severity">Severity</Label>
          <span className="text-sm text-gray-500">{severity[0]}/10</span>
        </div>
        <Slider id="severity" min={1} max={10} step={1} value={severity} onValueChange={setSeverity} />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Mild</span>
          <span>Severe</span>
        </div>
      </div>

      <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
        Save Symptom
      </Button>
    </form>
  )
}

function AnalyzeExplainButton() {
  return (
    <button
      className="absolute top-[30%] -translate-y-1/2 left-[12%] sm:left-[16%] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
      aria-label="Analyze & Explain"
      onClick={() => window.location.href = '/analyze'}
    >
      <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#00C58E]" />
      <span className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 bg-white/90 backdrop-blur-md text-gray-800 text-[10px] sm:text-xs rounded-full py-1.5 sm:py-2 px-3 sm:px-4 pointer-events-none whitespace-nowrap right-full mr-2 shadow-md border border-gray-100/50">
        Analyze & Explain
      </span>
    </button>
  )
}

function ProfileButton() {
  return (
    <Link
      href="/profile"
      className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-md hover:shadow-lg border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Profile"
    >
      <User className="w-5 h-5 text-[#2C3E50]" />
    </Link>
  )
}

export function FloatingActionButtons() {
  return (
    <>
      {/* Left Side Buttons - 3 buttons in a curved arc around the 3D model */}
      <SymptomManagementButton />
      <AnalyzeExplainButton />
      <FloatingButton 
        icon={LineChart} 
        href="/timeline" 
        position="top-[70%] -translate-y-1/2 left-[12%] sm:left-[16%]" 
        label="Health Timeline" 
        color="mint"
      />
      
      {/* Right Side Buttons - 3 buttons in a curved arc around the 3D model */}
      <FloatingButton 
        icon={Brain} 
        href="/risk-scan" 
        position="top-[30%] -translate-y-1/2 right-[12%] sm:right-[16%]" 
        label="Risk Scan" 
        color="blue"
      />
      <FloatingButton 
        icon={FileText} 
        href="/records" 
        position="top-[50%] -translate-y-1/2 right-[8%] sm:right-[10%]" 
        label="Health Records" 
        color="blue"
      />
      <FloatingButton 
        icon={Share2} 
        href="/profile?share=true" 
        position="top-[70%] -translate-y-1/2 right-[12%] sm:right-[16%]" 
        label="Share QR" 
        color="blue"
      />
      
      {/* Profile Button */}
      <ProfileButton />
    </>
  )
}
