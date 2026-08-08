# Contributing to OpenWave

Thank you for your interest in improving the OpenWave standard.

## How to Contribute

### Reporting Issues
Open a GitHub issue for:
- Ambiguities or errors in the spec
- Missing fields or edge cases
- Inconsistencies between modules

### Proposing Changes

1. Fork the repo
2. Create a branch: `git checkout -b proposal/your-change`
3. Edit the relevant YAML file(s)
4. Install dependencies with `npm ci`, then run the complete validation suite with `npm run verify`
5. Open a Pull Request with a clear description of the change and rationale

### Change Categories

| Type | Branch prefix | Version bump |
|---|---|---|
| New endpoint or optional field | `feat/` | MINOR |
| Breaking change | `breaking/` | MAJOR |
| Fix, clarification, example | `fix/` | PATCH |
| New module (e.g. Open Banking v1.0) | `module/` | new file |

### Validation

```bash
# Validate every OpenAPI file and the NPT lifecycle contract
npm test

# Validate public docs and build the VitePress site
npm run verify
```

## Design Principles

1. **Bank-agnostic** — no assumptions about specific CBS or bank technology
2. **Minimal** — only include what is necessary; avoid over-specifying implementation details
3. **Practical** — designed for real-world deployment in emerging markets, not theoretical perfection
4. **Secure by default** — authenticate non-public endpoints; mark intentional public operations explicitly with `security: []`
5. **Versioned** — never make breaking changes without a MAJOR version bump
6. **Consistent** — amounts always minor units, IDs always UUIDs, dates always ISO 8601

## License

By contributing you agree your contributions will be licensed under Apache 2.0.
