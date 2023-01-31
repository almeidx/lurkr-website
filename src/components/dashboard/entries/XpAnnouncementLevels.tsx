import { useState, useRef } from "react";
import { MdPlaylistAdd } from "react-icons/md";
import SmallClearableItem from "@/dashboard/SmallClearableItem";
import Field from "@/form/Field";
import Input from "@/form/Input";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import type { AddChangeFn, GuildSettings } from "~/contexts/GuildContext";
import { getDatabaseLimit, parseIntStrict } from "~/utils/common";

interface XpAnnouncementLevelsProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function XpAnnouncementLevels({ addChange, settings }: XpAnnouncementLevelsProps) {
	const [xpAnnounceLevels, setXpAnnounceLevels] = useState<number[]>(settings.xpAnnounceLevels);
	const [newXpAnnounceLevel, setNewXpAnnounceLevel] = useState<string>("");
	const newXpAnnounceLevelsSubmitRef = useRef<HTMLButtonElement>(null);

	const xpAnnounceLevelsLimit = getDatabaseLimit("xpAnnounceLevels", settings.premium).maxLength;
	const xpAnnounceLevelLimits = getDatabaseLimit("xpAnnounceLevel", settings.premium);

	return (
		<Field>
			<Label
				htmlFor="xpAnnounceLevels"
				name="Specific Announcement Levels"
				url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#when-to-send-the-level-up-message"
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
							level >= xpAnnounceLevelLimits.min &&
							level <= xpAnnounceLevelLimits.max &&
							!xpAnnounceLevels.includes(level) &&
							xpAnnounceLevels.length < xpAnnounceLevelsLimit
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

			<Subtitle text={`Maximum of ${xpAnnounceLevelsLimit} levels.`} />
		</Field>
	);
}
