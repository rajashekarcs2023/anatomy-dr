"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X } from "lucide-react"

interface FileUploadProps {
  onFileChange: (file: File | null) => void
}

export function FileUpload({ onFileChange }: FileUploadProps) {
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
        onFileChange(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (isValidFileType(file)) {
        setSelectedFile(file)
        onFileChange(file)
      }
    }
  }

  const isValidFileType = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    return validTypes.includes(file.type)
  }

  const removeFile = () => {
    setSelectedFile(null)
    onFileChange(null)
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
                <Upload size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button onClick={removeFile} className="p-1 rounded-full hover:bg-gray-200" aria-label="Remove file">
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={32} className="text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">Upload Doctor's Notes</p>
            <p className="text-xs text-gray-500 mt-1">Drag & drop or click to upload (.pdf, .docx, or .txt)</p>
            <input type="file" className="hidden" onChange={handleChange} accept=".pdf,.docx,.txt" id="file-upload" />
            <label
              htmlFor="file-upload"
              className="mt-3 px-4 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 cursor-pointer"
            >
              Select File
            </label>
          </>
        )}
      </div>
      {selectedFile && (
        <p className="text-sm text-gray-600 mt-2">
          File ready for processing. Click "Explain & Visualize" to continue.
        </p>
      )}
    </div>
  )
}
