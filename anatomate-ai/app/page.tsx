import { VisualizationPanel } from "@/components/visualization-panel"
import { FloatingActionButtons } from "@/components/floating-action-buttons"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Main Content - Centered 3D Model */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* App Title - Centered elegant overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#34D399] via-[#60A5FA] to-[#A78BFA] drop-shadow-md animate-pulse-slow">
            AnatoMate.ai
          </h1>
          <p className="text-sm sm:text-base text-[#6D758F] mt-2 font-light tracking-wide opacity-80 backdrop-blur-sm px-4 py-1 rounded-full bg-white/10 border border-white/20 shadow-sm">
            Your Personal Health Companion
          </p>
        </div>
        
        {/* 3D Visualization Panel */}
        <div className="h-screen w-full max-w-5xl mx-auto">
          <VisualizationPanel />
        </div>

        {/* Floating Action Buttons */}
        <FloatingActionButtons />
      </div>
    </div>
  )
}
