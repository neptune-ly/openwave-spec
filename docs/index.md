---
layout: home

hero:
  name: "OpenWave"
  text: "Open payments. Open banking. One interoperable standard."
  tagline: "An Apache 2.0 standard developed by Neptune. Fintech for bank payments, NPT identity, Open Banking consent, Credit & Finance, webhooks, settlement, and gateway-to-gateway switching."
  image:
    src: /hero-openwave.svg
    alt: OpenWave Logo
  actions:
    - theme: brand
      text: Start Building
      link: /guide/introduction
    - theme: alt
      text: Endpoint Map
      link: /api/overview
    - theme: alt
      text: Downloads
      link: /downloads
    - theme: alt
      text: Presented Payments
      link: /guide/presented-payments
    - theme: alt
      text: Credit & Finance
      link: /guide/credit-finance
    - theme: alt
      text: Gateway Interconnect
      link: /guide/gateway-interconnect

features:
  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
    title: For Merchants
    details: Integrate once. Accept payments from any participating bank via IBAN or NPT alias. No per-bank integrations, no separate agreements — one API key to rule them all.
    link: /guide/merchants
    linkText: Merchant Integration Guide

  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>'
    title: For Banks
    details: Join the OpenWave network. Expose a standardised callback interface and your customers can instantly pay any merchant in the ecosystem — from any bank.
    link: /guide/banks
    linkText: Bank Integration Guide

  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
    title: For TPPs & Fintechs
    details: Read account data and initiate payments on behalf of customers under explicit OAuth 2.0 + PKCE consent. PSD2-inspired, built for emerging market realities.
    link: /guide/tpp
    linkText: Open Banking (TPP) Guide

  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/><path d="M19 19l2 2"/><path d="M19 21l2-2"/></svg>'
    title: Credit & Finance
    details: Standardize consented affordability packages, BNPL offers, revolving-credit drawdowns, Murabaha disclosures, repayment schedules, and finance webhooks without forcing one scoring model.
    link: /guide/credit-finance
    linkText: Credit & Finance Guide

  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/><path d="M4 12a8 8 0 0 0 8 8"/><path d="M20 12a8 8 0 0 0-8-8"/></svg>'
    title: Presented Payments
    details: Merchant-presented QR, NFC, and app-handoff flows that still keep bank authorization inside hosted or official SDK surfaces. Gateways, banks, and wallets can operate the channel for merchants when enabled.
    link: /guide/presented-payments
    linkText: Presented Payment Guide

  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
    title: NPT — National Payment Tag
    details: "`mtellesy@andalus` — one username, any bank. Pay by alias without knowing an IBAN. The universal payment identity layer for Libya and beyond."
    link: /guide/npt
    linkText: Learn about NPT

  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>'
    title: Gateway-Agnostic & Federated
    details: Any operator can run a compliant gateway. Multiple gateways interoperate automatically because the standard is the contract — not the operator.
    link: /guide/operators
    linkText: Run a Gateway

  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
    title: Ready to Use
    details: Six OpenAPI 3.0 spec files, Postman collections, and code generation templates. Import to Swagger, Postman, Redocly, Insomnia, or generated clients in seconds.
    link: /downloads
    linkText: Download Specs & Collections
---

<div class="ow-stats-bar">
  <div class="ow-stat"><span class="ow-stat-num">6</span><span class="ow-stat-label">OpenAPI Spec Files</span></div>
  <div class="ow-stat-div"></div>
  <div class="ow-stat"><span class="ow-stat-num">QR + NFC</span><span class="ow-stat-label">Presented Channels</span></div>
  <div class="ow-stat-div"></div>
  <div class="ow-stat"><span class="ow-stat-num">70+</span><span class="ow-stat-label">API Endpoints</span></div>
  <div class="ow-stat-div"></div>
  <div class="ow-stat"><span class="ow-stat-num">5</span><span class="ow-stat-label">Integration Roles</span></div>
  <div class="ow-stat-div"></div>
  <div class="ow-stat"><span class="ow-stat-num">Apache 2.0</span><span class="ow-stat-label">Open License</span></div>
</div>

---

