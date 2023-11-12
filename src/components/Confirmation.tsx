"use client";

import { Dialog, DialogDescription, DialogDismiss, DialogHeading, useDialogStore } from "@ariakit/react/dialog";
import type { PropsWithChildren } from "react";

export function Confirmation({ className, children, buttonText, onConfirm }: ConfirmationProps) {
	const dialog = useDialogStore();

	return (
		<>
			<button className={className} onClick={dialog.toggle} type="button">
				{buttonText}
			</button>

			<Dialog
				store={dialog}
				backdrop={
					<div className="bg-black/10 opacity-0 transition-[opacity,backdrop-filter] ease-in-out duration-150 backdrop-blur-0 data-[enter]:opacity-100 data-[enter]:backdrop-blur-sm z-[100001]" />
				}
				className="bg-dark-gray z-[100002] fixed top-20 left-1/2 -translate-x-1/2 rounded-lg border border-white/25 px-4 py-3 opacity-0 scale-95 data-[enter]:opacity-100 data-[enter]:scale-100 transition-[opacity,transform] duration-150 ease-in-out"
			>
				<DialogHeading className="text-xl font-bold mb-4">{buttonText}</DialogHeading>

				<DialogDescription className="text-white/75 mb-4">{children}</DialogDescription>

				<div className="space-x-4">
					<button
						className="rounded-lg px-2 py-1 bg-green hover:bg-green/75 transition-colors"
						onClick={onConfirm}
						type="button"
					>
						Confirm
					</button>

					<DialogDismiss className="rounded-lg px-2 py-1 bg-red hover:bg-red/75 transition-colors">
						Cancel
					</DialogDismiss>
				</div>
			</Dialog>
		</>
	);
}

interface ConfirmationProps extends PropsWithChildren {
	readonly buttonText: string;
	readonly className: string;
	onConfirm(): void;
}
