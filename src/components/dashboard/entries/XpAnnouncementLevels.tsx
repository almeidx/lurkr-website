import { useState, useRef } from "react";
import { MdPlaylistAdd } from "react-icons/md";
import SmallClearableItem from "@/dashboard/SmallClearableItem";
import Field from "@/form/Field";
import Input from "@/form/Input";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import type { AddChangeFn, GuildSettings } from "~/contexts/GuildContext";
import { parseIntStrict } from "~/utils/common";
import { MAX_XP_ANNOUNCE_LEVEL, MAX_XP_ANNOUNCE_LEVELS, MIN_XP_ANNOUNCE_LEVEL } from "~/utils/guild-config";

interface XpAnnouncementLevelsProps {
	readonly addChange: AddChangeFn;
	readonly settings: GuildSettings;
}

export function XpAnnouncementLevels({ addChange, settings }: XpAnnouncementLevelsProps) {
	const [xpAnnounceLevels, setXpAnnounceLevels] = useState<number[]>(settings.xpAnnounceLevels);
	const [newXpAnnounceLevel, setNewXpAnnounceLevel] = useState<string>("");
	const newXpAnnounceLevelsSubmitRef = useRef<HTMLButtonElement>(null);

	return (
		<Field>
			<Label
				htmlFor="xpAnnounceLevels"
				name="Specific Announcement Levels"
				url="https://docs.lurkr.gg/guides/setting-up-server-xp-leveling#when-to-send-the-level-up-message"
			/>

			<div className="max-w-md divide-y-2">
				<Input
					clearOnSubmit
					id="newXpAnnounceLevel"
					initialValue=""
					maxLength={3}
					onChange={(text) => setNewXpAnnounceLevel(text)}
					onSubmit={() => {
						const level = parseIntStrict(newXpAnnounceLevel);
						if (
							level >= MIN_XP_ANNOUNCE_LEVEL &&
							level <= MAX_XP_ANNOUNCE_LEVEL &&
							!xpAnnounceLevels.includes(level) &&
							xpAnnounceLevels.length < MAX_XP_ANNOUNCE_LEVELS
						) {
							const newArr = [...xpAnnounceLevels, level];
							setXpAnnounceLevels(newArr);
							addChange("xpAnnounceLevels", newArr);
						}
					}}
					placeholder="Enter a level to add to the announce levels list"
					submitIcon={MdPlaylistAdd}
					submitRef={newXpAnnounceLevelsSubmitRef}
				/>
			</div>

			{Boolean(xpAnnounceLevels.length) && (
				<div className="my-4 flex flex-row flex-wrap gap-2">
					{xpAnnounceLevels.map((prefix, index) => (
						<SmallClearableItem
							index={index}
							item={prefix}
							key={prefix}
							onDelete={(index) => {
								const clone = [...xpAnnounceLevels];
								clone.splice(index, 1);
								setXpAnnounceLevels(clone);
								addChange("xpAnnounceLevels", clone);
							}}
						/>
					))}
				</div>
			)}

			<Subtitle text={`Maximum of ${MAX_XP_ANNOUNCE_LEVELS} levels.`} />
		</Field>
	);
}
