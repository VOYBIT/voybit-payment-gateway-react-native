# Voybit checkout for React Native

## Get an API key

The API key is created in the dashboard and used only on your server. This library opens the `checkout_url` that server returns.

1. Create an account at [dashboard.voybit.com](https://dashboard.voybit.com).
2. Open **Gateways** and create a payment gateway. Keep it enabled.
3. Open **API keys**, choose **Create secret key**, and bind it to that gateway. Copy the full `vb_live_…` value once. Your server sends it as `X-Voybit-Api-Key` when it creates the payment.

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
