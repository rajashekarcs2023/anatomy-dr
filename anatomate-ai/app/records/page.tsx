import { PageHeader } from "@/components/page-header"
import { RecordsList } from "@/components/records-list"

export default function RecordsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Health Records" />
      <div className="p-4">
        <RecordsList />
      </div>
    </div>
  )
}
