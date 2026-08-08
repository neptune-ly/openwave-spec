# Downloads

All OpenWave spec files are OpenAPI 3.x and fully machine-readable. Import them into any compatible tool in seconds.

---

## OpenAPI Spec Files

### Payments API 1.1.0 — `openwave-payments-v1.yaml`

Covers payment sessions, NPT alias routing, recurring mandates, webhooks, and bank partner callbacks.

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-payments-v1.yaml">View on GitHub</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml" target="_blank">Open in Swagger Editor ↗</a>
</div>

**Key endpoints:**

| Method | Path | Description |
|---|---|---|
| `POST` | `/payments/initiate` | Create a payment session |
| `GET` | `/payments/{session_id}` | Poll payment status |
| `POST` | `/session/{id}/resolve-payer` | Resolve payer alias or IBAN |
| `POST` | `/session/{id}/select-auth` | Start customer OTP or push authorization |
| `POST` | `/session/{id}/confirm-otp` | Confirm OTP auth |
| `POST` | `/alias/enroll` | Enroll an NPT alias through the registry-backed flow |
| `GET` | `/alias/{alias}` | Look up a registered alias |
| `GET` | `/alias/{alias_username}/availability` | Get a typed availability or safe `UNKNOWN` verdict |
| `PATCH` | `/alias/rename` | Rename and permanently retire the previous username |
| `POST` | `/recurring/mandates` | Create recurring mandate |
| `GET` | `/webhooks` | List webhook deliveries |
| `GET` | `/webhooks/session/{session_id}` | List deliveries for a payment session |
| `POST` | `/webhooks/{delivery_id}/retry` | Retry a failed webhook delivery |

---

### Presented Payments API — `openwave-presented-payments-v1.yaml`

Covers merchant-presented QR, NFC, and app/wallet handoff flows, direct operator implementation patterns, customer review summaries, and channel capability discovery.

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-presented-payments-v1.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-presented-payments-v1.yaml">View on GitHub</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-presented-payments-v1.yaml" target="_blank">Open in Swagger Editor ↗</a>
</div>

**Key endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/capabilities` | Read supported channels, modes, intents, and deployment role |
| `POST` | `/presentments` | Create presentment for one-time payment or mandate approval |
| `GET` | `/presentments/{presentment_id}` | Read presentment metadata |
| `POST` | `/presentments/{presentment_id}/claim` | Claim presentment and open hosted or SDK authorization |
| `POST` | `/presentments/{presentment_id}/cancel` | Cancel a pending presentment |
| `GET` | `/presentments/{presentment_id}/status` | Poll presentment state |

---

### Open Banking API — `openwave-open-banking-v1.0.yaml`

Covers OAuth 2.0 + PKCE consent, AISP (account data), PISP (payment initiation), and SCA.

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-open-banking-v1.0.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-open-banking-v1.0.yaml">View on GitHub</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-open-banking-v1.0.yaml" target="_blank">Open in Swagger Editor ↗</a>
</div>

**Key endpoints:**

| Method | Path | Description |
|---|---|---|
| `POST` | `/ob/consent` | Create an account access consent |
| `GET` | `/ob/accounts` | List customer accounts (AISP) |
| `GET` | `/ob/accounts/{id}/balances` | Get account balances |
| `GET` | `/ob/accounts/{id}/transactions` | Get transaction history |
| `POST` | `/ob/payment-orders` | Initiate a PISP payment |
| `GET` | `/ob/payment-orders/{id}` | Poll payment order status |

---

### Credit & Finance API — `openwave-credit-finance-v1.yaml`

Covers credit-assessment output, affordability packages, BNPL offers, revolving-credit drawdowns, Murabaha disclosures, contracts, repayment schedules, and finance webhooks.

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-credit-finance-v1.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-credit-finance-v1.yaml">View on GitHub</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-credit-finance-v1.yaml" target="_blank">Open in Swagger Editor ↗</a>
</div>

**Key endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/finance/capabilities` | Discover supported finance products and required Open Banking scopes |
| `POST` | `/credit/assessments` | Create purpose-bound affordability and risk assessment |
| `GET` | `/credit/assessments/{assessment_id}` | Read assessment output |
| `POST` | `/finance/offers` | Create BNPL, revolving-credit, or Murabaha offer |
| `POST` | `/finance/offers/{offer_id}/accept` | Customer accepts offer in hosted or official SDK surface |
| `GET` | `/finance/contracts/{contract_id}` | Read finance contract |
| `GET` | `/finance/contracts/{contract_id}/repayment-schedule` | Read repayment schedule |

