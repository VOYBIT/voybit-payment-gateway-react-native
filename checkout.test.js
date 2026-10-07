import assert from 'node:assert/strict'
import test from 'node:test'

import { checkoutStatus, parseStatus, publicIdFromCheckoutUrl } from './checkout.js'

const id = 'nYVvXxsYGr5LZk8Dn7hU0Q'

test('accepts a voybit checkout URL', () => {
  assert.equal(publicIdFromCheckoutUrl(`https://voybit.com/pay/${id}`), id)
  assert.throws(() => publicIdFromCheckoutUrl('http://voybit.com/pay/' + id), /invalid/)
})

test('reads the top-level status', () => {
  const status = parseStatus({
    deposit_instructions: { status: 'ready', address: 'secret-address' },
    status: 'overpaid',
    public_id: id,
  }, id)
  assert.equal(status.confirmed, true)
  assert.equal(JSON.stringify(status).includes('secret-address'), false)
})

test('status request does not send an API key', async () => {
  let headers
  const status = await checkoutStatus(id, {
    fetch: async (url, options) => {
      headers = options.headers
      assert.equal(url, `https://api.voybit.com/api/v1/checkout/${id}`)
      return { ok: true, status: 200, text: async () => JSON.stringify({ status: 'paid', public_id: id }) }
    },
  })
  assert.equal(status.confirmed, true)
  assert.equal(headers['X-Voybit-Api-Key'], undefined)
})
