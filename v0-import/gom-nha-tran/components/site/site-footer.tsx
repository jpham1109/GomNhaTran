import Link from 'next/link'
import { LogoMark } from '@/components/brand/logo'
import { Container } from '@/components/brand/primitives'
import type { NavItem, SiteSettings, Store } from '@/lib/types'

export function SiteFooter({
  navigation,
  stores,
  settings,
}: {
  navigation: NavItem[]
  stores: Store[]
  settings: SiteSettings
}) {
  const linkClass =
    'text-deep-foreground/90 underline-offset-4 transition-colors hover:text-deep-foreground hover:underline'

  return (
    <footer data-surface="deep" className="bg-deep text-deep-foreground">
      <Container className="flex flex-col gap-16 pt-20 pb-10 lg:pt-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="flex items-start gap-6 lg:col-span-5">
            <LogoMark className="h-28 text-deep-foreground md:h-36" />
            <div className="flex flex-col gap-4 pt-2">
              <p className="font-serif text-h2">{settings.name}</p>
              {settings.tagline ? (
                <p className="max-w-xs text-body text-deep-muted text-pretty">{settings.tagline}</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <nav aria-label="Footer" className="flex flex-col gap-4">
              <h2 className="text-label font-medium text-deep-muted">Explore</h2>
              <ul className="flex flex-col gap-3 text-small">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-4">
              <h2 className="text-label font-medium text-deep-muted">Visit</h2>
              <ul className="flex flex-col gap-3 text-small">
                {stores.map((store) => (
                  <li key={store.href ?? store.name} className="flex flex-col">
                    {store.href ? (
                      <Link href={store.href} className={linkClass}>
                        {store.name}
                      </Link>
                    ) : (
                      <span>{store.name}</span>
                    )}
                    {store.hours ? <span className="text-deep-muted">{store.hours}</span> : null}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
              <h2 className="text-label font-medium text-deep-muted">Contact</h2>
              <ul className="flex flex-col gap-3 text-small">
                <li>
                  <a href={`mailto:${settings.email}`} className={linkClass}>
                    {settings.email}
                  </a>
                </li>
                {settings.phone ? (
                  <li>
                    <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className={linkClass}>
                      {settings.phone}
                    </a>
                  </li>
                ) : null}
                {settings.social.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} className={linkClass} target="_blank" rel="noreferrer">
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-deep-border pt-8 text-small text-deep-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {'© '}
            {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
          {settings.footerNote ? <p lang="vi">{settings.footerNote}</p> : null}
        </div>
      </Container>
    </footer>
  )
}
