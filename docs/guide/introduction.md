# What is OpenWave?

**OpenWave** is an open standard that defines a unified API surface for payments and open banking, built specifically for the **Libyan banking ecosystem** and designed to extend across other emerging markets.

## The Problem

Libya's banking sector has historically lacked interoperability:

- Customers are **locked to their bank's app** — paying someone at a different bank is painful or impossible
- Merchants must **integrate with each bank separately** — ten banks means ten integrations
- There is **no shared payment identity layer** — you need someone's full IBAN to send them money
- TPPs and fintechs **cannot safely access account data** — no open banking framework exists

## The Solution

OpenWave solves this with coordinated specifications:

| Module | What it does |
|:---|:---|
| **Payments API** | Standard payment sessions, IBAN/NPT alias routing, recurring mandates, webhooks |
| **Presented Payments API** | QR and NFC presentments that create secure one-time payment or mandate approval flows |
| **Open Banking API** | Consent-based account access (AISP) and payment initiation (PISP) for TPPs |
| **Credit & Finance API** | Consented affordability packages, BNPL, revolving-credit, Murabaha, contracts, repayments |
| **Identity Registry** | Global NPT handle ownership, multi-bank linking, public alias resolution, and bank-vouched digital identity continuity |

## Who Runs a Gateway?

Any server that **implements this specification** is an **OpenWave Gateway**. A gateway:

- Routes payments between merchants and bank cores
- Manages session lifecycle and customer authentication
- Enforces Strong Customer Authentication (SCA)
- Delivers webhook events to merchants
- Issues and validates NPT aliases

In Libya-focused deployments, OpenWave Identity is more than an alias lookup utility. It is the bank-vouched customer payment identity layer that lets one customer identity span multiple banks while keeping bank trust boundaries intact.

Any bank, fintech, processor, or national switch operator can run an OpenWave-compliant gateway. The specification is not tied to a single product or operator.

OpenWave also defines **presented payments as a channel capability**, not a product lock-in. A gateway, bank, or wallet can implement QR or NFC presented flows directly as long as it preserves OpenWave authorization, status, and consent rules.

OpenWave defines **Credit & Finance** as a separate lifecycle module for financed payments. It links customer-approved Open Banking data to BNPL, revolving-credit, and Murabaha-style offers while keeping scoring models, lending policy, and regulatory responsibility with the finance provider.

## Deployment Models

### Centralised (shared gateway)
A single gateway connects multiple banks. Simplest model for a national payment network.

```
Merchant ──→ [ OpenWave Gateway ] ──→ Bank A
                                  └──→ Bank B
                                  └──→ Bank C
```

### Federated (multiple gateways)
Each operator runs its own gateway. They interoperate because the protocol is the same.

```
Merchant A ──→ [ Gateway 1 ] ──┐
                                ├──→ [ Settlement Layer ]
Merchant B ──→ [ Gateway 2 ] ──┘
```

**No single operator controls the network.** The standard is the contract.

## Status

| Module | Version | Status |
|:---|:---:|:---:|
| Payments | 1.0.0 | ✅ Stable |
| Presented Payments | 1.0.0 | Draft |
| Recurring Payments | 1.0.0 | ✅ Stable |
| Alias (NPT) | 1.0.0 | ✅ Stable |
| Webhooks | 1.0.0 | ✅ Stable |
| Open Banking — AISP | 1.0.0 | ✅ Stable |
| Open Banking — PISP | 1.0.0 | ✅ Stable |
| Credit & Finance | 1.0.0 | Draft |
| Identity Registry | 1.0.0 | ✅ Stable |

## Next Steps

- [Core Concepts →](./concepts.md)
- [NPT explained →](./npt.md)
- [Presented payments →](./presented-payments.md)
- [Credit & Finance →](./credit-finance.md)
- [Merchant integration guide →](./merchants.md)
