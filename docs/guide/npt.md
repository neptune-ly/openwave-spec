# NPT — National Payment Tag

**NPT (National Payment Tag)** is the payment identity layer of OpenWave. It lets you send money to a person using only their username — no IBAN required.

## The Concept

Inspired by how email works. You know someone's email address; the `@domain` part routes the message to the right provider. NPT works the same way for payments.

```
mtellesy             →  routes to default bank account
mtellesy@andalus     →  routes to Andalus Bank specifically
mtellesy@nub         →  routes to NUB specifically
```

A person **owns** a username and can **link accounts from multiple banks** to it. The `@bank-handle` suffix is optional — if omitted, the payment goes to their default account regardless of which bank that is.

## Key Properties

| Property | Detail |
|:---|:---|
| **Globally unique** | One username per person across the entire ecosystem |
| **Multi-bank** | Link accounts from any participating bank |
| **Portable** | Change your default without sharing a new IBAN |
| **Bank-vouched** | Claimed through your bank's existing KYC process |
| **Routing-only** | The registry stores only routing data — no balances, no history |
| **First-come, permanently reserved** | A claimed handle is never reissued; previous names retire permanently after rename |

## How Claiming Works

1. Customer visits their bank's app and chooses a username (e.g. `mtellesy`)
2. Bank verifies the customer is KYC-approved (already done at onboarding)
3. Bank calls the **Identity Registry**: `POST /v1/identity/claim`
4. Registry checks uniqueness and registers `mtellesy → { bank: "andalus", iban: "LY..." }`
5. Customer now receives payments at `mtellesy` from anywhere in the ecosystem

## How Resolution Works

<section class="ow-flow-card ow-npt-demo" aria-label="Animated NPT resolution explainer">
  <div>
    <p class="ow-flow-kicker">NPT resolution</p>
    <h3>The registry maps a human handle to the right bank route.</h3>
  </div>
  <div class="ow-stage-row">
    <span style="--i:0"><b>1</b>Sender enters handle</span>
    <span style="--i:1"><b>2</b>Registry resolves default</span>
    <span style="--i:2"><b>3</b>Bank-scoped account returned</span>
    <span style="--i:3"><b>4</b>Gateway routes payment</span>
  </div>
  <div class="ow-npt-board" aria-hidden="true">
    <div class="ow-handle-card"><small>Customer-owned handle</small><strong>tellesy</strong></div>
    <div class="ow-account-stack">
      <span class="ow-account-active">tellesy@andalus <b>default</b></span>
      <span>tellesy@nub <b>linked</b></span>
    </div>
    <div class="ow-boundary-note">Banks can update only accounts they vouched for. A rename requires a linked bank, matching national ID, and customer authority.</div>
  </div>
</section>

Sending money to an NPT alias:

```
Sender types: mtellesy

1. Gateway calls: GET /v1/identity/resolve?alias=mtellesy
   ← { iban: "LY83002700100099900001", bank_handle: "andalus" }

2. Gateway routes payment to Andalus Bank with that IBAN
```

Resolution is **public** — no authentication required. The endpoint is designed to be fast and heavily cached (60-second TTL).

## Adding Multiple Banks

Once you have a handle, you can link additional bank accounts:

```
mtellesy           →  andalus (default)
mtellesy@nub       →  nub
mtellesy@wahda     →  wahda
```

Merchants or senders don't need to know which bank you use. They just use `mtellesy`.

## Availability, Rename, and Permanent Retirement

Before enrollment or rename, a bank asks the registry for a typed verdict:

| Status | Meaning | Customer action |
|:---|:---|:---|
| `AVAILABLE` | The normalized handle can be claimed now. | Continue. |
| `TAKEN` | A current or retained identity owns it. | Choose another handle. |
| `RETIRED` | The handle was used before and is reserved forever. | Choose another handle; waiting will not help. |
| `INVALID` | The candidate does not match the format. | Correct the spelling or format. |
| `UNKNOWN` | A gateway could not reach the registry or Identity is disabled. | Retry safely; never assume the name is free. |

A customer may rename through a bank that already holds one of their linked accounts. The bank supplies the matching 12-digit national ID, and the registry moves the identity atomically. Successful changes have a 30-day cooldown and a lifetime cap of three. Retrying the same normalized name is a no-op and consumes no allowance.

The previous handle is then **retired permanently**. It cannot be claimed or used as another rename target. Resolution returns `410 HANDLE_RETIRED`; it never redirects to or reveals the replacement. This prevents saved payees, printed QR codes, or old messages from silently paying a future owner.

The rename also changes the Identity portal username. Existing portal sessions for
the old subject are rejected and OAuth tokens and grants for that subject are
revoked atomically. The customer signs in again with the new handle and grants
fresh consent to each delegated app. A same-name retry changes no subject and does
not require this cycle.

## Multi-bank sign-in selection

A customer who enters a phone number or national ID signs in first with their
OpenWave Identity portal password. If portal TOTP is enabled, TOTP is verified
first and the flow still advances to bank approval. Identity then returns the
linked bank choices; it does **not** ask for any bank password, bank PIN, bank
OTP, passcode, or push secret.

The customer selects one bank app. The default bank may be listed first, but it is
not mandatory when another linked bank is available. The selected bank authenticates
its own customer on its trusted surface and approves or rejects the five-minute
challenge with its internal `customerRef`. The portal retains the opaque status
token and polls for `PENDING`, `APPROVED`, `REJECTED`, or `EXPIRED`; the token is
never a bank credential and is not handed to the bank app.

Deactivating an identity also does not release its name. The identity stops resolving, while the handle remains reserved for safety and governance.

## Format Rules

| Rule | Example |
|:---|:---|
| 3–32 characters | ✅ `mtellesy`, ✅ `ahmed` |
| Lowercase letters, numbers, dots, underscores, hyphens | ✅ `ahmed.ali`, ✅ `ahmed_123`, ✅ `my-store` |
| No spaces | ❌ `ahmed ali` |

## Bank Handle Format

Bank handles are separate registry identifiers: 2–20 lowercase letters, numbers, or hyphens. They are issued when a bank registers with the registry.

```
@andalus    →  Andalus Bank
@nub        →  National Union Bank
@wahda      →  Wahda Bank
```

## Compared to Other Systems

| System | What you share | Portable? | Multi-bank? |
|:---|:---|:---:|:---:|
| **IBAN transfer** | Full IBAN (24 chars) | ✗ | ✗ |
| **Phone-based transfer** | Phone number | ✗ | ✗ |
| **NPT (OpenWave)** | Short username | ✅ | ✅ |
| **Email (for reference)** | Email address | ✅ | N/A |
