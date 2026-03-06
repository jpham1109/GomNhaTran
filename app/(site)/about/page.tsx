import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAboutPage, getSiteSettings } from '@/lib/sanity/queries'
import HeroSection from '@/components/sections/HeroSection'
import StorySection from '@/components/sections/StorySection'
import ProcessSection from '@/components/sections/ProcessSection'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getAboutPage(), getSiteSettings()])
  const seo = page?.seo
  const defaultSeo = settings?.defaultSeo
  return {
    title: seo?.metaTitle ?? defaultSeo?.metaTitle ?? settings?.siteTitle ?? undefined,
    description: seo?.metaDescription ?? defaultSeo?.metaDescription ?? undefined,
    openGraph: seo?.ogImage ? { images: [{ url: seo.ogImage.url }] } : undefined,
  }
}

export default async function AboutPage() {
  const page = await getAboutPage()
  if (!page) notFound()

  return (
    <main>
      <HeroSection hero={page.hero} priority />
      {page.story && <StorySection section={page.story} />}
      {page.process && <ProcessSection section={page.process} />}
    </main>
  )
}
