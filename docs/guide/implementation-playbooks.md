# Implementation Playbooks

This page turns the OpenWave standard into practical integration paths. Use it as the starting checklist for merchants, banks, TPPs, gateway operators, and registry operators.

## Merchant playbook

Merchants integrate with a gateway, not directly with banks.

| Phase | Build | Done when |
|---|---|---|
| 1 | Merchant registration and API key storage | `mk_...` keys exist only on the merchant backend. |
| 2 | Payment session creation | Backend can create a session with amount, currency, order reference, callback URL, and return URL. |
| 3 | Hosted checkout or SDK | Customer enters NPT alias or IBAN and authorizes in gateway-hosted UI. |
| 4 | Webhook receiver | Merchant verifies `X-OpenWave-Signature` and persists events idempotently. |
| 5 | Reconciliation | Merchant can match order reference, payment ID, amount, fee, and settlement status. |
| 6 | Recurring mandates | Customer sees amount/frequency/expiry and approves before future charges. |
| 7 | Open Banking, if needed | Customer sees scopes and bank before consent; backend exchanges authorization code with PKCE. |
| 8 | Financed checkout, if offered | Merchant waits for final financed-payment confirmation and receives only merchant-safe finance status. |

Minimum production evidence:

- Successful payment by NPT alias.
- Successful payment by IBAN.
- Failed OTP and retry.
- Signed webhook verification.
- Duplicate webhook idempotency.
- Refund or cancellation path where supported.
- Customer-safe error messages.

## Bank playbook

Banks expose callbacks to gateways and integrate with their CBS or bank middleware.

| Phase | Build | Done when |
|---|---|---|
| 1 | Callback authentication | Gateway calls are authenticated with `X-OpenWave-Internal-Key: ow_cbk_...`. |
| 2 | Customer lookup | Bank can resolve customer eligibility and available SCA methods without exposing private account data. |
| 3 | OTP or push | Bank sends and verifies OTP or push approval. |
| 4 | Internal transfer | Same-bank debtor and creditor accounts are mapped to CBS account numbers before execution. |
| 5 | Interbank route | Cross-bank payments use the configured national rail or gateway interconnect path. |
| 6 | Idempotency | Retried debit, credit, and notification calls do not duplicate money movement. |
| 7 | Open Banking APIs | Accounts, balances, transactions, standing orders, and payment orders enforce consent scopes. |

Minimum production evidence:

- Missing key returns unauthorized.
- Wrong key returns unauthorized.
- Valid key reaches OTP send.
- OTP verified payment executes once.
- Blocked account returns a clear standard error.
- CBS timeout returns retry-safe dependency error.
- Audit trail exists for SCA, debit, credit, and consent access.

## TPP and fintech playbook

TPPs use OAuth 2.0 Authorization Code with PKCE for Open Banking.

| Phase | Build | Done when |
|---|---|---|
| 1 | Client registration | TPP has redirect URIs, client ID, and allowed scopes. |
| 2 | Consent creation | TPP creates consent with purpose, expiry, scopes, and PKCE challenge. |
| 3 | Hosted consent | Customer sees TPP, bank, accounts, scope list, duration, and revocation path. |
| 4 | Token exchange | Backend exchanges code and verifier for scoped tokens. |
| 5 | API calls | TPP calls only APIs covered by granted scopes. |
| 6 | Revocation | Consent revocation stops future token use. |

Minimum production evidence:

- Missing PKCE verifier fails.
- Redirect URI mismatch fails.
- Token cannot access ungranted scopes.
- Consent revocation invalidates access.
- Customer portal shows active and revoked consents.

## Finance provider playbook

Finance providers turn customer-permissioned data into offers and repayment schedules.

| Phase | Build | Done when |
|---|---|---|
| 1 | Product capability | Provider advertises BNPL, revolving-credit, and/or Murabaha support. |
| 2 | Finance consent | Customer sees finance purpose, amount, tenor, data window, selected accounts, and credit scopes. |
| 3 | Assessment | Provider creates purpose-bound affordability output and safe reason codes. |
| 4 | Offer | Provider creates offer with disclosures, repayment preview, and hosted acceptance URL. |
| 5 | Acceptance | Customer accepts terms and repayment schedule in hosted or official SDK surface. |
| 6 | Settlement | Financier pays merchant through the normal OpenWave payment lifecycle. |
| 7 | Servicing | Customer can see contract, repayments, failures, cancellations, and revocation state. |

