import { requireAdmin } from '@/lib/user'
import { createAdminClient } from '@/lib/supabase/admin'
import PortfolioForm from '@/app/admin/_components/PortfolioForm'
import { notFound } from 'next/navigation'

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAdmin()
  const adminClient = createAdminClient()

  const { data } = await adminClient
    .from('portfolios')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) notFound()

  return (
    <div className="min-h-screen bg-zinc-950">
      <PortfolioForm mode="edit" initial={data} />
    </div>
  )
}