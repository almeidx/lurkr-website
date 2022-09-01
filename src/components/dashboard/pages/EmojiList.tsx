import { useContext, useEffect } from "react";
import { GuildContext } from "../../../contexts/GuildContext";
import type { DashboardChannels, DashboardDatabaseGuild } from "../../../graphql/queries/DashboardGuild";
import Field from "../../form/Field";
import Fieldset from "../../form/Fieldset";
import Label from "../../form/Label";
import Selector from "../../form/Selector";
import Header from "../Header";

interface EmojiListProps {
	channels: DashboardChannels;
	database: DashboardDatabaseGuild;
	openMenu(): void;
}

export default function EmojiList({ channels, database, openMenu }: EmojiListProps) {
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
				initialValue={database.emojiList}
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
					<div className="max-w-[20rem]">
						<Selector
							id="emojiListChannel"
							limit={1}
							initialItems={database.emojiListChannel ? [database.emojiListChannel] : []}
							items={channels}
							onSelect={(channelIds) => addChange("emojiListChannel", channelIds[0] ?? null)}
							type="channel"
						/>
					</div>
				</Field>
			</Fieldset>
		</>
	);
}
