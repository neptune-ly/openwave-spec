# Presented Payments

Presented payments add **scan** and **tap** as payment-entry channels without weakening the existing OpenWave trust model.

## In one sentence

**QR, NFC, or app/wallet handoff starts the payment. OpenWave still controls the secure authorization and final payment lifecycle.**

## What changes

Instead of the customer always starting from a hosted checkout URL, the flow may start from:

- a merchant-displayed QR code
- an NFC tap target
- an app, universal-link, deep-link, or platform wallet handoff on iOS, Android, or web, initiated from the merchant or payment acceptor

## What does not change

- The customer still authorizes inside a trusted hosted or bank-controlled surface.
- The customer must see merchant, amount, account, expiry, fees if any, and recurring terms if applicable before approval.
- Merchants still never handle OTPs, push-approval decisions, or bank credentials.
- Final one-time payment and recurring mandate outcomes still reuse the normal payment and mandate lifecycle.

## Actor model

| Actor | Role in presented payments | Must not do |
|---|---|---|
| Merchant | Shows QR, exposes NFC target, receives final status | Collect bank OTP, PIN, or push approval result |
| Customer | Scans or taps the merchant presentment | Bypass secure authorization |
| Gateway / bank / wallet operator | Creates or claims presentment, enforces policy, opens secure flow | Treat QR or NFC alone as final authorization |
| Bank | Performs SCA and money movement | Let merchant UI impersonate bank authorization |
| Identity registry | Resolves alias or NPT when needed | Own presentment, payment session, or consent lifecycle |

## Supported v1 modes

| Mode | Intent | Description |
|---|---|---|
| `MERCHANT_PRESENTED` | `ONE_TIME_PAYMENT` | Merchant shows QR or NFC for immediate checkout. |
| `MERCHANT_PRESENTED` | `MANDATE_APPROVAL` | Merchant starts a recurring mandate approval flow from QR or NFC. |

`APP_HANDOFF` is a supported channel for the same modes. It is used when the scan/tap/start action is carried through a bank app, wallet app, universal link, Android app link, iOS app link, or platform wallet integration. It is not a different payment rail.

## What OpenWave standardizes

OpenWave standardizes:

- the presentment object
- the QR and NFC payload model
- app and wallet handoff payloads
- the customer review summary shown before approval
- capability discovery
- claim and cancellation behavior
- the security boundary between merchant UI and authorization UI

OpenWave does **not** force one operator model. The same channel can be implemented by:

- a gateway such as Neptune. Astro
- a bank directly
- a wallet or payment app directly

## Operator-controlled channel enablement

Presented payments are part of the standard, but **not every deployment must enable every mode**.

Operators may independently enable or disable:

- QR
- NFC
- app / wallet handoff
- merchant-presented
- one-time presented payments
- recurring mandate-presented approvals
- direct operator implementation by a gateway, bank, or wallet serving merchants

Availability must be exposed through the capability metadata so merchant, wallet, and bank software can adapt at runtime.

## Simple end-to-end flow

```mermaid
sequenceDiagram
  autonumber
  participant M as Merchant backend
  participant UI as Merchant UI / POS
  participant O as OpenWave operator
  participant C as Customer app / device
  participant B as Bank SCA

  M->>O: POST /presentments
  O-->>M: presentment_id + QR/NFC/app handoff payload
  M-->>UI: render QR, expose NFC, or open handoff
  C->>O: claim presentment after scan/tap/handoff
  O-->>C: customer review + secure hosted URL or SDK sheet
  C->>B: complete OTP / push / SCA
  B-->>O: verified
  O-->>M: webhook / final payment status
```

## Claim response contract

Claiming a presentment returns a hosted checkout URL, hosted mandate consent URL, secure SDK sheet descriptor, or bank-app handoff session. It never returns SCA credentials and it never authorizes the payment by itself.

The merchant or acceptor may open the returned `auth_surface`, `payment_url`, or `mandate_consent_url`, but must not collect OTP, PIN, passcode, push approval, bank login, or any other bank authentication secret.

The claim response must carry or point to a customer review summary. Before approval, the trusted surface must show:

- merchant or accepting party
- amount, currency, fees, and total where known
- funding account or alias, masked where needed
- expiry
- one-time or recurring intent
- recurrence frequency, maximum amount, duration, and cancellation rights when the flow approves a recurring mandate

## Security boundaries

| Actor | Allowed | Not allowed |
|---|---|---|
| Merchant UI | Show QR, expose NFC target, receive final status | Collect OTP or bank secrets |
| Wallet / bank app | Scan, tap, app-handoff, claim presentment, show review, continue in secure app flow | Skip SCA or hide amount/recurring terms when the payment or mandate requires it |
| Gateway / bank / wallet operator | Create presentment, enforce expiry and replay protection, route lifecycle | Treat QR alone as final authorization |

## Relationship to existing payment rails

Presented payments are a **channel layer**.

That means:

- QR does not create a new settlement rail
- NFC does not create a new settlement rail
- app/wallet handoff does not create a new settlement rail

After claim, the operator reuses the normal:

- payment session lifecycle
- recurring mandate approval lifecycle
- settlement routing
- webhook events

## Typical flows

### Merchant-presented one-time payment

1. Merchant backend creates a presentment.
2. Merchant site or POS displays QR, exposes NFC, or starts app handoff.
3. Customer scans or taps.
4. Customer lands in hosted, SDK, bank-app, or wallet-controlled secure authorization.
5. Customer reviews merchant, amount, account, expiry, and fees if any.
6. Presentment becomes a normal payment session after approval.
7. Final merchant fulfilment still depends on webhook or final payment status.

```mermaid
flowchart LR
  A[Merchant backend] -->|create presentment| B[OpenWave operator]
  B -->|QR payload| C[Merchant screen]
  C -->|scan| D[Customer device]
  D -->|claim| B
  B -->|hosted checkout / SDK sheet| D
  D -->|OTP / push / SCA| E[Bank]
  E -->|approved| B
  B -->|payment.completed| A
```

### Merchant-presented recurring approval

1. Merchant backend creates a presentment with `intent = MANDATE_APPROVAL`.
2. Customer scans or taps.
3. Customer sees mandate amount, frequency, duration, and merchant name.
4. Customer approves through bank OTP or push.
5. Presentment becomes a normal mandate approval flow.

## Interoperability rules for banks

To keep every bank interoperable, banks should all follow the same minimum behavior:

| Topic | Required common behavior |
|---|---|
| QR parsing | Accept the OpenWave URI or signed presentment reference format |
| NFC parsing | Accept the OpenWave NDEF URI format |
| App handoff | Accept OpenWave URI, universal link, app link, or platform wallet handoff descriptors |
| Capabilities | Publish enabled channels, modes, and intents accurately |
| Review | Show the customer review summary before approval |
| SCA | Perform OTP, push, or bank-controlled approval in a trusted surface |
| Status | Map presentment outcomes into standard payment or mandate states |
| Errors | Return retry-safe error envelopes with correlation IDs |

## What a customer should always see

For one-time payments:

- merchant name
- amount and currency
- destination context
- bank account or alias being used, masked as needed

For recurring mandate approval:

- merchant name
- recurring amount or max amount
- frequency
- expiry / duration
- cancellation rights
- bank account or alias being used, masked as needed

## Read next

- [QR payloads](./presented-qr.md)
- [NFC handoff](./presented-nfc.md)
- [Direct bank and wallet implementation](./presented-direct.md)
- [Channel governance](./presented-governance.md)
