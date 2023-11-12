"use client";

import { Tooltip, TooltipAnchor, useTooltipStore } from "@ariakit/react/tooltip";
import { MdOutlineUpdate } from "@react-icons/all-files/md/MdOutlineUpdate";

export function UpdateEmojiList() {
	const tooltip = useTooltipStore({ showTimeout: 150 });

	return (
		<div className="w-fit">
			<TooltipAnchor store={tooltip}>
				<button
					className="flex w-fit items-center gap-2 rounded-lg bg-yellow px-2 py-1 text-lg font-semibold text-shadow-regular disabled:cursor-not-allowed disabled:select-none disabled:opacity-50 md:text-xl"
					type="button"
					disabled
				>
					Update <MdOutlineUpdate className="drop-shadow-regular" size={22} />
				</button>
			</TooltipAnchor>

			<Tooltip store={tooltip} className="rounded-lg bg-black px-2 py-1">
				Coming soon!
			</Tooltip>
		</div>
	);
}
