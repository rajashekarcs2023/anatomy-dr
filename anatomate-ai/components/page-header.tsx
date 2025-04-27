"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageHeaderProps {
  title: string
  backLink?: string
}

export function PageHeader({ title, backLink = "/" }: PageHeaderProps) {
  const handleBack = () => {
    // Use browser history to go back
    window.history.back();
  };
  
  return (
    <header className="bg-gradient-to-r from-teal-500 to-blue-500 py-4 px-4 text-white">
      <div className="flex items-center">
        <button 
          onClick={handleBack} 
          className="mr-3 p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        {/* Fallback link in case JavaScript is disabled */}
        <Link href={backLink} className="hidden">
          <span className="sr-only">Go back</span>
        </Link>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </header>
  )
}
