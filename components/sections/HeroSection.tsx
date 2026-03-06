import Image from 'next/image'
import type { SanityHeroSection } from '@/lib/sanity/types'
import SmartLink from '@/components/SmartLink'

type HeroSectionProps = {
  hero: SanityHeroSection
  // Only pass `priority` for above-the-fold heroes (e.g. the first section on a page).
  // Avoid using it on reused instances lower in the page to keep LCP accurate.
  priority?: boolean
}

export default function HeroSection({ hero, priority = false }: HeroSectionProps) {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      <Image
        src={hero.image.url}
        alt={hero.image.alt}
        fill
        sizes="100vw"
        className="object-cover"
        priority={priority}
      />
      {/* Overlay — adjust bg-black/* opacity to suit the site's photography.
          Light, airy shots may need /20–/30; darker or busier images may need /50–/60. */}
      <div aria-hidden="true" className="absolute inset-0 z-10 bg-black/40" />
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 px-4 text-center text-white">
        <h1 className="text-4xl font-semibold md:text-5xl">{hero.headline}</h1>
        {hero.subheadline && (
          <p className="max-w-xl text-lg text-white/90">{hero.subheadline}</p>
        )}
        {hero.cta && (
          <SmartLink
            link={hero.cta.link}
            className="mt-2 inline-flex items-center border border-white px-6 py-2 text-sm uppercase tracking-widest text-white transition hover:bg-white hover:text-stone-900"
          >
            {hero.cta.label}
          </SmartLink>
        )}
      </div>
    </section>
  )
}
