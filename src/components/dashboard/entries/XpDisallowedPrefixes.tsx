import { useState, useRef } from "react";
import { MdPlaylistAdd } from "react-icons/md";
import SmallClearableItem from "@/dashboard/SmallClearableItem";
import Field from "@/form/Field";
import Input from "@/form/Input";
import Label from "@/form/Label";
import Subtitle from "@/form/Subtitle";
import type { AddChangeFn, GuildSettings } from "~/contexts/GuildContext";
import {
	MAX_XP_DISALLOWED_PREFIXES,
	MAX_XP_DISALLOWED_PREFIXES_PREMIUM,
	MAX_XP_DISALLOWED_PREFIX_LENGTH,
} from "~/utils/guild-config";

interface XpDisallowedPrefixesProps {
	addChange: AddChangeFn;
	settings: GuildSettings;
}

export function XpDisallowedPrefixes({ addChange, settings }: XpDisallowedPrefixesProps) {
	const [newDisallowedPrefix, setNewDisallowedPrefix] = useState<string>("");
	const [xpDisallowedPrefixes, setXpDisallowedPrefixes] = useState<string[]>(settings.xpDisallowedPrefixes);
	const newXpDisallowedPrefixSubmitRef = useRef<HTMLButtonElement>(null);

	const xpDisallowedPrefixesLimit = settings.premium ? MAX_XP_DISALLOWED_PREFIXES_PREMIUM : MAX_XP_DISALLOWED_PREFIXES;

	return (
		<Field>
			<Label
				htmlFor="xpDisallowedPrefixes"
				name="Ignored Leveling Bot Prefixes"
				url="https://docs.lurkr.gg/guides/setting-up-server-xp-leveling#blacklisting-bot-prefixes"
			/>

			<div className="max-w-md divide-y-2">
				<Input
					clearOnSubmit
					id="newXpDisallowedPrefix"
					initialValue=""
					maxLength={MAX_XP_DISALLOWED_PREFIX_LENGTH}
					onChange={(text) => setNewDisallowedPrefix(text)}
					onSubmit={() => {
						if (
							!xpDisallowedPrefixes.includes(newDisallowedPrefix) &&
							xpDisallowedPrefixes.length < xpDisallowedPrefixesLimit
						) {
							const newArr = [...xpDisallowedPrefixes, newDisallowedPrefix];
							setXpDisallowedPrefixes(newArr);
							addChange("xpDisallowedPrefixes", newArr);
						}
					}}
					placeholder="Enter a prefix to add to the disallowed list"
					submitIcon={MdPlaylistAdd}
					submitRef={newXpDisallowedPrefixSubmitRef}
				/>
			</div>

			{Boolean(xpDisallowedPrefixes.length) && (
				<div className="my-4 flex flex-row flex-wrap gap-2">
					{xpDisallowedPrefixes.map((prefix, index) => (
						<SmallClearableItem
							index={index}
							item={prefix}
							key={prefix}
							onDelete={(index) => {
								const clone = [...xpDisallowedPrefixes];
								clone.splice(index, 1);
								setXpDisallowedPrefixes(clone);
								addChange("xpDisallowedPrefixes", clone);
							}}
						/>
					))}
				</div>
			)}

			<Subtitle text={`Maximum of ${xpDisallowedPrefixesLimit} prefixes.`} />
		</Field>
	);
}
