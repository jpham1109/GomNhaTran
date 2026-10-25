import { BrandStatement } from '@/components/home/brand-statement'
import { CraftProcess } from '@/components/home/craft-process'
import { FeaturedCollection } from '@/components/home/featured-collection'
import { Hero } from '@/components/home/hero'
import { OurStores } from '@/components/home/our-stores'
import { StoryTeaser } from '@/components/home/story-teaser'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import {
  brandStatement,
  collectionSection,
  craftSection,
  hero,
  navigation,
  siteSettings,
  stores,
  storesSection,
  storyTeaser,
} from '@/lib/content'

export default function HomePage() {
  return (
    <>
      <SiteHeader navigation={navigation} settings={siteSettings} />
      <main id="main">
        <Hero content={hero} />
        <StoryTeaser content={storyTeaser} />
        <FeaturedCollection content={collectionSection} />
        <CraftProcess content={craftSection} />
        <BrandStatement content={brandStatement} />
        <OurStores content={storesSection} stores={stores} />
      </main>
      <SiteFooter navigation={navigation} stores={stores} settings={siteSettings} />
    </>
  )
}
