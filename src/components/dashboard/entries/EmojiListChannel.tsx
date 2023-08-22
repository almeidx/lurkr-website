import { useMemo } from "react";
import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import { type Channel, type AddChangeFn, type GuildSettings, ChannelType } from "~/contexts/GuildContext";

interface EmojiListChannelProps {
	readonly addChange: AddChangeFn;
	readonly channels: Channel[];
	readonly settings: GuildSettings;
}

export function EmojiListChannel({ addChange, channels, settings }: EmojiListChannelProps) {
	const allowedChannels = useMemo(
		() => channels.filter((channel) => channel.type !== ChannelType.GuildForum),
		[channels],
	);

	return (
		<Field>
			<Label
				htmlFor="emojiListChannel"
				name="Emoji List Channel"
				url="https://docs.lurkr.gg/guides/automatically-controlled-emoji-list"
			/>
			<div className="max-w-md">
				<Selector
					id="emojiListChannel"
					initialItems={settings.emojiListChannel ? [settings.emojiListChannel] : []}
					items={allowedChannels}
					limit={1}
					onSelect={(channelIds) => addChange("emojiListChannel", channelIds[0] ?? null)}
					type="Channel"
				/>
			</div>
		</Field>
	);
}
