"use client"

import type React from "react"

import { useState } from "react"
import { Mic, Square, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceRecorderProps {
  onAudioChange: (file: File | null) => void
}

export function VoiceRecorder({ onAudioChange }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null)

  // Mock recording functionality
  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)

    // Start timer to track recording duration
    const id = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)

    setTimerId(id)

    // In a real implementation, we would use the MediaRecorder API here
    console.log("Recording started...")
  }

  const stopRecording = () => {
    setIsRecording(false)

    // Clear timer
    if (timerId) {
      clearInterval(timerId)
      setTimerId(null)
    }

    // Mock creating a file
    // In a real implementation, we would get the actual recording blob
    const mockBlob = new Blob(["audio data would go here"], { type: "audio/wav" })
    const mockFile = new File([mockBlob], "voice-recording.wav", { type: "audio/wav" })

    setAudioFile(mockFile)
    onAudioChange(mockFile)

    console.log("Recording stopped...")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.includes("audio")) {
        setAudioFile(file)
        onAudioChange(file)
      }
    }
  }

  const removeAudio = () => {
    setAudioFile(null)
    onAudioChange(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center">
      {audioFile ? (
        <div className="w-full p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-teal-100 p-2 rounded-full mr-3">
                <Upload size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{audioFile.name}</p>
                <p className="text-xs text-gray-500">{(audioFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button onClick={removeAudio} className="p-1 rounded-full hover:bg-gray-200" aria-label="Remove audio">
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Audio ready for processing. Click "Explain & Visualize" to continue.
          </p>
        </div>
      ) : isRecording ? (
        <div className="w-full p-6 border rounded-lg flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-3 animate-pulse">
            <Mic size={32} className="text-red-600" />
          </div>
          <p className="text-lg font-medium">Recording...</p>
          <p className="text-2xl font-bold my-2">{formatTime(recordingTime)}</p>
          <Button variant="destructive" onClick={stopRecording} className="mt-2 flex items-center">
            <Square size={16} className="mr-2" />
            Stop Recording
          </Button>
        </div>
      ) : (
        <div className="w-full p-6 border-2 border-dashed rounded-lg flex flex-col items-center">
          <p className="text-sm font-medium text-gray-700 mb-4">Record or Upload Voice Note</p>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Button onClick={startRecording} className="flex items-center bg-teal-600 hover:bg-teal-700">
              <Mic size={16} className="mr-2" />
              Start Recording
            </Button>

            <div className="relative">
              <Button variant="outline" className="flex items-center">
                <Upload size={16} className="mr-2" />
                Upload Audio
              </Button>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                accept="audio/*"
              />
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">Supported formats: .mp3, .wav (max 5 minutes)</p>
        </div>
      )}
    </div>
  )
}
