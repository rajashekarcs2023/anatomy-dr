import { PageHeader } from "@/components/page-header"
import UserSurvey from "@/components/user_survery"

export default function AnalyzePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Analyze & Explain" />

      <div className="p-4">
        {/* User Survey */}
        <UserSurvey />
      </div>
    </div>
  )
}
