# Error Codes

All errors follow the same JSON structure:

```json
{
  "error": {
    "code": "SESSION_EXPIRED",
    "message": "The payment session has expired",
    "detail": "Session ops_01HZGV expired at 2026-04-24T04:15:00Z",
    "request_id": "req_01HZGV..."
  }
}
```

Include `request_id` when contacting support — it traces the request through all gateway logs.

## HTTP Status Codes

| Status | Meaning |
|:---:|:---|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request — invalid parameters |
| `401` | Unauthorised — missing or invalid API key / token |
| `403` | Forbidden — valid key but insufficient permissions |
| `404` | Not found |
| `409` | Conflict — resource already exists (e.g. handle taken) |
| `410` | Gone — a retired NPT handle is permanently unavailable |
| `422` | Unprocessable — semantically invalid (e.g. amount too low) |
| `429` | Rate limited |
| `500` | Gateway internal error |
| `502` | Upstream bank or Identity dependency failed |
| `503` | Gateway or bank core temporarily unavailable |

## Error Code Reference

### Authentication

| Code | HTTP | Cause |
|:---|:---:|:---|
| `INVALID_API_KEY` | 401 | API key missing, malformed, or revoked |
| `INVALID_BANK_KEY` | 401 | Bank key invalid or revoked |
| `TOKEN_EXPIRED` | 401 | Access token has expired — refresh it |
| `TOKEN_REVOKED` | 401 | Token revoked (consent deleted) |
| `CONSENT_REVOKED` | 401 | Consent was revoked; re-initiate the flow |
| `PKCE_INVALID` | 400 | Code verifier does not match challenge |
| `PKCE_METHOD_REJECTED` | 400 | `plain` challenge method not accepted |

### Payments

| Code | HTTP | Cause |
|:---|:---:|:---|
| `SESSION_NOT_FOUND` | 404 | Unknown `session_id` |
| `SESSION_EXPIRED` | 422 | Session TTL elapsed |
| `SESSION_ALREADY_COMPLETED` | 409 | Cannot modify a completed session |
| `ALIAS_NOT_FOUND` | 404 | NPT alias does not exist |
| `ALIAS_INVALID` | 400 | Requested alias format or national ID is invalid |
| `ALIAS_RENAME_NOT_PERMITTED` | 403 | Calling bank does not serve the customer or national ID does not match |
| `ALIAS_TAKEN` | 409 | Requested alias belongs to a current identity |
| `ALIAS_RETIRED` | 410 | Requested alias is permanently retired and will never be reusable |
| `ALIAS_RENAME_TOO_SOON` | 429 | Rename cooldown or lifetime limit was reached |
| `IDENTITY_UNAVAILABLE` | 502 | Identity could not be reached; no rename was made |
| `IDENTITY_DISABLED` | 503 | Identity integration is disabled for this gateway deployment |
| `ALIAS_INACTIVE` | 422 | Alias exists but is deactivated |
| `BANK_NOT_PARTICIPATING` | 422 | The destination bank is not connected |
| `AMOUNT_TOO_LOW` | 422 | Below bank minimum transaction amount |
| `AMOUNT_TOO_HIGH` | 422 | Exceeds bank maximum transaction amount |
| `INSUFFICIENT_FUNDS` | 422 | Source account balance too low |
| `OTP_INVALID` | 401 | OTP entered by customer was wrong |
| `OTP_EXPIRED` | 422 | OTP TTL elapsed |
| `CBS_TIMEOUT` | 503 | Bank core did not respond in time |
| `CBS_ERROR` | 502 | Bank core returned an error |

### Open Banking

| Code | HTTP | Cause |
|:---|:---:|:---|
| `CONSENT_NOT_FOUND` | 404 | Unknown `consent_id` |
| `SCOPE_INSUFFICIENT` | 403 | Consent does not include required scope |
| `ACCOUNT_NOT_FOUND` | 404 | Account ID not in consented accounts |
| `SCA_REQUIRED` | 428 | SCA needed; redirect to `sca_url` |
| `PAYMENT_ORDER_REJECTED` | 422 | Bank declined the payment order |

### Credit & Finance

| Code | HTTP | Cause |
|:---|:---:|:---|
| `ASSESSMENT_NOT_FOUND` | 404 | Unknown `assessment_id` |
| `ASSESSMENT_NOT_READY` | 409 | Assessment is still processing |
| `ASSESSMENT_EXPIRED` | 409 | Assessment can no longer be used for new offers |
| `PRODUCT_NOT_SUPPORTED` | 400 | Operator does not support requested finance product |
| `INSUFFICIENT_DATA` | 422 | Consented data is not enough to produce an assessment |
| `PROVIDER_DECISION_DECLINED` | 422 | Provider declined under policy; return safe reason codes |
| `OFFER_EXPIRED` | 409 | Customer tried to accept an expired offer |
| `OFFER_ALREADY_ACCEPTED` | 409 | Offer has already created a contract |
| `CONTRACT_NOT_CANCELLABLE` | 409 | Contract cannot be cancelled in its current state |
| `PAYMENT_SETTLEMENT_FAILED` | 502 | Financier-to-merchant settlement failed |

### Identity Registry

| Code | HTTP | Cause |
|:---|:---:|:---|
| `HANDLE_TAKEN` | 409 | NPT handle already claimed by another user |
| `HANDLE_RETIRED` | 410 | NPT handle was used previously and is reserved permanently |
| `VALIDATION_ERROR` | 400 | Rename request fields do not meet their format requirements |
| `HANDLE_INVALID_FORMAT` | 422 | Claimed handle format does not meet requirements |
| `HANDLE_RENAME_NOT_PERMITTED` | 403 | Calling bank is not linked, identity is inactive, or national ID does not match |
| `HANDLE_RENAME_TOO_SOON` | 429 | Rename cooldown or lifetime cap was reached |
| `BANK_NOT_REGISTERED` | 404 | Bank handle not in the registry |
| `LOGIN_APPROVAL_INVALID_FILTER` | 400 | Approval list filter is not `PENDING`, `APPROVED`, `REJECTED`, or `EXPIRED` |
| `LOGIN_APPROVAL_NOT_PERMITTED` | 403 | Calling bank customer does not own a linked account for the challenge identity |
| `LOGIN_APPROVAL_NOT_FOUND` | 404 | Challenge is missing or not visible to the calling bank |
| `LOGIN_APPROVAL_ALREADY_ACTIONED` | 409 | Challenge was already approved or rejected |
| `LOGIN_APPROVAL_EXPIRED` | 410 | Five-minute approval window elapsed; begin a new sign-in |

## Rate Limits

Default limits (contact your gateway operator for custom limits):

| Endpoint class | Limit |
|:---|:---|
| `POST /payments/initiate` | 100 req/min per merchant |
| `GET` endpoints | 300 req/min per key |
| `POST /ob/token` | 30 req/min per client |
| Identity resolution | 600 req/min (public, IP-based) |

Rate limit headers are included in every response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 94
X-RateLimit-Reset: 1714024200
```
