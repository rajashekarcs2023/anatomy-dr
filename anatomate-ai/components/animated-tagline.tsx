"use client"

import { useState, useEffect } from "react"

const taglines = [
  "Secure Healthcare Data. On the Blockchain.",
  "Your Health, Your Data, Your Control.",
  "Protect Your Body's Blueprint.",
  "Visualize Your Body. Protect Your Identity.",
  "Data You Can Trust. Anatomy You Can See.",
  "Transparency, Security, and Trust — Built for Healthcare.",
  "From Heartbeats to Hard Drives: We've Got You Covered.",
  "When Every Byte Matters, So Does Security."
]

export function AnimatedTagline() {
  const [currentTagline, setCurrentTagline] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    const currentText = taglines[currentIndex]
    const typingSpeed = 100 // Speed for typing
    const deletingSpeed = 50 // Speed for deleting
    const waitTime = 2000 // Time to wait before deleting

    if (isWaiting) {
      const timer = setTimeout(() => {
        setIsWaiting(false)
        setIsDeleting(true)
      }, waitTime)
      return () => clearTimeout(timer)
    }

    if (isDeleting) {
      if (currentTagline === "") {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % taglines.length)
      } else {
        const timer = setTimeout(() => {
          setCurrentTagline(currentText.slice(0, currentTagline.length - 1))
        }, deletingSpeed)
        return () => clearTimeout(timer)
      }
    } else {
      if (currentTagline === currentText) {
        setIsWaiting(true)
      } else {
        const timer = setTimeout(() => {
          setCurrentTagline(currentText.slice(0, currentTagline.length + 1))
        }, typingSpeed)
        return () => clearTimeout(timer)
      }
    }
  }, [currentTagline, currentIndex, isDeleting, isWaiting])

  return (
    <div className="mt-4 relative">
      <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-100">
        <p className="text-lg sm:text-xl text-[#34495E] min-h-[1.5em]">
          {currentTagline}
          <span className="animate-pulse">|</span>
        </p>
      </div>
    </div>
  )
} 