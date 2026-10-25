import { Container, Eyebrow, SectionHeading } from '@/components/brand/primitives'
import type { CollectionsIndexContent } from '@/lib/types'

export function CollectionsIntro({
  content,
}: {
  content: Pick<CollectionsIndexContent, 'eyebrow' | 'title' | 'intro'>
}) {
  return (
    <Container className="hero-copy grid grid-cols-1 gap-6 pt-[calc(var(--header-height)+3.5rem)] pb-14 md:pt-[calc(var(--header-height)+5rem)] md:pb-20 lg:grid-cols-12 lg:gap-8 lg:pt-[calc(var(--header-height)+7rem)] lg:pb-28">
      <div className="flex flex-col gap-5 lg:col-span-7">
        {content.eyebrow ? <Eyebrow>{content.eyebrow}</Eyebrow> : null}
        <SectionHeading as="h1" size="h1">
          {content.title}
        </SectionHeading>
      </div>
      {content.intro ? (
        <p className="max-w-prose text-body-lg text-muted-foreground text-pretty lg:col-span-4 lg:col-start-9 lg:self-end">
          {content.intro}
        </p>
      ) : null}
    </Container>
  )
}
