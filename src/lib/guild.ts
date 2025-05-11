import type { Snowflake } from "@/utils/discord-cdn.ts";
import type { UserFlags } from "@/utils/user-flags.ts";

export enum LevelingImportBot {
	Mee6 = "Mee6",
	Amari = "Amari",
	Polaris = "Polaris",
}

export const enum LevelingImportError {
	LeaderboardNotFound = "LeaderboardNotFound",
	PrivateLeaderboard = "PrivateLeaderboard",
	RateLimited = "RateLimited",
	NonJSONResponse = "NonJSONResponse",
	SchemaMismatch = "SchemaMismatch",
	Exception = "Exception",
	LeaderboardEmpty = "LeaderboardEmpty",
	CancelledByJob = "CancelledByJob",
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
	accentType: GuildAccentType | null;
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
	xpAnnounceChannelType: XpAnnouncementChannelType;
	xpAnnounceLevels: number[];
	xpAnnounceMinimumLevel: number;
	xpAnnounceMultipleOf: number | null;
	xpAnnounceOnlyXpRoles: boolean;
	xpChannelMode: XpChannelMode;
	xpChannels: Snowflake[];
	xpDisallowedPrefixes: string[];
	xpInThreads: boolean;
	xpMessage: string | null;
	xpMessageEmbed: Embed | null;
	xpMultipliers: XpMultiplier[];
	xpRoleRewards: XpRoleReward[];
}

export enum XpAnnouncementChannelType {
	Custom = "Custom",
	Direct = "Direct",
	None = "None",
	SameChannel = "SameChannel",
}

export enum XpChannelMode {
	Blacklist = "Blacklist",
	Whitelist = "Whitelist",
}

export enum AutoResetLevels {
	Ban = "Ban",
	BanAndLeave = "BanAndLeave",
	Leave = "Leave",
	None = "None",
}

export enum XpMultiplierType {
	Channel = "Channel",
	Global = "Global",
	Role = "Role",
}

export enum ChannelType {
	GuildText = 0,
	GuildVoice = 2,
	GuildCategory = 4,
	GuildAnnouncement = 5,
	GuildForum = 15,
}

export enum GuildAccentType {
	BannerAverage = "BannerAverage",
	Custom = "Custom",
	IconAverage = "IconAverage",
}

export enum LeaderboardVisibility {
	Public = "Public",
	MembersOnly = "MembersOnly",
	ManagersOnly = "ManagersOnly",
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
	Read = "Read",
	Write = "Write",
}
