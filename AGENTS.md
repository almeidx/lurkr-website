# AGENTS.md

This is a TypeScript monorepo built for **Node.js v24** using ES Modules (ESM).
It's managed with pnpm and includes two different websites which are built using Next.js 16.

The purpose of this repository is to contain the source code for the web dashboard and documentation site for a Discord
bot named "Lurkr", which is designed to be used by users to configure and manage Lurkr on their Discord servers.

Please follow these guidelines when contributing:

## Technology Stack

- **Runtime**: Node.js v24.12.0+
- **Package Manager**: pnpm v10
- **Framework**: Next.js 16 (with React 19)
- **Language**: TypeScript 5.9
- **Styling**: TailwindCSS v4
- **Linting/Formatting**: Biome
- **Documentation Framework**: Fumadocs (for the docs site)

## Code Standards

### Before Starting Development

To install the dependencies for the project, you need to enable `pnpm` on your environment.

1. Install pnpm: `npm install --global pnpm@latest-10`
2. Install dependencies: `pnpm install --frozen-lockfile`

### Environment Setup

For local development, you may need to set up environment variables:

- **Dashboard (`dash/`)**: Copy `.env.local.example` to `.env.local` and configure the required variables.
- **Docs (`docs/`)**: Copy `.env.local.example` to `.env.local` and configure the required variables.

Development and production environment files (`.env.development`, `.env.production`) are already configured.

### Running Development Servers

- **Dashboard**: `cd dash && pnpm run dev` (runs on default Next.js port)
- **Docs**: `cd docs && pnpm run dev`
- **Build all**: `pnpm run build` (from root)

### Required Before Each Commit

- Run `pnpm run fmt` before committing any changes to ensure proper code formatting and linting.
- This utilizes `biome` for formatting and linting. Make sure to fix any issues reported by these tools.
- Run `pnpm run lint` to check for issues without auto-fixing.

If making changes to the content in the documentation site, ensure that you also run `pnpm run fmt:content` in the
`docs` directory to format the content files using Prettier.

### Continuous Integration

The CI workflow (`.github/workflows/ci.yml`) runs on every push and performs:

1. Lint check using `pnpm biome ci`
2. Type checking using `pnpm run build:typecheck`

Ensure both pass before submitting changes.

## Repository Structure

```
lurkr-website/
├── dash/                    # Web dashboard (@lurkr/dashboard)
│   ├── src/                 # Source code
│   └── public/              # Public static files
├── docs/                    # Documentation site (@lurkr/docs)
│   ├── content/             # MDX documentation content
│   ├── src/                 # Source code
│   └── scripts/             # Build scripts
├── shared/                  # Shared utilities (NOT a package)
│   ├── common.ts            # Common utilities
│   └── shared-links.ts      # Shared URLs and external links
└── biome.json               # Biome configuration
```

### Shared Utilities

The `shared/` directory contains utilities used by both websites. **It is not a package itself** - files are imported
directly using relative paths:

```typescript
// From dash/src or docs/src:
import { BASE_URL } from "../../shared/shared-links.ts";
```

### Domain Configuration

The dashboard and documentation sites are hosted under the same domain, `lurkr.gg`, with the dashboard being hosted at
the root and the documentation site being hosted under the `/docs` path. The way this works in practice is the dashboard
app handles all the requests, and rewrites requests to `/docs` to the documentation site. This is configured in the
`next.config.ts` file of the dashboard.

## Key Guidelines

1. Follow the TypeScript coding standards, best practices, and idiomatic patterns.
2. Use up-to-date, builtin (if available) features, including those introduced in Node.js v24.
3. Use ESM features (this project uses `"type": "module"`).
4. Maintain existing code structure and organization.
5. Use TailwindCSS v4 for styling.
6. Use Radix UI primitives (already installed) when building accessible UI components.

## Changes to the Documentation Content

When necessary to link to pages in the dashboard from the documentation, use `/../<path>` to avoid hardcoding the domain
everywhere.

Documentation content is written in MDX and located in `docs/content/`. After modifying MDX files, run:

```bash
cd docs && pnpm run fmt:content
```

## External Links and Resources

Key external links are centralized in `shared/shared-links.ts`:

- `BASE_URL`: https://lurkr.gg
- `SUPPORT_SERVER_INVITE`: Discord support server
- `GITHUB_REPOSITORY_URL`: This repository
- `BOT_INVITE`: Discord bot invite link
