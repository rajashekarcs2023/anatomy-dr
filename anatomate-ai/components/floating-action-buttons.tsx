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
  // Cosmic vibrant color palette
  const colorClasses = {
    blue: "text-[#00BFFF] group-hover:text-white",
    mint: "text-[#00FFCC] group-hover:text-white",
    gold: "text-[#FFC837] group-hover:text-white",
    purple: "text-[#A78BFA] group-hover:text-white",
    emerald: "text-[#10FFCB] group-hover:text-white",
    indigo: "text-[#818CF8] group-hover:text-white"
  }
  
  // Cosmic background gradients
  const bgGradients = {
    blue: "bg-gradient-to-br from-[#0B132B]/80 to-[#1C3D5A]/90",
    mint: "bg-gradient-to-br from-[#0B132B]/80 to-[#004D40]/90",
    gold: "bg-gradient-to-br from-[#0B132B]/80 to-[#7D4400]/90",
    purple: "bg-gradient-to-br from-[#0B132B]/80 to-[#4A148C]/90",
    emerald: "bg-gradient-to-br from-[#0B132B]/80 to-[#004D40]/90",
    indigo: "bg-gradient-to-br from-[#0B132B]/80 to-[#283593]/90"
  }
  
  // Glow effects
  const glowEffects = {
    blue: "shadow-[0_0_15px_rgba(0,191,255,0.5)]",
    mint: "shadow-[0_0_15px_rgba(0,255,204,0.5)]",
    gold: "shadow-[0_0_15px_rgba(255,200,55,0.5)]",
    purple: "shadow-[0_0_15px_rgba(167,139,250,0.5)]",
    emerald: "shadow-[0_0_15px_rgba(16,255,203,0.5)]",
    indigo: "shadow-[0_0_15px_rgba(129,140,248,0.5)]"
  }
  
  // Border colors
  const borderColors = {
    blue: "border-[#00BFFF]/30",
    mint: "border-[#00FFCC]/30",
    gold: "border-[#FFC837]/30",
    purple: "border-[#A78BFA]/30",
    emerald: "border-[#10FFCB]/30",
    indigo: "border-[#818CF8]/30"
  }
  
  // Hover glow effects
  const hoverGlowEffects = {
    blue: "group-hover:shadow-[0_0_20px_rgba(0,191,255,0.7)]",
    mint: "group-hover:shadow-[0_0_20px_rgba(0,255,204,0.7)]",
    gold: "group-hover:shadow-[0_0_20px_rgba(255,200,55,0.7)]",
    purple: "group-hover:shadow-[0_0_20px_rgba(167,139,250,0.7)]",
    emerald: "group-hover:shadow-[0_0_20px_rgba(16,255,203,0.7)]",
    indigo: "group-hover:shadow-[0_0_20px_rgba(129,140,248,0.7)]"
  }
  
  return (
    <Link
      href={href}
      className={`absolute ${position} w-16 h-16 sm:w-[64px] sm:h-[64px] rounded-full ${bgGradients[color]} backdrop-blur-md ${glowEffects[color]} hover:${hoverGlowEffects[color]} border ${borderColors[color]} flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group animate-pulse-slow overflow-visible z-10`}
      aria-label={label}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${colorClasses[color]} transition-all duration-300 ${hoverGlowEffects[color]}`} />
      <span className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 bg-[#0B132B]/80 backdrop-blur-md text-white text-xs font-medium rounded-full py-2 px-4 pointer-events-none whitespace-nowrap shadow-lg border border-white/10 z-20 bottom-full mb-3 left-1/2 -translate-x-1/2">
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
        className="absolute top-[50%] -translate-y-1/2 left-[8%] sm:left-[10%] w-16 h-16 sm:w-[64px] sm:h-[64px] rounded-full bg-gradient-to-br from-[#0B132B]/80 to-[#004D40]/90 backdrop-blur-md shadow-[0_0_15px_rgba(16,255,203,0.5)] hover:shadow-[0_0_20px_rgba(16,255,203,0.7)] border border-[#10FFCB]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group animate-pulse-slow overflow-visible z-10"
        aria-label="Symptom Management"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <Stethoscope className="w-7 h-7 sm:w-8 sm:h-8 text-[#10FFCB] group-hover:text-white transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(16,255,203,0.7)]" />
        <span className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 bg-[#0B132B]/80 backdrop-blur-md text-white text-xs font-medium rounded-full py-2 px-4 pointer-events-none whitespace-nowrap bottom-full mb-3 left-1/2 -translate-x-1/2 shadow-lg border border-white/10 z-20">
          Symptom Management
        </span>
      </button>
    </Link>
  )
}



function AnalyzeExplainButton() {
  return (
    <button
      className="absolute top-[30%] -translate-y-1/2 left-[12%] sm:left-[16%] w-16 h-16 sm:w-[64px] sm:h-[64px] rounded-full bg-gradient-to-br from-[#0B132B]/80 to-[#283593]/90 backdrop-blur-md shadow-[0_0_15px_rgba(129,140,248,0.5)] hover:shadow-[0_0_20px_rgba(129,140,248,0.7)] border border-[#818CF8]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group animate-pulse-slow overflow-visible z-10"
      aria-label="Analyze & Explain"
      onClick={() => window.location.href = '/analyze'}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      <Search className="w-7 h-7 sm:w-8 sm:h-8 text-[#818CF8] group-hover:text-white transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(129,140,248,0.7)]" />
      <span className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 bg-[#0B132B]/80 backdrop-blur-md text-white text-xs font-medium rounded-full py-2 px-4 pointer-events-none whitespace-nowrap bottom-full mb-3 left-1/2 -translate-x-1/2 shadow-lg border border-white/10 z-20">
        Analyze & Explain
      </span>
    </button>
  )
}

function ProfileButton() {
  return (
    <Link
      href="/profile"
      className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-[#0B132B]/80 to-[#1C3D5A]/90 backdrop-blur-md shadow-[0_0_15px_rgba(0,191,255,0.5)] hover:shadow-[0_0_20px_rgba(0,191,255,0.7)] border border-[#00BFFF]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group animate-pulse-slow overflow-hidden"
      aria-label="Profile"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      <User className="w-6 h-6 text-[#00BFFF] group-hover:text-white transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,191,255,0.7)]" />
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
