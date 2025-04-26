"use client"

import { useState } from "react"
import { Menu, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TopBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 py-2 px-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-700">
              <Menu size={20} />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px]">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/"
                className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center"
                onClick={() => setSidebarOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/records"
                className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center"
                onClick={() => setSidebarOpen(false)}
              >
                Health Records
              </Link>
              <Link
                href="/timeline"
                className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center"
                onClick={() => setSidebarOpen(false)}
              >
                Health Timeline
              </Link>
              <Link
                href="/risk-scan"
                className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center"
                onClick={() => setSidebarOpen(false)}
              >
                Risk Scan
              </Link>
              <Link
                href="/analyze"
                className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center"
                onClick={() => setSidebarOpen(false)}
              >
                Analyze & Explain
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center"
                onClick={() => setSidebarOpen(false)}
              >
                Profile
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="text-center">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
            AnatoMate.ai
          </h1>
        </div>

        <Link href="/profile">
          <Button variant="ghost" size="icon" className="text-gray-700">
            <User size={20} />
            <span className="sr-only">Profile</span>
          </Button>
        </Link>
      </div>
    </header>
  )
}
