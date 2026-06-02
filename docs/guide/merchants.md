# Merchant Integration Guide

Accept payments from any participating bank with a single integration. No per-bank setup.

Presented QR and NFC flows are available when your operator enables them. You still create a payment or mandate intent on your backend, but instead of redirecting immediately, you can request a presentment for scan or tap. Read [Presented Payments](./presented-payments.md) and [QR Payloads](./presented-qr.md).

Financed checkout is available through the [Credit & Finance](./credit-finance.md) module when a finance provider or lender is configured. Merchants request offer options and receive merchant-safe statuses, but they do not receive raw customer transaction data unless the customer explicitly consented to share it with that merchant or TPP.

## Overview

```
1. Your backend creates a payment session
2. You redirect the customer (or embed the widget)
3. Customer authenticates with their bank via OTP
4. Gateway deducts funds and delivers a webhook to your endpoint
5. You fulfil the order
```

## Step 1 — Get Your API Key

Contact your gateway operator (or your bank) to receive a **Merchant API Key** (`mk_live_...`).

All requests are authenticated with:
```http
Authorization: Bearer mk_live_...
```

::: tip Test Keys
Use `mk_test_...` keys during development. Test mode payments never touch real funds.
:::

## Sandbox, Live, and Branding

Sandbox and live access must be separate. A merchant should receive a sandbox base URL and sandbox credential for testing, and a live base URL and live credential only after production review. Do not use a request flag to turn a live credential into a sandbox transaction.

Before live enablement, configure:

- merchant display name,
- logo URL or uploaded logo,
- brand color,
- support email,
- website,
- webhook URL,
- allowed SDK origins,
- settlement account or merchant IBAN where required by the operator.

Hosted checkout, presented QR/NFC review, recurring approval, Open Banking consent, and SDK surfaces should show the merchant logo/display name and the acquiring bank or gateway operator identity. See [Production Readiness](./production-readiness.md).

## Step 2 — Create a Payment Session

From your **backend** (never from the browser — your API key stays server-side):

```http
POST /api/v1/payments/initiate
Authorization: Bearer mk_live_...
Content-Type: application/json

{
  "amount": 50000,
  "currency": "LYD",
  "destination": {
    "type": "alias",
    "value": "mtellesy"
  },
  "description": "Order #1042",
  "reference": "order_1042",
  "redirect_url": "https://mystore.com/orders/1042/result",
  "webhook_url": "https://mystore.com/webhooks/openwave"
}
```

