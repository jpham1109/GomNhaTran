// TODO: extract social links into a <SocialLinks> helper component
import Link from 'next/link'
import { getSiteSettings } from '@/lib/sanity/queries'
import { getSafeHref } from '@/lib/links/getSafeHref'
import Logo from '@/components/icons/Logo'

export default async function Footer() {
  const settings = await getSiteSettings()

  const instagramHref = getSafeHref(settings?.socialLinks?.instagram)
  const pinterestHref = getSafeHref(settings?.socialLinks?.pinterest)
  const hasSocialLinks = instagramHref !== '#' || pinterestHref !== '#'

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">

        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" aria-label={settings?.siteTitle ?? 'Home'}>
              <Logo className="h-7 w-auto" aria-hidden="true" focusable="false" />
            </Link>
            {settings?.footerTagline && (
              <p className="max-w-xs text-sm text-stone-500">{settings.footerTagline}</p>
            )}
          </div>

          {/* Social links */}
          {hasSocialLinks && (
            <nav aria-label="Social links">
              <ul className="flex gap-4 list-none m-0 p-0">
                {instagramHref !== '#' && (
                  <li>
                    <a
                      href={instagramHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-stone-600 hover:text-stone-900"
                    >
                      Instagram
                    </a>
                  </li>
                )}
                {pinterestHref !== '#' && (
                  <li>
                    <a
                      href={pinterestHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-stone-600 hover:text-stone-900"
                    >
                      Pinterest
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          )}

        </div>

        {/* Copyright */}
        <p className="mt-8 text-xs text-stone-400">
          &copy; {new Date().getFullYear()} {settings?.siteTitle ?? 'Gốm Nhà Trần'}
        </p>

      </div>
    </footer>
  )
}
