"use client"

import { useState, useEffect } from "react"

export function UserGreeting() {
  const [name, setName] = useState("User")

  useEffect(() => {
    // In a real app, this would fetch the user's name from an API or local storage
    const storedName = localStorage.getItem("userName")
    if (storedName) {
      setName(storedName)
    }
  }, [])

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">Welcome back, {name}!</h1>
        <p className="text-sm opacity-90">Your health, your control</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        {name.charAt(0).toUpperCase()}
      </div>
    </div>
  )
}
