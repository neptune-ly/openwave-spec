# Changelog

All notable changes to the OpenWave specification are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added — NPT handle lifecycle
- Identity 1.1.0 adds typed handle availability and bank-authenticated rename operations.
- Payments 1.1.0 adds the Astro-compatible alias availability and rename gateway surface.
- Previous handles are retired permanently after rename, never reissued, never redirected, and never disclosed through a successor lookup.
- Availability distinguishes `AVAILABLE`, `TAKEN`, `RETIRED`, and `INVALID`; gateway integrations preserve `UNKNOWN` when Identity cannot be asked.
- Deterministic OpenAPI linting and an executable NPT lifecycle contract check now gate documentation builds.
- The Identity rename contract now records the shipped camelCase request/response DTO, forced portal reauthentication, and fresh delegated-app consent after a changed handle.
- The bank-app login approval contract now covers multi-bank selection, bank-scoped queue reads, exact terminal errors, and the rule that Identity never collects bank credentials.

### Added — Credit & Finance API
- New `openwave-credit-finance-v1.yaml` draft module for credit assessment, affordability summaries, BNPL installment offers, revolving-credit drawdowns, Murabaha installment disclosures, finance contracts, repayment schedules, and finance lifecycle webhooks.
- New Open Banking scopes for finance use cases: `credit_assessment:read`, `income:read`, `liabilities:read`, and `affordability:read`.
- New docs pages for Credit & Finance overview, credit-assessment consent, BNPL, revolving credit, Murabaha, financed-payment lifecycle, and risk/privacy/explainability.
- API reference and downloads pages now include Credit & Finance OpenAPI links for Swagger Editor, Postman import, and Redocly validation.

### Added — Identity API
- `GET /admin/customers/lookup/nid/{national_id}` — KYC-based cross-bank identity deduplication. Banks can check if a customer is already enrolled in the network by national ID, receiving their existing NPT handle. This ensures one person has one global payment identity regardless of how many banks they enroll with.
- `NidLookupResponse` schema documenting the response shape.
- Non-citizen support note: the system is designed to accept alternative unique identifiers (passport, resident ID) in future.

### Added — Payments API
- Mandate `consent_redirect_url` now stored on mandate entity and used post-consent redirect.
- Customer-facing mandate consent page served at `GET /mandate/{id}/consent?token=...`.

---

## Identity Registry API

### [1.1.0] — 2026-08-07

- Added `GET /identity/handles/{handle}/availability` with `AVAILABLE`, `TAKEN`, `RETIRED`, and `INVALID` verdicts.
- Added `PATCH /identity/{npt_handle}/handle` with linked-bank and national-ID authorization, a 30-day cooldown, and a lifetime cap of three successful renames.
- Added `HANDLE_RETIRED`, `HANDLE_RENAME_NOT_PERMITTED`, and `HANDLE_RENAME_TOO_SOON` errors.
- A renamed handle is permanently reserved and resolves as `410 HANDLE_RETIRED` without redirecting to or revealing the replacement.
- Identity deactivation is clarified as non-releasing: the name remains reserved after resolution stops.

### [1.0.0] — 2026-04-24

Initial stable release of the OpenWave Identity Registry API.

**Modules included:**
- NPT handle claiming (bank-initiated, bank-vouched)
- Multi-bank account linking per identity
- Default account management
- Public alias resolution (`mtellesy` → IBAN, `mtellesy@nub` → IBAN)
- Bank handle registry (phonebook of `bank-handle → core URL`)
- Registry metadata and governance info endpoint

**Key design decisions:**
- **Global username, multi-bank** — one handle spans multiple banks; `@bank-handle` suffix routes to a specific account, omitting it uses the default
- **Banks vouch, registry routes** — no KYC data stored; registry only holds `username → { bank, iban, is_default }`
- **Resolution is public** — `GET /identity/resolve` requires no auth; designed for gateway caching (60s TTL)
- **IBANs never in public profile** — `GET /identity/{handle}` returns masked data; full IBAN only via resolution endpoint
- **Governance-first** — registry publishes open source code, open governance charter, and explicit stewardship transfer plan to Central Bank of Libya or bank consortium
- **First-come, first-served** — handles are globally unique; bank-mediated dispute resolution documented in GOVERNANCE.md
- **11 typed error codes** — covering all failure modes

---

## Payments API

### [1.1.0] — 2026-08-07

