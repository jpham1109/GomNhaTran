import type { SanityContactPage } from '@/lib/sanity/types'
import ContactForm from '@/components/forms/ContactForm'
import EditorialPanel from '@/components/EditorialPanel'

type ContactSectionProps = {
  page: SanityContactPage
}

export default function ContactSection({ page }: ContactSectionProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <EditorialPanel>
      <header className="mb-16 max-w-xl">
        <h1 className="text-4xl font-semibold text-text-primary">{page.headline}</h1>
        {page.subheadline && (
          <p className="mt-4 text-lg text-text-secondary">{page.subheadline}</p>
        )}
      </header>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Contact details */}
        {/* TODO: Replace div groups with semantic <ul>/<li> lists in a later polish pass. */}
        <div className="flex flex-col gap-10">
          {/* Direct contact */}
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-text-secondary">Contact</p>
            <a
              href={`mailto:${page.email}`}
              className="text-text-primary hover:text-bamboo-main transition-colors"
            >
              {page.email}
            </a>
            <a
              href={`tel:${page.phone}`}
              className="text-text-primary hover:text-bamboo-main transition-colors"
            >
              {page.phone}
            </a>
          </div>

          {/* Locations */}
          {page.locations.length > 0 && (
            <div className="flex flex-col gap-6">
              <p className="text-xs uppercase tracking-widest text-text-secondary">Visit</p>
              {page.locations.map((location) => (
                <div key={location._key}>
                  <p className="text-sm font-medium text-text-primary">{location.label}</p>
                  <p className="mt-1 text-text-secondary whitespace-pre-line">{location.address}</p>
                </div>
              ))}
            </div>
          )}

          {/* Social */}
          {(page.instagramUrl || page.facebookUrl) && (
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-widest text-text-secondary">Follow</p>
              {page.facebookUrl && (
                <a
                  href={page.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary hover:text-bamboo-main transition-colors"
                >
                  Facebook
                </a>
              )}
              {page.instagramUrl && (
                <a
                  href={page.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary hover:text-bamboo-main transition-colors"
                >
                  Instagram
                </a>
              )}
            </div>
          )}
        </div>

        {/* Inquiry form */}
        {page.formEnabled && (
          <div>
            <p className="text-xs uppercase tracking-widest text-text-secondary">Inquire</p>
            <h2 className="mt-3 text-2xl font-semibold text-text-primary">Send us a message</h2>
            <p className="mt-2 mb-8 text-text-secondary">
              Whether you have a question about a piece, a custom order, or a wholesale inquiry —
              we would love to hear from you.
            </p>
            <ContactForm />
          </div>
        )}
      </div>
      </EditorialPanel>
    </div>
  )
}
