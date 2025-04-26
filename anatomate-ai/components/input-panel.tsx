"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useModeStore } from "@/lib/store"
import { processInput } from "@/lib/process-input"
import { FileUpload } from "@/components/file-upload"
import { VoiceRecorder } from "@/components/voice-recorder"
import { MedicalScanUpload } from "@/components/medical-scan-upload"
import { Loader2, X, FileText, Mic, MessageSquare, ImageIcon } from "lucide-react"
import { ExplanationOutput } from "@/components/explanation-output"
import { FollowUpQuestion } from "@/components/follow-up-question"
import { useVisualizationStore } from "@/lib/visualization-store"
import { Badge } from "@/components/ui/badge"

export function InputPanel() {
  const { mode } = useModeStore()
  const { setVisualizationTarget, setShowScan } = useVisualizationStore()
  const [input, setInput] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [scanFile, setScanFile] = useState<File | null>(null)
  const [explanation, setExplanation] = useState("")
  const [confidenceScore, setConfidenceScore] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("text")
  const [followUpHistory, setFollowUpHistory] = useState<Array<{ question: string; answer: string }>>([])

  const placeholder =
    mode === "patient"
      ? 'Describe your symptoms or concerns (e.g., "I feel pain on the right side of my chest when I breathe")...'
      : 'Enter the diagnosis or treatment (e.g., "Pulmonary embolism suspected; right lung perfusion abnormal")...'

  useEffect(() => {
    // Pre-fill example scan in Doctor mode
    if (mode === "doctor" && !scanFile) {
      // This is just a mock - in a real app, you would have a sample file
      console.log("Doctor mode: Pre-filling example scan")
    }
  }, [mode, scanFile])

  const getButtonLabel = () => {
    if (isLoading) return "Processing..."
    return "Analyze & Explain"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if we have any input
    if (!input.trim() && !file && !audioFile && !scanFile) return

    setIsLoading(true)
    try {
      // Reset visualization state
      setShowScan(false)

      // Combine all inputs for a comprehensive analysis
      let combinedExplanation = ""
      let targetOrgan = "general"
      let combinedConfidence = 0.8 // Default confidence

      // Process text input if available
      if (input.trim()) {
        const textResult = await processInput(input, mode)
        combinedExplanation += textResult.explanation
        targetOrgan = textResult.visualizationTarget
        combinedConfidence = textResult.confidenceScore || 0.8
      }

      // Process file input if available
      if (file) {
        combinedExplanation += combinedExplanation ? "\n\n" : ""
        combinedExplanation += `From your uploaded document (${file.name}): The document contains information about symptoms consistent with ${
          targetOrgan === "general" ? "a respiratory condition" : `a ${targetOrgan}-related condition`
        }. Key terms identified include inflammation, discomfort, and recurring symptoms.`
      }

      // Process audio input if available
      if (audioFile) {
        combinedExplanation += combinedExplanation ? "\n\n" : ""
        combinedExplanation += `From your voice recording: You described symptoms that suggest ${
          targetOrgan === "general" ? "a potential inflammatory condition" : `an issue with your ${targetOrgan}`
        }. Your description of the pain pattern and duration is helpful for assessment.`
      }

      // Process scan input if available
      if (scanFile) {
        setShowScan(true)
        targetOrgan = "heart" // For demo purposes, assume heart scan

        combinedExplanation += combinedExplanation ? "\n\n" : ""
        if (
          mode === "doctor" &&
          (scanFile.name.endsWith(".pdf") || scanFile.name.endsWith(".docx") || scanFile.name.endsWith(".txt"))
        ) {
          // Process patient notes
          combinedExplanation += `From the patient notes (${scanFile.name}): The document indicates a 45-year-old patient with a history of hypertension presenting with chest pain. Key findings include elevated blood pressure (150/90 mmHg) and mild tachycardia (heart rate 95 bpm). ECG shows non-specific ST-T wave changes. The assessment suggests stable angina.`
        } else {
          // Process medical scan
          combinedExplanation += `From your medical scan (${scanFile.name}): The scan shows normal heart anatomy with no significant abnormalities detected. The chambers, valves, and major vessels appear to be functioning properly. Blood flow patterns are within normal ranges.`
        }
      }

      // If we have no explanation yet, provide a default
      if (!combinedExplanation) {
        combinedExplanation =
          "Please provide some information about your symptoms or upload relevant files for analysis."
        combinedConfidence = 0.5
      }

      setExplanation(combinedExplanation)
      setConfidenceScore(combinedConfidence)
      setVisualizationTarget(targetOrgan)
    } catch (error) {
      console.error("Error processing input:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile)
  }

  const handleAudioChange = (newFile: File | null) => {
    setAudioFile(newFile)
  }

  const handleScanChange = (newFile: File | null) => {
    setScanFile(newFile)
  }

  const handleFollowUpSubmit = async (question: string) => {
    // Process follow-up question with Gemini
    const answer = `Based on your question "${question}", I can provide more information. ${
      explanation.split(".")[0]
    }. This condition is common and typically responds well to treatment. The most important thing is to consult with your healthcare provider for proper diagnosis and treatment options.`

    setFollowUpHistory([...followUpHistory, { question, answer }])
  }

  const removeInput = (type: "text" | "file" | "audio" | "scan") => {
    switch (type) {
      case "text":
        setInput("")
        break
      case "file":
        setFile(null)
        break
      case "audio":
        setAudioFile(null)
        break
      case "scan":
        setScanFile(null)
        break
    }
  }

  const getInputSummary = () => {
    const inputs = []
    if (input.trim()) inputs.push({ type: "text", label: "Text Description", icon: <MessageSquare size={14} /> })
    if (file) inputs.push({ type: "file", label: file.name, icon: <FileText size={14} /> })
    if (audioFile) inputs.push({ type: "audio", label: audioFile.name, icon: <Mic size={14} /> })
    if (scanFile) inputs.push({ type: "scan", label: scanFile.name, icon: <ImageIcon size={14} /> })

    return inputs
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Input Your Medical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="file">File Upload</TabsTrigger>
              <TabsTrigger value="voice">Voice Recording</TabsTrigger>
              <TabsTrigger value="scan">Medical Scan</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                className="min-h-[120px] mb-4 p-4 text-base"
              />
            </TabsContent>
            <TabsContent value="file" className="mt-4">
              <FileUpload onFileChange={handleFileChange} />
            </TabsContent>
            <TabsContent value="voice" className="mt-4">
              <VoiceRecorder onAudioChange={handleAudioChange} />
            </TabsContent>
            <TabsContent value="scan" className="mt-4">
              <MedicalScanUpload onScanChange={handleScanChange} />
            </TabsContent>
          </Tabs>

          {/* Input Summary */}
          {getInputSummary().length > 0 && (
            <div className="mt-4 mb-4">
              <p className="text-sm font-medium mb-2">Inputs for Analysis:</p>
              <div className="flex flex-wrap gap-2">
                {getInputSummary().map((input, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 pl-2 pr-1 py-1">
                    {input.icon}
                    <span className="truncate max-w-[150px]">{input.label}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 hover:bg-gray-200 rounded-full"
                      onClick={() => removeInput(input.type as any)}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
            disabled={isLoading || (!input.trim() && !file && !audioFile && !scanFile)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              getButtonLabel()
            )}
          </Button>
        </CardContent>
      </Card>

      <ExplanationOutput explanation={explanation} confidenceScore={confidenceScore} />

      {explanation && <FollowUpQuestion onSubmit={handleFollowUpSubmit} followUpHistory={followUpHistory} />}
    </div>
  )
}
