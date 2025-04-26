import { ModeToggle } from "@/components/mode-toggle"
import { InputPanel } from "@/components/input-panel"
import { VisualizationPanel } from "@/components/visualization-panel"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-500 to-blue-500 py-6 px-4 text-white relative">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">AnatoMate.ai</h1>
              <p className="text-lg mt-2 opacity-90">Medical knowledge, simplified and visualized</p>
            </div>
            <div className="flex items-center">
              <div className="mr-2 text-sm">AI Status:</div>
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" title="AI is active and ready"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Mode Toggle */}
        <div className="mb-8 flex justify-center">
          <ModeToggle />
        </div>

        {/* Two Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Input and Explanation */}
          <InputPanel />

          {/* Right Panel - 3D Visualization */}
          <VisualizationPanel />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 px-4 mt-12">
        <div className="container mx-auto text-center text-gray-600">
          <p>© {new Date().getFullYear()} AnatoMate.ai - Helping patients understand medical conditions</p>
          <p className="text-xs mt-2">
            This tool is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </footer>
    </div>
  )
}