<div class="neptune-brand-strip" aria-label="Neptune brand">
  <img class="neptune-logo neptune-logo-default" src="/neptune-logo.png" alt="Neptune. Financial Technology And Solutions">
  <img class="neptune-logo neptune-logo-dark" src="/neptune-logo-light.png" alt="Neptune. Financial Technology And Solutions">
  <p>OpenWave is developed and maintained by Neptune. Fintech as open infrastructure: product-neutral, bank-agnostic, and built for a multi-gateway ecosystem.</p>
  <a href="./guide/architecture.html">Read the architecture</a>
</div>

---

<section class="ow-architecture-board" aria-label="Animated OpenWave architecture and data flow">
  <div class="ow-suite-head">
    <p class="ow-eyebrow">Architecture in motion</p>
    <h2>OpenWave standardizes the contract between apps, gateways, identity, banks, finance providers, and settlement rails.</h2>
    <p>The moving paths are separated by purpose: session creation, customer authorization, alias resolution, finance assessment, bank execution, webhook confirmation, and gateway-to-gateway routing.</p>
  </div>
  <div class="ow-system-map" aria-hidden="true">
    <div class="ow-map-node ow-map-merchant"><b>Merchant backend</b><small>Create sessions, verify webhooks</small></div>
    <div class="ow-map-node ow-map-customer"><b>Customer app / SDK</b><small>Hosted checkout and consent</small></div>
    <div class="ow-map-node ow-map-gateway"><b>OpenWave Gateway</b><small>Policy, routing, SCA orchestration</small></div>
    <div class="ow-map-node ow-map-identity"><b>OW Identity</b><small>NPT source of truth</small></div>
    <div class="ow-map-node ow-map-bank"><b>Bank middleware</b><small>OTP, push, CBS execution</small></div>
    <div class="ow-map-node ow-map-rail"><b>Settlement rail</b><small>Same-bank, LyPay, or GIP</small></div>
    <span class="ow-data-line ow-data-session"><i></i><em>session</em></span>
    <span class="ow-data-line ow-data-auth"><i></i><em>customer SCA</em></span>
    <span class="ow-data-line ow-data-id"><i></i><em>NPT resolve</em></span>
    <span class="ow-data-line ow-data-bank"><i></i><em>bank callback</em></span>
    <span class="ow-data-line ow-data-settle"><i></i><em>settle</em></span>
    <span class="ow-data-line ow-data-webhook"><i></i><em>signed webhook</em></span>
  </div>
  <div class="ow-boundary-grid">
    <span><b>Merchant boundary</b>No bank OTP collection, no direct CBS calls.</span>
    <span><b>Gateway boundary</b>Short-lived hosted tokens and idempotent routing.</span>
    <span><b>Bank boundary</b>Bank performs SCA and owns account execution.</span>
  </div>
</section>

---

