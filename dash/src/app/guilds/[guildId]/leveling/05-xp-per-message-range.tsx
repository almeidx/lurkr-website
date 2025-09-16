import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { MAX_XP_PER_MESSAGE, MIN_XP_PER_MESSAGE } from "@/lib/guild-config.ts";

export function XpPerMessageRange({ defaultMin, defaultMax }: XpPerMessageRangeProps) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center">
				<Label>Set the XP range awarded per message…</Label>

				<DocsBubble
					path="/guides/leveling-automation#xp-per-message-range"
					tooltip="Each message awards a random amount of XP between these two values. The minimum must be less than or equal to the maximum."
				/>
			</div>

			<div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
				<div className="flex flex-col gap-2">
					<Label sub={`Between ${MIN_XP_PER_MESSAGE}-${MAX_XP_PER_MESSAGE}`}>Minimum XP</Label>
					<Input
						defaultValue={defaultMin}
						id="xpPerMessageMin"
						max={MAX_XP_PER_MESSAGE}
						min={MIN_XP_PER_MESSAGE}
						placeholder={`Min XP (${MIN_XP_PER_MESSAGE}-${MAX_XP_PER_MESSAGE})`}
						type="number"
					/>
				</div>

				<div className="hidden items-center justify-center md:flex">
					<div className="h-16 w-px bg-white/20" />
				</div>

				<div className="flex flex-col gap-2">
					<Label sub={`Between ${MIN_XP_PER_MESSAGE}-${MAX_XP_PER_MESSAGE}`}>Maximum XP</Label>
					<Input
						defaultValue={defaultMax}
						id="xpPerMessageMax"
						max={MAX_XP_PER_MESSAGE}
						min={MIN_XP_PER_MESSAGE}
						placeholder={`Max XP (${MIN_XP_PER_MESSAGE}-${MAX_XP_PER_MESSAGE})`}
						type="number"
					/>
				</div>
			</div>

			<div className="text-sm text-white/60">
				<p>
					Default: 15-40 XP per message. Each message will award a random amount of XP between your minimum and maximum
					values.
				</p>
			</div>
		</div>
	);
}

interface XpPerMessageRangeProps {
	readonly defaultMin: number;
	readonly defaultMax: number;
}
