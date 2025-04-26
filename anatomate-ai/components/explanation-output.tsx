"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, Download, ThumbsUp, ThumbsDown, FileText, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useModeStore } from "@/lib/store"
import { useState } from "react"
import { SeverityEstimate } from "@/components/severity-estimate"
import { SimilarCases } from "@/components/similar-cases"
import { useVisualizationStore } from "@/lib/visualization-store"

interface ExplanationOutputProps {
  explanation: string
  confidenceScore: number
}

export function ExplanationOutput({ explanation, confidenceScore }: ExplanationOutputProps) {
  const { mode } = useModeStore()
  const { visualizationTarget } = useVisualizationStore()
  const [approved, setApproved] = useState<boolean | null>(null)

  const handleTextToSpeech = () => {
    // Text-to-speech functionality
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(explanation || defaultExplanation)
      window.speechSynthesis.speak(utterance)
    } else {
      alert("Text-to-speech is not supported in your browser.")
    }
  }

  const handleDownload = () => {
    // Create a blob with the explanation text
    const blob = new Blob([explanation || defaultExplanation], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = "anatomate-explanation.txt"
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleGenerateDischarge = () => {
    // Generate a discharge summary PDF
    alert(
      "Generating discharge summary... This would create a PDF with the explanation, severity, and recommendations.",
    )
  }

  const handleGeneratePDF = () => {
    // In a real implementation, this would use a library like jsPDF to generate a PDF
    // For now, we'll just show an alert
    alert(
      "Generating PDF... In a real implementation, this would create a nicely formatted PDF with the explanation, severity assessment, and visualization.",
    )
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return "bg-green-500"
    if (score >= 0.7) return "bg-yellow-500"
    return "bg-red-500"
  }

  const defaultExplanation =
    "Your plain English medical explanation will appear here after you submit your input. We'll translate complex medical terminology into simple, understandable language."

  return (
    <Card className="flex-grow mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Plain English Explanation</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleTextToSpeech}
            title="Listen to explanation"
            aria-label="Listen to explanation"
          >
            <Volume2 size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownload}
            title="Download explanation as text"
            aria-label="Download explanation as text"
          >
            <Download size={18} />
          </Button>
          {explanation && (
            <Button
              variant="outline"
              onClick={handleGeneratePDF}
              className="flex items-center gap-1"
              title="Download as PDF"
              aria-label="Download as PDF"
            >
              <FileDown size={16} />
              <span>PDF</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-lg leading-relaxed mb-6 whitespace-pre-line">{explanation || defaultExplanation}</div>

        {explanation && (
          <>
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">AI Confidence Score</span>
                <span className="text-sm font-medium">{Math.round(confidenceScore * 100)}%</span>
              </div>
              <Progress value={confidenceScore * 100} className={getConfidenceColor(confidenceScore)} />
            </div>

            {/* Severity Estimate */}
            <SeverityEstimate />

            {/* Similar Cases */}
            <SimilarCases />

            {mode === "doctor" && (
              <>
                <div className="mt-6 flex flex-col space-y-4">
                  <div className="text-sm font-medium">Was this explanation helpful to the patient?</div>
                  <div className="flex gap-3">
                    <Button
                      variant={approved === true ? "default" : "outline"}
                      className={approved === true ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => setApproved(true)}
                      size="sm"
                    >
                      <ThumbsUp size={16} className="mr-2" />
                      Yes, it's accurate
                    </Button>
                    <Button
                      variant={approved === false ? "default" : "outline"}
                      className={approved === false ? "bg-red-600 hover:bg-red-700" : ""}
                      onClick={() => setApproved(false)}
                      size="sm"
                    >
                      <ThumbsDown size={16} className="mr-2" />
                      No, too complex
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={handleGenerateDischarge} className="bg-blue-600 hover:bg-blue-700">
                    <FileText size={16} className="mr-2" />
                    Generate Discharge Summary
                  </Button>
                </div>
              </>
            )}

            <div className="mt-6 p-3 bg-gray-50 rounded-md border text-xs text-gray-600">
              <p className="font-medium mb-1">AI-Generated Disclaimer:</p>
              <p>
                This is an AI-generated aid and not a substitute for professional medical advice, diagnosis, or
                treatment. Always seek the advice of your physician or other qualified health provider with any
                questions you may have regarding a medical condition.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