<section class="ow-explainer-suite" aria-label="OpenWave workflow explainers">
  <div class="ow-suite-head">
    <p class="ow-eyebrow">How OpenWave works</p>
    <h2>Three different flows. One standard contract.</h2>
    <p>Each flow below cycles through the real responsibility split: who starts it, where customer authorization happens, who moves money or data, and what the receiving system can trust.</p>
  </div>

  <div class="ow-explainer-grid">
    <article class="ow-flow-card ow-payment-demo">
      <div>
        <p class="ow-flow-kicker">Payment routing</p>
        <h3>Merchant integrates once. The gateway chooses the route.</h3>
      </div>
      <div class="ow-stage-row">
        <span style="--i:0"><b>1</b>Session</span>
        <span style="--i:1"><b>2</b>NPT / IBAN resolve</span>
        <span style="--i:2"><b>3</b>Bank SCA</span>
        <span style="--i:3"><b>4</b>Same-bank or LyPay</span>
        <span style="--i:4"><b>5</b>Signed webhook</span>
      </div>
      <div class="ow-route-board" aria-hidden="true">
        <div class="ow-lane ow-lane-merchant"><b>Merchant</b><small>Creates payment session</small></div>
        <div class="ow-lane ow-lane-gateway"><b>Gateway</b><small>Resolves bank and route</small></div>
        <div class="ow-lane ow-lane-bank"><b>Debtor bank</b><small>OTP / push + debit</small></div>
        <div class="ow-lane ow-lane-rail"><b>Settlement</b><small>Internal books or LyPay</small></div>
        <div class="ow-lane ow-lane-webhook"><b>Merchant server</b><small>Fulfils after signature check</small></div>
      </div>
    </article>
    <article class="ow-flow-card ow-payment-demo">
      <div>
        <p class="ow-flow-kicker">Presented payments</p>
        <h3>Scan or tap starts the flow. Secure bank authorization still happens in the trusted surface.</h3>
      </div>
      <div class="ow-stage-row">
        <span style="--i:0"><b>1</b>Create presentment</span>
        <span style="--i:1"><b>2</b>Scan or tap</span>
        <span style="--i:2"><b>3</b>Claim session</span>
        <span style="--i:3"><b>4</b>Bank SCA</span>
        <span style="--i:4"><b>5</b>Reuse payment or mandate lifecycle</span>
      </div>
      <div class="ow-switch-board" aria-hidden="true">
        <div class="ow-gateway-pill">Merchant / wallet<br><small>QR or NFC presenter</small></div>
        <div class="ow-switch-line"><span></span></div>
        <div class="ow-gateway-pill">Gateway / bank / wallet<br><small>capability-controlled channel</small></div>
        <div class="ow-switch-foot">Operator enables QR, NFC, app handoff, merchant-presented, and direct operator support through capabilities.</div>
      </div>
    </article>
    <article class="ow-flow-card ow-ob-demo">
      <div>
        <p class="ow-flow-kicker">Open Banking</p>
        <h3>Consent is scoped, visible, and bound to one TPP and bank.</h3>
      </div>
      <div class="ow-stage-row">
        <span style="--i:0"><b>1</b>TPP requests scopes</span>
        <span style="--i:1"><b>2</b>Customer sees consent</span>
        <span style="--i:2"><b>3</b>Bank verifies SCA</span>
        <span style="--i:3"><b>4</b>Token issued</span>
        <span style="--i:4"><b>5</b>Accounts API</span>
      </div>
      <div class="ow-consent-board" aria-hidden="true">
        <div class="ow-consent-phone">
          <strong>Consent request</strong>
          <span>Account names</span>
          <span>Balances</span>
          <span>Transactions</span>
          <button>Approve with bank</button>
        </div>
        <div class="ow-token-panel">
          <b>Access token</b>
          <code>accounts:read</code>
          <code>balances:read</code>
          <small>No broad access. No merchant-owned OTP collection.</small>
        </div>
      </div>
    </article>
    <article class="ow-flow-card ow-gip-demo">
      <div>
        <p class="ow-flow-kicker">Gateway interconnect</p>
        <h3>Two gateways can route one payment without becoming one system.</h3>
      </div>
      <div class="ow-stage-row">
        <span style="--i:0"><b>1</b>Discover</span>
        <span style="--i:1"><b>2</b>Remote alias</span>
        <span style="--i:2"><b>3</b>Route payment</span>
        <span style="--i:3"><b>4</b>Status</span>
        <span style="--i:4"><b>5</b>Net settlement</span>
      </div>
      <div class="ow-switch-board" aria-hidden="true">
        <div class="ow-gateway-pill">Gateway A<br><small>merchant side</small></div>
        <div class="ow-switch-line"><span></span></div>
        <div class="ow-gateway-pill">Gateway B<br><small>customer bank side</small></div>
        <div class="ow-switch-foot">Authenticated with owgw_..., mTLS, idempotency, and settlement batch IDs.</div>
      </div>
    </article>
  </div>
</section>

---

<div class="ow-section">

## What is OpenWave?

OpenWave is an **open API standard** created and maintained by Neptune. Fintech for payments, Open Banking, identity, Credit & Finance, settlement webhooks, and gateway interconnect. It defines a unified contract so any bank, merchant, fintech, finance provider, or gateway operator can plug into a single interoperable network without bilateral agreements between every participant.

**Libya's problem:** Customers are locked to their bank's app. Merchants integrate with each bank separately. There is no shared payment identity layer. Money can't move freely.

**OpenWave's solution:** one standard that every participant implements. A bank integrates once, and every merchant on any compliant gateway can accept payments from its customers.

</div>

