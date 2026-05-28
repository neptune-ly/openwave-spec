<div align="center">

<img src="./docs/public/neptune-logo.png" alt="Neptune. Financial Technology And Solutions" width="520">

# OpenWave

### Open Payment & Open Banking Standard

**Bank-agnostic · Interoperable · Built for the Libyan Banking Ecosystem**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Spec](https://img.shields.io/badge/OpenAPI-3.0.3-green.svg)](https://neptune-ly.github.io/openwave-spec/)
[![Status](https://img.shields.io/badge/Payments%20API-v1.0%20Stable-brightgreen.svg)]()
[![Status](https://img.shields.io/badge/Open%20Banking%20API-v1.0%20Stable-brightgreen.svg)]()

*Developed by [Neptune. Fintech](https://www.neptune.ly)*

</div>

---

## What is OpenWave?

**OpenWave** is an open standard that defines a unified API surface for payments and open banking, built specifically for the **Libyan banking ecosystem** and designed to extend across other emerging markets.

Libya's banking sector has historically lacked interoperability — customers are locked to their bank's app, merchants integrate with each bank separately, and there is no shared payment identity layer. OpenWave solves this.

It allows any Libyan bank to expose a standardised interface so that:

- **Merchants** can accept payments from any bank via IBAN or NPT alias — one integration, all banks
- **Banks** can join the network as payment partners without custom bilateral agreements
- **Third-Party Providers (TPPs)** can securely access account data and initiate payments on behalf of customers — with explicit, revocable customer consent

OpenWave is **bank-agnostic and gateway-agnostic by design**. Any institution or fintech operator can run a compliant gateway independently. Multiple gateways can interoperate — a merchant on one gateway can reach a customer at a bank connected to another, because the standard is the contract, not the operator.

---

## API Modules

| Module | Version | Status | Description |
|:---|:---:|:---:|:---|
| **Payments** | 1.0.0 | ✅ Stable | Online payment sessions via IBAN or NPT alias |
| **Presented Payments** | 1.0.0 | Draft | QR and NFC presentment for one-time payments and mandate approval |
| **Recurring Payments** | 1.0.0 | ✅ Stable | Mandate-based recurring charges |
| **Alias (NPT — National Payment Tag)** | 1.0.0 | ✅ Stable | Universal payment identity enrollment & resolution |
| **Webhooks** | 1.0.0 | ✅ Stable | Real-time event notifications with HMAC signature |
| **Open Banking — AISP** | 1.0.0 | ✅ Stable | Account info, balances, transactions |
| **Open Banking — PISP** | 1.0.0 | ✅ Stable | TPP-initiated payment orders |
| **Credit & Finance** | 1.0.0 | Draft | Credit assessments, BNPL, revolving credit, Murabaha, repayments |
| **Identity Registry** | 1.0.0 | ✅ Stable | Global NPT handle ownership, multi-bank accounts, alias resolution |
| **Gateway Interconnect** | 1.0.0 | Draft | Gateway discovery, remote routing, and gateway-to-gateway settlement |

---

## Spec Files

The specification files are valid OpenAPI documents — load them directly into Swagger UI, Postman, Redocly, or any OpenAPI-compatible tooling.

| File | Covers |
|:---|:---|
| [`openwave-payments-v1.yaml`](./openwave-payments-v1.yaml) | Payments · Recurring · Alias · Webhooks |
| [`openwave-presented-payments-v1.yaml`](./openwave-presented-payments-v1.yaml) | Merchant-presented QR · NFC handoff · app handoff · capability discovery |
| [`openwave-open-banking-v1.0.yaml`](./openwave-open-banking-v1.0.yaml) | Open Banking AISP + PISP · OAuth 2.0 + PKCE |
| [`openwave-credit-finance-v1.yaml`](./openwave-credit-finance-v1.yaml) | Credit assessment · BNPL · Revolving credit · Murabaha · repayment schedules |
| [`openwave-identity-v1.0.yaml`](./openwave-identity-v1.0.yaml) | Identity Registry · NPT handle ownership · Multi-bank aliases · Governance |
| [`openwave-gateway-interconnect-v1.yaml`](./openwave-gateway-interconnect-v1.yaml) | Gateway discovery · Remote alias resolution · Cross-gateway routing · Settlement |

---

## Core Concepts

### NPT — National Payment Tag

An **NPT (National Payment Tag)** handle is a **global payment identity** — not just an alias for one account. A person owns a username and can link accounts from multiple banks to it.

| Format | Resolves to |
|:---|:---|
| `mtellesy` | The user's **default** bank account |
| `mtellesy@andalus` | Specifically the user's Andalus account |
| `mtellesy@nub` | Specifically the user's NUB account |

Inspired by the email model — `@bank-handle` is the routing suffix, the same way `@gmail.com` routes to Gmail. A sender who just knows your username can always reach you regardless of which bank you use.

**Key properties:**
- One username, many banks — add any bank account you hold to your identity
- You control your default — change which account receives payments with no `@` suffix
- First-come, first-served — handles are globally unique, claimed through your bank's KYC
- The Identity Registry stores only routing data — no balances, no transaction history

### OpenWave Gateway

Any server that implements this specification is an **OpenWave Gateway**. Gateways are responsible for:

- Routing payments between merchants and bank cores
- Managing session lifecycle and authentication
- Enforcing SCA (Strong Customer Authentication)
- Delivering webhook events to merchants

### Deployment Models

OpenWave supports both **centralised** and **decentralised** deployments — and they can interoperate.

**Centralised (shared gateway)**
A single gateway connects multiple banks. Merchants integrate once and reach all participating banks. Banks register with the gateway. This is the simplest model for a national payment network.

```
Merchant ──→ [ OpenWave Gateway ] ──→ Bank A
                                  └──→ Bank B
                                  └──→ Bank C
```

**Decentralised (federated gateways)**
Each bank or fintech operator runs its own gateway. Gateways interoperate by honouring the same standard — an NPT alias from one gateway can be resolved and settled across another, because the protocol is identical.

```
Merchant A ──→ [ Gateway 1 ] ──┐
                                ├──→ [ Shared Settlement Layer ]
Merchant B ──→ [ Gateway 2 ] ──┘
```

**What this means in practice:**
- A customer at Bank A can pay a merchant connected to Gateway 2, even if Bank A is registered with Gateway 1
- Any compliant gateway can verify an NPT alias, initiate a payment session, and deliver settlement
- No single operator controls the network — the standard is the contract

### Amount Convention

> **All monetary amounts are integers in minor units (cents/fils).**

| Value | Meaning |
|:---|:---|
| `50000` | 50.000 LYD |
| `100` | 1.00 USD |
| `75050` | 750.50 EUR |

Always pair `amount` with a `currency` field (ISO 4217).

---

## Authentication

| Context | Mechanism | Header |
|:---|:---|:---|
| Merchant API | Static API key | `Authorization: Bearer <key>` |
| Bank Partner | Static bank key | `X-OpenWave-Bank-Key: <key>` |
| Customer session | Short-lived session token | `X-Session-Token: <token>` |
| TPP (Open Banking) | OAuth 2.0 + PKCE access token | `Authorization: Bearer <token>` |
| Finance provider | Provider/participant bearer key + consent ID | `Authorization: Bearer <finance key>` |
| Bank core → gateway | Pre-shared internal key | `X-OpenWave-Internal-Key: <secret>` |
| Gateway / bank / wallet presentment operator | Presented-payment capability policy | `GET /capabilities` + operator policy |

---

## Open Banking

OpenWave's Open Banking module is inspired by **PSD2** and **UK Open Banking**, adapted for emerging market banks.

### How it works

```
1.  TPP creates a consent        →  POST /ob/consents
                                     ← { consent_id, consent_url }

2.  Customer approves at bank    →  bank redirects to redirect_uri
                                     ?code=AUTH_CODE&consent_id=...

3.  TPP exchanges for tokens     →  POST /ob/token  (PKCE S256 verified)
                                     ← { access_token, refresh_token }

4.  TPP accesses data/payments   →  GET /ob/accounts
                                     GET /ob/accounts/{id}/balances
                                     GET /ob/accounts/{id}/transactions
                                     POST /ob/payment-orders
                                     Header: Authorization: Bearer <access_token>

5.  Consent revoked at any time  →  DELETE /ob/consents/{id}
                                     ← all tokens immediately invalidated
```

### Scopes

| Scope | Access granted |
|:---|:---|
| `accounts:read` | List accounts and account details |
| `balances:read` | Account balances |
| `transactions:read` | Transaction history (with date filtering) |
| `payments:write` | Initiate payment orders |
| `credit_assessment:read` | Permit a declared finance eligibility assessment |
| `income:read` | Derive income summaries |
| `liabilities:read` | Derive obligations and debt-service indicators |
| `affordability:read` | Derive affordability output for a requested amount and tenor |

### Token Design

| Property | Value |
|:---|:---|
| Type | Opaque (never JWT) |
| Storage | SHA-256 hash only — raw token never persisted |
| `access_token` TTL | 15 minutes |
| `refresh_token` TTL | 90 days, single-use rotation |
| Revocation | Instant — `DELETE /ob/consents/{id}` invalidates all tokens |
| Token revoke | `POST /ob/token/revoke` (RFC 7009 compliant) |

---

## Credit & Finance

Credit & Finance connects consented Open Banking data with financed-payment products. It is not a credit bureau and does not define one universal score. It standardizes the assessment package, safe reason codes, finance offers, customer acceptance, contracts, repayment schedules, and finance webhooks.

Supported v1 products:

| Product | Description |
|:---|:---|
| `BNPL_INSTALLMENT` | Merchant checkout paid by financier and repaid by the customer in installments |
| `REVOLVING_CREDIT_DRAW` | Drawdown against an existing approved facility |
| `MURABAHA_INSTALLMENT` | Islamic-finance asset sale with cash price, profit, total sale price, and installment schedule |

Financed checkout reuses normal OpenWave payment settlement: the financier pays the merchant, the merchant fulfils after final `payment.completed`, and customer repayments use mandates or scheduled payment orders.

### Security

- **PKCE S256 mandatory** — plain challenge method rejected
- **No client secrets in frontend or mobile** — public clients are fully supported
- **`X-Consent-Id` header required** on every data/payment call — creates an explicit audit trail beyond the token
- **SCA support** — bank advertises `sca_exemption_limit` via `/banks/{handle}/capabilities`; payments above the limit return `PENDING_SCA` status with an `sca_url`

### Bank Capabilities

Before creating a consent, check what a bank actually supports:

```http
GET /banks/{handle}/capabilities
```

```json
{
  "bank_handle": "andalus",
  "ob_enabled": true,
  "ob_scopes_supported": ["accounts:read", "balances:read", "transactions:read", "payments:write", "credit_assessment:read", "income:read", "liabilities:read", "affordability:read"],
  "sca_exemption_limit": 5000,
  "max_consent_expiry_days": 365
}
```

---

## Webhooks

All events share a common envelope:

```json
{
  "id": "evt_01J15D7QZ8S3SM58GQZZZWY6F3",
  "event_id": "evt_01J15D7QZ8S3SM58GQZZZWY6F3",
  "event": "payment.completed",
  "api_version": "1.0.0",
  "timestamp": "2026-04-23T20:00:00Z",
  "data": {}
}
```

Verify authenticity with the `X-OpenWave-Signature` header:

```
X-OpenWave-Signature: sha256=<HMAC-SHA256(raw_body, webhook_secret)>
```

### Event Reference

**Payments**

| Event | Trigger |
|:---|:---|
| `payment.completed` | Final creditor-bank credit confirmed |
| `payment.reconciliation_required` | Gateway cannot determine final bank execution result; merchant must not fulfil until operator reconciliation |
| `payment.failed` | OTP failure, timeout, or CBS error |
| `payment.expired` | Session timed out before completion |
| `payment.settlement_pending` | Cross-bank transfer is in flight; final credit is not confirmed yet |
| `refund.created` | Refund request was accepted |
| `refund.processing` | Refund reversal is underway |
| `refund.completed` | Refund completed successfully |
| `refund.failed` | Refund failed with a merchant-safe reason |
| `presentment.created` | QR or NFC presentment was created |
| `presentment.claimed` | Presentment was claimed |
| `presentment.expired` | Presentment expired |
| `presentment.cancelled` | Presentment was cancelled |

**Recurring**

| Event | Trigger |
|:---|:---|
| `mandate.activated` | Customer consented to recurring charges |
| `mandate.cancelled` | Cancelled by any party |
| `mandate.charge.completed` | Charge executed successfully |
| `mandate.charge.failed` | Charge attempt failed |

**Credit & Finance**

| Event | Trigger |
|:---|:---|
| `credit_assessment.completed` | Assessment output is ready |
| `finance_offer.created` | Offer is ready for customer review |
| `finance_offer.accepted` | Customer accepted terms and repayment schedule |
| `finance_contract.active` | Finance contract became active |
| `finance_contract.cancelled` | Finance contract was cancelled |
| `repayment.completed` | Scheduled repayment collected |
| `repayment.failed` | Scheduled repayment failed |

**Open Banking**

| Event | Trigger |
|:---|:---|
| `consent.granted` | Customer approved TPP access |
| `consent.revoked` | Revoked by TPP, customer, or bank |
| `consent.expired` | Consent reached its expiry date |
| `payment_order.completed` | Funds transferred successfully |
| `payment_order.failed` | Processing error |
| `payment_order.pending_sca` | Bank requires SCA before execution |
| `payment_order.rejected` | Bank declined the payment order |

---

## Versioning

OpenWave follows **Semantic Versioning**:

| Change type | Version bump | Example |
|:---|:---:|:---|
| Breaking change to existing endpoint | `MAJOR` | 1.x → 2.0 |
| New endpoint or optional field | `MINOR` | 1.0 → 1.1 |
| Clarification, fix, or example update | `PATCH` | 1.0.0 → 1.0.1 |

The `api_version` field in webhook envelopes and the `info.version` in each spec file always reflect the module version.

---

## Contributing

We welcome proposals, corrections, and discussion from the community.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

OpenWave is released under the **Apache License 2.0**.  
See [LICENSE](./LICENSE) for the full text.

---

<div align="center">

Developed and maintained by **[Neptune. Fintech](https://www.neptune.ly)**

</div>
