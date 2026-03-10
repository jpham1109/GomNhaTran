import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getContactPage, getSiteSettings } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/buildMetadata'
import ContactSection from '@/components/sections/ContactSection'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
  ])
  return buildMetadata({
    seo: page?.seo,
    defaultSeo: settings?.defaultSeo,
    siteTitle: settings?.siteTitle,
  })
}

export default async function ContactPage() {
  const page = await getContactPage()
  if (!page) notFound()

  return (
    <main>
      <ContactSection page={page} />
    </main>
  )
}
