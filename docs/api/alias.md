# Alias API

The Alias API covers NPT resolution and account selection for payments. Ownership of the alias belongs to the OpenWave Identity Registry; gateways and banks may cache or display registry data, but they must treat the registry as the source of truth.

## OpenAPI

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml" download>Download Payments YAML</a>
  <a class="ow-dl-btn-ghost" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-identity-v1.0.yaml" download>Download Identity YAML</a>
  <a class="ow-dl-btn-ghost" href="../downloads.html">Import to tools</a>
</div>

## What belongs where

| Operation | Owner | Notes |
|---|---|---|
| Reserve or create `username@bank` | Identity Registry | Customer owns the username; banks can only claim accounts they vouch for. |
| Add an account under a bank handle | Identity Registry through bank-authenticated API | Requires `X-OpenWave-Bank-Key: owbk_...`. |
| Resolve alias for checkout | Gateway | Gateway calls the registry and returns only the fields required to continue authorization. |
| Change global username | Customer / registry policy | Banks must not rename a global alias without customer authority. |
| Change default account for one bank | Customer or approved bank flow | The account must still belong to that bank. |

## Payment-time alias resolution

| Endpoint | Purpose |
|---|---|
| `POST /session/{id}/resolve-payer` | Resolve an alias or IBAN inside the checkout session. |
| `GET /alias/{alias}` | Resolve alias metadata when exposed by a gateway. |
| `POST /alias/enroll` | Gateway-assisted enrollment backed by the OpenWave Identity Registry. |
| `POST /alias/{alias}/default-account` | Set default account for an alias within permitted ownership rules. |

## Example responses

### Resolved bank-scoped alias

```json
{
  "alias": "tellesy@andalus",
  "handle": "tellesy",
  "bank_handle": "andalus",
  "status": "ACTIVE",
  "route": {
    "bank_handle": "andalus",
    "account_ref": "acctref_7d8f9a",
    "default": true
  },
  "display": {
    "name": "M*** T******",
    "iban_masked": "LY83*****************2345"
  }
}
```

### Alias not found

```json
{
  "error": {
    "code": "ALIAS_NOT_FOUND",
    "message": "Alias was not found in the identity registry.",
    "retryable": false,
    "correlation_id": "corr_01HX7V7XT5Y7C7G5WM3H8S5W5P"
  }
}
```

## Response principles

- Return masked customer names and masked IBANs to the checkout surface.
- Never expose full account details to a merchant unless the customer explicitly consented under an Open Banking scope.
- If an alias is not found, return `ALIAS_NOT_FOUND` without leaking whether a phone number, customer ID, or private registry record exists.
- If the registry is unavailable, return a retry-safe dependency error rather than falling back to stale local ownership claims.

## Related guides

- [NPT guide](../guide/npt.md)
- [Identity Registry API](./identity.md)
- [Merchant integration](../guide/merchants.md)
