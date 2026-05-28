# Presented Payments API

The Presented Payments API standardizes merchant-presented QR, NFC, and app/wallet handoff payment initiation without moving customer authentication into merchant UI. In v1, the merchant or payment acceptor creates the presentment and the customer pays by scanning or tapping that merchant surface.

## OpenAPI

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-presented-payments-v1.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-presented-payments-v1.yaml" target="_blank">Open in Swagger Editor</a>
  <a class="ow-dl-btn-ghost" href="../downloads.html">Client tools</a>
</div>

## Deployment model

Presented payments are a **channel capability**, not a gateway-only product feature. The merchant-presented channel can be implemented by:

- OpenWave gateways
- banks directly
- wallets or payment apps directly

Operators decide which channels and intents are enabled in each deployment.

## Endpoints at a glance

| Endpoint | Why it exists |
|---|---|
| `GET /capabilities` | So merchants, banks, and wallets know which presented flows are actually enabled |
| `POST /presentments` | To create the QR, NFC, or app/wallet handoff start point |
| `GET /presentments/{id}` | To inspect full metadata |
| `POST /presentments/{id}/claim` | To turn the QR/NFC/app handoff interaction into a real payment or mandate flow |
| `POST /presentments/{id}/cancel` | To terminate a pending presentment safely |
| `GET /presentments/{id}/status` | To poll lifecycle state when needed |

## Main flow

| Step | Endpoint | Caller | Purpose |
|---:|---|---|---|
| 1 | `GET /capabilities` | Merchant, wallet, bank app, gateway | Discover whether QR, NFC, app handoff, merchant-presented, or mandate approval flows are enabled. |
| 2 | `POST /presentments` | Merchant backend or acceptor backend | Create a presentment with amount rules, expiry, merchant-presented mode, intent, and auth requirements. |
| 3 | `POST /presentments/{id}/claim` | Hosted checkout, bank app, wallet, secure SDK sheet | Claim the presentment after scan, tap, or handoff and create the underlying payment or mandate session. |
| 4 | `GET /presentments/{id}/status` | Merchant backend, wallet backend | Poll state when needed until the flow transitions into payment or mandate lifecycle. |
| 5 | existing payment / mandate APIs | Gateway, bank, wallet | Reuse the existing session, SCA, settlement, and webhook model. |

## Example responses

### Read channel capabilities

```json
{
  "operator_id": "andalus-direct",
  "deployment_role": "BANK",
  "presented_payments": {
    "supported_channels": ["QR", "NFC", "APP_HANDOFF"],
    "supported_modes": ["MERCHANT_PRESENTED"],
    "supported_intents": ["ONE_TIME_PAYMENT", "MANDATE_APPROVAL"],
    "enabled": {
      "merchant_presented_qr": true,
      "merchant_presented_nfc": true,
      "app_handoff": true,
      "direct_operator_presentment": true,
      "mandate_approval_presentment": true
    }
  }
}
```

### Create presentment

```json
{
  "presentment_id": "prs_01J15B6A1N2QZ5YP4V4P4FJW40",
  "status": "CREATED",
  "channel": "QR",
  "mode": "MERCHANT_PRESENTED",
  "intent": "ONE_TIME_PAYMENT",
  "amount_mode": "FIXED",
  "amount": 125000,
  "currency": "LYD",
  "description": "In-store checkout",
  "expires_at": "2026-05-15T19:30:00Z",
  "presentment_payload": {
    "uri": "openwave://presentments/prs_01J15B6A1N2QZ5YP4V4P4FJW40?token=claim-token&channel=QR&intent=ONE_TIME_PAYMENT&operator=andalus-direct",
    "reference": "owp_38d6f0f3cf",
    "channel": "QR",
    "claim_token": "claim-token"
  },
  "qr_payload": {
    "format": "OPENWAVE_URI",
    "render_hint": "SVG_OR_PNG",
    "value": "openwave://presentments/prs_01J15B6A1N2QZ5YP4V4P4FJW40?token=claim-token&channel=QR&intent=ONE_TIME_PAYMENT&operator=andalus-direct"
  }
}
```

### Claim presentment

```json
{
  "presentment_id": "prs_01J15B6A1N2QZ5YP4V4P4FJW40",
  "status": "PAYMENT_SESSION_CREATED",
  "payment_session_id": "ses_01J15B7MAB0QSM1VCV2WCH9Y3Q",
  "payment_url": "https://gateway.example.com/pay/ses_01J15B7MAB0QSM1VCV2WCH9Y3Q",
  "auth_surface": {
    "type": "HOSTED_CHECKOUT",
    "url": "https://gateway.example.com/pay/ses_01J15B7MAB0QSM1VCV2WCH9Y3Q"
  },
  "customer_review": {
    "title": "Pay Neptune Store",
    "merchant": {
      "merchant_id": "mer_01J15B6V25S34EVJ4ABR9E7S2Q",
      "display_name": "Neptune Store"
    },
    "intent": "ONE_TIME_PAYMENT",
    "amount_mode": "FIXED",
    "amount": 125000,
    "currency": "LYD",
    "payer_display": "LY83*****************2345",
    "expires_at": "2026-05-15T19:30:00Z"
  }
}
```

