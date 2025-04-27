import { VisualizationPanel } from "@/components/visualization-panel"
import { FloatingActionButtons } from "@/components/floating-action-buttons"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Main Content - Centered 3D Model */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* App Title - Centered elegant overlay */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 animate-fade-in-slide-down text-center">
          <h1 className="text-2xl sm:text-3xl font-light tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#34D399] to-[#60A5FA] drop-shadow-sm">
            AnatoMate.ai
          </h1>
          <p className="text-xs sm:text-sm text-[#6D758F] mt-1 font-light tracking-wide">
            Your Personal Health Companion
          </p>
        </div>
        
        {/* 3D Visualization Panel */}
        <div className="h-[90vh] w-full max-w-5xl mx-auto animate-fade-in">
          <VisualizationPanel />
        </div>

        {/* Floating Action Buttons */}
        <FloatingActionButtons />
      </div>
    </div>
  )
}
