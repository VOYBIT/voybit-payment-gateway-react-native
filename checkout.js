const PUBLIC_ID = /^[A-Za-z0-9_-]{22}$/

export const CHECKOUT_ORIGIN = 'https://voybit.com'
export const API_ORIGIN = 'https://api.voybit.com'

export class CheckoutError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CheckoutError'
  }
}

export function publicIdFromCheckoutUrl(value) {
  let url
  try {
    url = new URL(String(value ?? '').trim())
  } catch {
    throw new CheckoutError('checkout URL is invalid')
  }
  if (url.protocol !== 'https:' || url.hostname !== 'voybit.com' || url.username || url.password || url.search || url.hash) {
    throw new CheckoutError('checkout URL is invalid')
  }
  const path = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname
  const id = path.startsWith('/pay/') ? path.slice('/pay/'.length) : ''
  if (path !== `/pay/${id}` || !PUBLIC_ID.test(id)) throw new CheckoutError('checkout URL is invalid')
  return id
}

export function checkoutUrl(publicId) {
  if (!PUBLIC_ID.test(publicId ?? '')) throw new CheckoutError('checkout URL is invalid')
  return `${CHECKOUT_ORIGIN}/pay/${publicId}`
}

export function parseStatus(body, publicId) {
  let decoded = body
  if (typeof body === 'string') {
    try {
      decoded = JSON.parse(body)
    } catch {
      throw new CheckoutError('checkout status was not JSON')
    }
  }
  if (!decoded || typeof decoded !== 'object' || Array.isArray(decoded) || typeof decoded.status !== 'string') {
    throw new CheckoutError('checkout status was not JSON')
  }
  const id = typeof decoded.public_id === 'string' ? decoded.public_id : publicId
  if (!PUBLIC_ID.test(id)) throw new CheckoutError('checkout status was not JSON')
  return {
    publicId: id,
    status: decoded.status,
    checkoutUrl: typeof decoded.checkout_url === 'string' ? decoded.checkout_url : checkoutUrl(id),
    confirmed: decoded.status === 'paid' || decoded.status === 'overpaid',
  }
}

export async function checkoutStatus(publicId, { fetch: fetchImpl = globalThis.fetch, apiOrigin = API_ORIGIN, userAgent = 'voybit-payment-gateway-react-native/0.1.0' } = {}) {
  const id = publicIdFromCheckoutUrl(checkoutUrl(publicId))
  const response = await fetchImpl(`${apiOrigin}/api/v1/checkout/${id}`, {
    method: 'GET',
    redirect: 'error',
    headers: { Accept: 'application/json', 'User-Agent': userAgent },
  })
  if (!response.ok) throw new CheckoutError(`checkout status returned HTTP ${response.status}`)
  const raw = await response.text()
  if (raw.length > 1 << 20) throw new CheckoutError('checkout status was too large')
  return parseStatus(raw, id)
}
