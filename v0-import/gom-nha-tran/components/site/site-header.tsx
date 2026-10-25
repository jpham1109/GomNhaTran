'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Logo } from '@/components/brand/logo'
import { Container, SkipLink } from '@/components/brand/primitives'
import { routes } from '@/lib/routes'
import type { NavItem, SiteSettings } from '@/lib/types'
import { cn } from '@/lib/utils'

const SCROLL_THRESHOLD = 24
const FOCUSABLE = 'a[href], button:not([disabled])'

export function SiteHeader({
  navigation,
  settings,
}: {
  navigation: NavItem[]
  settings: SiteSettings
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!open) return
    const trigger = menuButtonRef.current
    closeButtonRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      trigger?.focus()
    }
  }, [open])

  const homeLabel = `${settings.name}, home`
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
    <SkipLink>Skip to content</SkipLink>
    <header className="fixed inset-x-0 top-0 z-30">
      {/* Backdrop lives on its own layer so the fixed mobile menu below isn't trapped by backdrop-filter. */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 border-b backdrop-blur-md transition-[background-color,border-color] duration-500 ease-calm',
          scrolled ? 'border-border bg-background/95' : 'border-transparent bg-background/80',
        )}
      />
      <Container
        className={cn(
          'relative flex items-center justify-between transition-[padding] duration-500 ease-calm',
          scrolled ? 'py-3 lg:py-4' : 'py-4 lg:py-6',
        )}
      >
        <Link href={routes.home} aria-label={homeLabel} className="text-foreground">
          <Logo
            name={settings.name}
            descriptor={settings.descriptor}
            size="lg"
            compact={scrolled}
          />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8 lg:gap-10">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className="relative py-2 text-nav font-medium text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-calm hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="-mr-2 flex h-12 items-center gap-3 px-2 text-nav font-medium text-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(true)}
        >
          Menu
          <span aria-hidden="true" className="flex w-6 flex-col gap-1.5">
            <span className="h-px w-full bg-current" />
            <span className="h-px w-4 self-end bg-current" />
          </span>
        </button>
      </Container>

      <div
        ref={dialogRef}
        id="mobile-nav"
        inert={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={cn(
          'fixed inset-0 z-40 flex flex-col bg-background transition-opacity duration-500 ease-calm md:hidden',
          open ? 'opacity-100' : 'pointer-events-none invisible opacity-0',
        )}
      >
        <Container className="flex items-center justify-between border-b border-transparent py-4">
          <Link href={routes.home} onClick={() => setOpen(false)} aria-label={homeLabel}>
            <Logo name={settings.name} descriptor={settings.descriptor} size="lg" />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            className="-mr-2 flex h-12 items-center px-2 text-nav font-medium"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </Container>

        <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-gutter">
          <ul className="flex flex-col">
            {navigation.map((item, index) => (
              <li key={item.href} className="border-b border-border first:border-t">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-baseline justify-between py-5 font-serif text-h2 transition-all duration-700 ease-calm',
                    open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                  )}
                  style={{ transitionDelay: open ? `${120 + index * 70}ms` : '0ms' }}
                >
                  {item.label}
                  <span aria-hidden="true" className="font-sans text-body text-muted-foreground">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-1 px-gutter pb-10 text-small text-muted-foreground">
          {settings.locationLine ? <span lang="vi">{settings.locationLine}</span> : null}
          <a href={`mailto:${settings.email}`} className="text-foreground underline-offset-4 hover:underline">
            {settings.email}
          </a>
        </div>
      </div>
    </header>
    </>
  )
}
