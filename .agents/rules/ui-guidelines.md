# UI guidelines

Prefer existing HeroUI v3 and Tailwind patterns when they meet the interaction
and accessibility requirements. Reuse local wrappers before adding another
component abstraction.

HeroUI's standard `Tooltip` is not tap-accessible on mobile. For content that
must be available on touch devices, use the existing wrapper:

```ts
import { ResponsiveTooltip } from "@/components/responsive-tooltip.tsx";
```
