"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import { cn } from "@/lib/utils"

interface TimeSlot {
  day: Date
  hour: number
  selected: boolean
}

interface TimeSlotSelectorProps {
  onTimeSlotsSelected: (slots: TimeSlot[]) => void
}

export function TimeSlotSelector({ onTimeSlotsSelected }: TimeSlotSelectorProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()))
  const [weekEnd, setWeekEnd] = useState(endOfWeek(new Date()))

  // Generate time slots for the week
  const generateTimeSlots = useCallback(() => {
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
    const slots: TimeSlot[] = []
    
    days.forEach(day => {
      for (let hour = 9; hour < 17; hour++) { // 9 AM to 5 PM
        slots.push({
          day,
          hour,
          selected: false
        })
      }
    })
    
    setTimeSlots(slots)
  }, [weekStart, weekEnd])

  // Initialize time slots when component mounts or week changes
  useEffect(() => {
    generateTimeSlots()
  }, [generateTimeSlots])

  const toggleSlot = (slot: TimeSlot) => {
    setTimeSlots(prevSlots => 
      prevSlots.map(s => 
        s.day.getTime() === slot.day.getTime() && s.hour === slot.hour
          ? { ...s, selected: !s.selected }
          : s
      )
    )
  }

  // Group time slots by day
  const slotsByDay = timeSlots.reduce((acc, slot) => {
    const dayKey = format(slot.day, 'yyyy-MM-dd')
    if (!acc[dayKey]) {
      acc[dayKey] = []
    }
    acc[dayKey].push(slot)
    return acc
  }, {} as Record<string, TimeSlot[]>)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Your Available Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Week Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => {
                  setWeekStart(prev => addDays(prev, -7))
                  setWeekEnd(prev => addDays(prev, -7))
                }}
              >
                Previous Week
              </Button>
              <span className="text-sm text-gray-500">
                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
              </span>
              <Button
                variant="outline"
                onClick={() => {
                  setWeekStart(prev => addDays(prev, 7))
                  setWeekEnd(prev => addDays(prev, 7))
                }}
              >
                Next Week
              </Button>
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-8 gap-2">
              {/* Time Labels */}
              <div className="space-y-2">
                <div className="h-8"></div>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-12 text-sm text-gray-500">
                    {i + 9}:00
                  </div>
                ))}
              </div>

              {/* Day Columns */}
              {Object.entries(slotsByDay).map(([dayKey, slots]) => (
                <div key={dayKey} className="space-y-2">
                  <div className="h-8 text-center text-sm font-medium">
                    {format(new Date(dayKey), 'EEE')}
                    <br />
                    {format(new Date(dayKey), 'MMM d')}
                  </div>
                  {slots.map((slot, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-12 border rounded cursor-pointer transition-colors",
                        slot.selected
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-gray-50 hover:bg-gray-100"
                      )}
                      onClick={() => toggleSlot(slot)}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-50 border rounded"></div>
                <span>Unavailable</span>
              </div>
            </div>

            {/* Save Button */}
            <Button
              className="w-full"
              onClick={() => {
                const selectedSlots = timeSlots.filter(slot => slot.selected)
                onTimeSlotsSelected(selectedSlots)
              }}
            >
              Save Available Times
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 