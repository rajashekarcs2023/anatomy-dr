"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Stethoscope, FileText, Calendar, Activity } from "lucide-react"

// Mock timeline data
const timelineEvents = [
  {
    id: "e1",
    date: "2023-04-15",
    type: "visit",
    title: "Annual checkup",
    description: "All vitals normal. Recommended regular exercise.",
    color: "bg-blue-500",
  },
  {
    id: "e2",
    date: "2023-03-20",
    type: "symptom",
    title: "Chest pain resolved",
    description: "No more discomfort after completing medication.",
    color: "bg-green-500",
  },
  {
    id: "e3",
    date: "2023-02-10",
    type: "visit",
    title: "Doctor visit for chest pain",
    description: "Diagnosed with mild GERD. Prescribed antacids.",
    color: "bg-blue-500",
  },
  {
    id: "e4",
    date: "2023-02-05",
    type: "symptom",
    title: "Started experiencing chest pain",
    description: "Mild discomfort after eating spicy foods.",
    color: "bg-yellow-500",
  },
  {
    id: "e5",
    date: "2022-11-05",
    type: "visit",
    title: "Seasonal allergies checkup",
    description: "Prescribed antihistamines for moderate symptoms.",
    color: "bg-blue-500",
  },
]

export function HealthTimeline() {
  // Group events by month and year
  const groupedEvents: Record<string, typeof timelineEvents> = {}

  timelineEvents.forEach((event) => {
    const date = new Date(event.date)
    const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`

    if (!groupedEvents[monthYear]) {
      groupedEvents[monthYear] = []
    }

    groupedEvents[monthYear].push(event)
  })

  // Function to get the appropriate icon based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case "visit":
        return <Stethoscope className="w-4 h-4 text-blue-600" />
      case "symptom":
        return <FileText className="w-4 h-4 text-yellow-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-8 px-2 sm:px-4 pb-20">
      {Object.entries(groupedEvents).map(([monthYear, events]) => (
        <div key={monthYear}>
          <div className="flex items-center mb-4 sticky top-0 bg-white/80 backdrop-blur-sm py-2 z-10">
            <Calendar className="w-5 h-5 mr-2 text-[#00C58E]" />
            <h3 className="text-lg font-medium text-gray-800">{monthYear}</h3>
          </div>
          <div className="space-y-6 relative">
            {/* Vertical timeline connector */}
            <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#E6F7F2] via-[#D0F0E9] to-[#E6F7F2] z-0"></div>
            
            {events.map((event, index) => (
              <div key={event.id} className="flex relative z-10">
                {/* Timeline dot with icon */}
                <div className="mr-4 flex-shrink-0">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md ${
                    event.type === "visit" ? "bg-blue-50" : "bg-yellow-50"
                  }`}>
                    {getEventIcon(event.type)}
                  </div>
                </div>
                
                {/* Card */}
                <Card className="flex-1 mb-2 overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{event.title}</h4>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {new Date(event.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    <div className="flex items-center">
                      <span
                        className={`text-xs px-3 py-1 rounded-full flex items-center ${
                          event.type === "visit"
                            ? "bg-blue-100/70 text-blue-700"
                            : event.type === "symptom"
                              ? "bg-yellow-100/70 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {event.type === "visit" ? "🩺" : "📋"} 
                        <span className="ml-1">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
