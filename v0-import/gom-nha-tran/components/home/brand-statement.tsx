import { LogoMark } from '@/components/brand/logo'
import { Reveal } from '@/components/brand/reveal'
import type { BrandStatementSection } from '@/lib/types'

export function BrandStatement({ content }: { content: BrandStatementSection }) {
  return (
    <section aria-label={content.label} className="section-y">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-gutter text-center">
        <LogoMark className="h-16 text-primary" />
        <figure className="flex flex-col items-center gap-8">
          <blockquote>
            <p className="font-serif text-h1 font-normal italic text-balance">
              {'“'}
              {content.quote}
              {'”'}
            </p>
          </blockquote>
          {content.attribution ? (
            <figcaption className="text-label font-medium text-accent">{content.attribution}</figcaption>
          ) : null}
        </figure>
      </Reveal>
    </section>
  )
}
