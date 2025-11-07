This is a TypeScript monorepo built for Node.js v22 using ES Modules (ESM).
It's managed with pnpm and includes two different websites which are built using Next.js.

The purpose of this repository is to contain the source code for the web dashboard and documentation site for a Discord
bot named "Lurkr", which is designed to be used by users to configure and manage Lurkr on their Discord servers.

Please follow these guidelines when contributing:

## Code Standards

### Before Starting Development

To install the dependencies for the project, you need to enable `pnpm` on your environment.
The simplest way is to use `npm install --global pnpm@latest-10`.
After that, you can run `pnpm install --frozen-lockfile` on the root of the repository to install the dependencies.

### Required Before Each Commit

- Run `pnpm run fmt` before committing any changes to ensure proper code formatting and linting.
- This utilizes `biome` for formatting and linting. Make sure to fix any issues reported by these tools.

If making changes to the content in the documentation site, ensure that you also run `pnpm run fmt:content` in the
`docs` directory to format the content files using Prettier.

### Development Flow

- Build: `pnpm run build`

### Repository Structure

- `dash/`: Contains the source code for the web dashboard.
- `docs/`: Contains the source code for the documentation site (Fumadocs).
- `shared/`: Contains shared utilities used by both websites. It is however not a package itself.

## Key Guidelines

1. Follow the TypeScript coding standards, best practices, and idiomatic patterns.
2. Use up-to-date, builtin (if available) features, including those introduced in Node.js v24.
3. Use ESM features.
4. Maintain existing code structure and organization.
