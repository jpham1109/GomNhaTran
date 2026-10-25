import { useId } from 'react'
import { Media } from '@/components/brand/media'
import { Eyebrow, SectionHeading, TextLink } from '@/components/brand/primitives'
import { Reveal } from '@/components/brand/reveal'
import type { CraftSection } from '@/lib/types'
import { cn } from '@/lib/utils'

/** Up to four stages sit in a single desktop row; more continue as a scroll strip. */
const desktopGrid: Record<number, string> = {
  2: 'lg:grid lg:grid-cols-2',
  3: 'lg:grid lg:grid-cols-3',
  4: 'lg:grid lg:grid-cols-4',
}

export function CraftProcess({ content }: { content: CraftSection }) {
  const titleId = useId()
  const grid = desktopGrid[content.stages.length]

  return (
    <section aria-labelledby={titleId} className="section-y bg-secondary">
      {/* No inline padding here: the stage list scrolls edge to edge and applies the gutter itself. */}
      <div className="mx-auto flex max-w-(--container-page) flex-col gap-14 lg:gap-20">
        <Reveal className="grid grid-cols-1 gap-6 px-gutter lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-5 lg:col-span-6">
            {content.eyebrow ? <Eyebrow>{content.eyebrow}</Eyebrow> : null}
            <SectionHeading id={titleId} className="max-w-[18ch]">
              {content.title}
            </SectionHeading>
          </div>
          {content.body || content.cta ? (
            <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9 lg:justify-end">
              {content.body ? (
                <p className="text-body-lg text-muted-foreground text-pretty">{content.body}</p>
              ) : null}
              {content.cta ? (
                <div>
                  <TextLink href={content.cta.href}>{content.cta.label}</TextLink>
                </div>
              ) : null}
            </div>
          ) : null}
        </Reveal>

        {/* Focusable so keyboard users can scroll the strip with arrow keys. */}
        <ol
          aria-labelledby={titleId}
          tabIndex={0}
          className={cn(
            'flex snap-x snap-mandatory scroll-px-gutter gap-5 overflow-x-auto px-gutter pb-4 [scrollbar-width:none] focus-visible:outline-offset-[-2px] lg:gap-8',
            grid && cn(grid, 'lg:snap-none lg:overflow-visible lg:pb-0'),
          )}
        >
          {content.stages.map((stage, index) => (
            <li
              key={`${index}-${stage.title}`}
              className={cn(
                'w-[78vw] shrink-0 snap-start sm:w-[44vw]',
                grid ? 'lg:w-auto' : 'lg:w-80',
                index % 2 === 1 && 'lg:mt-24',
              )}
            >
              <Reveal delay={Math.min(index, 3) * 110} className="flex flex-col gap-5">
                <Media
                  image={stage.image}
                  sizes="(min-width: 1024px) 22vw, 78vw"
                  className="aspect-[3/4] rounded-sm bg-muted"
                />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-serif text-h3 break-words">{stage.title}</h3>
                    {stage.titleVi ? (
                      <span lang="vi" className="font-serif text-small italic text-muted-foreground">
                        {stage.titleVi}
                      </span>
                    ) : null}
                  </div>
                  {stage.body ? (
                    <p className="max-w-[34ch] text-body text-muted-foreground text-pretty">
                      {stage.body}
                    </p>
                  ) : null}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
