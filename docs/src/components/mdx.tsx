import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ExternalLink } from "@/components/ExternalLink.tsx";

export default {
	...defaultMdxComponents,
	ExternalLink,
} satisfies MDXComponents;
