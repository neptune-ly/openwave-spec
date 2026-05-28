# Direct Operator Implementation

Presented payments are not restricted to commercial gateway products.

## Why the standard allows this

If OpenWave locked QR and NFC to one gateway product, it would break the core goal of interoperability. The standard therefore defines a common channel contract that any compliant operator can implement.

## Who can implement the channel

- a gateway operator
- a bank directly
- a wallet or payment app directly

## Compliance rule

Direct implementation is compliant only when it preserves:

- OpenWave SCA and consent rules
- capability discovery
- replay-safe presentment lifecycle
- reuse of the existing payment or mandate lifecycle after claim

## Direct bank implementation

A bank may expose the presented-payment endpoints itself when:

- it wants QR or NFC flows in its own mobile app
- it wants direct merchant-presented support without an intermediary commercial gateway
- it can still route final outcomes through the OpenWave payment lifecycle

## Direct wallet implementation

A wallet or payment app may implement presented payments when:

- it exposes OpenWave-compliant capability metadata
- it uses bank-controlled or OpenWave-controlled authorization surfaces when SCA is required
- it does not bypass consent or mandate approval rules

## Interoperability outcome

This model allows channel innovation without fragmenting the network contract. A merchant, bank, or wallet reads capabilities, creates a merchant-presented presentment, and then hands into the same trusted payment system regardless of whether the operator behind it is a gateway, bank, or wallet.

## Minimum compliance checklist

| Requirement | Gateway | Bank | Wallet |
|---|---:|---:|---:|
| `GET /capabilities` or equivalent metadata | Yes | Yes | Yes |
| Presentment create/claim/cancel/status lifecycle | Yes | Yes | Yes |
| Replay protection and expiry | Yes | Yes | Yes |
| Secure SCA or consent surface | Yes | Yes | Yes |
| Reuse standard payment or mandate lifecycle after claim | Yes | Yes | Yes |

## What Astro represents in this model

Neptune. Astro is one **gateway implementation** of this standard. It supports merchant-presented flows, but the standard is still valid when a bank or wallet operates the same merchant-presented APIs directly for its merchants or acceptors.
