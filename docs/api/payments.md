# Payments API

The Payments API is the merchant-facing payment contract. It covers one-time checkout, NPT or IBAN payer resolution, customer authorization, bank execution, refunds, recurring mandates, and merchant webhooks.

If your flow starts with a merchant QR code, NFC handoff, or app handoff, read [Presented Payments](./presented-payments.md) first. That spec creates or claims the presentment, then hands control back to the same payment and mandate lifecycle described on this page.

If your flow is financed checkout, read [Credit & Finance](./credit-finance.md) first. BNPL, revolving-credit, and Murabaha offers use their own assessment, offer, contract, and repayment lifecycle, then settle merchant funds through the same final payment states and signed webhook rules described here.

## OpenAPI

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml" target="_blank">Open in Swagger Editor</a>
  <a class="ow-dl-btn-ghost" href="../downloads.html">Client tools</a>
</div>

## Main payment flow

| Step | Endpoint | Caller | Purpose |
|---:|---|---|---|
| 1 | `POST /payments/initiate` | Merchant backend | Create a payment session with amount, currency, merchant order reference, callback URL, and return URL. |
| 2 | `POST /session/{id}/resolve-payer` | Hosted checkout / SDK | Resolve an NPT alias or IBAN to the debtor bank and masked customer details. |
| 3 | `POST /session/{id}/select-auth` | Hosted checkout / SDK | Choose OTP or push authorization when multiple methods are available. |
| 4 | `POST /session/{id}/confirm-otp` | Hosted checkout / SDK | Confirm the customer OTP collected by the secure gateway surface. |
| 5 | `GET /payments/{session_id}` | Merchant backend | Poll status when needed. Webhooks remain the final source for fulfilment. |

## Refunds and reversals

Merchants can create refunds only against their own completed payment sessions. A refund may be full or partial, but the cumulative completed and in-flight refund amount must never exceed the original payment amount.

| Endpoint | Purpose |
|---|---|
| `POST /payments/{session_id}/refunds` | Create a full or partial refund for a completed payment session. |
| `GET /payments/{session_id}/refunds` | List refunds created for a payment session. |
| `GET /payments/refunds/{refund_id}` | Read refund status when polling is needed. |

Refund creation accepts the standard `Idempotency-Key` header. Retrying the same key returns the original refund and must not create duplicate money movement.

```http
POST /payments/ses_01HX7R7JVY5G7K2A2Y65HRJ9NQ/refunds
Authorization: Bearer mk_live_...
Idempotency-Key: refund-ORD-1042-1
Content-Type: application/json

{
  "amount": 12500,
  "currency": "LYD",
  "merchant_reference": "ORD-1042-RF-1",
  "reason": "PARTIAL_RETURN"
}
```

```json
{
  "refund_id": "rfd_01HX8B3W4QG7TK2V4R9MB8K2YX",
  "session_id": "ses_01HX7R7JVY5G7K2A2Y65HRJ9NQ",
  "status": "PROCESSING",
  "amount": 12500,
  "currency": "LYD",
  "merchant_reference": "ORD-1042-RF-1",
  "original_payment_amount": 860000,
  "refundable_amount_before": 860000,
  "refundable_amount_after": 847500,
  "rail": "LYPAY_REVERSAL",
  "reversal_reference": "rv_20260508_00042",
  "failure_reason": null,
  "idempotency_key": "refund-ORD-1042-1",
  "created_at": "2026-05-08T23:02:10Z"
}
```

For a full refund, set `amount` to the current remaining refundable amount. For a partial refund, set any smaller positive amount in the original payment currency.

Refund execution must reuse the original bank or payment rail reversal where available:

| Original route | Preferred refund path |
|---|---|
| Same-bank internal transfer | Same-bank reversal or book-transfer correction. |
| Cross-bank LyPay transfer | LyPay reversal, return, or equivalent rail-native reversal. |
| Rail reversal unavailable | Compliant fallback credit transfer with the same refund lifecycle and reconciliation fields. |

### Refund statuses

| Status | Meaning | Merchant action |
|---|---|---|
| `CREATED` | Refund request was accepted and recorded. | Store the refund ID and wait. |
| `PROCESSING` | Bank or payment rail reversal is underway. | Do not treat as complete yet. |
| `COMPLETED` | Refund is final and successful. | Update the order/refund record. |
| `FAILED` | Refund is final and did not complete. | Show a safe failure message or retry with a new idempotency key when appropriate. |

Failure reasons are merchant-safe categories such as `PAYMENT_NOT_COMPLETED`, `AMOUNT_EXCEEDS_REFUNDABLE`, `CURRENCY_MISMATCH`, `REFUND_WINDOW_EXPIRED`, `REVERSAL_NOT_SUPPORTED`, `BANK_REJECTED`, `RAIL_UNAVAILABLE`, `TEMPORARY_PROCESSING_ERROR`, `COMPLIANCE_REVIEW`, and `UNKNOWN`. They must not expose sensitive payer, bank, or compliance details.

## Example responses

### Create payment session

