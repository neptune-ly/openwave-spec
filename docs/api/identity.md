# Identity Registry API

The Identity Registry API is the source of truth for NPT handles, bank handles, and account links. In the Libya deployment model, it is intended to act as a **bank-vouched digital identity and payment identity layer**, not only as an alias directory. It is not owned by a payment gateway or a single bank.

## OpenAPI

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-identity-v1.0.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-identity-v1.0.yaml" target="_blank">Open in Swagger Editor</a>
  <a class="ow-dl-btn-ghost" href="../downloads.html">Postman and clients</a>
</div>

## Registry responsibilities

| Area | Responsibility |
|---|---|
| Customer handle | Preserve one global username across banks, such as `mtellesy@andalus`. |
| Bank handle | Identify the bank namespace, such as `andalus`. |
| Account links | Store bank-vouched accounts under a customer identity. |
| Default account | Resolve the preferred account per bank or per payment context. |
| Identity continuity | Preserve bank-vouched customer identity continuity across multi-bank linking and recovery flows. |
| Governance | Enforce claim, suspension, dispute, and recovery policy. |

## Digital identity role

OpenWave Identity is intentionally narrow, but its role is larger than username routing:

- it gives a customer one payment identity across participating banks
- it preserves which bank vouched for which linked account
- it supports customer-access and recovery flows built on bank-backed enrollment
- it lets gateways and banks resolve routing facts without exposing broad KYC or bank-core data

The registry is therefore part of the digital identity trust layer for OpenWave in Libya, while banks still own KYC, customer authentication, account execution, and regulated account servicing.

## Key endpoints

| Endpoint | Purpose |
|---|---|
| `POST /identity/handles` | Create or claim a customer NPT handle. |
| `GET /identity/resolve/{alias}` | Resolve an alias for payment routing. |
| `GET /identity/banks` | List registered bank namespaces and capabilities. |
| `POST /identity/banks/{handle}/accounts` | Bank links an account it owns to a customer handle. |
| `DELETE /identity/handles/{alias}` | Deactivate a handle under governance rules. |

## Example responses

### Public resolution

```json
{
  "alias": "tellesy@andalus",
  "handle": "tellesy",
  "bank_handle": "andalus",
  "status": "ACTIVE",
  "routes": [
    {
      "bank_handle": "andalus",
      "account_ref": "acctref_7d8f9a",
      "default": true,
      "capabilities": ["PAYMENTS", "OPEN_BANKING"]
    }
  ]
}
```

### Bank account linked

```json
{
  "handle": "tellesy",
  "bank_handle": "andalus",
  "account_ref": "acctref_7d8f9a",
  "status": "LINKED",
  "vouched_by": "andalus",
  "linked_at": "2026-05-08T22:08:00Z"
}
```

## Authentication

Banks use `X-OpenWave-Bank-Key: owbk_...` for bank-to-registry operations. Public resolution may be unauthenticated or rate-limited depending on national policy.

## Implementation neutrality

The standard does not require a bank to run Neptune products, Nexus, or any specific middleware stack.

Valid implementation patterns include:

- a bank connecting directly from its own middleware or core integration layer
- a bank deploying a lightweight adapter only for OpenWave-facing contracts
- a bank using Neptune products such as OpenWave Identity, Astro, Nexus, or another public/mobile edge as one implementation path

The protocol contract matters; the internal bank architecture does not.

## Privacy rules

- Public resolution must return only what routing requires.
- Full IBAN, account owner details, and cross-bank account lists require explicit authorization.
- Banks can manage only accounts they own or have verified.
- Customers control global username changes and account visibility where policy permits.

## Related guides

- [NPT guide](../guide/npt.md)
- [Authentication](../guide/authentication.md)
- [OpenWave Identity portal](https://neptune-ly.github.io/openwave-identity/)
