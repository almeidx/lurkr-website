import type { Snowflake } from "@/utils/discord-cdn.ts";
import type { UserFlags } from "@/utils/user-flags.ts";

export enum LevelingImportBot {
	Mee6 = "mee6",
	Amari = "amari",
	Polaris = "polaris",
}

export const enum LevelingImportError {
	LeaderboardNotFound = "leaderboard_not_found",
	PrivateLeaderboard = "private_leaderboard",
	RateLimited = "rate_limited",
	NonJSONResponse = "non_json_response",
	SchemaMismatch = "schema_mismatch",
	Exception = "exception",
	LeaderboardEmpty = "leaderboard_empty",
	CancelledByJob = "cancelled_by_job",
}

export interface Guild {
	channels: Channel[];
	emojis: Emoji[];
	icon: string | null;
	id: Snowflake;
	name: string;
	roles: Role[];
	premium: boolean;
}

export interface Channel {
	id: Snowflake;
	name: string;
	parentId: Snowflake | null;
	type: ChannelType;
}

export interface Emoji {
	animated: boolean;
	id: Snowflake;
	name: string;
}

export interface Role {
	color: number;
	id: Snowflake;
	name: string;
	position: number;
}

export interface Embed {
	title?: string;
	description?: string;
	color?: number;
	footer?: {
		text: string;
		icon_url?: string;
	};
	author?: {
		name: string;
		icon_url?: string;
		url?: string;
	};
	image?: {
		url: string;
	};
	thumbnail?: {
		url: string;
	};
	fields?: {
		name: string;
		value: string;
		inline?: boolean;
	}[];
	url?: string;
}

export interface GuildSettings {
	accentColour: string | null;
	autoPublishChannels: string[];
	autoResetLevels: AutoResetLevels;
	autoRole: Snowflake[];
	autoRoleFlags: AutoRoleFlag[];
	autoRoleTimeout: number | null;
	emojiList: boolean;
	emojiListChannel: Snowflake | null;
	id: Snowflake;
	leaderboardVisibility: LeaderboardVisibility;
	levels: boolean;
	mentionCooldown: number | null;
	mentionCooldownRoles: Snowflake[];
	milestonesChannel: Snowflake | null;
	milestonesInterval: number;
	milestonesMessage: string | null;
	milestonesRoles: Snowflake[];
	noRoleRewardRoles: Snowflake[];
	noTopXpRoles: Snowflake[];
	noXpRoles: Snowflake[];
	prioritiseMultiplierRoleHierarchy: boolean;
	storeCounts: boolean;
	storeMilestones: boolean;
	topXpRole: Snowflake | null;
	vanity: string | null;
	voteBoostedXp: boolean;
	xpAnnounceChannel: Snowflake | null;
	xpAnnounceChannelType: XpAnnouncementType;
	xpAnnounceLevels: number[];
	xpAnnounceMinimumLevel: number;
	xpAnnounceMultipleOf: number | null;
	xpAnnounceOnlyXpRoles: boolean;
	xpChannelMode: XpChannelMode;
	xpChannels: Snowflake[];
	xpDisallowedPrefixes: string[];
	xpFromCommands: boolean;
	xpGainInterval: number;
	xpGlobalMultiplier: number;
	xpInThreads: boolean;
	xpMessage: string | null;
	xpPerMessageMin: number;
	xpPerMessageMax: number;
	xpMessageEmbed: Embed | null;
	xpMultipliers: XpMultiplier[];
	xpRoleRewards: XpRoleReward[];
}

export enum XpAnnouncementType {
	Custom = "custom",
	Direct = "direct",
	None = "none",
	SameChannel = "same_channel",
}

export enum XpChannelMode {
	Blacklist = "blacklist",
	Whitelist = "whitelist",
}

export enum AutoResetLevels {
	Ban = "ban",
	BanAndLeave = "ban_and_leave",
	Leave = "leave",
	None = "none",
}

export enum XpMultiplierType {
	Channel = "channel",
	Role = "role",
}

export enum ChannelType {
	GuildText = 0,
	GuildVoice = 2,
	GuildCategory = 4,
	GuildAnnouncement = 5,
	GuildForum = 15,
}

export enum LeaderboardVisibility {
	Public = "public",
	MembersOnly = "members_only",
	ManagersOnly = "managers_only",
}

export interface AutoRoleFlag {
	flagId: UserFlags;
	id: string;
	roleIds: string[];
}

export interface XpMultiplier {
	id: string;
	multiplier: number;
	targets: Snowflake[];
	type: XpMultiplierType;
}

export interface XpRoleReward {
	id: string;
	level: number;
	roleIds: Snowflake[];
	stack: boolean;
}

export interface UserGuildInfo {
	botIn: boolean;
	icon: string | null;
	id: Snowflake;
	name: string;
}

export enum ApiKeyPermission {
	Read = "read",
	Write = "write",
}
