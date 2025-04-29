import { openapi } from "@/lib/source";
import { APIPage } from "fumadocs-openapi/ui";
import defaultComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultComponents,
		APIPage: (props) => <APIPage {...openapi.getAPIPageProps(props)} />,
		...components,
	};
}
