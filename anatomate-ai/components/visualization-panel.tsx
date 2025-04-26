"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useModeStore } from "@/lib/store"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import { HumanModel } from "@/components/human-model"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useVisualizationStore } from "@/lib/visualization-store"
import { MedicalScanViewer } from "@/components/medical-scan-viewer"

export function VisualizationPanel() {
  const { mode } = useModeStore()
  const { visualizationTarget, showScan } = useVisualizationStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState("normal")
  const [compareMode, setCompareMode] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 p-4 bg-white" : ""}`}>
      <Card className={`h-full ${isFullscreen ? "h-full" : "min-h-[500px]"}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>3D Anatomical Visualization</CardTitle>
          <div className="flex items-center gap-4">
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Toggle View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal Anatomy</SelectItem>
                <SelectItem value="affected">Affected Area</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Switch id="compare-mode" checked={compareMode} onCheckedChange={setCompareMode} />
              <Label htmlFor="compare-mode" className="text-sm">
                Compare
              </Label>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className={`relative ${isFullscreen ? "h-[calc(100vh-150px)]" : "h-[400px]"}`}>
          {compareMode ? (
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="relative h-full border rounded-md overflow-hidden">
                <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-xs font-medium z-10">
                  Normal
                </div>
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                  <OrbitControls enableZoom={true} enablePan={true} />
                  <Environment preset="studio" />
                  <HumanModel target={visualizationTarget} affected={false} />
                </Canvas>
              </div>
              <div className="relative h-full border rounded-md overflow-hidden">
                <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-xs font-medium z-10">
                  Affected
                </div>
                {showScan ? (
                  <MedicalScanViewer />
                ) : (
                  <Canvas>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                    <OrbitControls enableZoom={true} enablePan={true} />
                    <Environment preset="studio" />
                    <HumanModel target={visualizationTarget} affected={true} />
                  </Canvas>
                )}
              </div>
            </div>
          ) : (
            <>
              {showScan ? (
                <MedicalScanViewer />
              ) : (
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                  <OrbitControls enableZoom={true} enablePan={true} />
                  <Environment preset="studio" />
                  <HumanModel target={visualizationTarget} affected={viewMode === "affected"} />
                </Canvas>
              )}
            </>
          )}
          <div className="absolute bottom-4 left-4 right-4 bg-white/80 p-2 rounded text-sm text-center">
            Tip: Click and drag to rotate the model. Scroll to zoom in/out.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
