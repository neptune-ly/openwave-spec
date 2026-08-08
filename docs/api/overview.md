# API Overview

OpenWave is defined by six OpenAPI 3.x specification files. All are ready to load into Swagger UI, Postman, Redocly, or any OpenAPI-compatible tool.

## Spec Files

| File | Covers | Download |
|:---|:---|:---|
| `openwave-payments-v1.yaml` | Payments · Recurring · Alias · Webhooks | [View](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-payments-v1.yaml) |
| `openwave-presented-payments-v1.yaml` | QR · NFC · presentment claim · channel capabilities | [View](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-presented-payments-v1.yaml) |
| `openwave-open-banking-v1.0.yaml` | AISP · PISP · OAuth 2.0 + PKCE Consent | [View](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-open-banking-v1.0.yaml) |
| `openwave-credit-finance-v1.yaml` | Credit assessment · BNPL · Revolving credit · Murabaha · Repayment schedules | [View](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-credit-finance-v1.yaml) |
| `openwave-identity-v1.0.yaml` | NPT Identity · Multi-bank Alias · Bank Phonebook | [View](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-identity-v1.0.yaml) |
| `openwave-gateway-interconnect-v1.yaml` | Gateway Discovery · Remote Routing · Interconnect Settlement | [View](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-gateway-interconnect-v1.yaml) |

## Interactive Explorer

[▶ Open API Explorer →](./explorer.md)

Browse and test the full API surface in your browser.

## API Modules

### Payments 1.1.0 (`openwave-payments-v1.yaml`)

| Method | Path | Description |
|:---|:---|:---|
| `POST` | `/payments/initiate` | Create a payment session |
| `GET` | `/payments/{session_id}` | Get session status |
| `GET` | `/payments` | List sessions |
| `POST` | `/payments/{session_id}/cancel` | Cancel a pending session |

### Presented Payments (`openwave-presented-payments-v1.yaml`)

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/capabilities` | Read supported QR/NFC, modes, intents, and operator role |
| `POST` | `/presentments` | Create a merchant-presented request |
| `GET` | `/presentments/{presentment_id}` | Read a presentment |
| `POST` | `/presentments/{presentment_id}/claim` | Claim a presentment and create the underlying session |
| `POST` | `/presentments/{presentment_id}/cancel` | Cancel a pending presentment |
| `GET` | `/presentments/{presentment_id}/status` | Poll current state |

### Recurring Payments

| Method | Path | Description |
|:---|:---|:---|
| `POST` | `/recurring/mandates` | Create a recurring mandate |
| `GET` | `/recurring/mandates/{id}` | Get mandate details |
| `DELETE` | `/recurring/mandates/{id}` | Cancel a mandate |
| `POST` | `/recurring/mandates/{id}/charge` | Execute a charge |

### Alias (NPT)

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/alias/{alias}` | Get alias details |
| `GET` | `/alias/{alias_username}/availability` | Get `AVAILABLE`, `TAKEN`, `RETIRED`, `INVALID`, or `UNKNOWN` |
| `PATCH` | `/alias/rename` | Rename a handle and retire the previous name permanently |
| `GET` | `/alias/{alias}/accounts` | List linked accounts |
| `DELETE` | `/alias/{alias}` | Deactivate alias |

### Webhooks

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/webhooks` | List webhook deliveries |
| `GET` | `/webhooks/session/{session_id}` | List deliveries for a payment session |
| `POST` | `/webhooks/{delivery_id}/retry` | Retry failed delivery |
| `POST` | `/webhooks/test` | Send a signed test webhook |

### Open Banking (`openwave-open-banking-v1.0.yaml`)

| Method | Path | Description |
|:---|:---|:---|
| `POST` | `/ob/consents` | Create a consent request |
| `GET` | `/ob/consents/{id}` | Get consent status |
| `DELETE` | `/ob/consents/{id}` | Revoke consent |
| `POST` | `/ob/token` | Exchange code or refresh token |
| `POST` | `/ob/token/revoke` | Revoke a token (RFC 7009) |
| `GET` | `/ob/accounts` | List consented accounts |
| `GET` | `/ob/accounts/{id}/balances` | Get account balances |
| `GET` | `/ob/accounts/{id}/transactions` | Get transactions |
| `POST` | `/ob/payment-orders` | Initiate a payment order |
| `GET` | `/ob/payment-orders/{id}` | Get payment order status |
| `GET` | `/banks/{handle}/capabilities` | Bank OB capabilities |

### Credit & Finance (`openwave-credit-finance-v1.yaml`)

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/finance/capabilities` | Discover supported finance products and required scopes |
| `POST` | `/credit/assessments` | Create a credit and affordability assessment |
| `GET` | `/credit/assessments/{assessment_id}` | Read assessment status and output |
| `POST` | `/credit/assessments/{assessment_id}/refresh` | Refresh an assessment while consent remains active |
| `DELETE` | `/credit/assessments/{assessment_id}` | Revoke or delete retained assessment output |
| `POST` | `/finance/offers` | Create BNPL, revolving-credit, or Murabaha offer |
| `GET` | `/finance/offers/{offer_id}` | Read finance offer details |
| `POST` | `/finance/offers/{offer_id}/accept` | Customer accepts offer in hosted or official SDK surface |
| `GET` | `/finance/contracts/{contract_id}` | Read finance contract |
| `GET` | `/finance/contracts/{contract_id}/repayment-schedule` | Read repayment schedule |
| `POST` | `/finance/contracts/{contract_id}/cancel` | Cancel a cancellable contract |

