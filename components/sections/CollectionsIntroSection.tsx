type CollectionsIntroSectionProps = {
  intro: {
    eyebrow: string | null
    title: string
    intro: string | null
  }
}

// Page intro for /collections: title on the left, lead paragraph set against
// the bottom of the right column from lg up. .hero-copy staggers the children
// in on first paint (disabled under reduced motion in globals.css).
export default function CollectionsIntroSection({ intro }: CollectionsIntroSectionProps) {
  return (
    <header className="container-page hero-copy grid grid-cols-1 gap-6 pt-14 pb-14 md:pt-20 md:pb-20 lg:grid-cols-12 lg:gap-8 lg:pt-28 lg:pb-28">
      <div className="flex flex-col gap-5 lg:col-span-7">
        {intro.eyebrow && (
          <p className="flex items-center gap-3 text-label font-medium text-bamboo-main">
            <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
            {intro.eyebrow}
          </p>
        )}
        <h1 className="font-serif text-h1 font-normal text-balance break-words">{intro.title}</h1>
      </div>
      {intro.intro && (
        <p className="max-w-prose text-body-lg text-text-secondary text-pretty lg:col-span-4 lg:col-start-9 lg:self-end">
          {intro.intro}
        </p>
      )}
    </header>
  )
}
