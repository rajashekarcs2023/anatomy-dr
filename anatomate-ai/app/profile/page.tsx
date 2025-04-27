import { PageHeader } from "@/components/page-header"
import { ProfileContent } from "@/components/profile-content"

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Your Profile" />
      <div className="p-4">
        <ProfileContent />
      </div>
    </div>
  )
}
