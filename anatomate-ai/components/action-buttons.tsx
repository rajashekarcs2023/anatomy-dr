"use client"

import Link from "next/link"
import { ClipboardList, LineChart, Brain, Share2, Search } from "lucide-react"

const actions = [
  {
    name: "View Health Records",
    icon: ClipboardList,
    path: "/records",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Health Timeline",
    icon: LineChart,
    path: "/timeline",
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Risk Detection",
    icon: Brain,
    path: "/risk-scan",
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Share Health Snapshot",
    icon: Share2,
    path: "/profile?share=true",
    color: "bg-amber-100 text-amber-600",
  },
  {
    name: "Analyze & Explain",
    icon: Search,
    path: "/analyze",
    color: "bg-teal-100 text-teal-600",
  },
]

export function ActionButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => (
        <Link
          key={action.name}
          href={action.path}
          className={`${action.color} p-4 rounded-xl flex flex-col items-center justify-center text-center transition-transform hover:scale-105 active:scale-95`}
        >
          <action.icon size={24} className="mb-2" />
          <span className="text-sm font-medium">{action.name}</span>
        </Link>
      ))}
    </div>
  )
}
