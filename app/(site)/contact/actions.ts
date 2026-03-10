'use server'

import { Resend } from 'resend'
import { getContactFormConfig } from '@/lib/sanity/queries'

const resend = new Resend(process.env.RESEND_API_KEY)

// TODO: Replace with a verified sending address once the domain is confirmed
// with Resend. Until then this action will fail in production.
// Set RESEND_FROM_ADDRESS in .env.local and Vercel environment variables.
const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS ?? ''

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LIMITS = {
  name: 100,
  email: 254,
  message: 2000,
}

export type InquiryFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export async function submitInquiry(
  _prevState: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  // Honeypot — bots fill hidden fields, humans don't.
  // Silently succeed so bots don't know they were caught.
  const honeyValue = formData.get('_honey')
  const honey = typeof honeyValue === 'string' ? honeyValue.trim() : ''
  if (honey) return { status: 'success' }

  const nameValue = formData.get('name')
  const emailValue = formData.get('email')
  const messageValue = formData.get('message')

  const name = typeof nameValue === 'string' ? nameValue.trim() : ''
  const email = typeof emailValue === 'string' ? emailValue.trim() : ''
  const message = typeof messageValue === 'string' ? messageValue.trim() : ''

  if (!name || !email || !message) {
    return { status: 'error', message: 'Please fill in all fields.' }
  }

  if (name.length > LIMITS.name) {
    return { status: 'error', message: 'Name is too long.' }
  }

  if (email.length > LIMITS.email || !EMAIL_REGEX.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  if (message.length > LIMITS.message) {
    return { status: 'error', message: `Message must be ${LIMITS.message} characters or fewer.` }
  }

  const config = await getContactFormConfig()

  if (!config?.formEnabled) {
    return { status: 'error', message: 'The inquiry form is currently unavailable.' }
  }

  if (!config.email) {
    return { status: 'error', message: 'Unable to send message. Please try again later.' }
  }

  if (!FROM_ADDRESS) {
    console.error('[submitInquiry] Missing RESEND_FROM_ADDRESS')
    return { status: 'error', message: 'Unable to send message. Please try again later.' }
  }

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: config.email,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })
    return { status: 'success' }
  } catch (error) {
    console.error('[submitInquiry] Resend error:', error)
    return { status: 'error', message: 'Unable to send message. Please try again later.' }
  }
}