```json
{
  "session_id": "ses_01HX7R7JVY5G7K2A2Y65HRJ9NQ",
  "status": "PENDING",
  "amount": 860000,
  "currency": "LYD",
  "payment_url": "https://gateway.example.com/pay/ses_01HX7R7JVY5G7K2A2Y65HRJ9NQ?token=chk_...",
  "checkout_url": "https://gateway.example.com/pay/ses_01HX7R7JVY5G7K2A2Y65HRJ9NQ?token=chk_...",
  "checkout_session_token": "chk_...",
  "expires_at": "2026-05-08T22:30:00Z",
  "idempotency_key": "order-NS-10042"
}
```

### Resolve payer

```json
{
  "session_id": "ses_01HX7R7JVY5G7K2A2Y65HRJ9NQ",
  "payer": {
    "alias": "tellesy@andalus",
    "bank_handle": "andalus",
    "bank_name": "Andalus Bank",
    "account_name_masked": "M*** T******",
    "iban_masked": "LY83*****************2345",
    "auth_modes": ["OTP", "PUSH"]
  },
  "status": "OTP_SENT"
}
```

### Completed status

```json
{
  "session_id": "ses_01HX7R7JVY5G7K2A2Y65HRJ9NQ",
  "status": "COMPLETED",
  "amount": 860000,
  "currency": "LYD",
  "route": {
    "type": "INTERBANK",
    "rail": "LYPAY",
    "debtor_bank": "andalus",
    "creditor_bank": "merchant-bank"
  },
  "fees": {
    "gateway_fee": 1200,
    "bank_fee": 0,
    "settlement_fee": 0
  },
  "completed_at": "2026-05-08T22:04:13Z"
}
```

### Retry-safe error

```json
{
  "error": {
    "code": "PAYER_ACCOUNT_DEBIT_BLOCKED",
    "message": "The selected account cannot be used for debit.",
    "retryable": false,
    "correlation_id": "corr_01HX7R91M3QX5R7N3P5W6YB0YA"
  }
}
```

## Standard statuses

| Status | Meaning | Merchant action |
|---|---|---|
| `PENDING` | Session created, customer has not completed authorization. | Keep order open. |
| `OTP_SENT` / `PUSH_SENT` | Gateway is waiting for bank authentication. | Keep the customer inside the hosted authorization surface. |
| `PROCESSING` | Bank execution or settlement is in progress. | Do not fulfil yet. |
| `COMPLETED` | Final successful payment state. | Fulfil after webhook signature verification. |
| `FAILED` | Final failed state. | Show a recoverable message when possible. |
| `CANCELLED` | Customer or merchant cancelled the session. | Close order gracefully. |

Refunds have their own lifecycle: `CREATED`, `PROCESSING`, `COMPLETED`, and `FAILED`. Do not infer refund completion from the original payment status.

## Bank callback endpoints

Gateway-to-bank calls use `X-OpenWave-Internal-Key: ow_cbk_...`. These endpoints are implemented by bank middleware, not by merchants:

| Endpoint | Purpose |
|---|---|
| `POST /bank/callback/send-otp` | Ask the bank to send OTP to the customer. |
| `POST /bank/callback/verify-otp` | Verify the OTP with the bank. |
| `POST /bank/callback/send-push` | Start bank push authorization when supported. |
| `POST /bank/callback/execute-transaction` | Execute debit and route credit through the configured rail. |
| `POST /bank/callback/refund-transaction` | Execute rail reversal or fallback refund transfer. |
| `POST /bank/callback/notify-credit` | Notify receiving bank or merchant bank that credit has arrived. |

## Recurring mandates

Recurring mandates use the same security model as payments: the customer must approve the mandate in a hosted, scoped consent screen before recurring charges can be made.

| Endpoint | Purpose |
|---|---|
| `POST /recurring/mandates` | Create a mandate request with amount rules, frequency, expiry, and merchant reference. |
| `GET /recurring/mandates/{mandate_id}` | Read mandate state. |
| `POST /recurring/mandates/{mandate_id}/charge` | Charge an active mandate within its approved limits. |
| `DELETE /recurring/mandates/{mandate_id}` | Cancel the mandate and stop future charges. |

### Mandate approval response

```json
{
  "mandate_id": "mnd_01HX7V10K3QVYRW9P9Z1SK5P8B",
  "status": "PENDING_CONSENT",
  "consent_url": "https://gateway.example.com/mandate/mnd_01HX7V10K3QVYRW9P9Z1SK5P8B/consent?token=...",
  "amount_limit": 10000,
  "currency": "LYD",
  "frequency": "MONTHLY",
  "merchant_reference": "care-plus-monthly",
  "expires_at": "2027-05-08T00:00:00Z"
}
```

## Related guides

- [Merchant integration](../guide/merchants.md)
- [Presented payments](../guide/presented-payments.md)
- [Credit & Finance](../guide/credit-finance.md)
- [Authentication](../guide/authentication.md)
- [Webhooks](../guide/webhooks.md)
- [Settlement](../guide/settlement.md)
