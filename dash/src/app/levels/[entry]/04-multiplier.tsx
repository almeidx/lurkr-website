import { Chip } from "@heroui/react";
import Image from "next/image";
import announcementChannel from "@/assets/channel-icons/announcement.svg";
import forumChannel from "@/assets/channel-icons/forum.svg";
import textChannel from "@/assets/channel-icons/text.svg";
import voiceChannel from "@/assets/channel-icons/voice.svg";
import { type Channel, ChannelType, type Role, XpMultiplierType } from "@/lib/guild.ts";
import { RoleDisplay } from "./03-role-reward.tsx";

export function MultiplierDisplay({ multiplier, targets, type }: Multiplier) {
	return (
		<div className="rounded-lg border border-white/10 bg-white/5 p-3">
			<div className="mb-2 flex items-center gap-2">
				<div className="flex size-6 items-center justify-center rounded-md bg-warning/20 font-semibold text-warning text-xs">
					{multiplier}x
				</div>
				<span className="font-medium text-white/60 text-xs">Multiplier</span>
			</div>
			<div className="flex flex-wrap gap-2">
				{/* Global multiplier comes without targets key */}
				{targets ? (
					targets.map((target) =>
						type === XpMultiplierType.Channel ? (
							<ChannelDisplay key={target.id} {...(target as Channel)} />
						) : (
							<RoleDisplay key={target.id} {...(target as Role)} />
						),
					)
				) : (
					<Chip size="sm" variant="soft">
						Global
					</Chip>
				)}
			</div>
		</div>
	);
}

function ChannelDisplay({ name, type }: Channel) {
	let channelIcon: any;

	switch (type) {
		case ChannelType.GuildVoice:
			channelIcon = voiceChannel;
			break;
		case ChannelType.GuildAnnouncement:
			channelIcon = announcementChannel;
			break;
		case ChannelType.GuildForum:
			channelIcon = forumChannel;
			break;
		default:
			channelIcon = textChannel;
			break;
	}

	return (
		<Chip className="border border-white/20" size="sm" variant="soft">
			<div className="flex items-center gap-1">
				<Image alt="Channel icon" className="size-3" height={12} src={channelIcon} width={12} />
				{name}
			</div>
		</Chip>
	);
}

export interface Multiplier {
	readonly id: string;
	readonly multiplier: number;
	readonly targets: Channel[] | Role[];
	readonly type: XpMultiplierType;
}
