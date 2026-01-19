# UI Guidelines

## Component Libraries

| Library | Usage |
|---------|-------|
| HeroUI v3 (Beta) | New components |
| Legacy (`dash/src/components/ui/`) | Old components (Radix UI, Tremor UI mix) |

## Tooltips on Mobile

Standard HeroUI `Tooltip` doesn't support tap interaction on mobile. Use:

```typescript
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip";
```
