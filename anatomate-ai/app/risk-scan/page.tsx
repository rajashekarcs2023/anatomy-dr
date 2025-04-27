import { PageHeader } from "@/components/page-header"
import { RiskScanContent } from "@/components/risk-scan-content"

export default function RiskScanPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Risk Detection" />
      <div className="p-4">
        <RiskScanContent />
      </div>
    </div>
  )
}
