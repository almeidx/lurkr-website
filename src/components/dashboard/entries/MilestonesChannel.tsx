"use client";

import { useMemo } from "react";
import Field from "@/form/Field";
import Label from "@/form/Label";
import Selector from "@/form/Selector";
import { type Channel, type GuildSettings, type AddChangeFn, ChannelType } from "~/contexts/GuildContext";

interface MilestonesChannelProps {
	addChange: AddChangeFn;
	channels: Channel[];
	settings: GuildSettings;
}

export function MilestonesChannel({ addChange, channels, settings }: MilestonesChannelProps) {
	const allowedChannels = useMemo(
		() => channels.filter((channel) => channel.type !== ChannelType.GuildForum),
		[channels],
	);

	return (
		<Field>
			<Label
				htmlFor="milestonesChannel"
				name="Milestone Channel"
				url="https://docs.lurkr.gg/guides/automatically-controlled-member-milestones#setting-the-milestones-channel"
			/>
			<div className="max-w-md">
				<Selector
					id="milestonesChannel"
					initialItems={settings.milestonesChannel ? [settings.milestonesChannel] : []}
					items={allowedChannels}
					limit={1}
					onSelect={(channelIds) => addChange("milestonesChannel", channelIds[0] ?? null)}
					type="Channel"
				/>
			</div>
		</Field>
	);
}
