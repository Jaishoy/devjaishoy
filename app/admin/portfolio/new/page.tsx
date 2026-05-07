import { requireAdmin } from '@/lib/user'
import PortfolioForm from '@/app/admin/_components/PortfolioForm'

export default async function NewPortfolioPage() {
  await requireAdmin()
  return (
    <div className="min-h-screen bg-zinc-950">
      <PortfolioForm mode="new" />
    </div>
  )
}