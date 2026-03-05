import Image from 'next/image'
import type { SanityTeaserSection } from '@/lib/sanity/types'
import SmartLink from '@/components/SmartLink'

type TeaserSectionProps = {
  teaser: SanityTeaserSection
}

export default function TeaserSection({ teaser }: TeaserSectionProps) {
  return (
    <section>
      <h2>{teaser.headline}</h2>
      <p>{teaser.body}</p>
      {teaser.image && (
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={teaser.image.url}
            alt={teaser.image.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      {teaser.cta && (
        <SmartLink link={teaser.cta.link}>{teaser.cta.label}</SmartLink>
      )}
    </section>
  )
}
