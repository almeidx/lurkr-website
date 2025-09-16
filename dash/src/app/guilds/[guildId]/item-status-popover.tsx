import { Popover, PopoverArrow, PopoverDescription, PopoverDisclosure, PopoverProvider } from "@ariakit/react";
import type { PropsWithChildren } from "react";

export function ItemStatusPopover({ children, description }: PropsWithChildren<{ readonly description: string }>) {
	return (
		<PopoverProvider>
			<PopoverDisclosure>{children}</PopoverDisclosure>

			<Popover
				className="left-4 z-10004 flex flex-col rounded-lg border border-white/25 bg-darker px-4 py-3 shadow-md"
				gutter={16}
			>
				<PopoverArrow />
				<PopoverDescription className="max-w-[80vw] text-wrap">{description}</PopoverDescription>
			</Popover>
		</PopoverProvider>
	);
}
