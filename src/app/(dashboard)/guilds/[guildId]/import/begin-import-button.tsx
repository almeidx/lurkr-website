import { Confirmation } from "@/components/Confirmation.tsx";
import { SystemUpdate } from "@/components/icons/mdi/system-update.tsx";
import { Tooltip, TooltipAnchor, TooltipProvider } from "@ariakit/react";

export function BeginImportButton({ isRateLimited, importOngoing }: BeginImportButtonProps) {
	const disabled = isRateLimited || importOngoing;

	const btn = (
		<Confirmation
			className="flex w-fit items-center justify-between gap-3 rounded-lg bg-green px-2 py-1 font-semibold text-lg text-shadow-regular transition-colors hover:bg-green/90 disabled:bg-green/50 md:text-xl"
			disabled={disabled}
			buttonText={
				<>
					Import
					<SystemUpdate className="size-5 drop-shadow-regular" />
				</>
			}
			useSubmitButton
		>
			Are you sure you want to import leveling data into this server?
			<br />
			<span className="font-bold text-red">
				This is a destructive and irreversible operation which will overwrite any existing data.
			</span>
		</Confirmation>
	);

	if (disabled) {
		return (
			<TooltipProvider showTimeout={50}>
				<TooltipAnchor className="w-fit">{btn}</TooltipAnchor>

				<Tooltip className="max-w-xs rounded-lg border bg-darker p-2 leading-relaxed tracking-tight md:max-w-prose">
					{importOngoing ? "An import is already in progress." : "Importing is rate limited to once per hour."}
				</Tooltip>
			</TooltipProvider>
		);
	}

	return btn;
}

interface BeginImportButtonProps {
	isRateLimited: boolean;
	importOngoing: boolean;
}
