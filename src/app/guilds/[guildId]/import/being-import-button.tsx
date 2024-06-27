"use client";

import { Confirmation } from "@/components/Confirmation.tsx";
import { Tooltip, TooltipAnchor, useTooltipStore } from "@ariakit/react/tooltip";
import { SystemUpdate } from "@mui/icons-material";
import { useRef } from "react";

export function BeginImportButton({ isRateLimited, importOngoing }: BeginImportButtonProps) {
	const btnRef = useRef<HTMLButtonElement>(null);
	const tooltip = useTooltipStore({ showTimeout: 50 });

	const disabled = isRateLimited || importOngoing;

	const btn = (
		<Confirmation
			className="flex w-fit items-center justify-between gap-3 rounded-lg bg-green px-2 py-1 font-semibold text-lg text-shadow-regular transition-colors disabled:cursor-not-allowed disabled:bg-green/50 hover:bg-green/90 md:text-xl"
			disabled={disabled}
			buttonText={
				<>
					Import
					<SystemUpdate className="size-5 drop-shadow-regular" />
				</>
			}
			onConfirm={() => {}}
			useSubmitButton
		>
			Are you sure you want to import leveling data into this server?
			<br />
			<span className="font-bold text-red">
				This is a destructive and irreversible operation which will overwrite any existing data.
			</span>
		</Confirmation>
	);

	// Using a hidden button to submit the form since the Confirmation dialog puts the button outside the form
	const submitBtn = <button aria-hidden className="hidden" type="submit" ref={btnRef} />;

	if (disabled) {
		return (
			<>
				{submitBtn}

				<TooltipAnchor className="w-fit" store={tooltip}>
					{btn}
				</TooltipAnchor>

				<Tooltip
					store={tooltip}
					className="max-w-xs rounded-lg border bg-darker p-2 leading-relaxed tracking-tight md:max-w-prose"
				>
					{importOngoing ? "An import is already in progress." : "Importing is rate limited to once per hour."}
				</Tooltip>
			</>
		);
	}

	return (
		<>
			{submitBtn}
			{btn}
		</>
	);
}

interface BeginImportButtonProps {
	isRateLimited: boolean;
	importOngoing: boolean;
}
