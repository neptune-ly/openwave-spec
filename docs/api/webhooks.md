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

## Related guides

- [Webhook guide](../guide/webhooks.md)
- [Merchant integration](../guide/merchants.md)
- [Error codes](../guide/errors.md)
