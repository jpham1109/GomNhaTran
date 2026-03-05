'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { SanityNavItem } from '@/lib/sanity/types'
import SmartLink from '@/components/SmartLink'

type FallbackItem = { readonly label: string; readonly href: string }

type MobileMenuProps = {
  items: SanityNavItem[]
  fallback: readonly FallbackItem[]
}

export default function MobileMenu({ items, fallback }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const hasCmsNav = items.length > 0

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const isFirstRender = useRef(true)

  // Close on outside click (pointerdown covers touch) and Escape key.
  // Listeners are only attached while the menu is open.
  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [open])

  // Focus management: open → first link; close → toggle button.
  // Guarded on first render so the button doesn't steal focus on mount.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (open) {
      const firstLink = navRef.current?.querySelector<HTMLElement>('a[href]')
      firstLink?.focus()
    } else {
      buttonRef.current?.focus()
    }
  }, [open])

  return (
    <div ref={containerRef} className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="p-2"
      >
        <span aria-hidden="true">{open ? '✕' : '☰'}</span>
      </button>

      {open && (
        <nav
          ref={navRef}
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full border-b border-stone-200 bg-white"
        >
          <ul className="flex flex-col gap-4 list-none m-0 px-4 py-4">
            {hasCmsNav
              ? items.map((item) => (
                  <li key={item._key}>
                    <SmartLink
                      link={item.link}
                      className="block"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </SmartLink>
                  </li>
                ))
              : fallback.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block" onClick={() => setOpen(false)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
