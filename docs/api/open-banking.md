# Open Banking API

The Open Banking API defines consent-based account access and payment initiation. It follows OAuth 2.0 Authorization Code with PKCE and explicit scopes so TPPs receive only the access the customer approved.

## OpenAPI

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-open-banking-v1.0.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-open-banking-v1.0.yaml" target="_blank">Open in Swagger Editor</a>
  <a class="ow-dl-btn-ghost" href="../downloads.html">Generate a client</a>
</div>

## Consent flow

| Step | Endpoint | Purpose |
|---:|---|---|
| 1 | `POST /ob/consents` | TPP creates a consent request with scopes, redirect URI, PKCE challenge, expiry, and customer-facing purpose. |
| 2 | Hosted consent URL | Customer sees TPP identity, bank, accounts, duration, and exact scopes. |
| 3 | Bank SCA | Customer approves using OTP, push, or another bank-supported SCA method. |
| 4 | `POST /ob/token` | TPP exchanges authorization code and PKCE verifier for tokens. |
| 5 | Account APIs | TPP calls only APIs covered by granted scopes. |

## Example responses

### Consent created

```json
{
  "consent_id": "cns_01HX7W0F4KZK2G8C6TW6EN10XR",
  "status": "AWAITING_AUTHORISATION",
  "consent_url": "https://gateway.example.com/ob/consent/cns_01HX7W0F4KZK2G8C6TW6EN10XR",
  "scopes": ["accounts:read", "balances:read", "transactions:read"],
  "expires_at": "2026-08-06T00:00:00Z",
  "code_challenge_method": "S256"
}
```

### Token response

```json
{
  "access_token": "owat_...",
  "refresh_token": "owrt_...",
  "token_type": "Bearer",
  "expires_in": 900,
  "scope": "accounts:read balances:read transactions:read",
  "consent_id": "cns_01HX7W0F4KZK2G8C6TW6EN10XR"
}
```

### Accounts response

```json
{
  "accounts": [
    {
      "account_id": "acc_01HX7W4QK2A95X2FGPVT7HHBZJ",
      "bank_handle": "andalus",
      "display_name": "Current Account",
      "iban_masked": "LY83*****************2345",
      "currency": "LYD"
    }
  ]
}
```

## Common scopes

| Scope | Access |
|---|---|
| `accounts:read` | Account list and masked identifiers. |
| `balances:read` | Current and available balances. |
| `transactions:read` | Transaction history for approved accounts and date ranges. |
| `standing-orders:read` | Standing order and scheduled payment data. |
| `payments:write` | PISP payment order creation. |
| `credit_assessment:read` | Permit a declared credit or finance assessment. |
| `income:read` | Permit derived income summaries. |
| `liabilities:read` | Permit derived obligations and debt-service indicators. |
| `affordability:read` | Permit affordability output for a requested amount and tenor. |

## AISP endpoints

| Endpoint | Purpose |
|---|---|
| `GET /ob/accounts` | List consented accounts. |
| `GET /ob/accounts/{account_id}/balances` | Read balances for one consented account. |
| `GET /ob/accounts/{account_id}/transactions` | Read transactions with pagination and date filters. |
| `GET /ob/accounts/{account_id}/standing-orders` | Read scheduled/standing orders where supported. |

## PISP endpoints

| Endpoint | Purpose |
|---|---|
| `POST /ob/payment-orders` | Create a payment order under customer consent. |
| `GET /ob/payment-orders/{id}` | Read payment order status. |
| `POST /ob/payment-orders/{id}/cancel` | Cancel a payment order if still cancellable. |

## Security requirements

- Merchants and TPPs must not collect the customer bank OTP inside their own UI.
- The hosted consent screen must show requested scopes before approval.
- Authorization codes are short-lived and bound to the PKCE challenge.
- Tokens must be scoped, revocable, and auditable.
- Consent revocation must stop future token use.

## Related guides

- [TPP guide](../guide/tpp.md)
- [Decentralized Open Banking](../guide/decentralized-open-banking.md)
- [Credit-assessment consent](../guide/credit-assessment-consent.md)
- [Credit & Finance API](./credit-finance.md)
- [Authentication](../guide/authentication.md)
