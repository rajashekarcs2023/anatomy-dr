import { VisualizationPanel } from "@/components/visualization-panel"
import { FloatingActionButtons } from "@/components/floating-action-buttons"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Main Content - Centered 3D Model */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* App Title - Stunning cosmic overlay */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-center">
          <div className="relative animate-float animation-delay-1000">
            {/* Subtle glow border with animation */}
            <div className="absolute -inset-1 border border-[#00FFCC]/50 rounded-lg opacity-70 shadow-[0_0_15px_rgba(0,255,204,0.5)] animate-pulse-slow"></div>
            
            {/* Clean, high-contrast title with solid colors */}
            <h1 className="relative py-2 px-4 text-4xl sm:text-5xl md:text-6xl font-black tracking-wider">
              <span className="text-[#00FFCC] animate-pulse-slow">Anato</span><span className="text-[#00BFFF] animate-pulse-slow animation-delay-1000">Mate</span><span className="text-[#A78BFA] animate-pulse-slow animation-delay-2000">.ai</span>
            </h1>
            
            {/* Animated sparkle effects */}
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-[#00FFCC] rounded-full shadow-[0_0_8px_rgba(0,255,204,0.8)] animate-float"></div>
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#00BFFF] rounded-full shadow-[0_0_8px_rgba(0,191,255,0.8)] animate-float animation-delay-1000"></div>
            <div className="absolute bottom-1 -right-3 w-1.5 h-1.5 bg-[#A78BFA] rounded-full shadow-[0_0_8px_rgba(167,139,250,0.8)] animate-float animation-delay-2000"></div>
            <div className="absolute -bottom-2 left-2 w-2 h-2 bg-[#00FFCC] rounded-full shadow-[0_0_8px_rgba(0,255,204,0.8)] animate-float animation-delay-3000"></div>
            <div className="absolute -top-1 left-1/2 w-1.5 h-1.5 bg-[#00BFFF] rounded-full shadow-[0_0_8px_rgba(0,191,255,0.8)] animate-float animation-delay-4000"></div>
          </div>
          
          {/* Enhanced tagline with cosmic styling */}
          <div className="mt-4 relative">
            {/* Subtle glow behind tagline */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#21D4FD] to-[#2AF598] opacity-50 blur-md rounded-full"></div>
            
            <p className="relative text-base sm:text-lg md:text-xl font-medium tracking-wide text-white px-6 py-2 rounded-full bg-[#0B132B]/40 backdrop-blur-md border border-[#21D4FD]/30 shadow-[0_0_15px_rgba(33,212,253,0.3)]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#21D4FD] to-[#2AF598] font-bold">Visualize</span> • <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2AF598] to-[#FEE140] font-bold">Understand</span> • <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FEE140] to-[#FA709A] font-bold">Heal</span>
            </p>
          </div>
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
