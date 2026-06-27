'use client'

type Props = {
    href: string
}

export default function ExternalLinkButton({ href }: Props) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-zinc-500 hover:text-zinc-300 transition text-xs border border-zinc-700 rounded-lg px-2.5 py-1 hover:border-zinc-500"
        >
            ดูโปรเจกต์ ↗
        </a>
    )
}