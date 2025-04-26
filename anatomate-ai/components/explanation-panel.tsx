"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useModeStore } from "@/lib/store"
import { processInput } from "@/lib/process-input"

export function ExplanationPanel() {
  const { mode } = useModeStore()
  const [input, setInput] = useState("")
  const [explanation, setExplanation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const placeholder =
    mode === "patient"
      ? 'Describe your symptoms or concerns (e.g., "I have chest pain and shortness of breath")...'
      : 'Enter the diagnosis or treatment (e.g., "Lumbar Disc Herniation")...'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    try {
      // TODO: Replace with actual Gemini API integration
      const result = await processInput(input, mode)
      setExplanation(result.explanation)
      // TODO: Update 3D model based on result.visualizationTarget
    } catch (error) {
      console.error("Error processing input:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="mb-6">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] mb-4 p-4 text-base"
        />
        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
          {isLoading ? "Processing..." : "Explain & Visualize"}
        </Button>
      </form>

      {explanation ? (
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Plain English Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">{explanation}</div>
          </CardContent>
        </Card>
      ) : (
        <Card className="flex-grow bg-gray-50">
          <CardHeader>
            <CardTitle>Plain English Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">
              Your explanation will appear here after you submit your input.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
