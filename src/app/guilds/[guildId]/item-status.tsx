import { BiCheck } from "@react-icons/all-files/bi/BiCheck";
import { BsSlashLg } from "@react-icons/all-files/bs/BsSlashLg";
import { RiErrorWarningFill } from "@react-icons/all-files/ri/RiErrorWarningFill";
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
						<BiCheck className="absolute inset-0" color="#93e19c" size={35} />
					) : type === "warning" ? (
						<BsSlashLg
							key={`warning-${name}`}
							className="absolute inset-2 z-10"
							color="#f6e594"
							size={19}
							strokeWidth={2}
						/>
					) : type === "error" ? (
						<RiErrorWarningFill className="absolute inset-2 z-10" color="#df4444" size={19} />
					) : (
						<BsSlashLg
							key={`disabled-${name}`}
							className="absolute inset-2 z-10"
							color="#474747"
							size={19}
							strokeWidth={2}
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
