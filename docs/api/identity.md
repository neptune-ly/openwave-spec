# Identity Registry API

The Identity Registry API is the source of truth for NPT handles, bank handles, and account links. It is not owned by a payment gateway or a single bank.

## OpenAPI

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-identity-v1.0.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-identity-v1.0.yaml" target="_blank">Open in Swagger Editor</a>
  <a class="ow-dl-btn-ghost" href="../downloads.html">Postman and clients</a>
</div>

## Registry responsibilities

| Area | Responsibility |
|---|---|
| Customer handle | Preserve one global username across banks; `mtellesy@andalus` is a bank-scoped route for `mtellesy`. |
| Bank handle | Identify the bank namespace, such as `andalus`. |
| Account links | Store bank-vouched accounts under a customer identity. |
| Default account | Resolve the preferred account per bank or per payment context. |
| Governance | Enforce claim, availability, rename, permanent retirement, suspension, dispute, and recovery policy. |

## Key endpoints

| Endpoint | Purpose |
|---|---|
| `GET /identity/handles/{handle}/availability` | Return `AVAILABLE`, `TAKEN`, `RETIRED`, or `INVALID`. |
| `POST /identity/claim` | Claim a customer handle or link the same verified identity at another bank. |
| `PATCH /identity/{npt_handle}/handle` | Rename an active identity and retire the previous handle permanently. |
| `POST /auth/login` | Start a portal sign-in; phone or national-ID login can return a linked-bank challenge. |
| `POST /auth/login/totp/verify` | Verify TOTP; phone or national-ID sign-in then continues to linked-bank approval. |
| `GET /auth/login/bank-approval/{challenge_id}` | Poll a challenge with its opaque status token. |
| `GET /identity/login-approvals` | List the calling bank's approval queue. |
| `GET /identity/login-approvals/{challenge_id}` | Read one challenge only when it belongs to the calling bank. |
| `POST /identity/login-approvals/{challenge_id}/approve` | Approve after the bank authenticates its own customer. |
| `POST /identity/login-approvals/{challenge_id}/reject` | Reject after the bank authenticates its own customer. |
| `GET /identity/resolve?alias={alias}` | Resolve a bare or bank-scoped alias for payment routing. |
| `GET /identity/{npt_handle}` | Read the bank-authenticated, privacy-minimized identity profile. |
| `GET /identity/{npt_handle}/accounts` | List bank-authenticated linked accounts. |
| `POST /identity/{npt_handle}/accounts` | Link an additional bank account. |
| `PATCH /identity/{npt_handle}/default` | Change the bank used by the bare handle. |
| `DELETE /identity/{npt_handle}` | Deactivate the identity without releasing its name. |
| `GET /banks` | List registered bank namespaces. |

## Example responses

### Public resolution

```json
{
  "npt_handle": "tellesy",
  "bank_handle": "andalus",
  "iban": "LY83002700100099900001",
  "display_name": "Mohamed T.",
  "is_default": true,
  "resolved_at": "2026-08-07T12:00:00Z"
}
```

### Bank account linked

```json
{
  "npt_handle": "tellesy",
  "bank_handle": "andalus",
  "iban_masked": "LY8300...0001",
  "is_default": true,
  "linked_at": "2026-08-07T12:00:00Z"
}
```

## Handle lifecycle contract

The registry distinguishes live ownership from permanent retirement:

| Operation | Live target | Retired target | Dependency failure |
|---|---|---|---|
| Availability | `TAKEN` | `RETIRED` | No verdict; caller must retry. |
| Claim | `409 HANDLE_TAKEN` | `410 HANDLE_RETIRED` | Registry error, never success. |
| Rename target | `409 HANDLE_TAKEN` | `410 HANDLE_RETIRED` | No rename is made. |
| Resolve old name | Current route | `410 HANDLE_RETIRED` | Retry-safe dependency error. |

