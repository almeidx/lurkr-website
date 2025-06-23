import { Tooltip, TooltipAnchor, TooltipProvider } from "@ariakit/react";
import { UpdateOutlined } from "@/components/icons/mdi/update-outlined.tsx";

export function UpdateEmojiList() {
	return (
		<div className="w-fit">
			<TooltipProvider showTimeout={150}>
				<TooltipAnchor>
					<button
						className="flex w-fit items-center gap-2 rounded-lg bg-yellow px-2 py-1 font-semibold text-lg text-shadow-regular disabled:select-none disabled:opacity-50 md:text-xl"
						disabled
						type="button"
					>
						Update <UpdateOutlined className="size-5 drop-shadow-regular" />
					</button>
				</TooltipAnchor>

				<Tooltip className="rounded-lg bg-black px-2 py-1">Coming soon!</Tooltip>
			</TooltipProvider>
		</div>
	);
}
