"use client";

import { Dialog, DialogDescription, DialogDismiss, DialogHeading, useDialogStore } from "@ariakit/react/dialog";
import type { MouseEvent, PropsWithChildren, ReactNode } from "react";

export function Confirmation({
	className,
	children,
	buttonText,
	onConfirm,
	disabled = false,
	useSubmitButton = false,
}: ConfirmationProps) {
	const dialog = useDialogStore();

	function handleConfirm(_event: MouseEvent<HTMLButtonElement>) {
		dialog.setState("open", false);

		onConfirm?.();
	}

	return (
		<>
			<button className={className} disabled={disabled} onClick={dialog.toggle} type="button">
				{buttonText}
			</button>

			<Dialog
				store={dialog}
				backdrop={
					<div className="z-[100001] bg-black/10 opacity-0 backdrop-blur-0 transition-[opacity,backdrop-filter] duration-150 ease-in-out data-[enter]:opacity-100 data-[enter]:backdrop-blur-sm" />
				}
				className="-translate-x-1/2 fixed top-20 left-1/2 z-[100002] scale-95 rounded-lg border border-white/25 bg-dark-gray px-4 py-3 opacity-0 transition-[opacity,transform] duration-150 ease-in-out data-[enter]:scale-100 data-[enter]:opacity-100"
				portal={!useSubmitButton}
			>
				<DialogHeading className="mb-4 font-bold text-xl">{buttonText}</DialogHeading>

				<DialogDescription className="mb-4 text-white/75">{children}</DialogDescription>

				<div className="space-x-4">
					<button
						className="rounded-lg bg-green px-2 py-1 transition-colors hover:bg-green/75"
						type={useSubmitButton ? "submit" : "button"}
						onClick={handleConfirm}
					>
						Confirm
					</button>

					<DialogDismiss className="rounded-lg bg-red px-2 py-1 transition-colors hover:bg-red/75">
						Cancel
					</DialogDismiss>
				</div>
			</Dialog>
		</>
	);
}

interface ConfirmationProps extends PropsWithChildren {
	readonly buttonText: ReactNode;
	readonly className: string;
	onConfirm?(): void;
	/** @defaultValue `false` */
	disabled?: boolean;
	/** @defaultValue `false` */
	useSubmitButton?: boolean;
}
