import { Linking } from 'react-native'

import { checkoutUrl, publicIdFromCheckoutUrl } from './checkout.js'

export { CheckoutError, checkoutStatus, checkoutUrl, publicIdFromCheckoutUrl } from './checkout.js'

export async function openCheckout(value) {
  await Linking.openURL(checkoutUrl(publicIdFromCheckoutUrl(value)))
}
