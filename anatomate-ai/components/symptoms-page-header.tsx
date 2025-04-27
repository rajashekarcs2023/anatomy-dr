"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface SymptomsPageHeaderProps {
  title: string
}

export function SymptomsPageHeader({ title }: SymptomsPageHeaderProps) {
  const router = useRouter()
  
  const handleBackClick = () => {
    router.push('/')
  }
  
  return (
    <header className="bg-gradient-to-br from-[#0B132B] to-[#1C3D5A] py-4 px-4 text-white shadow-lg fixed top-0 left-0 right-0 z-[100]">
      <div className="flex items-center">
        <button 
          onClick={handleBackClick}
          className="mr-3 p-2 hover:bg-[#00BFFF]/20 rounded-full transition-colors border border-[#00BFFF]/30 shadow-[0_0_10px_rgba(0,191,255,0.3)] hover:shadow-[0_0_15px_rgba(0,191,255,0.5)]"
          aria-label="Go back to home"
          style={{ pointerEvents: 'auto' }}
        >
          <ArrowLeft size={20} className="text-[#00BFFF]" />
        </button>
        
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00FFCC] to-[#00BFFF]">{title}</h1>
      </div>
    </header>
  )
}
