import Image from 'next/image'
import type { SanityHeroSection } from '@/lib/sanity/types'
import SmartLink from '@/components/SmartLink'

type HeroSectionProps = {
  hero: SanityHeroSection
}

export default function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section>
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={hero.image.url}
          alt={hero.image.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <h1>{hero.headline}</h1>
      {hero.subheadline && <p>{hero.subheadline}</p>}
      {hero.cta && (
        <SmartLink link={hero.cta.link}>{hero.cta.label}</SmartLink>
      )}
    </section>
  )
}
