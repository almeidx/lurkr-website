# Code Standards

## Before Committing

Run `pnpm run fmt` from root. This uses Biome for formatting and linting.

For documentation content changes, also run:
```bash
cd docs && pnpm run fmt:content
```

## CI Pipeline

The CI workflow (`.github/workflows/ci.yml`) runs:

1. `pnpm biome ci` — Lint check
2. `pnpm run build:typecheck` — Type checking

Both must pass before merging.
