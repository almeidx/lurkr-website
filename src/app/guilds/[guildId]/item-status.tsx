import { Check, Close, ShowChart } from "@mui/icons-material";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { ItemStatusPopover } from "./item-status-popover.tsx";

export function ItemStatus({ description, name, type }: ItemStatusProps) {
	return (
		<div className="flex min-w-[20rem] items-center gap-4">
			<div
				className={clsx("relative size-9 rounded-xl", {
					"bg-darker": type === "success",
					"before:bg-[#ffe87c]": type === "warning",
					"before:bg-red": type === "error",
					"after:absolute before:absolute after:inset-0 before:inset-2 after:rounded-xl before:rounded-xl after:bg-darker before:blur-lg":
						type !== "success",
				})}
			>
				<PopoverWrapper description={description}>
					{type === "success" ? (
						<Check className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10 size-7 text-[#93e19c]" />
					) : type === "warning" ? (
						<ShowChart
							key={`warning-${name}`}
							className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10 size-7 text-[#f6e594]"
						/>
					) : type === "error" ? (
						<Close className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10 size-7 text-red" />
					) : (
						<ShowChart
							key={`disabled-${name}`}
							className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10 size-7 text-[#474747]"
						/>
					)}
				</PopoverWrapper>
			</div>

			<p className="pr-6 font-semibold tracking-tighter">{name}</p>
		</div>
	);
}

function PopoverWrapper({
	children,
	description,
}: PropsWithChildren<{ readonly description: string | null | undefined }>) {
	return description ? <ItemStatusPopover description={description}>{children}</ItemStatusPopover> : children;
}

interface ItemStatusProps {
	readonly description?: string | null;
	readonly name: string;
	readonly type: "disabled" | "error" | "success" | "warning";
}
