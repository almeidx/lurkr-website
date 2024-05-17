"use client";

import { Tooltip, TooltipAnchor, useTooltipStore } from "@ariakit/react/tooltip";
import { UpdateOutlined } from "@mui/icons-material";

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
					Update <UpdateOutlined className="drop-shadow-regular size-5" />
				</button>
			</TooltipAnchor>

			<Tooltip store={tooltip} className="rounded-lg bg-black px-2 py-1">
				Coming soon!
			</Tooltip>
		</div>
	);
}
