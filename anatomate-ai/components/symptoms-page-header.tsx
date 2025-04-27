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
    <header className="bg-gradient-to-r from-teal-500 to-blue-500 py-4 px-4 text-white shadow-md fixed top-0 left-0 right-0 z-[100]">
      <div className="flex items-center">
        <button 
          onClick={handleBackClick}
          className="mr-3 p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Go back to home"
          style={{ pointerEvents: 'auto' }}
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>
    </header>
  )
}
