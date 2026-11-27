"use client";

import { Button, Modal } from "@heroui/react";
import { type MouseEvent, type PropsWithChildren, type ReactNode, useRef, useState } from "react";

export function Confirmation({
	className,
	children,
	buttonText,
	onConfirm,
	disabled = false,
	useSubmitButton = false,
}: ConfirmationProps) {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);

	function handleOpen(event: MouseEvent<HTMLButtonElement>) {
		// Safari does not focus a clicked button, and the modal returns focus to the focused element when it closes.
		event.currentTarget.focus();
		setIsOpen(true);
	}

	function handleConfirm() {
		setIsOpen(false);

		onConfirm?.();

		// The modal is rendered outside of the surrounding form, so it has to be submitted through the trigger.
		if (useSubmitButton) {
			triggerRef.current?.form?.requestSubmit();
		}
	}

	return (
		<>
			<button className={className} disabled={disabled} onClick={handleOpen} ref={triggerRef} type="button">
				{buttonText}
			</button>

			<Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen} variant="blur">
				<Modal.Container className="sm:pt-20" placement="top">
					<Modal.Dialog className="rounded-lg border border-white/25 bg-dark-gray px-4 py-3">
						<Modal.Header>
							<Modal.Heading className="flex items-center gap-2 text-xl font-bold">{buttonText}</Modal.Heading>
						</Modal.Header>

						<Modal.Body className="mt-4 text-base text-white/75">{children}</Modal.Body>

						<Modal.Footer className="mt-4 justify-start gap-4">
							<Button
								className="rounded-lg bg-green px-2 text-base font-normal text-white hover:bg-green/75"
								onPress={handleConfirm}
								size="sm"
							>
								Confirm
							</Button>

							<Button
								className="rounded-lg bg-red px-2 text-base font-normal text-white hover:bg-red/75"
								size="sm"
								slot="close"
							>
								Cancel
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</>
	);
}

interface ConfirmationProps extends PropsWithChildren {
	readonly buttonText: ReactNode;
	readonly className: string;
	onConfirm?(): void;
	disabled?: boolean;
	useSubmitButton?: boolean;
}
