import type { PropsWithChildren } from "react";

export function UnorderedList({ children }: PropsWithChildren) {
	return <ul className="list-disc list-inside [&>*]:mb-2 last:mb-0">{children}</ul>;
}