<div class="ow-developer-band">
  <div>
    <p class="ow-eyebrow">Developer path</p>
    <h2>Read the standard by integration role</h2>
    <p>OpenWave is split by who is calling whom. Merchant APIs use bearer merchant keys, banks expose gateway callbacks, TPPs use OAuth 2.0 + PKCE, and gateways use OW-GIP with gateway keys and mTLS.</p>
  </div>
  <div class="ow-path-grid">
    <a href="./guide/merchants.html"><b>Merchant</b><span>Create sessions, receive webhooks, reconcile orders.</span><code>Authorization: Bearer mk_...</code></a>
    <a href="./guide/banks.html"><b>Bank</b><span>Send OTP, verify SCA, execute debit/credit callbacks.</span><code>X-OpenWave-Internal-Key</code></a>
    <a href="./guide/tpp.html"><b>TPP</b><span>Ask for scoped Open Banking access with PKCE consent.</span><code>/ob/consents -> /ob/token</code></a>
    <a href="./guide/credit-finance.html"><b>Finance provider</b><span>Assess affordability, create offers, publish repayment schedules.</span><code>/credit + /finance</code></a>
    <a href="./guide/gateway-interconnect.html"><b>Gateway</b><span>Discover peer gateways and route cross-gateway payments.</span><code>X-OpenWave-Gateway-Key</code></a>
  </div>
</div>

<div class="ow-modules-grid">

<div class="ow-module-card">
  <div class="ow-module-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></div>
  <div class="ow-module-title">Payments Module</div>
  <div class="ow-module-spec"><a href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-payments-v1.yaml">openwave-payments-v1.yaml</a></div>
  <ul>
    <li>Payment sessions (IBAN + NPT alias)</li>
    <li>OTP &amp; push notification auth</li>
    <li>Recurring mandates</li>
    <li>Same-bank &amp; LyPay cross-bank routing</li>
    <li>Settlement status &amp; webhook events</li>
  </ul>
</div>

<div class="ow-module-card">
  <div class="ow-module-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
  <div class="ow-module-title">Open Banking Module</div>
  <div class="ow-module-spec"><a href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-open-banking-v1.0.yaml">openwave-open-banking-v1.0.yaml</a></div>
  <ul>
    <li>OAuth 2.0 + PKCE consent flow</li>
    <li>AISP: accounts, balances, transactions</li>
    <li>PISP: payment initiation by TPPs</li>
    <li>SCA (Strong Customer Authentication)</li>
    <li>Bank capability advertisement</li>
  </ul>
</div>

<div class="ow-module-card">
  <div class="ow-module-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg></div>
  <div class="ow-module-title">Credit &amp; Finance Module</div>
  <div class="ow-module-spec"><a href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-credit-finance-v1.yaml">openwave-credit-finance-v1.yaml</a></div>
  <ul>
    <li>Credit-assessment consent output</li>
    <li>Affordability and risk reason codes</li>
    <li>BNPL and revolving-credit offers</li>
    <li>Murabaha disclosures and acceptance</li>
    <li>Contracts, repayment schedules, and finance webhooks</li>
  </ul>
</div>

<div class="ow-module-card">
  <div class="ow-module-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M8 10h.01M8 14h.01M12 10h4M12 14h4"/><circle cx="8" cy="10" r="1" fill="currentColor"/><circle cx="8" cy="14" r="1" fill="currentColor"/></svg></div>
  <div class="ow-module-title">Identity Registry</div>
  <div class="ow-module-spec"><a href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-identity-v1.0.yaml">openwave-identity-v1.0.yaml</a></div>
  <ul>
    <li>NPT handle ownership &amp; governance</li>
    <li>Typed availability &amp; permanent retirement</li>
    <li>Multi-bank account linking</li>
    <li>Public alias resolution</li>
    <li>Bank phonebook &amp; directory</li>
    <li>Cross-gateway handle federation</li>
  </ul>
</div>

</div>

---

<div class="ow-section">

## Payment Flow at a Glance

