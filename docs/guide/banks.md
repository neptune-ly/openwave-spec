# Bank Integration Guide

Join the OpenWave network as a payment partner. Once registered, your customers can pay and receive payments from any merchant or user in the ecosystem.

Banks can also implement the **presented-payments channel directly** when enabled by operator policy. In that model, the bank still follows the same OpenWave security rules and final payment or mandate lifecycle, but the bank owns the presenting app surface and capability advertisement.

## What a Bank Needs to Provide

OpenWave is a **routing layer** — it doesn't replace your core banking system. The gateway calls your core to:

1. Verify customer identity (OTP or SCA)
2. Debit the sending account
3. Credit the destination account (if it's your bank)
4. Reverse or refund completed payments where policy and rail support allow
5. Query account details for Open Banking

You expose a **bank core callback API** that the gateway calls. The spec defines exactly what this interface must look like.

## Step 1 — Register with a Gateway

Contact the gateway operator (or run your own — see [Gateway Operators](./operators.md)).

You'll need to provide:
- Bank handle (e.g. `andalus`) — globally unique short identifier
- Display name
- Country (`LY`)
- Core API base URL (your OpenWave callback server, for example `https://bank.example.com/api/v1/openwave`)
- Settlement IBAN (where net settlements are credited/debited)
- Contact email

The gateway issues you a **Bank API Key** (`owbk_...`). Store it securely — it's shown once.

## Step 2 — Implement the Core Callback Interface

The gateway calls your core at the `core_base_url` you registered. All endpoints receive `X-OpenWave-Internal-Key` for authentication. **You must implement all of the following:**

| Endpoint | Method | Called when |
|:---|:---|:---|
| `/send-otp` | POST | Customer selects OTP auth |
| `/verify-otp` | POST | Customer submits OTP code |
| `/send-push` | POST | Customer selects push auth |
| `/execute-transaction` | POST | OTP/push verified — debit + route funds |
| `/refund-transaction` | POST | Merchant requests a full or partial refund against a completed payment |
| `/notify-credit` | POST | Cross-bank credit arrives (non-blocking) |
| `/ob/accounts` | POST | Open Banking AISP account list |
| `/ob/balances` | POST | Open Banking AISP balance query |
| `/ob/transactions` | POST | Open Banking AISP transaction history |
| `/ob/payment-orders` | POST | Open Banking PISP payment initiation |

::: tip Bank-agnostic routing
The gateway has **one generic HTTP client** for all banks. There is no bank-specific code in the gateway — your `core_base_url` is the sole routing target.
:::

::: tip Recommended callback base path
Use a product-neutral OpenWave base path such as:

```text
https://bank.example.com/api/v1/openwave
```

The gateway appends the standard callback operation, for example `POST {core_base_url}/send-otp`. A bank may place an internet-facing edge in front of private middleware, but the public base URL should remain OpenWave-branded rather than tied to a specific gateway product.
:::

### Send OTP Challenge
```http
POST {core_base_url}/send-otp
X-OpenWave-Internal-Key: <shared-secret>

{
  "session_id": "ops_01HZGV...",
  "payer_iban": "LY83002700100099900001"
}
```
Your bank receives the payer IBAN, extracts the account number, looks up the customer in your CBS, and sends the OTP via SMS/email. Return:
```json
{ "otp_token": "<reference>", "phone_masked": "091****12", "expires_in_seconds": 300 }
```

::: warning CBS customer IDs never leave your bank
The gateway passes only the **IBAN** — it never stores or transmits CBS-internal customer IDs.
Your bank derives the customer from the IBAN internally. This is by design.
:::

### Verify OTP
```http
POST {core_base_url}/verify-otp
X-OpenWave-Internal-Key: <shared-secret>

{ "session_id": "ops_01HZGV...", "otp_token": "<reference>", "otp_code": "123456" }
```
Return `{ "verified": true }` or a 401.

### Execute Transaction

Called once after OTP/push auth is confirmed. Handles both same-bank and cross-bank routing:

```http
POST {core_base_url}/execute-transaction
X-OpenWave-Internal-Key: <shared-secret>

{
  "session_id": "ops_01HZGV...",
  "merchant_name": "My Store",
  "merchant_reference": "order_1042",
  "debtor_iban": "LY83002700100099900001",
  "creditor_iban": "LY83002700200099900002",
  "creditor_bank_handle": "bank-b",
  "creditor_bank_lypay_code": "002",
  "amount": 50000,
  "currency": "LYD",
  "description": "Order #1042",
  "route_type": "SAME_BANK"
}
```

`route_type` is either `SAME_BANK` (atomic CBS book transfer) or `LYPAY_INITIATE` (debtor bank initiates a CBL LyPay transfer). Return:

```json
{ "transfer_ref": "TRF-20260424-001", "route_used": "SAME_BANK", "lypay_ref": null }
```

### Refund Transaction

Called when a merchant requests a full or partial refund for a completed payment. The bank should use the original rail reversal where available. If rail reversal is not available, the bank may execute a compliant return transfer while preserving the same OpenWave refund lifecycle.

```http
POST {core_base_url}/refund-transaction
X-OpenWave-Internal-Key: <shared-secret>

{
  "refund_id": "rfd_01HX8B3W4QG7TK2V4R9MB8K2YX",
  "original_session_id": "ops_01HZGV...",
  "original_transfer_ref": "TRF-20260424-001",
  "merchant_name": "My Store",
  "merchant_reference": "order_1042",
  "refund_reference": "order_1042_refund_1",
  "debtor_iban": "LY83002700200099900002",
  "creditor_iban": "LY83002700100099900001",
  "creditor_bank_handle": "bank-a",
  "creditor_bank_lypay_code": "001",
  "amount": 12500,
  "currency": "LYD",
  "reason": "Customer return",
  "route_type": "LYPAY_INITIATE"
}
```

Return a refund reference and the route used:

```json
{ "refund_ref": "RFD-20260424-001", "route_used": "LYPAY_INITIATE", "lypay_ref": "LPY-RFD-001", "status": "COMPLETED" }
```

If the bank cannot process the refund, return a controlled error with a merchant-safe code. Examples include `REFUND_WINDOW_EXPIRED`, `REVERSAL_NOT_SUPPORTED`, `BANK_REJECTED`, or `RAIL_UNAVAILABLE`.

### Notify Credit (cross-bank, non-blocking)

When a cross-bank payment credits the merchant's bank, the gateway calls the creditor bank to inform it:

```http
POST {core_base_url}/notify-credit
X-OpenWave-Internal-Key: <shared-secret>

{
  "session_id": "ops_01HZGV...",
  "creditor_iban": "LY83002700200099900002",
  "amount": 50000,
  "currency": "LYD",
  "transfer_ref": "TRF-20260424-001"
}
```

### Get Accounts (for Open Banking AISP)
```http
POST {core_base_url}/ob/accounts
X-OpenWave-Internal-Key: <shared-secret>

{ "customer_id": "CUST-001", "consent_id": "con_01HZGV..." }
```
Returns list of accounts with IBAN, account name, currency, and type.

### Get Balances (for Open Banking AISP)
```http
POST {core_base_url}/ob/balances
X-OpenWave-Internal-Key: <shared-secret>

{ "customer_id": "CUST-001", "iban": "LY83...", "consent_id": "con_01HZGV..." }
```

### Get Transactions (for Open Banking AISP)
```http
POST {core_base_url}/ob/transactions
X-OpenWave-Internal-Key: <shared-secret>

{ "customer_id": "CUST-001", "iban": "LY83...", "from_date": "2026-01-01",
  "to_date": "2026-04-30", "page": 1, "limit": 50, "consent_id": "con_01HZGV..." }
```

## Step 3 — Enroll Your Customers' Aliases

When a customer chooses their NPT handle in your app, your backend calls the Identity Registry:

```http
POST /v1/identity/claim
X-OpenWave-Bank-Key: owbk_<your-bank-handle>_...

{
  "npt_handle": "mtellesy",
  "iban": "LY83002700100099900001",
  "customer_display_name": "Mohamed T.",
  "bank_customer_ref": "CUST-001"
}
```

If the handle is taken, the registry returns `409 Conflict`.

## Step 4 — Advertise Your Capabilities

Let TPPs know what Open Banking features you support:

```http
PATCH /banks/{handle}
X-OpenWave-Bank-Key: owbk_andalus_...

{
  "ob_enabled": true,
  "ob_scopes_supported": ["accounts:read", "balances:read", "transactions:read", "payments:write", "credit_assessment:read", "income:read", "liabilities:read", "affordability:read"],
  "sca_exemption_limit": 5000,
  "max_consent_expiry_days": 365
}
```

If you implement QR or NFC presented flows directly, advertise them through the presented-payments capability object. Supported channels, modes, intents, and enablement flags must be discoverable so merchants and wallets do not assume unavailable flows.

If you support Credit & Finance assessment data, expose credit-related Open Banking scopes only when your consent, audit, revocation, and data-minimization controls are ready. Banks may implement assessment support directly, or allow a gateway/finance provider to consume bank data under customer consent. Either way, the customer must see that the data is used for finance eligibility.

## Step 5 — Handle Settlements

The gateway batches net settlement amounts and calls your core once per settlement cycle (configurable: hourly, daily, etc.).

A settlement is a **net credit or debit** to your `settlement_account_iban`. The gateway handles individual customer debits and credits — settlement reconciles the net position between banks.

## LyPay & NAD Integration

To participate in cross-bank OpenWave payments, your bank must be connected to **CBL's National Payment Infrastructure**:

### NAD — National Alias Directory

NAD is the CBL-operated alias registry. Your bank must:

1. **Enroll your customers** in NAD when they activate their alias (NPT handle) — this maps alias → IBAN + institution code
2. **Keep NAD in sync** — deactivate entries when accounts are closed or aliases are released
3. **Expose the enrollment callback** so the gateway can trigger NAD enrollment via your bank's OpenWave interface

```http
POST /openwave/callbacks/v1/alias/enroll
{
  "alias": "mtellesy",
  "account_iban": "LY83002700100099900001",
  "customer_ref": "CUST-001"
}
```

### LyPay — Outbound (Sending)

When your customer pays a merchant at another bank:

1. Gateway instructs your bank to debit the customer
2. Your bank CBS debits, then initiates a **LyPay transfer** to the creditor IBAN
3. LyPay routes to the merchant's bank
4. You receive a LyPay `debit notice` (your RRN) — store this for reconciliation

### LyPay — Inbound (Receiving)

When your merchant customer receives a payment from another bank:

1. CBL LyPay delivers a **credit instruction** to your bank
2. Your CBS credits the merchant's account
3. Your bank (or the gateway) fires the **credit confirmation** back to the gateway
4. The gateway updates the session to `COMPLETED` and fires `payment.completed` to the merchant

::: warning Credit confirmation is mandatory
The gateway will not fire `payment.completed` to the merchant until it receives credit confirmation from your bank. Implement the credit callback promptly — delays here delay merchant fulfillment.
:::

```http
POST /openwave/callbacks/v1/payment/credit-confirmed
{
  "payment_reference": "LYPAY-REF-001",
  "session_id": "ops_01HZGV...",
  "creditor_iban": "LY83002700100099900001",
  "amount": 50000,
  "currency": "LYD",
  "rrn": "20260424-000123"
}
```

## Security Requirements

| Requirement | Detail |
|:---|:---|
| All callback endpoints must be HTTPS | TLS 1.2+ required |
| Validate `X-OpenWave-Internal-Key` on every callback | Reject requests without valid key |
| Idempotency | Use the `reference` field to deduplicate — the gateway may retry on timeout |
| Response time | Core callbacks should respond within 10 seconds |
| Retry policy | Gateway retries with exponential backoff on 5xx responses |

## Rotate Your Bank Key

If your key is compromised:

```http
POST /banks/{handle}/rotate-key
X-OpenWave-Bank-Key: owbk_<your-bank-handle>_...
```

New key is returned **once**. Update your systems immediately.
