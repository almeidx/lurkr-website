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
					"before:absolute before:inset-2 before:rounded-xl before:blur-lg after:absolute after:inset-0 after:rounded-xl after:bg-darker":
						type !== "success",
				})}
			>
				<PopoverWrapper description={description}>
					{type === "success" ? (
						<Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-[#93e19c] size-7" />
					) : type === "warning" ? (
						<ShowChart
							key={`warning-${name}`}
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-[#f6e594] size-7"
						/>
					) : type === "error" ? (
						<Close className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-red size-7" />
					) : (
						<ShowChart
							key={`disabled-${name}`}
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-[#474747] size-7"
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
