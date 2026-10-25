import { useId } from 'react'
import { StoreRow } from '@/components/brand/cards'
import { Media } from '@/components/brand/media'
import { ButtonLink, Container, Eyebrow, SectionHeading } from '@/components/brand/primitives'
import { Reveal } from '@/components/brand/reveal'
import type { Store, StoresSection } from '@/lib/types'
import { cn } from '@/lib/utils'

function groupStores(content: StoresSection, stores: Store[]) {
  const listed = new Set(content.groups.map((group) => group.kind))
  const groups: { label?: string; stores: Store[] }[] = content.groups.map((group) => ({
    label: group.label,
    stores: stores.filter((store) => store.kind === group.kind),
  }))
  const unlisted = stores.filter((store) => !listed.has(store.kind))
  if (unlisted.length > 0) groups.push({ stores: unlisted })
  return groups.filter((group) => group.stores.length > 0)
}

export function OurStores({ content, stores }: { content: StoresSection; stores: Store[] }) {
  const titleId = useId()
  const groups = groupStores(content, stores)

  return (
    <section aria-labelledby={titleId} className={content.image ? 'section-b' : 'section-y'}>
      {content.image ? (
        <Media
          image={content.image}
          sizes="100vw"
          className="aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/8]"
        />
      ) : null}

      <Container
        className={cn(
          'grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8',
          content.image && 'pt-14 md:pt-20 lg:pt-24',
        )}
      >
        <Reveal className="flex flex-col gap-6 lg:col-span-5">
          {content.eyebrow ? <Eyebrow>{content.eyebrow}</Eyebrow> : null}
          <SectionHeading id={titleId} className="max-w-[18ch]">
            {content.title}
          </SectionHeading>
          {content.body ? (
            <p className="max-w-prose text-body-lg text-muted-foreground text-pretty">{content.body}</p>
          ) : null}
          {content.cta ? (
            <div className="pt-2">
              <ButtonLink href={content.cta.href}>
                {content.cta.label}
                <span aria-hidden="true">→</span>
              </ButtonLink>
            </div>
          ) : null}
        </Reveal>

        {groups.length > 0 ? (
          <Reveal delay={120} className="flex flex-col gap-12 lg:col-span-6 lg:col-start-7">
            {groups.map((group, index) => (
              <div key={group.label ?? `group-${index}`} className="flex flex-col gap-4">
                {group.label ? (
                  <h3 className="text-label font-medium text-primary">{group.label}</h3>
                ) : null}
                <ul className="flex flex-col">
                  {group.stores.map((store) => (
                    <StoreRow key={store.href ?? store.name} store={store} />
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        ) : null}
      </Container>
    </section>
  )
}
