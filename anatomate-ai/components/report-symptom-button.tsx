"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

export function ReportSymptomButton() {
  const [open, setOpen] = useState(false)
  const [symptom, setSymptom] = useState("")
  const [severity, setSeverity] = useState([5])
  const [date, setDate] = useState<Date>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the symptom to the user's health record
    console.log({ symptom, severity: severity[0], date })
    setOpen(false)

    // Reset form
    setSymptom("")
    setSeverity([5])
    setDate(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95"
          aria-label="Report Symptom"
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report a Symptom</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
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
      </DialogContent>
    </Dialog>
  )
}
