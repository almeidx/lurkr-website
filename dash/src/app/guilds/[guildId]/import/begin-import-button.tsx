import { Tooltip } from "@heroui/react";
import { useState } from "react";
import { Confirmation } from "@/components/Confirmation.tsx";
import { SystemUpdate } from "@/components/icons/mdi/system-update.tsx";

export const IMPORT_BUTTON_CLASS_NAME =
	"text-shadow-regular flex w-fit items-center justify-between gap-3 rounded-lg bg-green px-2 py-1 text-lg font-semibold transition-colors hover:bg-green/90 disabled:bg-green/50 md:text-xl";

export function ImportConfirmationMessage() {
	return (
		<>
			Are you sure you want to import leveling data into this server?
			<br />
			<span className="font-bold text-red">
				This is a destructive and irreversible operation which will overwrite any existing data.
			</span>
		</>
	);
}

export function BeginImportButton({ isRateLimited, importOngoing }: BeginImportButtonProps) {
	const [isTooltipOpen, setIsTooltipOpen] = useState(false);

	const disabled = isRateLimited || importOngoing;

	const btn = (
		<Confirmation
			buttonText={
				<>
					Import
					<SystemUpdate className="size-5 drop-shadow-regular" />
				</>
			}
			className={IMPORT_BUTTON_CLASS_NAME}
			disabled={disabled}
			useSubmitButton
		>
			<ImportConfirmationMessage />
		</Confirmation>
	);

	if (disabled) {
		return (
			<Tooltip delay={50} isOpen={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
				<Tooltip.Trigger
					className="w-fit"
					onBlur={() => setIsTooltipOpen(false)}
					onFocus={() => setIsTooltipOpen(true)}
				>
					{btn}
				</Tooltip.Trigger>

				<Tooltip.Content className="max-w-xs rounded-lg border bg-darker p-2 text-base leading-relaxed tracking-tight break-normal md:max-w-prose">
					{importOngoing ? "An import is already in progress." : "Importing is rate limited to once per hour."}
				</Tooltip.Content>
			</Tooltip>
		);
	}

	return btn;
}

interface BeginImportButtonProps {
	isRateLimited: boolean;
	importOngoing: boolean;
}
