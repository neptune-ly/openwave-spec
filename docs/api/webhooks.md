# Webhooks

Webhooks are the final notification channel for merchants, gateways, banks, and registry participants. Polling is allowed for status screens, but fulfilment should be driven by signed webhook events.

## Event principles

- Events are signed with `X-OpenWave-Signature`.
- Event IDs are globally unique and idempotent. The envelope should expose `id`; implementations may also mirror it as `event_id` for SDK compatibility.
- Receivers must return `2xx` only after the event is safely persisted.
- Senders must retry transient failures with backoff.
- Webhook payloads include `api_version`, event type, object ID, timestamp, and final or intermediate state.

## Common payment events

| Event | Meaning |
|---|---|
| `payment.settlement_pending` | Cross-bank transfer is in flight; final credit is not confirmed yet. |
| `payment.completed` | Payment is final and successful. |
| `payment.reconciliation_required` | Payment execution result is unknown and requires operator reconciliation before fulfilment. |
| `payment.failed` | Payment is final and failed. |
| `payment.expired` | Payment session expired before completion. |
| `refund.created` | Refund request was accepted and recorded. |
| `refund.processing` | Bank or payment rail reversal is underway. |
| `refund.completed` | Refund is final and successful. |
| `refund.failed` | Refund is final and failed with a merchant-safe reason. |
| `mandate.activated` | Customer approved and activated a recurring mandate. |
| `mandate.cancelled` | Mandate can no longer be charged. |
| `mandate.charge.completed` | Recurring charge completed. |
| `mandate.charge.failed` | Recurring charge failed. |
| `presentment.created` | QR or NFC presentment was created and is waiting for claim. |
| `presentment.claimed` | Presentment was claimed and bound to a payment session or mandate consent. |
| `presentment.expired` | Presentment expired before claim or completion. |
| `presentment.cancelled` | Presentment was cancelled before claim. |
| `merchant.account.transaction.posted` | A bank-origin merchant account transaction was posted and affects the merchant. |
| `merchant.account.transaction.updated` | Additional bank reference data became available for a prior merchant account transaction. |
| `webhook.test` | Operator or merchant portal test event. |

## Example event

```json
{
  "id": "evt_01HX7Y0HK4D2H9PBW80KHKV221",
  "event_id": "evt_01HX7Y0HK4D2H9PBW80KHKV221",
  "api_version": "1.0.0",
  "event": "payment.completed",
  "timestamp": "2026-05-08T22:10:00Z",
  "data": {
    "session_id": "ses_01HX7R7JVY5G7K2A2Y65HRJ9NQ",
    "merchant_reference": "NS-10042",
    "amount": 860000,
    "currency": "LYD",
    "status": "COMPLETED"
  }
}
```

## Refund event payload

Refund events use the same signed envelope. The `data` object identifies both the refund and the original payment session. Receivers should deduplicate by event ID, then update the refund record by `refund_id`.

```json
{
  "id": "evt_01HX8B5F2JEM86BSS2N0YV7H2E",
  "event_id": "evt_01HX8B5F2JEM86BSS2N0YV7H2E",
  "api_version": "1.0.0",
  "event": "refund.completed",
  "timestamp": "2026-05-08T23:03:15Z",
  "data": {
    "refund_id": "rfd_01HX8B3W4QG7TK2V4R9MB8K2YX",
    "session_id": "ses_01HX7R7JVY5G7K2A2Y65HRJ9NQ",
    "merchant_reference": "ORD-1042-RF-1",
    "amount": 12500,
    "currency": "LYD",
    "status": "COMPLETED",
    "rail": "LYPAY_REVERSAL",
    "reversal_reference": "rv_20260508_00042",
    "failure_reason": null
  }
}
```

For `refund.failed`, `failure_reason` is a merchant-safe category such as `PAYMENT_NOT_COMPLETED`, `AMOUNT_EXCEEDS_REFUNDABLE`, `REFUND_WINDOW_EXPIRED`, `REVERSAL_NOT_SUPPORTED`, `BANK_REJECTED`, `RAIL_UNAVAILABLE`, `TEMPORARY_PROCESSING_ERROR`, `COMPLIANCE_REVIEW`, or `UNKNOWN`.

