"use client";

import { Popover, PopoverArrow, PopoverDescription, PopoverDisclosure, usePopoverStore } from "@ariakit/react/popover";
import type { PropsWithChildren } from "react";

export function ItemStatusPopover({ children, description }: PropsWithChildren<{ readonly description: string }>) {
	const store = usePopoverStore();

	return (
		<>
			<PopoverDisclosure store={store}>{children}</PopoverDisclosure>

			<Popover
				className="left-4 z-[10004] flex flex-col rounded-lg border border-white/25 bg-darker px-3 py-2"
				store={store}
				gutter={16}
			>
				<PopoverArrow />
				<PopoverDescription>{description}</PopoverDescription>
			</Popover>
		</>
	);
}
