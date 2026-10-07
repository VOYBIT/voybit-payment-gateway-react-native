export class CheckoutError extends Error {}

export interface CheckoutStatus {
  publicId: string
  status: string
  checkoutUrl: string
  confirmed: boolean
}

export function publicIdFromCheckoutUrl(checkoutUrl: string): string
export function checkoutUrl(publicId: string): string
export function parseStatus(body: string | object, publicId: string): CheckoutStatus
export function checkoutStatus(publicId: string, options?: {
  fetch?: typeof fetch
  apiOrigin?: string
  userAgent?: string
}): Promise<CheckoutStatus>
export function openCheckout(checkoutUrl: string): Promise<void>