The returned URL or auth surface is the only place customer SCA occurs. The customer review summary must be shown before approval. Merchants must not collect OTP, PIN, passcode, push approval, or bank credentials.

### Claim recurring mandate presentment

```json
{
  "presentment_id": "prs_01J15C2G8P8V7MY79KWD4EHW9A",
  "status": "MANDATE_SESSION_CREATED",
  "mandate_id": "mnd_01J15C38RT80N8B0Y6QRG6S4DE",
  "mandate_consent_url": "https://gateway.example.com/mandate/mnd_01J15C38RT80N8B0Y6QRG6S4DE/consent?token=...",
  "auth_surface": {
    "type": "HOSTED_MANDATE_CONSENT",
    "url": "https://gateway.example.com/mandate/mnd_01J15C38RT80N8B0Y6QRG6S4DE/consent?token=..."
  },
  "customer_review": {
    "title": "Approve monthly subscription",
    "merchant": {
      "merchant_id": "mer_01J15C20C9PMK8D41S0NZZ9W06",
      "display_name": "Neptune Store"
    },
    "intent": "MANDATE_APPROVAL",
    "amount_mode": "FIXED",
    "amount": 25000,
    "currency": "LYD",
    "recurrence": {
      "frequency": "MONTHLY",
      "max_amount": 25000,
      "end_date": "2027-05-15"
    },
    "cancellation_rights": "You can cancel future payments from your bank app or OpenWave customer portal.",
    "expires_at": "2026-05-15T19:30:00Z"
  }
}
```

The returned mandate consent URL or auth surface is the only place recurring consent and SCA occur. It must show amount, frequency, duration, account, and cancellation rights before approval. Merchants must not collect OTP, PIN, passcode, push approval, or bank credentials.

### App / wallet handoff presentment

```json
{
  "presentment_id": "prs_01J15D4HN9N7MF8Z8RWYYKAW1G",
  "status": "CREATED",
  "channel": "APP_HANDOFF",
  "mode": "MERCHANT_PRESENTED",
  "intent": "ONE_TIME_PAYMENT",
  "amount_mode": "OPEN",
  "currency": "LYD",
  "description": "Quick in-store payment",
  "expires_at": "2026-05-15T19:30:00Z",
  "app_handoff_payload": {
    "format": "UNIVERSAL_LINK",
    "value": "https://pay.example.com/openwave/present/prs_01J15D4HN9N7MF8Z8RWYYKAW1G",
    "expires_at": "2026-05-15T19:30:00Z"
  },
  "wallet_handoff": {
    "supported_platforms": ["IOS", "ANDROID"],
    "preferred_channel": "APP_HANDOFF",
    "universal_link": "https://pay.example.com/openwave/present/prs_01J15D4HN9N7MF8Z8RWYYKAW1G",
    "android_app_link": "https://pay.example.com/openwave/present/prs_01J15D4HN9N7MF8Z8RWYYKAW1G",
    "ios_app_link": "https://pay.example.com/openwave/present/prs_01J15D4HN9N7MF8Z8RWYYKAW1G"
  }
}
```

App handoff is for platform-specific wallet or bank-app experiences launched from a merchant or acceptor presentment. It still uses the same presentment claim, customer review, authorization, status, and webhook rules as QR and NFC.

### Retry-safe capability-disabled error

```json
{
  "error": {
    "code": "PRESENTED_CHANNEL_DISABLED",
    "message": "Merchant-presented NFC is disabled for this operator.",
    "retryable": false,
    "correlation_id": "corr_01J15B8TCM9DXMZE0M4J3AHF3C"
  }
}
```

## Security model

- QR, NFC, or app/wallet handoff only starts the flow. It does not authorize the payment by itself.
- The customer must see a review summary before approval, including amount, merchant, funding account, expiry, and recurring terms where applicable.
- Merchants must not collect OTP, PIN, passcode, or push-approval results.
- Wallet and bank apps may initiate the scan or tap flow, but final authorization must remain in a bank-controlled or OpenWave-controlled secure surface.
- Each presentment must be time-bound, replay-protected, and idempotent.
- Claim retries with the same valid claim token should return the already-created payment session or mandate consent URL instead of creating another underlying flow.

## Events

Operators may emit presented-payment-specific events before the normal payment or mandate events:

| Event | Meaning |
|---|---|
| `presentment.created` | QR, NFC, or app handoff presentment exists and is waiting to be claimed |
| `presentment.claimed` | A customer device or merchant system claimed the presentment |
| `presentment.expired` | Presentment timed out before claim or completion |
| `presentment.cancelled` | Presentment was explicitly cancelled |

After claim, normal payment or mandate events remain authoritative.

## Related guides

- [Presented payments overview](../guide/presented-payments.md)
- [QR payloads](../guide/presented-qr.md)
- [NFC handoff](../guide/presented-nfc.md)
- [Direct bank and wallet implementation](../guide/presented-direct.md)
