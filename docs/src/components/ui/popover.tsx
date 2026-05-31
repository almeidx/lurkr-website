"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn.ts";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

function PopoverContent({
	className,
	align = "center",
	sideOffset = 4,
	ref,
	...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				align={align}
				className={cn(
					"z-50 max-h-(--radix-popover-content-available-height) min-w-60 max-w-[98vw] origin-(--radix-popover-content-transform-origin) overflow-y-auto rounded-xl border bg-fd-popover/60 p-2 text-fd-popover-foreground text-sm shadow-lg backdrop-blur-lg focus-visible:outline-none data-[state=closed]:animate-fd-popover-out data-[state=open]:animate-fd-popover-in",
					className,
				)}
				ref={ref}
				side="bottom"
				sideOffset={sideOffset}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	);
}

const PopoverClose = PopoverPrimitive.PopoverClose;

export { Popover, PopoverClose, PopoverContent, PopoverTrigger };
