import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'light' | 'deep'

/** Page-width wrapper shared by every section, header and footer. */
export function Container({
  as: Tag = 'div',
  className,
  children,
}: {
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav'
  className?: string
  children: ReactNode
}) {
  return <Tag className={cn('container-page', className)}>{children}</Tag>
}

export function Eyebrow({
  children,
  className,
  tone = 'light',
}: {
  children: ReactNode
  className?: string
  tone?: Tone
}) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 text-label font-medium',
        tone === 'light' ? 'text-primary' : 'text-deep-muted',
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
      {children}
    </p>
  )
}

const headingSizes = {
  display: 'text-display',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
}

export function SectionHeading({
  as: Tag = 'h2',
  size = 'h2',
  id,
  children,
  className,
}: {
  as?: 'h1' | 'h2' | 'h3'
  size?: keyof typeof headingSizes
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <Tag
      id={id}
      className={cn('font-serif font-normal text-balance break-words', headingSizes[size], className)}
    >
      {children}
    </Tag>
  )
}

export function SkipLink({ href = '#main', children }: { href?: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:bg-background focus:px-4 focus:py-3 focus:text-small"
    >
      {children}
    </a>
  )
}

const buttonBase =
  'inline-flex min-h-12 items-center justify-center gap-3 rounded-sm px-6 text-nav font-medium transition-colors duration-300 ease-calm'

const buttonVariants = {
  primary: 'bg-primary text-primary-foreground hover:bg-deep',
  secondary: 'border border-foreground/30 text-foreground hover:border-foreground hover:bg-foreground/4',
  'secondary-deep':
    'border border-deep-border text-deep-foreground hover:border-deep-foreground hover:bg-deep-foreground/6',
}

export function ButtonLink({
  variant = 'primary',
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof buttonVariants }) {
  return (
    <Link className={cn(buttonBase, buttonVariants[variant], className)} {...props}>
      {children}
    </Link>
  )
}

export function TextLink({
  className,
  children,
  tone = 'light',
  ...props
}: ComponentProps<typeof Link> & { tone?: Tone }) {
  return (
    <Link
      className={cn(
        'group inline-flex items-center gap-3 py-2 text-nav font-medium',
        tone === 'light' ? 'text-foreground' : 'text-deep-foreground',
        className,
      )}
      {...props}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-calm group-hover:bg-[length:40%_1px]">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="transition-transform duration-500 ease-calm group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  )
}