Rename also returns `403 HANDLE_RENAME_NOT_PERMITTED` for the wrong bank, national ID, or inactive identity, and `429 HANDLE_RENAME_TOO_SOON` for the 30-day cooldown or lifetime cap of three.

The runtime-canonical rename request uses `newHandle` and `nationalId` (legacy snake-case input aliases remain accepted). A changed response uses the exact camelCase Identity DTO and includes `retiredHandle`, `reauthenticationRequired: true`, and `nextStep`:

```json
{
  "nptHandle": "ahmed.ali",
  "displayName": "Ahmed Ali",
  "status": "ACTIVE",
  "defaultBankHandle": "andalus",
  "linkedBanks": ["andalus", "nub"],
  "nationalIdPresent": true,
  "customerPortalAccess": null,
  "createdAt": "2026-07-01T10:00:00Z",
  "updatedAt": "2026-08-08T11:00:00Z",
  "retiredHandle": "ahmed",
  "reauthenticationRequired": true,
  "nextStep": "Customer must sign in again with 'ahmed.ali' and re-authorize delegated apps."
}
```

An idempotent same-name retry omits the three rename-only fields. A changed rename moves the portal username, rejects existing sessions for the old subject, and revokes OAuth access/refresh tokens and grants for that subject. The customer signs in with the new handle and grants fresh consent to delegated apps. The old handle never redirects; a later availability or resolution response for that retired address never identifies the replacement.

## Linked-bank login approval

Phone and national-ID customer sign-in uses the customer's **OpenWave Identity portal password**, not a bank credential. A successful password check can return `202` for TOTP first; successful TOTP verification still continues to linked-bank approval and does not bypass it. The five-minute `BANK_APP` response contains an opaque `status_token`, `default_bank_handle`, and a `banks` list. The top-level challenge fields are snake_case, while each bank choice is the shipped DTO shape: `bankHandle`, `alias`, and `isDefault`.

For customers with more than one linked bank, the client presents those choices and may put the default first. The customer selects exactly one bank app. That bank authenticates the customer locally using its existing trusted flow, locates the challenge with its own internal `customerRef`, then calls approve or reject using a bank API key or bank portal session. OpenWave Identity never receives the bank password, PIN, OTP, passcode, or push-approval secret. The portal keeps the status token and polls the public status endpoint; the token must not be handed to the bank app. Approve and reject responses intentionally contain no portal session—the session is returned only to the initiator through an approved status poll.

Approval states and bank actions are exact:

| State or failure | HTTP / code | Required action |
|---|---|---|
| Pending, approved, rejected, or expired list filter | `200` | Render the typed state; `EXPIRED` is derived from challenge time. |
| Unsupported list filter | `400 LOGIN_APPROVAL_INVALID_FILTER` | Use `PENDING`, `APPROVED`, `REJECTED`, or `EXPIRED`. |
| Wrong bank customer | `403 LOGIN_APPROVAL_NOT_PERMITTED` | Do not approve; authenticate the correct local customer. |
| Missing or unrelated-bank challenge | `404 LOGIN_APPROVAL_NOT_FOUND` | Do not disclose whether another bank can see it. |
| Already approved or rejected | `409 LOGIN_APPROVAL_ALREADY_ACTIONED` | Treat the first terminal action as final. |
| Approval window elapsed | `410 LOGIN_APPROVAL_EXPIRED` | Start a new portal sign-in. |

## Authentication

Banks use `X-OpenWave-Bank-Key: owbk_...` for bank-to-registry operations, including the privacy-minimized profile. Resolution is public and rate-limited.

## Privacy rules

- Public resolution must return only what routing requires.
- Full IBAN, account owner details, and cross-bank account lists require explicit authorization.
- Banks can manage only accounts they own or have verified.
- A global username change requires customer authority through a linked bank and a matching national ID.
- Retired-handle responses never expose the replacement username.

## Related guides

- [NPT guide](../guide/npt.md)
- [Authentication](../guide/authentication.md)
- [OpenWave Identity portal](https://neptune-ly.github.io/openwave-identity/)
