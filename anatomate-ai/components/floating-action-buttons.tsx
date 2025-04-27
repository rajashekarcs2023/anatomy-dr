"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { FileText, LineChart, Brain, Share2, Stethoscope, Plus, ClipboardList, User, Search } from "lucide-react"

interface FloatingButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  href: string
  position: string
  label: string
}

function FloatingButton({ icon: Icon, href, position, label, color = "blue" }: FloatingButtonProps & { color?: "blue" | "mint" | "gold" | "purple" | "emerald" | "indigo" }) {
  // Updated vibrant color palette
  const colorClasses = {
    blue: "text-[#60A5FA] group-hover:text-[#3B82F6] group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]",
    mint: "text-[#4ADE80] group-hover:text-[#22C55E] group-hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]",
    gold: "text-[#FBBF24] group-hover:text-[#F59E0B] group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]",
    purple: "text-[#A78BFA] group-hover:text-[#8B5CF6] group-hover:drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]",
    emerald: "text-[#34D399] group-hover:text-[#10B981] group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]",
    indigo: "text-[#818CF8] group-hover:text-[#6366F1] group-hover:drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]"
  }

  // Enhanced background gradients
  const bgGradients = {
    blue: "bg-gradient-to-br from-white to-blue-50/90",
    mint: "bg-gradient-to-br from-white to-green-50/90",
    gold: "bg-gradient-to-br from-white to-amber-50/90",
    purple: "bg-gradient-to-br from-white to-purple-50/90",
    emerald: "bg-gradient-to-br from-white to-emerald-50/90",
    indigo: "bg-gradient-to-br from-white to-indigo-50/90"
  }
  
  return (
    <Link
      href={href}
      className={`absolute ${position} w-16 h-16 sm:w-[64px] sm:h-[64px] rounded-full ${bgGradients[color]} backdrop-blur-md shadow-lg hover:shadow-xl border border-white/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-white/0 before:hover:bg-white/10 before:transition-all before:duration-300 before:scale-100 hover:before:scale-[1.35] before:opacity-0 hover:before:opacity-100 overflow-visible z-10`}
      aria-label={label}
    >
      <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${colorClasses[color]} transition-all duration-300`} />
      <span className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 bg-white/95 backdrop-blur-md text-gray-800 text-xs font-medium rounded-full py-2 px-4 pointer-events-none whitespace-nowrap shadow-md border border-white/60 z-10 bottom-full mb-3 left-1/2 -translate-x-1/2">
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
  return (
    <Link href="/symptoms">
      <button
        className="absolute top-[50%] -translate-y-1/2 left-[8%] sm:left-[10%] w-16 h-16 sm:w-[64px] sm:h-[64px] rounded-full bg-gradient-to-br from-white to-green-50/90 backdrop-blur-md shadow-lg hover:shadow-xl border border-white/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-white/0 before:hover:bg-white/10 before:transition-all before:duration-300 before:scale-100 hover:before:scale-[1.35] before:opacity-0 hover:before:opacity-100 overflow-visible z-10"
        aria-label="Symptom Management"
      >
        <Stethoscope className="w-7 h-7 sm:w-8 sm:h-8 text-[#4ADE80] group-hover:text-[#22C55E] group-hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.6)] transition-all duration-300" />
        <span className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 bg-white/95 backdrop-blur-md text-gray-800 text-xs font-medium rounded-full py-2 px-4 pointer-events-none whitespace-nowrap shadow-md border border-white/60 z-10 bottom-full mb-3 left-1/2 -translate-x-1/2">
          Symptom Management
        </span>
      </button>
    </Link>
  )
}



function AnalyzeExplainButton() {
  return (
    <button
      className="absolute top-[30%] -translate-y-1/2 left-[12%] sm:left-[16%] w-16 h-16 sm:w-[64px] sm:h-[64px] rounded-full bg-gradient-to-br from-white to-indigo-50/90 backdrop-blur-md shadow-lg hover:shadow-xl border border-white/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-white/0 before:hover:bg-white/10 before:transition-all before:duration-300 before:scale-100 hover:before:scale-[1.35] before:opacity-0 hover:before:opacity-100 overflow-visible z-10"
      aria-label="Analyze & Explain"
      onClick={() => window.location.href = '/analyze'}
    >
      <Search className="w-7 h-7 sm:w-8 sm:h-8 text-[#818CF8] group-hover:text-[#6366F1] group-hover:drop-shadow-[0_0_12px_rgba(99,102,241,0.6)] transition-all duration-300" />
      <span className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 bg-white/95 backdrop-blur-md text-gray-800 text-xs font-medium rounded-full py-2 px-4 pointer-events-none whitespace-nowrap shadow-md border border-white/60 z-10 bottom-full mb-3 left-1/2 -translate-x-1/2">
        Analyze & Explain
      </span>
    </button>
  )
}

function ProfileButton() {
  return (
    <Link
      href="/profile"
      className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-white to-blue-50/90 backdrop-blur-md shadow-lg hover:shadow-xl border border-white/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-white/0 before:hover:bg-white/10 before:transition-all before:duration-300 before:scale-100 hover:before:scale-[1.35] before:opacity-0 hover:before:opacity-100 overflow-visible"
      aria-label="Profile"
    >
      <User className="w-6 h-6 text-[#60A5FA] group-hover:text-[#3B82F6] group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-300" />
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
        color="purple"
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
        label="Share Health Snapshot" 
        color="gold"
      />
      
      {/* Add Symptom Button removed as requested */}
      
      {/* Profile Button */}
      <ProfileButton />
    </>
  )
}
