# Documentation Guidelines

## Content Location

MDX files are in `docs/content/`.

## Formatting

After modifying MDX files:
```bash
cd docs && pnpm run fmt:content
```

## Linking to Dashboard

Use relative paths from docs to dashboard:
```markdown
[Link text](/../some-dashboard-path)
```

This avoids hardcoding the domain.
