import { CreatableList } from "@/components/dashboard/CreatableList.tsx";
import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
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
					<div className="flex items-end gap-2 tracking-tight">
						<p className="text-lg text-white/75 md:text-xl">
							Set the <span className="font-semibold tracking-tight text-white">specific</span> levels you want the
							level up message to be sent at…
						</p>
						<p className="mb-1 text-xs font-light text-white/50">(Max. 100 levels)</p>
					</div>

					<DocsBubble path="/guides/setting-up-server-leveling#when-to-send-the-level-up-message" />
				</div>
			</CreatableList>

			<div className="mt-2 flex items-center">
				<div className="flex items-end gap-2 tracking-tight">
					<p className="text-lg text-white/75 md:text-xl">
						Set the <span className="font-semibold tracking-tight text-white">minimum</span> level you want the level up
						message to be sent at…
					</p>
					<p className="mb-1 text-xs font-light text-white/50">(Between level 1-500)</p>
				</div>

				<DocsBubble path="/guides/setting-up-server-leveling#when-to-send-the-level-up-message" />
			</div>

			<Input id="xpAnnounceMinimumLevel" placeholder="Write the minimum level you want…" />

			<div className="mt-2 flex items-center">
				<div className="flex items-end gap-2 tracking-tight">
					<p className="text-lg text-white/75 md:text-xl">
						Set the <span className="font-semibold tracking-tight text-white">factor</span> for levels you want the
						level up message to be sent at…
					</p>
					<p className="mb-1 text-xs font-light text-white/50">(Between level 1-250)</p>
				</div>

				<DocsBubble path="/guides/setting-up-server-leveling#when-to-send-the-level-up-message" />
			</div>

			<Input id="xpAnnounceMultipleOf" placeholder="Write the factor for levels you want…" />
		</>
	);
}
