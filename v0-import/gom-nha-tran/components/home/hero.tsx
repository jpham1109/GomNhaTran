import { useId } from 'react'
import { Media } from '@/components/brand/media'
import { ButtonLink, Container, Eyebrow, SectionHeading } from '@/components/brand/primitives'
import type { HeroSection } from '@/lib/types'

export function Hero({ content }: { content: HeroSection }) {
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="relative flex flex-col overflow-hidden lg:min-h-[100svh] lg:justify-end"
    >
      <Container className="hero-copy relative z-10 flex flex-col gap-6 pt-[calc(var(--header-height)+3.5rem)] pb-10 md:pt-[calc(var(--header-height)+5rem)] lg:pt-[calc(var(--header-height)+4rem)] lg:pb-24">
        {content.eyebrow ? <Eyebrow>{content.eyebrow}</Eyebrow> : null}
        <SectionHeading as="h1" size="display" id={titleId} className="max-w-[11ch]">
          {content.title}
        </SectionHeading>
        {content.body ? (
          <p className="max-w-md text-body-lg text-muted-foreground text-pretty">{content.body}</p>
        ) : null}
        {content.cta ? (
          <div className="pt-2">
            <ButtonLink href={content.cta.href}>
              {content.cta.label}
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        ) : null}
      </Container>

      <Media
        image={content.image}
        priority
        sizes="100vw"
        className="aspect-[4/5] w-full bg-transparent sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto"
        imageClassName="hero-image"
      />
    </section>
  )
}
