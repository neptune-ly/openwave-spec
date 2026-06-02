# Gateway Operator Guide

Any organisation can run an **OpenWave-compliant gateway**. This page covers what compliance means and how to get started.

## What is a Compliant Gateway?

A gateway is compliant if it:

1. Implements all endpoints defined in [`openwave-payments-v1.yaml`](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-payments-v1.yaml) and [`openwave-open-banking-v1.0.yaml`](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-open-banking-v1.0.yaml)
2. Follows the authentication model specified (API keys, OAuth 2.0 + PKCE for OB)
3. Delivers webhooks with correct `X-OpenWave-Signature` HMAC signing
4. Enforces the amount convention (integers, minor units)
5. Exposes `/banks/{handle}/capabilities` for Open Banking capability discovery
6. Integrates with the OpenWave Identity Registry for NPT alias resolution

## Reference Implementation

OpenWave is implementation-neutral. Reference implementations may be published by gateway operators; they are examples, not normative parts of the standard.

Any implementation can be compliant if it follows the OpenAPI contracts, security requirements, webhook semantics, idempotency rules, and settlement behavior defined by this specification.

## Running Your Own Gateway

### Minimum Requirements

| Component | Requirement |
|:---|:---|
| Runtime | JVM 21+ (Kotlin/Java) or equivalent in your stack |
| Database | PostgreSQL 14+ |
| Cache | Redis (for session state and OTP TTLs) |
| TLS | All endpoints must be HTTPS in production |
| Webhooks | Async delivery with retry queue (Redis Streams or equivalent) |

### Production Control Plane

A production gateway should expose an operator control plane for sandbox/live readiness, client branding, credential rotation, and audit review.

| Control | Requirement |
|---|---|
| Sandbox/live separation | distinct base URLs and credentials; no request flag controls environment |
| Branding | bank, merchant, and TPP logos/display names available to customer-facing approval screens |
| Readiness | `READY`, `INCOMPLETE`, and `DISABLED` states visible per client and environment |
| Security | secure-link password reset, passkeys, active sessions, recent auth events |
| Audit | create/update/rotate/reset/upload actions logged without raw secrets |

See [Production Readiness](./production-readiness.md) for the deployment baseline.

### Architecture Overview

```
                    ┌─────────────────────────────┐
Merchant ──────────►│                             │
                    │     OpenWave Gateway        │──────► Bank Core A
TPP ───────────────►│                             │──────► Bank Core B
                    │  - Payment sessions         │──────► Bank Core C
Customer ──────────►│  - OB consent + tokens      │
                    │  - NPT alias resolution      │──────► Identity Registry
                    │  - Webhook delivery          │
                    │  - Settlement batching       │──────► Settlement Layer
                    └─────────────────────────────┘
```

### Connecting to the Identity Registry

To resolve NPT aliases and register bank handles, your gateway must connect to the **OpenWave Identity Registry**:

```
Production: https://registry.openwave.ly
```

Or [run your own registry](https://github.com/neptune-ly/openwave-identity).

### Settlement

OpenWave does not prescribe a settlement mechanism — this is a bilateral agreement between banks and the gateway operator. Common approaches:

- **Net settlement via RTGS** — gateway calculates net positions per bank cycle and submits to central bank
- **Gross settlement** — each payment triggers an immediate interbank transfer
- **Prefunded model** — banks maintain a balance at the gateway; depleted by outgoing payments

## Interoperability Between Gateways

Two compliant gateways can interoperate:

```
Gateway A (merchant on G-A) ──┐
                               ├──► [Identity Registry: resolve alias]
Gateway B (payer's bank)    ──┘     ──► routed to Bank B via Gateway B
```

Protocol:
1. Gateway A resolves the NPT alias → gets `{ iban, bank_handle }`
2. Gateway A looks up which gateway Bank B is connected to
3. Gateway A calls Gateway B's payment initiation endpoint using standard OpenWave API
4. Gateway B debits the customer and delivers the settlement

This requires a **cross-gateway routing table** — maintained via the Identity Registry's bank phonebook (`GET /v1/banks`).

## CBL Infrastructure Dependencies

If operating in Libya, your gateway must integrate with CBL's National Payment Infrastructure to enable cross-bank payments.

### NAD Integration

Your gateway calls NAD (National Alias Directory) to resolve alias/phone/NID → IBAN + bank code before routing any LyPay transfer.

```
alias "mtellesy"  →  NAD lookup  →  { iban: "LY83...", institution: { code: "ABCD" } }
```

The Nexus reference implementation uses `UniversalLookupService` which queries NAD via the `NadIndividualHandler` / `NadMerchantHandler` strategy pattern. Cache NAD responses (short TTL: 60 seconds) to reduce latency.

### LyPay Outbound

When the gateway instructs a bank to debit a customer for a cross-bank payment:

1. Bank CBS debits customer
2. Bank sends LyPay transfer instruction to CBL
3. CBL routes to creditor bank
4. Creditor bank credits merchant

Your gateway **does not need to call LyPay directly** — the debtor bank handles the LyPay instruction. You instruct the bank via the standard `debit` core callback.

### LyPay Inbound Callback

CBL LyPay (or the creditor bank) sends a credit notification to your gateway when funds land. You must:

1. Register a webhook endpoint with CBL LyPay for your gateway
2. Handle the `credit_notice` payload
3. Find the matching session by `payment_reference`
4. Update session status to `COMPLETED`
5. Fire `payment.completed` webhook to the merchant

```kotlin
// Pattern from Nexus LyPayTransactionNotificationService
when (statusCode) {
    "03" -> { // completed — credit confirmed
        session.status = COMPLETED
        webhookService.fire("payment.completed", session)
    }
    "04", "05" -> { // declined / failed
        session.status = FAILED
        webhookService.fire("payment.failed", session)
    }
}
```

::: warning Idempotency is critical
CBL LyPay may send duplicate callbacks on retry. Use the `payment_reference` as an idempotency key — process each reference only once.
:::

### Settlement Model with LyPay

LyPay handles the **actual money movement** between banks. Your gateway tracks the **logical state** of each payment session. Settlement reconciliation options:

| Model | Description |
|---|---|
| **Real-time (gross)** | Each payment triggers one LyPay transfer; no net settlement needed |
| **Net batch** | Gateway batches obligations; single LyPay transfer per bank per cycle |
| **Prefunded** | Banks maintain escrow balance at gateway; LyPay only for rebalancing |

In a real-time gross settlement model, each confirmed payment maps to one interbank transfer. Operators may also use net or prefunded models when they preserve merchant-facing OpenWave status and reconciliation semantics.

## Compliance Checklist

- [ ] All spec endpoints implemented with correct HTTP methods and status codes
- [ ] `api_version` field included in all webhook payloads
- [ ] PKCE S256 enforced — plain method rejected
- [ ] Webhook HMAC signing with SHA-256
- [ ] `X-Consent-Id` validated on all Open Banking data/payment calls
- [ ] Token storage: SHA-256 hash only — raw access token never persisted
- [ ] Access token TTL ≤ 15 minutes
- [ ] Refresh token single-use rotation enforced
- [ ] `DELETE /ob/consents/{id}` immediately invalidates all associated tokens
- [ ] Amount convention: integers in minor units validated and enforced
- [ ] `/banks/{handle}/capabilities` endpoint publicly accessible
- [ ] Identity Registry connected for alias resolution