::: info Amount is in minor units
`50000` = **500.00 LYD**. See [Amount Convention](./concepts.md#amount-convention).
:::

Response:
```json
{
  "session_id": "ops_01HZGV...",
  "status": "PENDING",
  "checkout_url": "https://gateway.example.com/pay/ops_01HZGV...",
  "expires_at": "2026-04-24T05:00:00Z"
}
```

## Step 3 — Redirect the Customer

Send the customer to `checkout_url`. The gateway handles:
- Alias/IBAN entry
- Bank selection
- OTP authentication
- Redirect back to your `redirect_url` with `?session_id=...&status=completed`

**Or embed the widget** (coming with the Web SDK):
```html
<script src="https://js.openwave.ly/v1/openwave.js"></script>
<script>
  openwave.checkout({
    sessionId: 'ops_01HZGV...',
    onSuccess: (e) => window.location.href = e.receipt_url,
    onFailed: (e) => showError(e.message),
  })
</script>
```

## Step 4 — Receive Webhooks

Configure a public HTTPS endpoint to receive events. **Always verify the signature:**

```js
// Express.js example
app.post('/webhooks/openwave', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['x-openwave-signature']
  const secret = process.env.WEBHOOK_SECRET

  const expected = 'sha256=' + createHmac('sha256', secret)
    .update(req.body)
    .digest('hex')

  if (sig !== expected) return res.status(401).send('Invalid signature')

  const event = JSON.parse(req.body)

  if (event.event === 'payment.completed') {
    const { session_id, reference } = event.data
    // fulfil order using reference
    await fulfillOrder(reference)
  }

  res.json({ received: true })
})
```

### Payment Events

| Event | When |
|:---|:---|
| `payment.completed` | Final creditor-bank credit confirmed ✅ |
| `payment.failed` | OTP failure, timeout, or CBS error ❌ |
| `payment.expired` | Session timed out before completion ⏱️ |

## Step 5 — Verify (Optional Double-Check)

After receiving the webhook, you can verify the session status directly:

```http
GET /api/v1/payments/{session_id}
Authorization: Bearer mk_live_...
```

## Refund a Completed Payment

Create refunds from your backend after a payment has reached `COMPLETED`. Refunds can be full or partial, and every create request should include an `Idempotency-Key` so a network retry cannot duplicate money movement.

```http
POST /api/v1/payments/{session_id}/refunds
Authorization: Bearer mk_live_...
Idempotency-Key: refund-order-1042-1
Content-Type: application/json

{
  "amount": 12500,
  "currency": "LYD",
  "merchant_reference": "order_1042_refund_1",
  "reason": "PARTIAL_RETURN"
}
```

Use the remaining refundable amount for a full refund, or a smaller amount for a partial refund. The currency must match the original payment.

```json
{
  "refund_id": "rfd_01HX8B3W4QG7TK2V4R9MB8K2YX",
  "session_id": "ops_01HZGV...",
  "status": "PROCESSING",
  "amount": 12500,
  "currency": "LYD",
  "merchant_reference": "order_1042_refund_1",
  "rail": "LYPAY_REVERSAL",
  "failure_reason": null
}
```

OpenWave uses the original bank or payment rail reversal when it is available. Same-bank payments should reverse through the bank ledger, and cross-bank rail payments should use the rail-native reversal or return path. If the original rail cannot reverse the transfer, the gateway may use a compliant fallback credit transfer while keeping the same refund status and webhook semantics.

### Refund Events

| Event | When |
|:---|:---|
| `refund.created` | Refund was accepted and recorded |
| `refund.processing` | Bank or rail reversal started |
| `refund.completed` | Refund is final and successful |
| `refund.failed` | Refund is final and failed with a safe reason |

`refund.failed` includes a merchant-safe `failure_reason` such as `AMOUNT_EXCEEDS_REFUNDABLE`, `REFUND_WINDOW_EXPIRED`, `REVERSAL_NOT_SUPPORTED`, `BANK_REJECTED`, `RAIL_UNAVAILABLE`, or `TEMPORARY_PROCESSING_ERROR`. Do not expect raw bank or payer details in failure responses.

## Destination Types

| Type | Example | Notes |
|:---|:---|:---|
| `alias` | `mtellesy` | NPT username, resolved to IBAN |
| `alias` with bank | `mtellesy@andalus` | Specific bank routing |
| `iban` | `LY83002700100099900001` | Direct IBAN |

## How Your Account Gets Credited

When a customer pays you, the money flows differently depending on whether you and the customer bank with the same institution:

| Scenario | What happens | Timing |
|---|---|---|
| **Same bank** | Internal CBS book transfer — instant debit and credit | < 1 second |
| **Different banks** | Customer's bank debits, sends via **CBL LyPay** to your bank, your bank credits | 2–10 seconds |

**You only need to act on `payment.completed`** — this webhook fires only after the credit at your bank is confirmed. Never fulfil an order from a non-final hosted checkout state alone.

```json
{
  "event": "payment.completed",
  "data": {
    "session_id": "ops_01HZGV...",
    "reference": "order_1042",
    "settlement_type": "lypay",
    "creditor_bank": "andalus"
  }
}
```

The `settlement_type` field is `internal` for same-bank payments and `lypay` for cross-bank. Your bank handles the actual credit — the gateway simply confirms it happened and fires this webhook.

::: tip Cross-bank payments are still real-time
LyPay is a real-time settlement rail. Cross-bank payments typically complete in under 10 seconds — you don't need to poll or wait.
:::

## Recurring Payments

Set up a mandate for recurring charges (subscriptions, instalments):

```http
POST /recurring/mandates
{
  "customer_alias": "mtellesy",
  "amount": 5000,
  "currency": "LYD",
  "interval": "monthly",
  "description": "Monthly subscription",
  "start_date": "2026-05-01"
}
```

Send the customer to the returned `consent_url` or open it in the official SDK/webview. The customer reviews the amount limit and frequency, then approves with bank OTP or push inside the hosted OpenWave surface. Do not collect OTPs in your merchant UI and do not call mandate approval endpoints from your backend.

Once active, you charge via:

```http
POST /recurring/mandates/{mandate_id}/charge
{ "amount": 5000, "reference": "sub_may_2026" }
```

## Presented Payments

Use presented flows when the customer starts from a merchant screen, POS, or merchant-initiated wallet handoff:

| Mode | Use when | What you send |
|---|---|---|
| `MERCHANT_PRESENTED` + `ONE_TIME_PAYMENT` | Storefront, POS, bill-pay page | Fixed or open-amount presentment |
| `MERCHANT_PRESENTED` + `MANDATE_APPROVAL` | Subscription signup, instalment approval | Mandate approval presentment |

Merchants must not collect OTP, PIN, or push approval results in their own UI. The QR or NFC payload only hands the customer into the trusted hosted or official SDK surface.

## Financed Checkout

Use Credit & Finance when the customer wants BNPL, revolving-credit drawdown, or Murabaha installment finance:

| Step | Merchant action | Finance provider action |
|---|---|---|
| 1 | Send order amount, currency, and merchant reference. | Request finance-specific consent where needed. |
| 2 | Show available offer option or hosted acceptance URL. | Complete assessment and create offer. |
| 3 | Wait for final OpenWave payment confirmation. | Customer accepts terms and financier pays merchant. |
| 4 | Fulfil after signed `payment.completed`. | Service repayment schedule and contract lifecycle. |

Assessment output and decline details must remain privacy-safe. The merchant can receive offer status, final payment status, safe reason categories, and correlation IDs.

## API Key Security

- **Never expose your API key in frontend code or mobile apps**
- Store it as an environment variable: `OPENWAVE_API_KEY`
- Rotate your key immediately if you suspect it's compromised
- Use `mk_test_...` keys in development and CI

## Two-Tier Access Model

::: warning Merchant API keys cannot drive the checkout flow
`resolve-payer`, `select-auth`, and `confirm` are **customer-facing** endpoints. Any call to these with a merchant API key is rejected with `403 CHECKOUT_STEP_FORBIDDEN`.
:::

Your integration follows this split:

| What you do (server-side) | What the customer does (in browser) |
|:---|:---|
| Create session with merchant key | Enter alias/IBAN in the hosted page |
| Redirect to `checkout_url` | Receive OTP, confirm payment |
| Poll status or wait for webhook | — |

This design ensures:
- **Your server never sees the customer's IBAN or phone** — that data lives in the browser session only.
- **The customer controls the payment** — you cannot trigger the debit from your backend after session creation.
- **Standard compliance** — follows SCA / PSD2 principles for delegated authentication.

### Use the Official SDK

```js
// ✅ Correct — merchant server creates the session
const session = await astro.payments.createSession({ amount, currency, destination })
// Then redirect: window.location.href = session.checkout_url

// ❌ Wrong — merchant cannot call checkout steps
await astro.payments.resolvePayer(sessionId, { payer_alias: '09...' }) // 403 Forbidden
```

The `checkout_url` is the single handoff point: your server creates the session, the customer completes it.
