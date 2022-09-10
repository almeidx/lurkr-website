import { useContext, useEffect } from "react";
import { GuildContext, type Channel, type GuildSettings } from "../../../contexts/GuildContext";
import Field from "../../form/Field";
import Fieldset from "../../form/Fieldset";
import Label from "../../form/Label";
import Selector from "../../form/Selector";
import Header from "../Header";

interface EmojiListProps {
	channels: Channel[];
	openMenu(): void;
	settings: GuildSettings;
}

export default function EmojiList({ channels, settings, openMenu }: EmojiListProps) {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { addChange } = useContext(GuildContext);

	useEffect(() => {
		window.scroll({
			behavior: "auto",
			left: 0,
			top: 0,
		});
	}, [openMenu]);

	return (
		<>
			<Header
				openMenu={openMenu}
				description="Automatically populate a channel with all the emojis in your server."
				id="emojiList"
				initialValue={settings.emojiList}
				onChange={(state) => addChange("emojiList", state)}
				title="Emoji List"
			/>

			<Fieldset>
				<Field>
					<Label
						htmlFor="emojiListChannel"
						name="Emoji List Channel"
						url="https://docs.pepemanager.com/guides/automatically-controlled-emoji-list"
					/>
					<div className="max-w-md">
						<Selector
							id="emojiListChannel"
							limit={1}
							initialItems={settings.emojiListChannel ? [settings.emojiListChannel] : []}
							items={channels}
							onSelect={(channelIds) => addChange("emojiListChannel", channelIds[0] ?? null)}
							type="Channel"
						/>
					</div>
				</Field>
			</Fieldset>
		</>
	);
}
