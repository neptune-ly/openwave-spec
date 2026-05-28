# Authentication

OpenWave uses different authentication mechanisms depending on who is making the call.

## Summary

| Caller | Mechanism | Header |
|:---|:---|:---|
| Merchant | Static API key | `Authorization: Bearer mk_live_...` |
| Bank Partner | Static bank key | `X-OpenWave-Bank-Key: owbk_...` |
| Customer (session) | Short-lived session token | `X-Session-Token: ost_...` |
| TPP (Open Banking) | OAuth 2.0 access token | `Authorization: Bearer <token>` |
| Customer (Open Banking authorisation) | Short-lived hosted authorisation token | `X-OpenWave-Auth-Session: <token>` |
| Gateway → bank core | Pre-shared internal secret | `X-OpenWave-Internal-Key: <secret>` |
| Gateway admin | Admin key | `X-OpenWave-Admin-Key: <key>` |

## Merchant API Keys

Format: `mk_live_` (production) or `mk_test_` (test mode)

```http
Authorization: Bearer mk_live_abc123...
```

- Issued when a merchant is registered with a gateway
- Scoped to that merchant — cannot access other merchants' data
- **Never use in frontend code or mobile apps**
- Test keys (`mk_test_...`) never affect real funds

## Bank Partner Keys

Format: `owbk_<bank_handle>_...`

```http
X-OpenWave-Bank-Key: owbk_andalus_abc123...
```

- Issued when a bank registers with the gateway
- Used for alias enrollment, account linking, and bank management
- Rotate immediately if compromised: `POST /banks/{handle}/rotate-key`

## Open Banking (OAuth 2.0 + PKCE)

TPPs authenticate via the Authorization Code Flow with PKCE.

```http
Authorization: Bearer <access_token>
X-Consent-Id: con_01HZGV...
```

Both headers are required on every Open Banking data/payment call.

Consent approval itself is not a TPP API. The customer must be redirected or embedded into the gateway-hosted authorisation surface, which issues a short-lived `X-OpenWave-Auth-Session` token for OTP/PUSH SCA. TPPs and merchants must not collect bank OTPs or invoke consent approval steps directly from their own backend.

The hosted authorisation surface must show the requested scopes as customer-readable permissions before SCA. Raw OAuth scope strings are audit data, not sufficient customer disclosure.

### Token Properties

| Property | Value |
|:---|:---|
| Type | Opaque (random string, never JWT) |
| Storage | **SHA-256 hash only** — raw token never persisted by the gateway |
| `access_token` TTL | 15 minutes |
| `refresh_token` TTL | 90 days, single-use rotation |
| Revocation | Instant — `DELETE /ob/consents/{id}` invalidates all tokens |

### PKCE Requirements

- `code_challenge_method` must be `S256`
- `plain` method is rejected with `400 Bad Request`
- Public clients (mobile, SPA) fully supported — no client secret required

## Two-Tier Access Model

OpenWave enforces a strict separation between merchant server-side operations and customer-facing checkout operations.

### Tier 1 — Merchant API (server-to-server)

These endpoints require a merchant API key (`Authorization: Bearer mk_...`):

| Endpoint | Purpose |
|:---|:---|
| `POST /payments/initiate` | Create a checkout session |
| `GET /payments/{session_id}` | Poll session status (no payer PII returned) |
| `POST /payments/{session_id}/cancel` | Cancel a session |
| `GET /payments/fee` | Query fee estimate |
| `POST /recurring/mandates` | Create a recurring mandate |

### Tier 2 — Checkout Flow (customer-facing, SDK only)

These endpoints are **blocked for merchant API keys**. They must be called from the hosted checkout page or an official OpenWave SDK widget using `X-Session-Token`:

| Endpoint | Purpose |
|:---|:---|
| `POST /session/{session_id}/resolve-payer` | Look up payer by alias or IBAN |
| `POST /session/{session_id}/select-auth` | Trigger OTP or push notification |
| `POST /session/{session_id}/confirm-otp` | Submit OTP code and execute payment |

Attempting to call any checkout step endpoint with a merchant API key returns:

```json
HTTP 403 Forbidden
{
  "error": "CHECKOUT_STEP_FORBIDDEN",
  "message": "Checkout session steps must be driven by the customer via the hosted checkout page or the official OpenWave SDK."
}
```

### Why this matters

- **Customer data isolation**: payer IBAN, phone number, and account list are returned to the customer's browser only — never to the merchant's server.
- **Consent integrity**: the customer controls the payment flow; the merchant cannot auto-complete it on their behalf.
- **Standard compliance**: aligns with PSD2 / Open Banking SCA principles.

> **Future — Direct API access for large merchants**: A future `merchant-direct` tier may be available for certified large merchants (analogous to Visa/Mastercard direct integrations), subject to enhanced compliance and customer consent requirements.

### Official SDK channels

| Channel | Package | Use case |
|:---|:---|:---|
| JavaScript SDK | `@neptune.fintech/astro-sdk` | Server-side session create/poll |
| React SDK | `@neptune.fintech/astro-react` | `usePaymentSession()` + `useCheckout()` |
| Hosted checkout page | `astro-ui /pay/{sessionId}` | Full-page redirect checkout |
| Web embed (coming soon) | `@neptune.fintech/astro-web-sdk` | Inline iframe checkout |

## Session Tokens

When a customer authenticates during a payment flow, the checkout page receives a short-lived session token:

```http
X-Session-Token: ost_01HZGV...
```

Session tokens are scoped to a single payment session and expire when the session completes or times out. The gateway issues them automatically — merchants never see or handle them.

## Internal Key (Bank Core ↔ Gateway)

When the gateway calls a bank's core API (for debits, credits, OTP verification), it includes:

```http
X-OpenWave-Internal-Key: <shared-secret>
```

This is a pre-shared secret configured when the bank registers. The bank's core must validate this header on all incoming gateway calls.

## Key Rotation

| Key type | How to rotate |
|:---|:---|
| Merchant API key | `POST /merchants/{id}/rotate-key` (admin) |
| Bank key | `POST /banks/{handle}/rotate-key` (bank) |
| Open Banking tokens | `POST /ob/token` with `refresh_token` grant |

All rotation endpoints return the new key **once**. The old key is immediately invalidated.
