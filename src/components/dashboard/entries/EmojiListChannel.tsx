import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import type { Channel, AddChangeFn, GuildSettings } from "~/contexts/GuildContext";

interface EmojiListChannelProps {
	addChange: AddChangeFn;
	channels: Channel[];
	settings: GuildSettings;
}

export function EmojiListChannel({ addChange, channels, settings }: EmojiListChannelProps) {
	return (
		<Field>
			<Label
				htmlFor="emojiListChannel"
				name="Emoji List Channel"
				url="https://docs.pepemanager.com/guides/automatically-controlled-emoji-list"
			/>
			<div className="max-w-md">
				<Selector
					id="emojiListChannel"
					initialItems={settings.emojiListChannel ? [settings.emojiListChannel] : []}
					items={channels}
					limit={1}
					onSelect={(channelIds) => addChange("emojiListChannel", channelIds[0] ?? null)}
					type="Channel"
				/>
			</div>
		</Field>
	);
}
