import { VisualizationPanel } from "@/components/visualization-panel"
import { FloatingActionButtons } from "@/components/floating-action-buttons"
import { AnimatedTagline } from "@/components/animated-tagline"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Main Content - Centered 3D Model */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Professional healthcare heading */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
            <span className="text-[#3498DB]">
              Anato
            </span>
            <span className="text-[#2E86C1]">
              Mate
            </span>
            <span className="text-[#1ABC9C]">
              .ai
            </span>
          </h1>
          
          {/* Professional tagline */}
          <AnimatedTagline />
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
