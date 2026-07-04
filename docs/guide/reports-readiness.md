# Merchant Reports and Operational Readiness

OpenWave implementations should give merchants a backend-accessible recovery path for payments, settlements, and webhooks. Real-time webhooks remain the primary notification channel, but report APIs let merchants reconcile missed events, recover orders, and prove operational state during support or finance review.

## Merchant report APIs

Merchant reports are authenticated with the merchant API key and scoped to that merchant only.

| Report | Purpose | Common filters |
|---|---|---|
| Payment report | Reconcile orders, payment IDs, bank references, and final status. | `status`, `environment`, `from`, `to`, `page`, `limit` |
| Settlement report | Reconcile gross amount, gateway fee, bank cut, net amount, and payout batch. | `from`, `to`, `page`, `limit` |
| Webhook delivery log | Recover failed or missed events and inspect retry state. | `status`, `event_type`, `webhook_endpoint_id`, `page`, `limit`, `include_payload` |
| Readiness report | Show whether sandbox/live integration is complete. | none |

Implementations may expose CSV export with `format=csv`, but JSON pagination is the minimum interoperable behavior.

## Payment report

```http
GET /reports/payments?status=COMPLETED&environment=LIVE&page=0&limit=25
Authorization: Bearer mk_live_...
```

Each row should include the payment/session ID, merchant reference, amount, currency, status, environment, payer/creditor bank handles where safe, OpenWave transfer references, and creation/finalization timestamps.

## Settlement report

```http
GET /reports/settlements?page=0&limit=25
Authorization: Bearer mk_live_...
```

Each row should include the settlement batch or item ID, payment session ID, gross amount, gateway fee, bank cut, net amount, bank handle, settlement date, status, and timestamps.

## Readiness report

Readiness is an operational status, not a payment protocol status. A merchant should see missing items before live enablement.

Minimum readiness checks:

- webhook URL configured,
- contact email configured,
- settlement account or merchant IBAN configured where required,
- sandbox or live environment enabled,
- live credential present before live processing,
- SDK origins configured when browser SDK access is enabled,
- branding configured for customer-facing surfaces.

## Webhook endpoint management

Operators should expose a merchant-scoped endpoint management surface. A minimum implementation may expose one default endpoint per merchant, while larger implementations should support multiple managed endpoints with event subscriptions and endpoint-specific delivery logs.

Recommended endpoint fields:

```json
{
  "id": 42,
  "label": "Production orders",
  "url": "https://merchant.example/webhooks/openwave",
  "status": "ACTIVE",
  "is_default": false,
  "secret_set": true,
  "event_types": ["payment.*", "refund.*", "mandate.*", "webhook.test"]
}
```

Operational rules:

- Webhook URLs should be HTTPS except for explicit local/sandbox testing.
- Raw signing secrets should only be shown once on creation or rotation.
- Disabling an endpoint should stop delivery attempts, but webhook events should remain visible in merchant recovery logs where the implementation stores them.
- Merchants should be able to send `webhook.test` and retry failed deliveries from the delivery log.
- Delivery rows should include the endpoint identifier and safe target URL metadata so merchants can diagnose which receiver missed an event.
- Legacy single-webhook implementations should preserve their existing URL/secret fields as compatibility wrappers while new managed endpoints take over delivery routing.

## Multiple merchant settlement accounts

An OpenWave operator may let one merchant hold multiple settlement accounts, for example separate IBANs for web checkout, POS, marketplace, or branch channels. This is an operator and bank configuration capability; it does not change the core payment session contract.

Recommended merchant account object:

```json
{
  "id": 123,
  "label": "Website checkout",
  "bank": {
    "name": "Example Bank",
    "handle": "example",
    "code": "001"
  },
  "account": {
    "iban_masked": "LY83••••0001",
    "account_number_masked": "••••1234"
  },
  "is_default": true,
  "status": "ACTIVE"
}
```

Compatibility rules:

- Existing merchant API keys should continue to route to the merchant default account.
- Exactly one active default account should exist per merchant.
- Only the gateway/operator or bank-authorized operations staff should add or edit bank account details unless the local regulatory model allows merchant self-service.
- Merchants may choose the default account and may create checkout channel credentials that route to a specific account when the operator enables that capability.
- Payment, settlement, and webhook reports should include merchant-safe account/channel identifiers so merchants can reconcile which checkout path and settlement account were used.

Recommended account-change workflow:

- Merchants may submit account-change requests for new settlement accounts, account replacement, or account suspension.
- Requests should have clear statuses such as `PENDING_REVIEW`, `APPROVED`, `REJECTED`, and `CANCELLED`.
- Approval should be performed by the operator or bank-authorized operations staff before any IBAN or settlement route becomes active.
- Merchant portals should show request history and review notes, while avoiding raw secrets or unrelated customer account data.
- Admin/operator portals should audit who approved or rejected the request and which settlement account was created or changed.

## Checkout channel credentials

Checkout channel credentials are implementation optional. They are useful when one merchant needs multiple purchase keys, each bound to a settlement account and environment.

Example:

```http
POST /payments/initiate
Authorization: Bearer mk_test_channel_or_live_channel_key
```

The request body remains the normal OpenWave payment request. The selected settlement account is derived from the credential, not from merchant-supplied bank account fields in the payment request. Operators should show raw channel keys only once at creation or rotation time, and should expose masked key state afterward.

## Bank-origin events

Banks may notify merchants about account-affecting transactions through a bank adapter. The adapter can be Nexus, another middleware, or a direct bank service. The OpenWave standard only defines the normalized event envelope and merchant-facing fields; it does not require any specific bank middleware.

The normalized flow is:

```text
Bank rail/CBS event -> bank adapter -> OpenWave gateway -> merchant webhook
```

The merchant receives `merchant.account.transaction.posted` or `merchant.account.transaction.updated`, not a raw rail/CBS payload.

## Bank callback health

OpenWave gateways should expose bank-scoped operational health for gateway-to-bank callbacks. This is an implementation feature, not a protocol dependency, because each bank adapter may be Nexus, another middleware, or a direct core service.

Recommended callback health fields:

```json
{
  "configured": true,
  "mode": "BANK_ADAPTER_IMPLEMENTATION",
  "status": "OBSERVED",
  "total_events": 120,
  "delivered": 118,
  "failed": 2,
  "ready_tests": 3
}
```

Recommended event log fields:

```json
{
  "id": 9001,
  "event_type": "bank.callback",
  "callback_path": "/execute-transaction",
  "target_url": "https://bank.example/openwave/execute-transaction",
  "status": "DELIVERED",
  "response_status": 200,
  "message": "Callback completed",
  "created_at": "2026-06-03T10:00:00Z"
}
```

Bank portals may include a readiness test action. A readiness test should record configuration state and operator intent, but it should not require OpenWave to send money movement, OTP, or customer-sensitive data.

## Operational expectations

- Report endpoints must be paginated and bounded.
- Failed webhook deliveries must remain visible long enough for normal merchant reconciliation windows.
- Payload recovery must be merchant-scoped.
- Bank callback health logs must be bank-scoped and must not expose internal keys, raw API keys, OTPs, customer secrets, or raw core payloads.
- CSV export must not expose secrets, raw API keys, private keys, OTPs, or sensitive customer account data.
- Operators should expose incident queues and dashboards, but those are implementation-specific portal features.
