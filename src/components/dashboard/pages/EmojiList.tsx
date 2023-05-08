"use client";

import { useContext, useEffect } from "react";
import Header from "@/dashboard/Header";
import { EmojiListChannel } from "@/entries/EmojiListChannel";
import Fieldset from "@/form/Fieldset";
import { GuildContext, type Channel, type GuildSettings } from "~/contexts/GuildContext";

export default function EmojiList({ channels, settings, openMenu }: EmojiListProps) {
	const { addChange } = useContext(GuildContext);

	useEffect(() => window.scroll({ behavior: "auto", left: 0, top: 0 }), [openMenu]);

	return (
		<>
			<Header
				description="Automatically populate a channel with all the emojis in your server."
				id="emojiList"
				initialValue={settings.emojiList}
				onChange={(state) => addChange("emojiList", state)}
				openMenu={openMenu}
				title="Emoji List"
			/>

			<Fieldset>
				<EmojiListChannel addChange={addChange} channels={channels} settings={settings} />
			</Fieldset>
		</>
	);
}

interface EmojiListProps {
	channels: Channel[];
	openMenu(): void;
	settings: GuildSettings;
}
