'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/',          label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services',  label: 'Services' },
  { href: '/about',     label: 'About' },
]

export default function Navbar() {
  const pathname = usePathname()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setLoggedIn(true)

      // ดึง role จาก users table
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('uid', user.id)
        .single()

      setIsAdmin(profile?.role === 'admin')
    }

    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setLoggedIn(false)
        setIsAdmin(false)
      } else {
        loadUser()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60">
      <nav className="max-w-5xl mx-auto px-6 h-15 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-zinc-100 font-medium text-[15px] tracking-tight hover:text-white transition"
        >
          devjaishoy
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition ${
                pathname === href
                  ? 'text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Admin badge — แสดงเฉพาะ admin */}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm text-amber-400 hover:text-amber-300 border border-amber-900/60 hover:border-amber-700 rounded-lg px-3.5 py-1.5 transition"
            >
              Admin
            </Link>
          )}

          {loggedIn ? (
            <Link
              href="/dashboard"
              className="text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg px-3.5 py-1.5 transition hover:border-zinc-500"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg px-3.5 py-1.5 transition hover:border-zinc-500"
            >
              Login
            </Link>
          )}

          <Link
            href="/chat"
            className="text-sm text-zinc-900 bg-zinc-100 hover:bg-white font-medium rounded-lg px-4 py-1.5 transition"
          >
            Contact me
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(prev => !prev)}
          className="md:hidden text-zinc-400 hover:text-zinc-200 transition p-1"
          aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950">
          <div className="flex flex-col py-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-6 py-3 text-sm transition ${
                  pathname === href
                    ? 'text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Admin link mobile — แสดงเฉพาะ admin */}
            {isAdmin && (
              <Link
                href="/admin"
                className="px-6 py-3 text-sm text-amber-400 hover:text-amber-300 transition"
              >
                Admin
              </Link>
            )}

            <div className="flex gap-2 px-6 pt-3 pb-2">
              {loggedIn ? (
                <Link
                  href="/dashboard"
                  className="flex-1 text-center text-sm text-zinc-400 border border-zinc-700 rounded-lg py-2.5 hover:border-zinc-500 transition"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex-1 text-center text-sm text-zinc-400 border border-zinc-700 rounded-lg py-2.5 hover:border-zinc-500 transition"
                >
                  Login
                </Link>
              )}
              <Link
                href="/chat"
                className="flex-1 text-center text-sm text-zinc-900 bg-zinc-100 hover:bg-white font-medium rounded-lg py-2.5 transition"
              >
                Contact me
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}