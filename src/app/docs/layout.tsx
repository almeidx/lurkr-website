import type { PropsWithChildren } from "react";

export default function DocsLayout({ children }: PropsWithChildren) {
	return <main className="container max-w-7xl mx-auto px-2 mb-6">{children}</main>;
}