---

### Identity Registry API 1.1.0 — `openwave-identity-v1.0.yaml`

Covers NPT handle ownership, typed availability, safe rename, permanent retirement, multi-bank account linking, linked-bank login approval, public alias resolution, and the bank directory.

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-identity-v1.0.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-identity-v1.0.yaml">View on GitHub</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-identity-v1.0.yaml" target="_blank">Open in Swagger Editor ↗</a>
</div>

**Key endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/identity/handles/{handle}/availability` | Return `AVAILABLE`, `TAKEN`, `RETIRED`, or `INVALID` |
| `POST` | `/identity/claim` | Register an NPT handle |
| `PATCH` | `/identity/{npt_handle}/handle` | Rename and retire the previous handle permanently |
| `POST` | `/auth/login` | Start portal sign-in and linked-bank selection when required |
| `GET` | `/auth/login/bank-approval/{challenge_id}` | Poll with the initiator's status token |
| `GET` | `/identity/login-approvals` | List the authenticated bank's approval queue |
| `POST` | `/identity/login-approvals/{challenge_id}/approve` | Approve after local bank authentication |
| `POST` | `/identity/login-approvals/{challenge_id}/reject` | Reject after local bank authentication |
| `GET` | `/identity/resolve?alias={alias}` | Resolve alias → IBAN + bank |
| `POST` | `/identity/{npt_handle}/accounts` | Link an account to a handle |
| `DELETE` | `/identity/{npt_handle}` | Deactivate without releasing the handle |
| `GET` | `/banks` | List all registered banks |

---

### Gateway Interconnect API — `openwave-gateway-interconnect-v1.yaml`

Covers gateway discovery, remote alias resolution, cross-gateway routing, health checks, settlement batches, and gateway-to-gateway authentication.

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-gateway-interconnect-v1.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-gateway-interconnect-v1.yaml">View on GitHub</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-gateway-interconnect-v1.yaml" target="_blank">Open in Swagger Editor ↗</a>
</div>

**Key endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/gateway-info` | Read gateway capabilities, banks, rails, regions, and fees |
| `POST` | `/gateway-register` | Register or update gateway metadata |
| `GET` | `/gateway-health` | Check peer gateway health and degraded modes |
| `POST` | `/resolve-alias-remote` | Resolve an alias through a remote gateway |
| `POST` | `/route-payment` | Route a cross-gateway payment |
| `POST` | `/route-status` | Read cross-gateway route status |
| `POST` | `/settlement-batch` | Submit settlement batch details |
| `GET` | `/settlement-status` | Read settlement batch state |

---

## Postman Collections

Import any spec file directly into Postman to get a pre-built collection with all endpoints, example payloads, and environment variables.

### Method 1 — Import by URL (recommended)

1. Open **Postman**
2. Click **Import** → **Link**
3. Paste one of these raw URLs:

```
# Payments
https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml

# Presented Payments
https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-presented-payments-v1.yaml

# Open Banking
https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-open-banking-v1.0.yaml

# Credit & Finance
https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-credit-finance-v1.yaml

# Identity Registry
https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-identity-v1.0.yaml

# Gateway Interconnect
https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-gateway-interconnect-v1.yaml
```

4. Postman generates the full collection automatically. Set your environment variables:

```
GATEWAY_URL    = https://your-gateway.example.com
MERCHANT_KEY   = your-merchant-api-key
BANK_KEY       = your-bank-api-key
ADMIN_KEY      = your-admin-api-key
GATEWAY_KEY    = your-peer-gateway-key
FINANCE_KEY    = your-finance-provider-key
```

### Method 2 — Download YAML then import as file

Download the YAML above → in Postman click **Import** → **File** → select the downloaded file.

### Suggested Postman environments

