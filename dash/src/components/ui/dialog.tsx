// Tremor Dialog [v1.0.0]

import * as DialogPrimitives from "@radix-ui/react-dialog";
import React from "react";
import { cx, focusRing } from "@/lib/utils.ts";

const Dialog = (props: React.ComponentPropsWithoutRef<typeof DialogPrimitives.Root>) => {
	return <DialogPrimitives.Root {...props} />;
};
Dialog.displayName = "Dialog";

const DialogTrigger = DialogPrimitives.Trigger;

DialogTrigger.displayName = "DialogTrigger";

const DialogClose = DialogPrimitives.Close;

DialogClose.displayName = "DialogClose";

const DialogPortal = DialogPrimitives.Portal;

DialogPortal.displayName = "DialogPortal";

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitives.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitives.Overlay>
>(({ className, ...props }, forwardedRef) => {
	return (
		<DialogPrimitives.Overlay
			className={cx(
				// base
				"fixed inset-0 z-50 overflow-y-auto",
				// background color
				"bg-black/70",
				// transition
				// "data-[state=open]:animate-dialog-overlay-show",
				className,
			)}
			ref={forwardedRef}
			{...props}
		/>
	);
});

DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitives.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitives.Content>
>(({ className, ...props }, forwardedRef) => {
	return (
		<DialogPortal>
			<DialogOverlay>
				<DialogPrimitives.Content
					className={cx(
						// base
						"-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 w-[95vw] max-w-lg overflow-y-auto rounded-md border p-6 shadow-lg",
						// border color
						"border-gray-200 dark:border-gray-900",
						// background color
						"bg-white dark:bg-[#090E1A]",
						// transition
						// "data-[state=open]:animate-dialog-content-show",
						focusRing,
						className,
					)}
					ref={forwardedRef}
					tremor-id="tremor-raw"
					{...props}
				/>
			</DialogOverlay>
		</DialogPortal>
	);
});

DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	return <div className={cx("flex flex-col gap-y-1", className)} {...props} />;
};

DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitives.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitives.Title>
>(({ className, ...props }, forwardedRef) => (
	<DialogPrimitives.Title
		className={cx(
			// base
			"font-semibold text-lg",
			// text color
			"text-gray-900 dark:text-gray-50",
			className,
		)}
		ref={forwardedRef}
		{...props}
	/>
));

DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitives.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitives.Description>
>(({ className, ...props }, forwardedRef) => {
	return (
		<DialogPrimitives.Description
			className={cx("text-gray-500 dark:text-gray-500", className)}
			ref={forwardedRef}
			{...props}
		/>
	);
});

DialogDescription.displayName = "DialogDescription";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	return <div className={cx("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />;
};

DialogFooter.displayName = "DialogFooter";

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
};
