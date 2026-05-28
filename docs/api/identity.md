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
| Customer handle | Preserve one global username across banks, such as `mtellesy@andalus`. |
| Bank handle | Identify the bank namespace, such as `andalus`. |
| Account links | Store bank-vouched accounts under a customer identity. |
| Default account | Resolve the preferred account per bank or per payment context. |
| Governance | Enforce claim, suspension, dispute, and recovery policy. |

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

## Privacy rules

- Public resolution must return only what routing requires.
- Full IBAN, account owner details, and cross-bank account lists require explicit authorization.
- Banks can manage only accounts they own or have verified.
- Customers control global username changes and account visibility where policy permits.

## Related guides

- [NPT guide](../guide/npt.md)
- [Authentication](../guide/authentication.md)
- [OpenWave Identity portal](https://neptune-ly.github.io/openwave-identity/)
