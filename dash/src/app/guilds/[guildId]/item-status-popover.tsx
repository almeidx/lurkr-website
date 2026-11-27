import { Popover } from "@heroui/react";
import type { PropsWithChildren } from "react";

export function ItemStatusPopover({ children, description }: PropsWithChildren<{ readonly description: string }>) {
	return (
		<Popover>
			<Popover.Trigger aria-label="Show status details" className="absolute inset-0 z-10 rounded-xl">
				{children}
			</Popover.Trigger>

			<Popover.Content className="rounded-lg border border-white/25 bg-darker shadow-md">
				<Popover.Dialog className="px-4 py-3">
					<Popover.Arrow className="[&_svg]:fill-darker [&_svg]:stroke-white/25" />
					<p className="max-w-[80vw] text-base text-wrap">{description}</p>
				</Popover.Dialog>
			</Popover.Content>
		</Popover>
	);
}
