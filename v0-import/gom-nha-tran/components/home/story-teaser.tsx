import { useId } from 'react'
import { Media } from '@/components/brand/media'
import { Container, Eyebrow, SectionHeading, TextLink } from '@/components/brand/primitives'
import { Reveal } from '@/components/brand/reveal'
import type { StorySection } from '@/lib/types'
import { cn } from '@/lib/utils'

export function StoryTeaser({ content }: { content: StorySection }) {
  const titleId = useId()
  const { detail } = content

  return (
    <section aria-labelledby={titleId} className="section-y">
      <Container className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
        <Reveal className="relative lg:col-span-6 lg:col-start-1">
          <Media
            image={content.image}
            sizes="(min-width: 1024px) 45vw, 88vw"
            className={cn('aspect-[4/5] rounded-sm', detail ? 'w-[88%] lg:w-[86%]' : 'w-full')}
          />
          {detail ? (
            <Media
              image={detail}
              sizes="(min-width: 1024px) 18vw, 40vw"
              className="absolute right-0 -bottom-10 aspect-square w-[42%] rounded-sm border-8 border-background md:-bottom-14 lg:w-[38%]"
            />
          ) : null}
        </Reveal>

        <Reveal
          delay={120}
          className={cn(
            'flex flex-col gap-7 lg:col-span-5 lg:col-start-8 lg:justify-center lg:pt-0',
            detail && 'pt-10',
          )}
        >
          {content.eyebrow ? <Eyebrow>{content.eyebrow}</Eyebrow> : null}
          <SectionHeading id={titleId} className="max-w-[16ch]">
            {content.title}
          </SectionHeading>
          <div className="flex max-w-prose flex-col gap-5 text-body-lg text-muted-foreground">
            {content.body.map((paragraph, index) => (
              <p key={index} className="text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
          {content.cta ? (
            <div>
              <TextLink href={content.cta.href}>{content.cta.label}</TextLink>
            </div>
          ) : null}
        </Reveal>
      </Container>
    </section>
  )
}
