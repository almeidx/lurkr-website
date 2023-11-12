"use client";

import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { Select, SelectItem, SelectLabel, SelectPopover, useSelectStore } from "@ariakit/react/select";

export const enum RoleMultiplierPriorityEnum {
	Hierarchy = "Hierarchy",
	Multiplier = "Multiplier",
}

export function RoleMultiplierPriority({ defaultValue }: { readonly defaultValue: boolean }) {
	const select = useSelectStore({ defaultValue: convertDefaultValueToEnum(defaultValue) });

	return (
		<div className="mt-3 flex h-6 items-center gap-2 rounded-lg">
			<SelectLabel className="flex items-center text-lg tracking-tight text-white/75 md:text-xl" store={select}>
				Prioritize Role Multipliers over{" "}
				<DocsBubble path="/guides/setting-up-leveling-multipliers#changing-role-multiplier-hierarchy" />
			</SelectLabel>

			<Select
				store={select}
				className="flex h-10 w-36 items-center justify-between rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
			/>

			<SelectPopover
				store={select}
				gutter={8}
				sameWidth
				className="z-[10000] flex w-36 flex-col gap-2 rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
			>
				<SelectItem className="cursor-pointer" value={RoleMultiplierPriorityEnum.Hierarchy}>
					Role Hierarchy
				</SelectItem>

				<SelectItem className="cursor-pointer" value={RoleMultiplierPriorityEnum.Multiplier}>
					Multiplier Value
				</SelectItem>
			</SelectPopover>
		</div>
	);
}

function convertDefaultValueToEnum(defaultValue: boolean) {
	return defaultValue ? RoleMultiplierPriorityEnum.Hierarchy : RoleMultiplierPriorityEnum.Multiplier;
}