Minimum production evidence:

- Rejected consent creates no assessment.
- Revoked consent blocks assessment refresh.
- Merchant does not receive raw transaction data.
- BNPL offer acceptance creates contract and payment.
- Murabaha offer shows cash price, profit, total sale price, and installment schedule before acceptance.
- Declines return safe reason codes and correlation IDs.

## Gateway operator playbook

Gateway operators implement policy, routing, merchant APIs, hosted customer surfaces, webhooks, and interconnect.

| Phase | Build | Done when |
|---|---|---|
| 1 | Merchant API | Payment and mandate creation enforce keys, idempotency, and amount validation. |
| 2 | Hosted customer UI | Payment, mandate, and Open Banking consent are rendered outside merchant-controlled OTP collection. |
| 3 | Bank routing | Gateway maps payer/merchant bank, same-bank route, interbank rail, and settlement state. |
| 4 | Webhook delivery | Events are signed, retried, logged, and replayable by operators. |
| 5 | Identity resolution | Gateway uses the registry as source of truth for NPT handles. |
| 6 | OW-GIP | Gateway can discover peers, route remote payments, and reconcile settlement batches. |
| 7 | OAuth protected-resource posture | Gateway publishes protected-resource metadata, uses authenticated token introspection, and shows fail-closed readiness without exposing secrets. |

Minimum production evidence:

- End-to-end one-time payment.
- Recurring mandate approval, charge, cancellation.
- Open Banking consent, token exchange, account read, revocation.
- Webhook retry after receiver outage.
- Gateway health and route-status responses.
- Operational dashboard with bank, merchant, customer, route, and error filters.
- OAuth readiness shows authorization servers, supported scopes, resource-server credential presence, tokenless protection, and kill-switch posture.

## Identity registry playbook

The registry is the source of truth for NPT handles and bank-scoped account links.

| Phase | Build | Done when |
|---|---|---|
| 1 | Bank registration | Bank has `owbk_...` credentials and a bank handle namespace. |
| 2 | Handle claim | Customer can claim one global username. |
| 3 | Account link | Bank links only accounts it owns and has vouched for. |
| 4 | Default route | Customer can choose default account without unsafe global alias rename. |
| 5 | Public resolution | Gateways can resolve route metadata without receiving private banking data. |
| 6 | Recovery and governance | Suspension, dispute, recovery, and audit paths are documented. |
| 7 | OAuth control plane, if operated | Registry owns client registration, authorization-code + PKCE consent, resource-server clients, token/grant revocation, and environment/owner kill switches. |

Minimum production evidence for an OAuth control plane:

- Exact redirect URI matching is enforced.
- PKCE `S256` is mandatory and `plain` is rejected.
- Authorization codes are short-lived, one-time use, and bound to the client and redirect URI.
- Refresh tokens are client-bound and reuse revokes the token family.
- Resource-server introspection requires an approved resource-server client.
- Customer/operator grant revocation invalidates future access.
- Kill switches can stop OAuth globally, per environment, per owner type, and per client.

## Standard test personas

| Persona | Purpose |
|---|---|
| Customer with one bank account | Basic payment and consent. |
| Customer with multiple accounts at one bank | Default account selection. |
| Customer with accounts at multiple banks | NPT handle plus bank-scoped routes. |
| Merchant with same-bank creditor account | Internal transfer route. |
| Merchant with different-bank creditor account | Interbank route and settlement. |
| TPP with read-only scopes | AISP token handling. |
| TPP with payment scope | PISP authorization and status. |

## Related pages

- [Payments API](../api/payments.md)
- [Open Banking API](../api/open-banking.md)
- [Credit & Finance API](../api/credit-finance.md)
- [Identity Registry API](../api/identity.md)
- [Gateway Interconnect API](../api/gateway-interconnect.md)
- [Downloads and client tools](../downloads.md)
