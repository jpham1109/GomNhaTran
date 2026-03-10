'use client'

import { useActionState } from 'react'
import { submitInquiry, type InquiryFormState } from '@/app/(site)/contact/actions'

const initialState: InquiryFormState = { status: 'idle' }

// TODO: Extract to shared constants (e.g. lib/ui/formStyles.ts) when more forms are added.
const inputClass =
  'w-full px-4 py-3 bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 disabled:opacity-50 transition-colors'
const labelClass = 'text-sm text-stone-600'

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitInquiry, initialState)

  if (state.status === 'success') {
    return (
      <div role="status" aria-live="polite" className="py-8">
        <p className="text-stone-900 font-medium">Thank you for reaching out.</p>
        <p className="mt-2 text-stone-600">We will be in touch shortly.</p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      noValidate
      aria-describedby={state.status === 'error' ? 'contact-form-error' : undefined}
    >
      {/* Honeypot — visually off-screen, not detectable as display:none */}
      <div
        className="absolute -left-[9999px] w-px h-px overflow-hidden"
        aria-hidden="true"
      >
        <input
          type="text"
          name="_honey"
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            disabled={isPending}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            disabled={isPending}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            maxLength={2000}
            rows={6}
            disabled={isPending}
            className={`${inputClass} resize-none`}
          />
        </div>

        {state.status === 'error' && (
          <p
            id="contact-form-error"
            role="alert"
            className="text-sm text-red-600"
          >
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="self-start px-8 py-3 bg-stone-900 text-stone-50 text-sm tracking-wide hover:bg-stone-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Sending…' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}
