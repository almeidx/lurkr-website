import { CreatableList } from "@/components/dashboard/CreatableList.tsx";
import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import {
	MAX_XP_ANNOUNCE_LEVEL,
	MAX_XP_ANNOUNCE_LEVELS,
	MAX_XP_ANNOUNCE_MINIMUM_LEVEL,
	MAX_XP_ANNOUNCE_MULTIPLE_OF,
	MIN_XP_ANNOUNCE_LEVEL,
	MIN_XP_ANNOUNCE_MINIMUM_LEVEL,
	MIN_XP_ANNOUNCE_MULTIPLE_OF,
} from "@/lib/guild-config.ts";
import type { GuildSettings } from "@/lib/guild.ts";

export function LevelUpMessageConditions({ settings }: { readonly settings: GuildSettings }) {
	return (
		<>
			<CreatableList
				defaultValues={settings.xpAnnounceLevels.map(String)}
				inputId="level-up-message-levels"
				placeholder="Type something and press enter, e.g. 10"
				settingId="xpAnnounceLevels"
			>
				<div className="mt-2 flex items-center">
					<Label
						sub={`Max. ${MAX_XP_ANNOUNCE_LEVELS} levels between ${MIN_XP_ANNOUNCE_LEVEL}-${MAX_XP_ANNOUNCE_LEVEL}`}
					>
						Set the <span className="font-semibold tracking-tight text-white">specific</span> levels you want the level
						up message to be sent at…
					</Label>

					<DocsBubble
						path="/guides/customize-level-up-messages#when-to-send-the-level-up-message"
						tooltip="Choose exactly what levels will trigger the level up message. All other levels will be ignored."
					/>
				</div>
			</CreatableList>

			<div className="mt-2 flex items-center">
				<Label sub={`Between level ${MIN_XP_ANNOUNCE_MINIMUM_LEVEL}-${MAX_XP_ANNOUNCE_MINIMUM_LEVEL}`}>
					Set the <span className="font-semibold tracking-tight text-white">minimum</span> level you want the level up
					message to be sent at…
				</Label>

				<DocsBubble
					path="/guides/customize-level-up-messages#when-to-send-the-level-up-message"
					tooltip="Select the level at which you want to receive the level up message. Any levels lower than the chosen level won't trigger the message."
				/>
			</div>

			<Input
				id="xpAnnounceMinimumLevel"
				placeholder="Write the minimum level you want…"
				type="number"
				min={MIN_XP_ANNOUNCE_MINIMUM_LEVEL}
				max={MAX_XP_ANNOUNCE_MINIMUM_LEVEL}
			/>

			<div className="mt-2 flex items-center">
				<Label sub={`Between level ${MIN_XP_ANNOUNCE_MULTIPLE_OF}-${MAX_XP_ANNOUNCE_MULTIPLE_OF}`}>
					Set the <span className="font-semibold tracking-tight text-white">factor</span> for levels you want the level
					up message to be sent at…
				</Label>

				<DocsBubble
					path="/guides/customize-level-up-messages#when-to-send-the-level-up-message"
					tooltip="Choosing a factor will only send the level up message to levels which are a multiple of the chosen factor. Selecting 5 will send the message at levels 5, 10, 15, etc."
				/>
			</div>

			<Input
				id="xpAnnounceMultipleOf"
				placeholder="Write the factor for levels you want…"
				type="number"
				min={MIN_XP_ANNOUNCE_MULTIPLE_OF}
				max={MAX_XP_ANNOUNCE_MULTIPLE_OF}
			/>
		</>
	);
}
