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
  return (
    <Link href="/symptoms">
      <button
        className="absolute top-[50%] -translate-y-1/2 left-[8%] sm:left-[10%] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
        aria-label="Symptom Management"
      >
        <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-[#00C58E]" />
        <span className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 bg-white/90 backdrop-blur-md text-gray-800 text-[10px] sm:text-xs rounded-full py-1.5 sm:py-2 px-3 sm:px-4 pointer-events-none whitespace-nowrap right-full mr-2 shadow-md border border-gray-100/50">
          Symptom Management
        </span>
      </button>
    </Link>
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
