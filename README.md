# Voybit checkout for React Native

Your server creates the payment and returns `checkout_url`. This package does not take an API key.

```bash
npm install github:VOYBIT/voybit-payment-gateway-react-native
```

```js
await openCheckout(checkoutUrl)
```

`openCheckout` opens `https://voybit.com/pay/{id}` with `Linking`. Fulfil the order from the webhook on your server.

```js
const status = await checkoutStatus(publicId)
if (status.confirmed) {
  // paid or overpaid — refresh the screen only
}
```

`checkoutStatus` calls `GET https://api.voybit.com/api/v1/checkout/{public_id}` and is only for the screen. Works with Expo. Peer dependency: React Native 0.73 or newer. Not published to npm.
