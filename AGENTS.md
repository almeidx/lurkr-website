# AGENTS.md

TypeScript monorepo for Lurkr Discord bot's web dashboard and documentation site, built with Next.js 16.

## Quick Reference

| Command | Purpose |
|---------|---------|
| `pnpm run build` | Build all packages |
| `pnpm run fmt` | Format and lint (run before commits) |
| `pnpm run lint` | Check without auto-fixing |

## Monorepo Structure

```
dash/    → Web dashboard (lurkr.gg)
docs/    → Documentation site (lurkr.gg/docs)
shared/  → Shared utilities (not a package, import via relative paths)
```

## Key Decisions

- **Package manager**: pnpm v10
- **UI components**: HeroUI v3 (Beta) for new components
- **Styling**: TailwindCSS v4

## Detailed Guidelines

- [Development Setup](.agents/rules/development-setup.md) — Environment, dependencies, dev servers
- [Code Standards](.agents/rules/code-standards.md) — Formatting, linting, CI
- [Architecture](.agents/rules/architecture.md) — Repository structure, routing, shared utilities
- [UI Guidelines](.agents/rules/ui-guidelines.md) — HeroUI, Tailwind, component patterns
- [Documentation](.agents/rules/documentation.md) — MDX content, linking
