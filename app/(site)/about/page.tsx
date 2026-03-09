import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAboutPage, getSiteSettings } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/buildMetadata'
import HeroSection from '@/components/sections/HeroSection'
import StorySection from '@/components/sections/StorySection'
import ProcessSection from '@/components/sections/ProcessSection'

export async function generateMetadata(): Promise<Metadata> {
	const [page, settings] = await Promise.all([
		getAboutPage(),
		getSiteSettings(),
	])
	return buildMetadata({
		seo: page?.seo,
		defaultSeo: settings?.defaultSeo,
		siteTitle: settings?.siteTitle,
		fallbackOgImageUrl: page?.hero?.image?.url,
	})
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
