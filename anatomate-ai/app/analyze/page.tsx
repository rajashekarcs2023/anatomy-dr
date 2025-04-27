import { PageHeader } from "@/components/page-header"
import { InputPanel } from "@/components/input-panel"
import { ModeToggle } from "@/components/mode-toggle"

export default function AnalyzePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Analyze & Explain" />

      <div className="p-4">
        {/* Mode Toggle */}
        <div className="mb-6 flex justify-center">
          <ModeToggle />
        </div>

        {/* Input Panel */}
        <InputPanel />
      </div>
    </div>
  )
}
