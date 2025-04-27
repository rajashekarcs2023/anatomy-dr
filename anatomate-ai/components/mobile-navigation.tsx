"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ClipboardList, LineChart, Brain, User } from "lucide-react"

const navItems = [
  {
    path: "/",
    name: "Home",
    icon: Home,
  },
  {
    path: "/records",
    name: "Records",
    icon: ClipboardList,
  },
  {
    path: "/timeline",
    name: "Timeline",
    icon: LineChart,
  },
  {
    path: "/risk-scan",
    name: "Risk Scan",
    icon: Brain,
  },
  {
    path: "/profile",
    name: "Profile",
    icon: User,
  },
]

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 ${
                isActive
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
