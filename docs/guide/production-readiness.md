# Production Readiness

OpenWave implementations must make production operation clear to operators, banks, merchants, TPPs, and customers. The standard separates technical protocol compliance from deployment readiness: a deployment can implement the APIs correctly and still be marked incomplete until live credentials, callback routing, branding, security controls, and webhook operations are ready.

## Environment Separation

Sandbox and live are separate environments, not a request flag.

| Area | Sandbox | Live |
|---|---|---|
| API base URL | Dedicated sandbox URL or clearly marked sandbox host | Dedicated live URL |
| Credentials | `test` or sandbox-only credentials | live-only credentials |
| Bank execution | Simulated or sandbox bank callbacks | real bank/CBS/rail execution |
| Webhooks | `environment=SANDBOX` in events | `environment=LIVE` in events |
| Settlement | no real settlement | production settlement and reconciliation |

Implementations should expose readiness status per environment:

- `READY`: credentials, webhook, branding, contact details, and bank routing are complete.
- `INCOMPLETE`: required operational metadata is missing.
- `DISABLED`: the operator has disabled that environment.
- `SANDBOX`: the resource is test-only and cannot move real funds.
- `LIVE`: the resource can affect production funds or customer data.

## Branding Metadata

OpenWave surfaces should identify the party asking for payment, consent, or recurring approval. Brand metadata is optional in the protocol, but production portals should warn when it is missing.

| Actor | Metadata |
|---|---|
| Bank | display name, logo URL, brand color, support email/URL, website |
| Merchant | display name, logo URL, brand color, support email, website |
| TPP / Open Banking client | display name, logo URL, brand color, support email, website |
| Gateway operator | display name, operator mark, support URL, environment label |

Logo upload implementations must validate file type and size, generate safe filenames, prevent path traversal, and serve assets from a configured public asset base URL. Operators may start with local server storage and later move to S3-compatible storage without changing the public metadata shape.

## Where Branding Appears

Branding must be visible where the customer makes a trust decision:

- hosted checkout and SDK checkout sheets,
- presented QR and NFC review screens,
- recurring mandate approval screens,
- Open Banking consent screens,
- customer history, consent, and recurring-management portals,
- merchant, bank, and operator portal detail pages.

Merchants, TPPs, and banks must not be able to impersonate another regulated participant. Operators should review display names, logos, and websites before enabling live mode.

## Security Baseline

Production portals should provide:

- secure-link password reset with short-lived, single-use reset tokens,
- passkey support where WebAuthn is available,
- active session management,
- recent authentication events,
- audit logs for create, update, credential rotation, reset, and upload actions,
- no raw password or API key replay except one-time controlled fallback when notification delivery fails.

Customer authentication for payments, presented payments, recurring mandates, Open Banking consent, and credit/finance consent must happen in a bank-controlled, hosted OpenWave, or official SDK/webview surface. Merchants must never collect OTP, PIN, passkeys, bank passwords, or push approvals directly.

## Audit Events

Operator portals should record at least:

| Event family | Examples |
|---|---|
| User/security | user created, password reset requested, passkey added, session revoked |
| Client lifecycle | merchant created, TPP created, bank registered |
| Credentials | sandbox key rotated, live key rotated, callback key rotated |
| Branding | logo uploaded, brand metadata updated |
| Environment | live enabled, live disabled, sandbox enabled, webhook changed |

Audit event details should be safe for support and compliance teams. Do not store raw API keys, raw passwords, private keys, card data, full OTPs, or sensitive customer account data in audit details.

## Identity Scope

OpenWave Identity owns NPT aliases, bank-vouched account links, bank directory metadata, and alias resolution. It does not own:

- payment sessions,
- merchant lifecycle state,
- sandbox/live transaction state,
- finance contracts,
- webhook delivery state.

Identity bank branding exists to help customers and implementers recognize bank participants and public directory entries. Merchant and TPP branding belongs to the gateway or the operator that manages those clients.

## Go-Live Checklist

- Sandbox and live base URLs are visible and separate.
- Sandbox and live credentials are separate and can be rotated independently.
- Live mode is disabled until merchant/bank contact details, webhook URL, and settlement routing are complete.
- Logos and support contacts are configured for banks, merchants, and TPPs that appear in customer approval surfaces.
- Webhook signing secrets are configured and tested.
- Audit events are emitted for all admin actions.
- Password reset, passkeys, active sessions, and auth-event history are available to portal users.
- Public docs explain sandbox/live behavior, secure hosted authorization, branding expectations, and webhook verification.