### Identity Registry 1.1.0 (`openwave-identity-v1.0.yaml`)

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/v1/identity/resolve` | Resolve alias → IBAN (public) |
| `GET` | `/v1/identity/handles/{handle}/availability` | Get a typed claimability verdict |
| `POST` | `/v1/identity/claim` | Claim an NPT handle |
| `GET` | `/v1/identity/{handle}` | Get bank-authenticated, privacy-minimized profile |
| `PATCH` | `/v1/identity/{handle}/handle` | Rename and permanently retire the old handle |
| `POST` | `/v1/auth/login` | Start customer sign-in and, when required, a linked-bank challenge |
| `POST` | `/v1/auth/login/totp/verify` | Verify TOTP and continue phone/national-ID login to bank approval |
| `GET` | `/v1/auth/login/bank-approval/{challenge_id}` | Poll a challenge with its status token |
| `GET` | `/v1/identity/login-approvals` | List the authenticated bank's approval queue |
| `GET` | `/v1/identity/login-approvals/{challenge_id}` | Read one bank-scoped approval |
| `POST` | `/v1/identity/login-approvals/{challenge_id}/approve` | Approve after local bank authentication |
| `POST` | `/v1/identity/login-approvals/{challenge_id}/reject` | Reject after local bank authentication |
| `GET` | `/v1/identity/{handle}/accounts` | List linked accounts |
| `POST` | `/v1/identity/{handle}/accounts` | Link additional bank |
| `PATCH` | `/v1/identity/{handle}/default` | Set default account |
| `DELETE` | `/v1/identity/{handle}` | Deactivate identity without releasing the handle |
| `GET` | `/v1/banks` | Bank phonebook (public) |
| `POST` | `/v1/banks` | Register bank (admin) |
| `GET` | `/v1/registry/info` | Registry metadata (public) |

### Gateway Interconnect (`openwave-gateway-interconnect-v1.yaml`)

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/gateway-info` | Get gateway metadata, capabilities, and fees |
| `POST` | `/gateway-register` | Register or update a gateway profile |
| `POST` | `/resolve-alias-remote` | Resolve an alias hosted by another gateway |
| `POST` | `/route-payment` | Initiate a cross-gateway payment route |
| `POST` | `/route-status` | Check cross-gateway route status |
| `POST` | `/settlement-batch` | Submit gateway-to-gateway settlement batch |
| `GET` | `/settlement-status` | Check settlement batch status |
| `GET` | `/gateway-health` | Get gateway health and routing availability |

## Base URL

```
https://<your-gateway-host>/api/v1
```

The exact base URL depends on your gateway operator. Example:

```
https://astro.neptune.ly/api/v1
```

## Which endpoint should I read first?

| I am building... | Start here | Then read |
|:---|:---|:---|
| Merchant checkout | `POST /payments/initiate` | `GET /payments/{session_id}`, webhook events, idempotency |
| Merchant QR / NFC checkout | `POST /presentments` | claim flow, capability discovery, hosted SCA |
| Financed checkout / BNPL | `POST /credit/assessments` | finance offers, hosted acceptance, repayment schedule |
| Subscription billing | `POST /recurring/mandates` | hosted mandate consent, mandate charges, cancellation |
| Bank connector | `/send-otp`, `/verify-otp`, `/execute-transaction`, `/notify-credit` | callback authentication and CBS idempotency |
| Open Banking TPP app | `POST /ob/consents` | PKCE, scopes, token exchange, consent revocation |
| NPT identity registry | `GET /v1/identity/resolve` | claim/link/default-account operations |
| Gateway operator | `GET /gateway-info` | `POST /route-payment`, status, settlement batch |

## Common headers

| Header | Direction | Used by | Notes |
|:---|:---|:---|:---|
| `Authorization: Bearer mk_...` | Merchant → Gateway | Payment sessions, mandates, merchant webhooks | Keep server-side only |
| `X-OpenWave-Internal-Key: ow_cbk_...` | Gateway → Bank | Bank callback interface | DB/configured per bank integration |
| `X-OpenWave-Bank-Key: owbk_...` | Bank → Identity Registry | NPT claims and bank-owned account changes | Bank-scoped; not customer login |
| `X-OpenWave-Gateway-Key: owgw_...` | Gateway → Gateway | OW-GIP interconnect calls | Production profiles must also use mTLS |
| `Idempotency-Key` | Client → API | Payment/session/route/create operations | Required for retry-safe writes |
