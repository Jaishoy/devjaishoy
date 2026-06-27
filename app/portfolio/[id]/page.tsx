import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PortfolioGallery from '../_components/PortfolioGallery'

export default async function PortfolioDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: item } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .single()

    return (
        <div className="min-h-screen bg-zinc-950">
            <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">

                {/* Back */}
                <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition mb-8"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    กลับไปหน้า Portfolio
                </Link>

                {/* Cover */}
                {item.cover_url ? (
                    <img
                        src={item.cover_url}
                        alt={item.title}
                        className="w-full h-64 sm:h-80 object-cover rounded-2xl border border-zinc-800 mb-8"
                    />
                ) : (
                    <div className="w-full h-64 sm:h-80 bg-zinc-900 border border-zinc-800 rounded-2xl mb-8 flex items-center justify-center">
                        <span className="text-zinc-600 text-sm">No image</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100">{item.title}</h1>
                    {item.url && (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex items-center gap-1.5 text-sm text-zinc-900 bg-zinc-100 hover:bg-white rounded-lg px-4 py-2 font-medium transition"
                        >
                            เปิดดูโปรเจกต์
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 17L17 7M17 7H7M17 7V17" />
                            </svg>
                        </a>
                    )}
                </div>

                {/* Tags */}
                {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {item.tags.map((tag: string) => (
                            <span key={tag} className="text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Description */}
                <p className="text-zinc-400 text-[15px] leading-relaxed mb-12 whitespace-pre-line">
                    {item.description}
                </p>

                {/* Gallery */}
                {item.images?.length > 0 && (
                    <div>
                        <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">Gallery</p>
                        <PortfolioGallery images={item.images} title={item.title} />
                    </div>
                )}

            </div>
        </div >
    )
}