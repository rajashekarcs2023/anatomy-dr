"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, FileText } from "lucide-react"
import { useModeStore } from "@/lib/store"

interface MedicalScanUploadProps {
  onScanChange: (file: File | null) => void
}

export function MedicalScanUpload({ onScanChange }: MedicalScanUploadProps) {
  const { mode } = useModeStore()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (isValidFileType(file)) {
        setSelectedFile(file)
        onScanChange(file)
      } else {
        alert(`Please upload a valid ${mode === "doctor" ? "medical scan or patient notes" : "medical scan"} file`)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (isValidFileType(file)) {
        setSelectedFile(file)
        onScanChange(file)
      } else {
        alert(`Please upload a valid ${mode === "doctor" ? "medical scan or patient notes" : "medical scan"} file`)
      }
    }
  }

  const isValidFileType = (file: File) => {
    // For patient mode, only accept medical scans
    if (mode === "patient") {
      return file.name.endsWith(".nii") || file.name.endsWith(".nii.gz")
    }

    // For doctor mode, accept medical scans and patient notes
    return (
      file.name.endsWith(".nii") ||
      file.name.endsWith(".nii.gz") ||
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".docx") ||
      file.name.endsWith(".txt")
    )
  }

  const removeFile = () => {
    setSelectedFile(null)
    onScanChange(null)
  }

  const getUploadTitle = () => {
    if (mode === "doctor") {
      return "Upload Medical Scan or Patient Notes"
    }
    return "Upload Medical Scan"
  }

  const getAcceptedFileTypes = () => {
    if (mode === "doctor") {
      return ".nii,.nii.gz,.pdf,.docx,.txt"
    }
    return ".nii,.nii.gz"
  }

  const getFileTypeDescription = () => {
    if (mode === "doctor") {
      return "(.nii, .nii.gz, .pdf, .docx, or .txt)"
    }
    return "(.nii or .nii.gz)"
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-full p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragActive ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-teal-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="bg-teal-100 p-2 rounded-full mr-3">
                <FileText size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={removeFile} className="p-1 rounded-full hover:bg-gray-200" aria-label="Remove file">
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={32} className="text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">{getUploadTitle()}</p>
            <p className="text-xs text-gray-500 mt-1">Drag & drop or click to upload {getFileTypeDescription()}</p>
            <input
              type="file"
              className="hidden"
              onChange={handleChange}
              accept={getAcceptedFileTypes()}
              id="scan-upload"
            />
            <label
              htmlFor="scan-upload"
              className="mt-3 px-4 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 cursor-pointer"
            >
              Select File
            </label>
          </>
        )}
      </div>
      {selectedFile && (
        <p className="text-sm text-gray-600 mt-2">
          File ready for processing. Click "Analyze {mode === "doctor" ? "File" : "Scan"}" to continue.
        </p>
      )}
    </div>
  )
}