| Variable | Used by | Example |
|---|---|---|
| `GATEWAY_URL` | Payments, Open Banking | `https://sandbox.gateway.example.com` |
| `PRESENTMENT_URL` | Presented payments | `https://sandbox.gateway.example.com` |
| `IDENTITY_URL` | Identity Registry | `https://identity.example.com` |
| `MERCHANT_KEY` | Merchant payment APIs | `mk_test_...` |
| `BANK_KEY` | Bank-to-registry APIs | `owbk_...` |
| `INTERNAL_KEY` | Gateway-to-bank callbacks | `ow_cbk_...` |
| `GATEWAY_KEY` | Gateway interconnect | `owgw_...` |
| `FINANCE_KEY` | Credit & Finance provider APIs | `fp_test_...` |
| `WEBHOOK_SECRET` | Signature verification tests | `whsec_...` |

---

## Swagger / OpenAPI Tools

### Swagger UI (online)

Click any "Open in Swagger Editor" button above, or paste a raw URL into [editor.swagger.io](https://editor.swagger.io).

### Run Swagger UI locally

```bash
docker run -p 8080:8080 \
  -e SWAGGER_JSON_URL=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml \
  swaggerapi/swagger-ui
```

Open `http://localhost:8080` — full interactive docs with live try-it-out (point it at your gateway).

### Redocly

```bash
npm ci
npm run spec:lint

# Optional local preview using the pinned CLI
npx --no-install redocly preview-docs openwave-payments-v1.yaml
```

### Insomnia

Use **Create → Import from URL** and paste any raw OpenAPI URL from this page. Create separate environments for sandbox and production so merchant, bank, and gateway credentials do not mix.

### Hoppscotch

Use **Collections → Import → OpenAPI** for quick browser-based exploration. Keep production credentials out of shared browser sessions.

### Stoplight Elements

Teams that want an internal branded API portal can render the same YAML files with Stoplight Elements or any OpenAPI 3.x compatible documentation renderer.

---

## Code Generation

Generate a type-safe client in any language using [openapi-generator](https://openapi-generator.tech):

::: code-group

```bash [TypeScript (fetch)]
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml \
  -g typescript-fetch \
  -o ./openwave-client-ts
```

```bash [TypeScript (axios)]
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml \
  -g typescript-axios \
  -o ./openwave-client-ts-axios
```

```bash [Kotlin]
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml \
  -g kotlin \
  -o ./openwave-client-kotlin
```

```bash [Python]
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml \
  -g python \
  -o ./openwave-client-python
```

```bash [Go]
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml \
  -g go \
  -o ./openwave-client-go
```

```bash [Java]
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml \
  -g java \
  -o ./openwave-client-java
```

```bash [C# / .NET]
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml \
  -g csharp \
  -o ./openwave-client-dotnet
```

:::

### TypeScript schema-first clients

For frontend and backend teams that prefer lightweight generated types:

```bash
npx openapi-typescript \
  https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml \
  -o ./src/openwave-payments.d.ts
```

For typed fetch clients:

```bash
npx openapi-fetch \
  https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml \
  -o ./src/openwave-payments-client.ts
```

### Microsoft Kiota

Kiota can generate clients for .NET, Java, Go, PHP, Python, Ruby, and TypeScript:

```bash
kiota generate \
  --openapi https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-open-banking-v1.0.yaml \
  --language typescript \
  --output ./openwave-ob-kiota
```

::: tip Native SDKs
OpenWave-compatible gateway operators may publish hand-crafted SDKs for their own products. For the standard itself, generated clients from the OpenAPI files remain the portable baseline.
:::

---

## Direct GitHub Access

Clone the full spec repository for offline use or CI/CD validation:

```bash
git clone https://github.com/neptune-ly/openwave-spec.git
cd openwave-spec

# Install exactly the dependency versions in package-lock.json
npm ci

# Lint all six specs, enforce the NPT contract, and build the docs
npm run verify
```

---

## Versioning

OpenWave follows **Semantic Versioning**:

| Change | Version bump |
|:---|:---:|
| Breaking change to an existing endpoint | `MAJOR` (1.x → 2.0) |
| New endpoint or optional field | `MINOR` (1.0 → 1.1) |
| Clarification, fix, or example update | `PATCH` (1.0.0 → 1.0.1) |

The OpenAPI `info.version` identifies each module release. Webhook `api_version` identifies the event-envelope contract and can evolve independently; the current envelope remains `1.0.0`. All changes are logged in [CHANGELOG.md](https://github.com/neptune-ly/openwave-spec/blob/main/CHANGELOG.md).
