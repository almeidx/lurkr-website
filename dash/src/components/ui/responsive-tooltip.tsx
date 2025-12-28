"use client";

// From https://github.com/heroui-inc/heroui/issues/2036#issuecomment-3199781880

import { Tooltip, type TooltipProps } from "@heroui/react";
import { useState } from "react";

// There is a problem with the standard tooltip on mobile, it cannot be opened
// https://github.com/heroui-inc/heroui/issues/2036
// https://webawesome.com/docs/components/tooltip
// Web Awesome handles it nicely, it allows multiple triggers, and by default has `hover focus`
// This adds focus handling, so that on focus the tooltip is opened, and on blur it is closed - works well on mobile

export function ResponsiveTooltip({ children, content, isOpen, onOpenChange, ...props }: ResponsiveTooltipProps) {
	const [localIsOpen, setLocalIsOpen] = useState(false);

	return (
		<Tooltip
			isOpen={isOpen ?? localIsOpen}
			onOpenChange={(open) => {
				setLocalIsOpen(open);
				onOpenChange?.(open);
			}}
			{...props}
		>
			<Tooltip.Trigger>
				<button
					className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					onBlur={() => setLocalIsOpen(false)}
					onFocus={() => setLocalIsOpen(true)}
					type="button"
				>
					{children}
				</button>
			</Tooltip.Trigger>
			<Tooltip.Content className="rounded-xl border border-white/10 px-3 py-2 shadow-xl">{content}</Tooltip.Content>
		</Tooltip>
	);
}

interface ResponsiveTooltipProps extends TooltipProps {
	content: React.ReactNode;
}
