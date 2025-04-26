import { VisualizationPanel } from "@/components/visualization-panel"
import { FloatingActionButtons } from "@/components/floating-action-buttons"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-[56px]">
      {/* Main Content - Centered 3D Model */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* 3D Visualization Panel */}
        <div className="h-[80vh] w-full max-w-md mx-auto">
          <VisualizationPanel />
        </div>

        {/* Floating Action Buttons */}
        <FloatingActionButtons />
      </div>
    </div>
  )
}
