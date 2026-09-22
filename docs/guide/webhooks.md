# Webhooks

Webhooks deliver real-time event notifications to your server when payment events occur.

## Webhook Envelope

All events share the same structure:

```json
{
  "id": "evt_01J15D7QZ8S3SM58GQZZZWY6F3",
  "event_id": "evt_01J15D7QZ8S3SM58GQZZZWY6F3",
  "event": "payment.completed",
  "api_version": "1.0.0",
  "timestamp": "2026-04-24T04:30:00Z",
  "data": {
    "session_id": "ops_01HZGV...",
    "reference": "order_1042",
    "amount": 50000,
    "currency": "LYD",
    "status": "COMPLETED"
  }
}
```

## Signature Verification

Every delivery includes an `X-OpenWave-Signature` header:

```
X-OpenWave-Signature: sha256=<HMAC-SHA256(raw_body, webhook_secret)>
```

**Always verify before processing the event.** If signatures don't match, discard the request.

::: code-group

```js [Node.js]
import { createHmac } from 'crypto'

function verifyWebhook(rawBody, signature, secret) {
  const expected = 'sha256=' + createHmac('sha256', secret)
    .update(rawBody)  // rawBody must be Buffer, not parsed JSON
    .digest('hex')
  return signature === expected
}
```

```python [Python]
import hmac, hashlib

def verify_webhook(raw_body: bytes, signature: str, secret: str) -> bool:
    expected = 'sha256=' + hmac.new(
        secret.encode(), raw_body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected)
```

```php [PHP]
function verify_webhook(string $raw_body, string $signature, string $secret): bool {
    $expected = 'sha256=' . hash_hmac('sha256', $raw_body, $secret);
    return hash_equals($expected, $signature);
}
```

:::

::: danger Never compute the signature on parsed JSON
Use the **raw request body** as bytes. Parsing and re-serialising JSON can change whitespace and break the HMAC.
:::

## Responding to Webhooks

Return `2xx` within **10 seconds**. The gateway retries failed deliveries:

| Attempt | Delay |
|:---:|:---|
| 1 | Immediate |
| 2 | 30 seconds |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |

After 5 failed attempts, the delivery is marked `FAILED` and remains visible in the merchant delivery log for manual retry and reconciliation.

## Delivery Logs and Recovery

Your integration can list and inspect webhook deliveries from your backend:

```http
GET /webhooks?status=FAILED&event_type=payment.completed&page=0&limit=25
Authorization: Bearer mk_live_...
```

Use `GET /webhooks/{delivery_id}` to recover the exact payload for a missed event. The response includes delivery status, attempt count, last HTTP response status, retry timing, event type, and payload. This lets your operations team recover orders even if your endpoint was unavailable or your application dropped an event after receiving it.

## Idempotency

Your webhook handler must be **idempotent** — the same event may be delivered more than once (on retry). Use the webhook `id` or `event_id` to deduplicate:

```js
const key = event.id ?? event.event_id
if (await redis.get(key)) return res.json({ received: true }) // already processed
await redis.set(key, '1', 'EX', 86400)
// process event...
```

## Event Reference

### Payment Events

| Event | Trigger |
|:---|:---|
| `payment.completed` | Final creditor-bank credit confirmed ✅ |
| `payment.reconciliation_required` | Gateway cannot determine final bank result; do not fulfil until reconciled |
| `payment.failed` | OTP failure, timeout, or CBS error ❌ |
| `payment.expired` | Session TTL elapsed before completion ⏱️ |
| `payment.settlement_pending` | Cross-bank transfer is in flight; final credit is not confirmed yet |

### Refund Events

| Event | Trigger |
|:---|:---|
| `refund.created` | Refund request was accepted and recorded |
| `refund.processing` | Bank or payment rail reversal is underway |
| `refund.completed` | Refund is final and successful |
| `refund.failed` | Refund is final and failed with a merchant-safe reason |

Refund events include `refund_id`, `session_id`, `amount`, `currency`, `status`, and, when available, `rail`, `reversal_reference`, and `failure_reason`. Use `refund_id` to update your refund record, and keep event handling idempotent because webhook delivery may be retried.

### Recurring Mandate Events

| Event | Trigger |
|:---|:---|
| `mandate.activated` | Customer confirmed the recurring mandate |
| `mandate.cancelled` | Mandate cancelled by any party |
| `mandate.charge.completed` | Charge executed successfully |
| `mandate.charge.failed` | Charge attempt failed |

### Presented Payment Events

| Event | Trigger |
|:---|:---|
| `presentment.created` | QR or NFC presentment was created |
| `presentment.claimed` | Presentment was claimed and bound to a payment session or mandate consent |
| `presentment.expired` | Presentment expired before claim or completion |
| `presentment.cancelled` | Presentment was cancelled before claim |

### Merchant Account Events

| Event | Trigger |
|:---|:---|
| `merchant.account.transaction.posted` | A bank-origin credit or debit affected the merchant account |
| `merchant.account.transaction.updated` | Additional bank reference data was attached after the first account event |
| `webhook.test` | A portal or operator sent a test delivery |

Use these events for bank-origin notifications that do not start as a merchant-created payment session. The sender must normalize the event into the OpenWave envelope and include merchant-safe fields such as amount, currency, direction, status, CBS reference, bank reference, rail reference, masked account identifier, and rail source. Do not forward raw LyPay, CBS, card, or bank-core payloads to merchants.

Example implementation flow:

```text
LyPay -> Bank middleware -> OpenWave gateway -> Merchant webhook
```

This flow is implementation-specific. The OpenWave standard defines the normalized merchant webhook contract; each bank decides how it receives, enriches, stores, retries, and forwards its local rail events.

### Open Banking Events

| Event | Trigger |
|:---|:---|
| `consent.granted` | Customer approved the TPP consent |
| `consent.revoked` | Revoked by TPP, customer, or bank |
| `consent.expired` | Consent reached its expiry date |
| `payment_order.completed` | Payment order executed successfully |
| `payment_order.failed` | Bank returned an error |
| `payment_order.pending_sca` | Bank requires SCA — redirect to `sca_url` |
| `payment_order.rejected` | Bank declined the payment order |

### Credit & Finance Events

| Event | Trigger |
|:---|:---|
| `credit_assessment.completed` | Assessment output is ready |
| `finance_offer.created` | Offer is ready for customer review |
| `finance_offer.accepted` | Customer accepted the offer in a hosted or official SDK surface |
| `finance_contract.active` | Contract is active after financed-payment confirmation |
| `finance_contract.cancelled` | Contract was cancelled |
| `repayment.completed` | Scheduled repayment collected |
| `repayment.failed` | Scheduled repayment failed |

## Configuring Webhook Endpoints

```http
POST /merchants/{id}/webhooks
Authorization: Bearer mk_live_...

{
  "url": "https://mystore.com/webhooks/openwave",
  "events": ["payment.completed", "payment.failed"]
}
```

Omit `events` to subscribe to all events.

Merchants should use the portal or operator API to save their HTTPS webhook URL, then send a `webhook.test` event before going live. Subscriptions and recurring mandates use the same webhook endpoint and signature secret as one-time payments.

Webhook secrets are issued at configuration time. Rotate via:
```http
POST /merchants/{id}/webhooks/{webhook_id}/rotate-secret
```
