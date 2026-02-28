/**
 * PricingDisplay — renders a product price with optional sale state.
 *
 * - VND prices are formatted with vi-VN locale (e.g. "250.000 ₫") — no
 *   hardcoded fraction digits; Intl.NumberFormat derives them from the
 *   currency code (VND → 0, USD → 2).
 * - Sale state: compareAtPrice must be strictly greater than price.
 * - Accessible: aria-label on the wrapper span summarizes the full price
 *   context for screen readers; visible children are aria-hidden.
 *
 * Locale is derived from currency code via CURRENCY_LOCALE_MAP.
 * No locale prop — language and currency are independent concerns.
 *
 * Post-MVP: PricingDisplay will accept an optional fxRate?: number prop.
 * When provided + currency === 'VND', a supplementary "~$X USD" line will
 * be rendered using CURRENCY_LOCALE_MAP.USD ('en-US'). Not implemented yet.
 */

import type { SanityPricing } from '@/lib/sanity/types'

// ── Locale map ─────────────────────────────────────────────────────────────

const CURRENCY_LOCALE_MAP: Record<string, string> = {
  VND: 'vi-VN',  // → "250.000 ₫"
  USD: 'en-US',  // → "$35.50"  (reserved for future fxRate estimate)
}

// ── Price formatter ────────────────────────────────────────────────────────

/**
 * Formats a price amount using the locale associated with the currency code.
 * Fraction digits are derived from the currency (VND → 0, USD → 2).
 */
function formatPrice(amount: number, currency: string): string {
  const locale = CURRENCY_LOCALE_MAP[currency] ?? 'vi-VN'
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

// ── Component ──────────────────────────────────────────────────────────────

type PricingDisplayProps = {
  pricing: SanityPricing
}

export default function PricingDisplay({ pricing }: PricingDisplayProps) {
  const { price, compareAtPrice, currency } = pricing

  if (compareAtPrice !== null && compareAtPrice > price) {
    const currentFormatted = formatPrice(price, currency)
    const originalFormatted = formatPrice(compareAtPrice, currency)
    const discountPct = Math.round((1 - price / compareAtPrice) * 100)

    return (
      <span
        aria-label={`${currentFormatted}, was ${originalFormatted}, ${discountPct}% off`}
      >
        <s aria-hidden="true">{originalFormatted}</s>{' '}
        <span aria-hidden="true">{currentFormatted}</span>{' '}
        <span aria-hidden="true">({discountPct}% off)</span>
      </span>
    )
  }

  return <span>{formatPrice(price, currency)}</span>
}
