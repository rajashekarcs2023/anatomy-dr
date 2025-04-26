"use client"

import { Card, CardContent } from "@/components/ui/card"

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

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([monthYear, events]) => (
        <div key={monthYear}>
          <h3 className="text-lg font-medium mb-3">{monthYear}</h3>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${event.color}`}></div>
                  <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                </div>
                <Card className="flex-1 mb-2">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{event.description}</p>
                    <div className="mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          event.type === "visit"
                            ? "bg-blue-100 text-blue-700"
                            : event.type === "symptom"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
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
