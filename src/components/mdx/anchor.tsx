import { ExternalLink } from "@/components/ExternalLink.tsx";
import Link from "next/link";
import type { ComponentProps } from "react";

export function CustomLink(props: ComponentProps<"a">) {
	const href = props.href as string;

	if (href.startsWith("/")) {
		return <Link {...props} href={href} />;
	}

	if (href.startsWith("#")) {
		return <a {...props} />;
	}

	return <ExternalLink {...props} />;
}
