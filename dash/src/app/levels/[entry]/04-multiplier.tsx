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
		<div className="rounded-2xl border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 backdrop-blur-sm">
			<div className="mb-3 flex items-center gap-3">
				<span className="rounded-lg border-2 border-warning/30 bg-warning/20 px-3 py-1 font-black text-warning text-xs uppercase tracking-wider">
					{multiplier}x
				</span>
				<span className="text-2xl text-white/20">→</span>
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
