import type { PropsWithChildren } from "react";

export function Paragraph({ children }: PropsWithChildren) {
	return <p className="mb-4">{children}</p>;
}