## Bank-origin merchant account event

Banks or gateway operators may notify a merchant when the merchant's acquiring account is affected by a bank-side rail event, even when that event did not start as an OpenWave payment session. The event must be normalized into the OpenWave envelope and must not forward raw bank or rail payloads.

```json
{
  "id": "evt_01K0A7Q0JR4MVH6DYB6P8HAF3A",
  "event_id": "evt_01K0A7Q0JR4MVH6DYB6P8HAF3A",
  "api_version": "1.0.0",
  "event": "merchant.account.transaction.posted",
  "timestamp": "2026-06-02T12:00:00Z",
  "data": {
    "merchant_id": "mer_123",
    "environment": "LIVE",
    "status": "POSTED",
    "transaction": {
      "direction": "CREDIT",
      "amount": 10000,
      "currency": "LYD",
      "cbs_reference": "CBS-20260602-00001",
      "bank_reference": "CBS-20260602-00001",
      "rail_reference": "LP-88210042",
      "lypay_reference": "LP-88210042",
      "rrn": "40602123456",
      "account_iban": "LY83***************1234",
      "posted_at": "2026-06-02T12:00:00Z",
      "description": "LyPay incoming credit"
    },
    "counterparty": {
      "name": "Counterparty name",
      "account_identifier": "123******789",
      "bank_name": "Sending Bank",
      "bank_code": "002"
    },
    "source": {
      "rail": "LYPAY",
      "bank_handle": "merchant-bank",
      "origin": "BANK"
    }
  }
}
```

`merchant.account.transaction.updated` uses the same shape when the first notification was sent before final bank enrichment, for example when the CBS reference is attached after narrative or posting reconciliation.

## Signature headers

```http
X-OpenWave-Event-Id: evt_01HX7Y0HK4D2H9PBW80KHKV221
X-OpenWave-Timestamp: 1778278200
X-OpenWave-Signature: sha256=8b55c2...
```

## Open Banking events

| Event | Meaning |
|---|---|
| `consent.created` | Consent request exists but is not approved. |
| `consent.authorized` | Customer approved the requested scopes. |
| `consent.revoked` | Consent was revoked by customer, bank, TPP, or policy. |
| `payment_order.completed` | PISP order reached a final successful state. |

## Credit & Finance events

| Event | Meaning |
|---|---|
| `credit_assessment.completed` | Assessment output is ready. |
| `finance_offer.created` | Offer is ready for customer review. |
| `finance_offer.accepted` | Customer accepted terms and repayment schedule. |
| `finance_contract.active` | Finance contract became active. |
| `finance_contract.cancelled` | Finance contract was cancelled. |
| `repayment.completed` | Repayment collected successfully. |
| `repayment.failed` | Repayment failed or was rejected. |

## Receiver checklist

1. Read the raw request body before JSON parsing.
2. Verify the HMAC signature with the active webhook secret.
3. Reject stale timestamps according to your replay window.
4. Deduplicate by event ID.
5. Persist the event before triggering fulfilment.
6. Return `2xx` only after durable storage succeeds.

## Delivery log API

Merchants can query delivery history from their backend with the merchant API key. This is the recovery path when an endpoint was down, a message was lost after receipt, or operations need to reconcile webhook state.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/webhooks` | Paginated delivery log with `status`, `event_type`, `page`, `limit`, and optional `include_payload` filters. |
| `GET` | `/webhooks/{delivery_id}` | Full delivery detail including payload, attempts, last response status, and next retry time. |
| `GET` | `/webhooks/session/{session_id}` | Deliveries related to one payment session. |
| `POST` | `/webhooks/{delivery_id}/retry` | Queue a retry for a delivery. |
| `POST` | `/webhooks/test` | Send a test event to the configured endpoint. |

The delivery log must include failed deliveries and should keep payload access long enough for normal merchant reconciliation windows. Merchants should still process webhooks idempotently by `event_id`; the log is a recovery and audit channel, not a replacement for real-time delivery.

## Related guides

- [Webhook guide](../guide/webhooks.md)
- [Merchant integration](../guide/merchants.md)
- [Error codes](../guide/errors.md)
