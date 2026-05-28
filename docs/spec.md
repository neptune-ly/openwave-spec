# Spec Files

Six OpenAPI 3.0.3 files define the complete OpenWave standard. All are machine-readable and compatible with any OpenAPI tooling.

## openwave-payments-v1.yaml

**Covers:** Payment sessions, recurring mandates, NPT alias management, webhooks

```bash
# Load in Swagger UI
curl https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml

# Import to Postman
# File → Import → Link → paste URL above
```

→ [View on GitHub](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-payments-v1.yaml)<br>
→ [Raw YAML](https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml)

## openwave-presented-payments-v1.yaml

**Covers:** Merchant-presented QR/NFC/app handoff, presentment creation and claim, customer review summaries, direct operator implementation patterns, and capability discovery

→ [View on GitHub](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-presented-payments-v1.yaml)<br>
→ [Raw YAML](https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-presented-payments-v1.yaml)

## openwave-open-banking-v1.0.yaml

**Covers:** OAuth 2.0 + PKCE consent flow, AISP (accounts, balances, transactions), PISP (payment initiation), SCA, bank capabilities

→ [View on GitHub](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-open-banking-v1.0.yaml)<br>
→ [Raw YAML](https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-open-banking-v1.0.yaml)

## openwave-credit-finance-v1.yaml

**Covers:** Credit-assessment consent output, affordability packages, BNPL offers, revolving-credit drawdowns, Murabaha disclosures, contracts, repayment schedules, and finance webhooks

→ [View on GitHub](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-credit-finance-v1.yaml)<br>
→ [Raw YAML](https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-credit-finance-v1.yaml)

## openwave-identity-v1.0.yaml

**Covers:** NPT handle ownership, multi-bank account linking, public alias resolution, bank phonebook, governance endpoints

→ [View on GitHub](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-identity-v1.0.yaml)<br>
→ [Raw YAML](https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-identity-v1.0.yaml)

## openwave-gateway-interconnect-v1.yaml

**Covers:** Gateway discovery, remote alias resolution, cross-gateway routing, route status, gateway-to-gateway settlement, health checks

→ [View on GitHub](https://github.com/neptune-ly/openwave-spec/blob/main/openwave-gateway-interconnect-v1.yaml)<br>
→ [Raw YAML](https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-gateway-interconnect-v1.yaml)

---

## Using the Specs

### Swagger UI

```html
<SwaggerUI url="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml" />
```

### Swagger Editor

Visit [editor.swagger.io](https://editor.swagger.io) and paste the raw URL via **File → Import URL**.

### Postman

1. Open Postman
2. Click **Import**
3. Paste the raw YAML URL
4. Postman generates a full collection with all endpoints

### Code Generation (openapi-generator)

```bash
# Generate a TypeScript SDK
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml \
  -g typescript-fetch \
  -o ./generated-client

# Generate a Python client
npx @openapitools/openapi-generator-cli generate \
  -i openwave-payments-v1.yaml \
  -g python \
  -o ./openwave-python
```

---

## Versioning

OpenWave follows **Semantic Versioning**:

| Change | Version bump |
|:---|:---:|
| Breaking change to existing endpoint | `MAJOR` (1.x → 2.0) |
| New endpoint or optional field | `MINOR` (1.0 → 1.1) |
| Clarification, fix, example update | `PATCH` (1.0.0 → 1.0.1) |

The `api_version` field in webhook envelopes and the `info.version` in each spec always reflect the module version.

All changes are documented in [CHANGELOG.md](https://github.com/neptune-ly/openwave-spec/blob/main/CHANGELOG.md).