```
Merchant           OpenWave Gateway        Debtor Bank (CBS)     CBL LyPay     Merchant Bank
   │                      │                       │                  │               │
   │── POST /payments ────►│                       │                  │               │
   │   /initiate          │                       │                  │               │
   │◄── { payment_url } ──│                       │                  │               │
   │                       │                       │                  │               │
   │  [Customer opens checkout URL]                │                  │               │
   │                       │── resolve alias ─────►│                  │               │
   │                       │── send OTP ──────────►│                  │               │
   │                       │◄── OTP verified ──────│                  │               │
   │                       │                       │                  │               │
   │          ┌────────────────────────────────────────────────────────────────────┐  │
   │          │  SAME_BANK: internal CBS book transfer (instant)                   │  │
   │          │  LYPAY:  debit at debtor CBS → LyPay instruction → credit at      │  │
   │          │          merchant bank (2–10 seconds)                              │  │
   │          └────────────────────────────────────────────────────────────────────┘  │
   │                       │◄── credit confirmed ──────────────────────────────────── │
   │◄── payment.completed ─│                       │                  │               │
   │    webhook            │                       │                  │               │
```

→ [Full settlement docs](./guide/settlement.md) | [Architecture overview](./guide/architecture.md)

</div>

---

<div class="ow-section">

## Security model in one minute

| Surface | Caller | Authentication | Customer protection |
|:---|:---|:---|:---|
| Payments | Merchant backend → Gateway | `Authorization: Bearer mk_...` | Hosted checkout or SDK session token, bank OTP or push SCA |
| Bank callbacks | Gateway → Bank middleware | `X-OpenWave-Internal-Key: ow_cbk_...` | Bank performs OTP/push verification before debit |
| Open Banking | TPP → Gateway | OAuth 2.0 Authorization Code + PKCE | Hosted consent screen, explicit scopes, revocation |
| Credit & Finance | Finance provider → Gateway | Provider/participant bearer key + consent ID | Customer sees finance purpose, amount, tenor, disclosures, and repayment schedule before acceptance |
| Identity | Bank → Registry | `X-OpenWave-Bank-Key: owbk_...` | Bank can only manage accounts it vouched for |
| Gateway interconnect | Gateway → Gateway | `X-OpenWave-Gateway-Key: owgw_...` + production mTLS | Idempotent routes, signed settlement batches |

</div>

<div class="ow-downloads-section">

## Downloads

<div class="ow-download-grid">

<div class="ow-download-card">
  <div class="ow-dl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
  <div class="ow-dl-title">Payments OpenAPI</div>
  <div class="ow-dl-sub">openwave-payments-v1.yaml</div>
  <div class="ow-dl-links">
    <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml" download>Download YAML</a>
    <a class="ow-dl-btn-ghost" href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-payments-v1.yaml">View on GitHub</a>
  </div>
</div>

<div class="ow-download-card">
  <div class="ow-dl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
  <div class="ow-dl-title">Open Banking OpenAPI</div>
  <div class="ow-dl-sub">openwave-open-banking-v1.0.yaml</div>
  <div class="ow-dl-links">
    <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-open-banking-v1.0.yaml" download>Download YAML</a>
    <a class="ow-dl-btn-ghost" href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-open-banking-v1.0.yaml">View on GitHub</a>
  </div>
</div>

<div class="ow-download-card">
  <div class="ow-dl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
  <div class="ow-dl-title">Credit &amp; Finance OpenAPI</div>
  <div class="ow-dl-sub">openwave-credit-finance-v1.yaml</div>
  <div class="ow-dl-links">
    <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-credit-finance-v1.yaml" download>Download YAML</a>
    <a class="ow-dl-btn-ghost" href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-credit-finance-v1.yaml">View on GitHub</a>
  </div>
</div>

<div class="ow-download-card">
  <div class="ow-dl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
  <div class="ow-dl-title">Identity Registry OpenAPI</div>
  <div class="ow-dl-sub">openwave-identity-v1.0.yaml</div>
  <div class="ow-dl-links">
    <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-identity-v1.0.yaml" download>Download YAML</a>
    <a class="ow-dl-btn-ghost" href="https://github.com/neptune-ly/openwave-spec/blob/main/openwave-identity-v1.0.yaml">View on GitHub</a>
  </div>
</div>

</div>

<div style="text-align:center;margin-top:1.5rem">

[→ Full downloads page with Postman collections, code generation, and Swagger links](./downloads.md)

</div>

</div>
