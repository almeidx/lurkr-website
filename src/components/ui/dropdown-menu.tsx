// Tremor Dropdown Menu [v1.0.0]

"use client";

import * as DropdownMenuPrimitives from "@radix-ui/react-dropdown-menu";
import { RiArrowRightSLine, RiCheckboxBlankCircleLine, RiCheckLine, RiRadioButtonFill } from "@remixicon/react";
import * as React from "react";

import { cx } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitives.Root;
DropdownMenu.displayName = "DropdownMenu";

const DropdownMenuTrigger = DropdownMenuPrimitives.Trigger;
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuGroup = DropdownMenuPrimitives.Group;
DropdownMenuGroup.displayName = "DropdownMenuGroup";

const DropdownMenuSubMenu = DropdownMenuPrimitives.Sub;
DropdownMenuSubMenu.displayName = "DropdownMenuSubMenu";

const DropdownMenuRadioGroup = DropdownMenuPrimitives.RadioGroup;
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup";

const DropdownMenuSubMenuTrigger = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitives.SubTrigger>,
	Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.SubTrigger>, "asChild">
>(({ className, children, ...props }, forwardedRef) => (
	<DropdownMenuPrimitives.SubTrigger
		className={cx(
			// base
			"relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-1 pl-2 outline-hidden transition-colors data-[state=checked]:font-semibold sm:text-sm",
			// text color
			"text-gray-900 dark:text-gray-50",
			// disabled
			"data-disabled:pointer-events-none data-disabled:text-gray-400 data-disabled:hover:bg-none dark:data-disabled:text-gray-600",
			// focus
			"focus-visible:bg-gray-100 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-900 dark:focus-visible:bg-gray-900",
			// hover
			"hover:bg-gray-100 dark:hover:bg-gray-900",
			//
			className,
		)}
		ref={forwardedRef}
		{...props}
	>
		{children}
		<RiArrowRightSLine aria-hidden="true" className="ml-auto size-4 shrink-0" />
	</DropdownMenuPrimitives.SubTrigger>
));
DropdownMenuSubMenuTrigger.displayName = "DropdownMenuSubMenuTrigger";

const DropdownMenuSubMenuContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitives.SubContent>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.SubContent>
>(({ className, collisionPadding = 8, ...props }, forwardedRef) => (
	<DropdownMenuPrimitives.Portal>
		<DropdownMenuPrimitives.SubContent
			className={cx(
				// base
				"relative z-50 overflow-hidden rounded-md border p-1 shadow-black/2.5 shadow-xl",
				// widths
				"min-w-32",
				// heights
				"max-h-(--radix-popper-available-height)",
				// background color
				"bg-white dark:bg-gray-950",
				// text color
				"text-gray-900 dark:text-gray-50",
				// border color
				"border-gray-200 dark:border-gray-800",
				// transition
				"will-change-[transform,opacity]",
				"data-[state=closed]:animate-hide",
				"data-[side=bottom]:animate-slide-down-and-fade data-[side=left]:animate-slide-left-and-fade data-[side=right]:animate-slide-right-and-fade data-[side=top]:animate-slide-up-and-fade",
				className,
			)}
			collisionPadding={collisionPadding}
			ref={forwardedRef}
			{...props}
		/>
	</DropdownMenuPrimitives.Portal>
));
DropdownMenuSubMenuContent.displayName = "DropdownMenuSubMenuContent";

const DropdownMenuContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitives.Content>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Content>
>(({ className, sideOffset = 8, collisionPadding = 8, align = "center", loop = true, ...props }, forwardedRef) => (
	<DropdownMenuPrimitives.Portal>
		<DropdownMenuPrimitives.Content
			align={align}
			className={cx(
				// base
				"relative z-50 overflow-hidden rounded-md border p-1 shadow-black/2.5 shadow-xl",
				// widths
				"min-w-48",
				// heights
				"max-h-(--radix-popper-available-height)",
				// background color
				"bg-white dark:bg-gray-950",
				// text color
				"text-gray-900 dark:text-gray-50",
				// border color
				"border-gray-200 dark:border-gray-800",
				// transition
				"will-change-[transform,opacity]",
				"data-[state=closed]:animate-hide",
				"data-[side=bottom]:animate-slide-down-and-fade data-[side=left]:animate-slide-left-and-fade data-[side=right]:animate-slide-right-and-fade data-[side=top]:animate-slide-up-and-fade",
				className,
			)}
			collisionPadding={collisionPadding}
			loop={loop}
			ref={forwardedRef}
			sideOffset={sideOffset}
			{...props}
		/>
	</DropdownMenuPrimitives.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitives.Item>,
	Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Item>, "asChild"> & {
		shortcut?: string;
		hint?: string;
	}
>(({ className, shortcut, hint, children, ...props }, forwardedRef) => (
	<DropdownMenuPrimitives.Item
		className={cx(
			// base
			"group/DropdownMenuItem relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pr-1 pl-2 outline-hidden transition-colors data-[state=checked]:font-semibold sm:text-sm",
			// text color
			"text-gray-900 dark:text-gray-50",
			// disabled
			"data-disabled:pointer-events-none data-disabled:text-gray-400 data-disabled:hover:bg-none dark:data-disabled:text-gray-600",
			// focus
			"focus-visible:bg-gray-100 dark:focus-visible:bg-gray-900",
			// hover
			"hover:bg-gray-100 dark:hover:bg-gray-900",
			className,
		)}
		ref={forwardedRef}
		tremor-id="tremor-raw"
		{...props}
	>
		{children}
		{hint && <span className={cx("ml-auto pl-2 text-gray-400 text-sm dark:text-gray-600")}>{hint}</span>}
		{shortcut && <span className={cx("ml-auto pl-2 text-gray-400 text-sm dark:text-gray-600")}>{shortcut}</span>}
	</DropdownMenuPrimitives.Item>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitives.CheckboxItem>,
	Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.CheckboxItem>, "asChild"> & {
		shortcut?: string;
		hint?: string;
	}
>(({ className, hint, shortcut, children, checked, ...props }, forwardedRef) => (
	<DropdownMenuPrimitives.CheckboxItem
		checked={checked}
		className={cx(
			// base
			"relative flex cursor-pointer select-none items-center gap-x-2 rounded-sm py-1.5 pr-1 pl-8 outline-hidden transition-colors data-[state=checked]:font-semibold sm:text-sm",
			// text color
			"text-gray-900 dark:text-gray-50",
			// disabled
			"data-disabled:pointer-events-none data-disabled:text-gray-400 data-disabled:hover:bg-none dark:data-disabled:text-gray-600",
			// focus
			"focus-visible:bg-gray-100 dark:focus-visible:bg-gray-900",
			// hover
			"hover:bg-gray-100 dark:hover:bg-gray-900",
			className,
		)}
		ref={forwardedRef}
		{...props}
	>
		<span className="absolute left-2 flex size-4 items-center justify-center">
			<DropdownMenuPrimitives.ItemIndicator>
				<RiCheckLine aria-hidden="true" className="size-full shrink-0 text-gray-800 dark:text-gray-200" />
			</DropdownMenuPrimitives.ItemIndicator>
		</span>
		{children}
		{hint && <span className={cx("ml-auto font-normal text-gray-400 text-sm dark:text-gray-600")}>{hint}</span>}
		{shortcut && (
			<span
				className={cx(
					"ml-auto font-normal text-gray-400 text-sm tracking-widest dark:border-gray-800 dark:text-gray-600",
				)}
			>
				{shortcut}
			</span>
		)}
	</DropdownMenuPrimitives.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitives.RadioItem>,
	Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.RadioItem>, "asChild"> & {
		shortcut?: string;
		hint?: string;
	}
>(({ className, hint, shortcut, children, ...props }, forwardedRef) => (
	<DropdownMenuPrimitives.RadioItem
		className={cx(
			// base
			"group/DropdownMenuRadioItem relative flex cursor-pointer select-none items-center gap-x-2 rounded-sm py-1.5 pr-1 pl-8 outline-hidden transition-colors data-[state=checked]:font-semibold sm:text-sm",
			// text color
			"text-gray-900 dark:text-gray-50",
			// disabled
			"data-disabled:pointer-events-none data-disabled:text-gray-400 data-disabled:hover:bg-none dark:data-disabled:text-gray-600",
			// focus
			"focus-visible:bg-gray-100 dark:focus-visible:bg-gray-900",
			// hover
			"hover:bg-gray-100 dark:hover:bg-gray-900",
			className,
		)}
		ref={forwardedRef}
		{...props}
	>
		<span className="absolute left-2 flex size-4 items-center justify-center">
			<RiRadioButtonFill
				aria-hidden="true"
				className="size-full shrink-0 text-blue-500 group-data-[state=checked]/DropdownMenuRadioItem:flex group-data-[state=unchecked]/DropdownMenuRadioItem:hidden dark:text-blue-500"
			/>
			<RiCheckboxBlankCircleLine
				aria-hidden="true"
				className="size-full shrink-0 text-gray-300 group-data-[state=unchecked]/DropdownMenuRadioItem:flex group-data-[state=checked]/DropdownMenuRadioItem:hidden dark:text-gray-700"
			/>
		</span>
		{children}
		{hint && <span className={cx("ml-auto font-normal text-gray-400 text-sm dark:text-gray-600")}>{hint}</span>}
		{shortcut && (
			<span
				className={cx(
					"ml-auto font-normal text-gray-400 text-sm tracking-widest dark:border-gray-800 dark:text-gray-600",
				)}
			>
				{shortcut}
			</span>
		)}
	</DropdownMenuPrimitives.RadioItem>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitives.Label>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Label>
>(({ className, ...props }, forwardedRef) => (
	<DropdownMenuPrimitives.Label
		className={cx(
			// base
			"px-2 py-2 font-medium text-xs tracking-wide",
			// text color
			"text-gray-500 dark:text-gray-500",
			className,
		)}
		ref={forwardedRef}
		{...props}
	/>
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitives.Separator>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Separator>
>(({ className, ...props }, forwardedRef) => (
	<DropdownMenuPrimitives.Separator
		className={cx("-mx-1 my-1 h-px border-gray-200 border-t dark:border-gray-800", className)}
		ref={forwardedRef}
		{...props}
	/>
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuIconWrapper = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
	return (
		<div
			className={cx(
				// text color
				"text-gray-600 dark:text-gray-400",
				// disabled
				"group-data-disabled/DropdownMenuItem:text-gray-400 dark:group-data-disabled/DropdownMenuItem:text-gray-700",
				className,
			)}
			{...props}
		/>
	);
};
DropdownMenuIconWrapper.displayName = "DropdownMenuIconWrapper";

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuSubMenuTrigger,
	DropdownMenuSubMenu,
	DropdownMenuSubMenuContent,
	DropdownMenuGroup,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuCheckboxItem,
	DropdownMenuIconWrapper,
	DropdownMenuLabel,
	DropdownMenuSeparator,
};
