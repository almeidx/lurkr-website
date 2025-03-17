"use client";
import { cx, focusRing } from "@/lib/utils.ts";
import * as RadioGroupPrimitives from "@radix-ui/react-radio-group";
import { LaptopMinimal, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

// Based on Tremor Raw RadioGroup [v0.0.0]

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Root>
>(({ className, ...props }, forwardedRef) => {
	return <RadioGroupPrimitives.Root ref={forwardedRef} className={cx("grid gap-2", className)} {...props} />;
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitives.Item>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item> & {
		icon: React.ElementType;
	}
>(({ className, icon, ...props }, forwardedRef) => {
	const Icon = icon;
	return (
		<RadioGroupPrimitives.Item
			ref={forwardedRef}
			className={cx("group relative flex size-8 appearance-none items-center justify-center outline-none", className)}
			{...props}
		>
			<div
				className={cx(
					// base
					"flex size-full shrink-0 items-center justify-center rounded-lg text-gray-700 dark:text-gray-400",
					// background color
					"bg-transparent",
					// checked
					"group-data-[state=checked]:bg-indigo-50 group-data-[state=checked]:text-indigo-600 dark:group-data-[state=checked]:bg-indigo-500/20 dark:group-data-[state=checked]:text-indigo-300",
					// focus
					focusRing,
				)}
			>
				<Icon className="size-4 text-inherit" />
			</div>
		</RadioGroupPrimitives.Item>
	);
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };

export function ThemeSwitcher() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<RadioGroup
			value={theme}
			onValueChange={(value) => {
				setTheme(value);
			}}
			className="flex gap-1"
		>
			<RadioGroupItem
				aria-label="Switch theme to your system preference"
				title="Switch theme to your system preference"
				icon={LaptopMinimal}
				value="system"
				id="system"
				className="rounded-full"
			/>

			<RadioGroupItem
				aria-label="Switch theme to light mode"
				title="Switch theme to light mode"
				icon={Sun}
				value="light"
				id="light"
				className="rounded-full"
			/>

			<RadioGroupItem
				aria-label="Switch theme to dark mode"
				title="Switch theme to dark mode"
				icon={Moon}
				value="dark"
				id="dark"
				className="rounded-full"
			/>
		</RadioGroup>
	);
}