- Added `GET /alias/{alias_username}/availability`, including the safe `UNKNOWN` dependency state.
- Added `PATCH /alias/rename` with exact `400`, `403`, `404`, `409`, `410`, `429`, `502`, and `503` outcomes.
- Successful responses confirm `previous_retired: true`; dependency failures confirm that no rename was made.

### [1.0.0] — 2026-04-23

Initial stable release of the OpenWave Payments API.

**Modules included:**
- Payments (payment session lifecycle)
- Recurring Mandates
- Alias (NPT alias enrollment and management)
- Webhooks (event schema reference)
- Bank Partner Registration

**Key design decisions:**
- Amounts in minor units (integers) throughout
- NPT alias format: `username@bank-handle`
- Three security schemes: MerchantApiKey, BankPartnerKey, SessionToken
- Idempotency via `Idempotency-Key` header (24h window)
- Webhook signature: HMAC-SHA256 in `X-OpenWave-Signature`

---

## Open Banking API

### [1.0.0] — 2026-04-23

Stable release of the OpenWave Open Banking API. Supersedes draft v0.9.0.

**Modules included:**
- TPP Registration (`POST /ob/tpp/register`, `GET/PATCH /ob/tpp/{client_id}`)
- Consent lifecycle — create, get, revoke (`POST/GET/DELETE /ob/consents/{id}`)
- OAuth 2.0 token operations — exchange, refresh, revoke (`POST /ob/token`, `POST /ob/token/revoke`)
- Accounts AISP — list and detail (`GET /ob/accounts`, `GET /ob/accounts/{id}`)
- Balances AISP (`GET /ob/accounts/{id}/balances`)
- Transactions AISP — paginated, date-filtered, pending support (`GET /ob/accounts/{id}/transactions`)
- Payment Orders PISP — immediate and scheduled (`POST/GET /ob/payment-orders`)
- Bank Capabilities — OB scope discovery (`GET /banks/{handle}/capabilities`)

**Key design decisions:**
- **OAuth 2.0 Authorization Code + PKCE (S256 only)** — no client secrets in frontend/mobile; plain challenge rejected
- **Opaque tokens (not JWT)** — stored as SHA-256 hashes; instantly revocable; access_token 15 min, refresh_token 90 days, rotated on use
- **`X-Consent-Id` header** on all data/payment calls — explicit audit trail per consent, not just per token
- **SCA** — bank declares `sca_exemption_limit` in capabilities; `PENDING_SCA` status + `sca_url` returned when required
- **State machine** — consent transitions: `AWAITING_AUTHORISATION` → `AUTHORISED` → `REVOKED|EXPIRED`; all invalid transitions return typed error codes
- **Token revocation** — `DELETE /ob/consents/{id}` invalidates all tokens for that consent instantly; individual token revoke also supported (RFC 7009 compliant)
- **Full error code table** — 17 typed OB error codes covering all failure modes
- **Webhook events** — 7 OB event types with same HMAC-SHA256 envelope as Payments module
- **Bank-agnostic** — `BankCoreClient` interface extended with AISP/PISP methods; any bank adapter can implement; bank declares capabilities
- Scopes: `accounts:read`, `balances:read`, `transactions:read`, `payments:write`, `mandates:write` (mandates:write reserved for future)

---

## Roadmap

| Feature | Target version | Notes |
|---|---|---|
| ~~Open Banking v1.0 stable~~ | ~~OB 1.0.0~~ | ✅ Done |
| ~~Identity Registry v1.0 stable~~ | ~~Identity 1.0.0~~ | ✅ Done |
| ~~NPT availability, safe rename, and permanent retirement~~ | ~~Identity / Payments 1.1.0~~ | ✅ Done |
| GOVERNANCE.md — dispute resolution & stewardship charter | Identity 1.0.1 | Governance document |
| Standing Orders (PISP) | OB 1.1.0 | Scheduled recurring payments |
| Variable Recurring Payments | OB 1.2.0 | Mandate-based PISP (`mandates:write` scope) |
| Cross-gateway identity federation | Identity 1.2.0 | Gateway-to-gateway handle discovery without central registry |
| Refund API | Payments 1.1.0 | Merchant-initiated refunds |
| Settlement reporting API | Payments 1.1.0 | Detailed settlement breakdowns |
| Handle transfer / dispute API | Identity 1.2.0 | Formal bank-mediated dispute mechanism |
