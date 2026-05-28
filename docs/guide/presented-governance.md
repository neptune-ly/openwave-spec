# Channel Governance

Presented payments are part of the OpenWave standard, but operators retain control over which channels are active.

## Why governance matters

QR and NFC have different operational, fraud, and product implications across banks, wallets, and merchants. The standard therefore separates:

- **protocol compliance**
- **channel enablement**

An operator can be compliant without enabling every presented channel or intent.

## Required capability flags

At minimum, capability metadata should state:

- supported channels
- supported modes
- supported intents
- deployment role
- enablement flags for merchant-presented QR/NFC/app handoff, direct operator presentment, and mandate-approval presentments

## Merchant and wallet expectation

Merchant and wallet software must check capabilities before assuming:

- NFC is available
- recurring mandate approval can start from presentment
- a direct bank or wallet endpoint can replace a gateway endpoint

## Bank governance expectation

Banks should not partially implement the flow in a way that breaks merchant expectations. If a bank enables a presented-payment mode, it should also support:

- the advertised capability contract
- proper secure authorization
- correct payment or mandate state transitions
- standard webhook or callback semantics where applicable

## Recommended rollout order

1. Merchant-presented QR for one-time payments
2. Merchant-presented NFC for one-time payments
3. Merchant-presented QR or NFC for mandate approval
4. Direct bank or wallet merchant-presented implementations

This keeps ecosystem adoption predictable and reduces divergent bank behavior early on.
