import announcementChannel from "@/assets/channel-icons/announcement.svg";
import forumChannel from "@/assets/channel-icons/forum.svg";
import textChannel from "@/assets/channel-icons/text.svg";
import voiceChannel from "@/assets/channel-icons/voice.svg";
import { type Channel, ChannelType, type Role, XpMultiplierType } from "@/lib/guild.ts";
import Image from "next/image";
import { RoleDisplay } from "./03-role-reward.tsx";

export function MultiplierDisplay({ multiplier, targets, type }: Multiplier) {
	return (
		<div className="flex items-center gap-4">
			<span className="flex size-9 items-center justify-center rounded-lg border border-white/25 bg-darker text-[#fff]">
				{multiplier}
			</span>

			<div className="flex flex-1 flex-wrap gap-2 overflow-x-hidden">
				{type === XpMultiplierType.Global ? (
					<p className="text-sm">Global</p>
				) : (
					targets.map((target) =>
						type === XpMultiplierType.Channel ? (
							<ChannelDisplay key={target.id} {...(target as Channel)} />
						) : (
							<RoleDisplay key={target.id} {...(target as Role)} />
						),
					)
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
		<div className="flex items-center gap-1 rounded-md border border-white/25 px-1.5">
			<Image className="size-3" src={channelIcon} alt="Channel icon" width={12} height={12} />
			<p className="text-sm">{name}</p>
		</div>
	);
}

export interface Multiplier {
	readonly id: string;
	readonly multiplier: number;
	readonly targets: Channel[] | Role[];
	readonly type: XpMultiplierType;
}
