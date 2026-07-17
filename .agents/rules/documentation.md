# Documentation

MDX content lives under `docs/content/`. After changing it, run:

```sh
pnpm --dir docs fmt:content
```

Links from documentation to dashboard routes should stay domain-independent.
Use the existing `/../<dashboard-path>` form instead of hard-coding
`https://lurkr.gg`.
