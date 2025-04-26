import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageHeaderProps {
  title: string
  backLink?: string
}

export function PageHeader({ title, backLink = "/" }: PageHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-teal-500 to-blue-500 py-4 px-4 text-white">
      <div className="flex items-center">
        <Link href={backLink} className="mr-3">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </header>
  )
}
