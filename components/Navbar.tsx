import Link from 'next/link'
import { getSiteSettings, getNavigation } from '@/lib/sanity/queries'
import { Logo } from '@/components/icons/Logo'
import SmartLink from '@/components/SmartLink'
import MobileMenu from '@/components/MobileMenu'

// Shown when the navigation document hasn't been published yet.
const FALLBACK_NAV = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

export default async function Navbar() {
  const [settings, nav] = await Promise.all([getSiteSettings(), getNavigation()])
  const mainNav = nav?.mainNav ?? []
  const hasCmsNav = mainNav.length > 0

  return (
    <header className="sticky top-0 z-40 w-full border-b border-bamboo-mid bg-canvas">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">

        <Link href="/" aria-label={settings?.siteTitle ?? 'Home'}>
          <Logo className="h-8 w-auto" />
        </Link>

        {/* Desktop nav */}
        {hasCmsNav ? (
          <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0">
            {mainNav.map((item) => (
              <li key={item._key}>
                <SmartLink link={item.link}>{item.label}</SmartLink>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0">
            {FALLBACK_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        )}

        {/* Mobile toggle — client island, receives serialized nav data */}
        <MobileMenu items={mainNav} fallback={FALLBACK_NAV} />

      </nav>
    </header>
  )
}
