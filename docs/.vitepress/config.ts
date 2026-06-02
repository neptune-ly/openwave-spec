import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenWave',
  description: 'Open standard developed by Neptune. Fintech for bank-agnostic payments, Open Banking, NPT identity, credit and finance, webhooks, and gateway interconnect.',
  base: '/openwave-spec/',

  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/openwave-spec/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#07315F' }],
    ['meta', { property: 'og:title', content: 'OpenWave — Open Payments and Open Banking Standard' }],
    ['meta', { property: 'og:description', content: 'Developer-first standard for payments, Open Banking, NPT identity, credit and finance, webhooks, and gateway-to-gateway switching.' }],
    ['meta', { property: 'og:image', content: 'https://neptune-ly.github.io/openwave-spec/og-preview.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: 'OpenWave',

    nav: [
      { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: 'API Reference', link: '/api/overview', activeMatch: '/api/' },
      { text: 'Downloads', link: '/downloads' },
      { text: 'Architecture', link: '/guide/architecture' },
      {
        text: 'Specs',
        items: [
          {
            text: 'OpenAPI Files',
            items: [
              { text: 'Payments v1', link: 'https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml' },
              { text: 'Presented Payments v1', link: 'https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-presented-payments-v1.yaml' },
              { text: 'Open Banking v1', link: 'https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-open-banking-v1.0.yaml' },
              { text: 'Credit & Finance v1', link: 'https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-credit-finance-v1.yaml' },
              { text: 'Identity v1', link: 'https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-identity-v1.0.yaml' },
              { text: 'Gateway Interconnect v1', link: 'https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-gateway-interconnect-v1.yaml' },
            ]
          },
          {
            text: 'Tools',
            items: [
              { text: 'Swagger Editor', link: 'https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml' },
              { text: 'All Downloads', link: '/downloads' },
            ]
          }
        ]
      },
      {
        text: 'v1.0.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/neptune-ly/openwave-spec/blob/main/CHANGELOG.md' },
          { text: 'Contributing', link: 'https://github.com/neptune-ly/openwave-spec/blob/main/CONTRIBUTING.md' },
          { text: 'GitHub Repo', link: 'https://github.com/neptune-ly/openwave-spec' },
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'What is OpenWave?', link: '/guide/introduction' },
            { text: 'Implementation Playbooks', link: '/guide/implementation-playbooks' },
            { text: 'Core Concepts', link: '/guide/concepts' },
            { text: 'NPT — National Payment Tag', link: '/guide/npt' },
            { text: 'Architecture & Infrastructure', link: '/guide/architecture' },
            { text: 'Production Readiness', link: '/guide/production-readiness' },
            { text: 'Presented Payments', link: '/guide/presented-payments' },
            { text: 'Credit & Finance', link: '/guide/credit-finance' },
            { text: 'Public Docs Policy', link: '/guide/maintainers' },
          ]
        },
        {
          text: 'Integration Guides',
          collapsed: false,
          items: [
            { text: 'For Merchants', link: '/guide/merchants' },
            { text: 'For Banks', link: '/guide/banks' },
            { text: 'For TPPs (Open Banking)', link: '/guide/tpp' },
            { text: 'Decentralized Open Banking', link: '/guide/decentralized-open-banking' },
            { text: 'QR Payloads', link: '/guide/presented-qr' },
            { text: 'QR Design Guidelines', link: '/guide/presented-qr-design' },
            { text: 'NFC Handoff', link: '/guide/presented-nfc' },
            { text: 'Direct Bank & Wallet', link: '/guide/presented-direct' },
            { text: 'Channel Governance', link: '/guide/presented-governance' },
            { text: 'Credit-Assessment Consent', link: '/guide/credit-assessment-consent' },
            { text: 'BNPL Flow', link: '/guide/bnpl' },
            { text: 'Revolving Credit Flow', link: '/guide/revolving-credit' },
            { text: 'Murabaha Flow', link: '/guide/murabaha' },
            { text: 'Financed-Payment Lifecycle', link: '/guide/financed-payment-lifecycle' },
            { text: 'Gateway Operators', link: '/guide/operators' },
            { text: 'Gateway Interconnect', link: '/guide/gateway-interconnect' },
          ]
        },
        {
          text: 'Reference',
          collapsed: false,
          items: [
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'Webhooks', link: '/guide/webhooks' },
            { text: 'Error Codes', link: '/guide/errors' },
            { text: 'Amount Convention', link: '/guide/amounts' },
            { text: 'Risk, Privacy & Explainability', link: '/guide/risk-privacy-explainability' },
            { text: 'Settlement & CBL Infrastructure', link: '/guide/settlement' },
          ]
        },
        {
          text: 'Downloads',
          collapsed: false,
          items: [
            { text: 'Spec Files & Postman', link: '/downloads' },
            { text: 'Spec Files (raw)', link: '/spec' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/api/overview' },
            { text: 'Interactive Explorer', link: '/api/explorer' },
            { text: 'Payments', link: '/api/payments' },
            { text: 'Presented Payments', link: '/api/presented-payments' },
            { text: 'Credit & Finance', link: '/api/credit-finance' },
            { text: 'Alias (NPT)', link: '/api/alias' },
            { text: 'Open Banking', link: '/api/open-banking' },
            { text: 'Identity Registry', link: '/api/identity' },
            { text: 'Gateway Interconnect', link: '/api/gateway-interconnect' },
            { text: 'Webhooks', link: '/api/webhooks' },
          ]
        }
      ]
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/neptune-ly/openwave-spec' }
    ],

    footer: {
      message: 'Released under the <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache 2.0 License</a>.',
      copyright: 'Developed and maintained by <a href="https://neptune.ly" target="_blank">Neptune. Fintech</a>'
    },

    notFound: {
      title: 'OpenWave page not found',
      quote: 'This documentation page moved or does not exist. Use the OpenWave home page, API reference, or downloads page to continue.',
      linkLabel: 'Go to OpenWave home',
      linkText: 'Take me home'
    },

    search: { provider: 'local' },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: { dateStyle: 'medium' }
    },

    docFooter: {
      prev: 'Previous',
      next: 'Next'
    },

    returnToTopLabel: 'Back to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Theme',
  }
})
