import { PageHeader } from "@/components/page-header"
import { HealthTimeline } from "@/components/health-timeline"

export default function TimelinePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Health Timeline" />
      <div className="p-4">
        <HealthTimeline />
      </div>
    </div>
  )
}
