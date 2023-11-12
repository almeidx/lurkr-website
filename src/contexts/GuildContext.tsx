import { createContext, useCallback, useState, type ReactNode } from "react";
import { API_BASE_URL, VANITY_REGEX, type Snowflake } from "~/utils/constants";
import {
	MAX_AUTO_ROLE_TIMEOUT,
	MAX_MENTION_COOLDOWN,
	MAX_MILESTONES_INTERVAL,
	MAX_VANITY_LENGTH,
	MAX_XP_ANNOUNCE_LEVEL,
	MAX_XP_ANNOUNCE_LEVELS,
	MAX_XP_ANNOUNCE_MINIMUM_LEVEL,
	MAX_XP_ANNOUNCE_MULTIPLE_OF,
	MAX_XP_CHANNELS,
	MAX_XP_CHANNELS_PREMIUM,
	MAX_XP_DISALLOWED_PREFIXES,
	MAX_XP_DISALLOWED_PREFIXES_PREMIUM,
	MAX_XP_DISALLOWED_PREFIX_LENGTH,
	MAX_XP_MESSAGE_LENGTH,
	MAX_XP_MULTIPLIERS,
	MAX_XP_MULTIPLIERS_PREMIUM,
	MAX_XP_MULTIPLIER_VALUE,
	MAX_XP_ROLE_REWARDS,
	MAX_XP_ROLE_REWARDS_PREMIUM,
	MILESTONES_INTERVAL_MULTIPLE_OF,
	MIN_AUTO_ROLE_TIMEOUT,
	MIN_MENTION_COOLDOWN,
	MIN_MILESTONES_INTERVAL,
	MIN_VANITY_LENGTH,
	MIN_XP_ANNOUNCE_LEVEL,
	MIN_XP_ANNOUNCE_MINIMUM_LEVEL,
	MIN_XP_ANNOUNCE_MULTIPLE_OF,
	MIN_XP_MESSAGE_LENGTH,
	MIN_XP_MULTIPLIER_VALUE,
} from "~/utils/guild-config";

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

const emojiListKeys = new Set<keyof PatchGuildData>(["emojiListChannel"]);

const levelingKeys = new Set<keyof PatchGuildData>([
	"noXpRoles",
	"stackXpRoles",
	"topXpRole",
	"voteBoostedXp",
	"xpAnnounceChannel",
	"xpAnnounceChannelType",
	"xpAnnounceLevels",
	"xpAnnounceMinimumLevel",
	"xpAnnounceMultipleOf",
	"xpAnnounceOnlyXpRoles",
	"xpChannelMode",
	"xpChannels",
	"xpDisallowedPrefixes",
	"xpInThreads",
	"xpMessage",
	"xpMultipliers",
	"xpRoleRewards",
]);

const milestonesKeys = new Set<keyof PatchGuildData>([
	"milestonesChannel",
	"milestonesInterval",
	"milestonesMessage",
	"milestonesRoles",
]);

export const GuildContext = createContext({} as GuildContextData);

let vanityAvailabilityTimeout: NodeJS.Timeout | undefined;

export default function GuildContextProvider({ children }: GuildContextProps) {
	const [guildId, setGuildId] = useState<Snowflake | null>(null);
	const [section, setSection] = useState<Section>("leveling");
	const [changes, setChanges] = useState<Partial<PatchGuildData>>({});
	const [data, setData] = useState<GuildSettings | null>(null);
	const [errors, setErrors] = useState<string[]>([]);
	const [warnings, setWarnings] = useState<string[]>([]);

	const addNewError = useCallback((error: string) => setErrors((prevErrors) => [...prevErrors, error]), []);

	const updateErrorsAndWarnings = useCallback(
		(changes: Partial<PatchGuildData>, data: GuildSettings | null) => {
			if (!Object.keys(changes).length) {
				setErrors([]);
				setWarnings([]);
				return;
			}

			const newErrors: string[] = [];
			const newWarnings: string[] = [];

			const validateMinutes = (number: number | null, min: number, max: number, keyName: string): void => {
				const minMinutes = min / 60_000;
				const maxMinutes = max / 60_000;
				if (Number.isNaN(number)) {
					newErrors.push(`The ${keyName} is not a valid number.`);
				} else if (number) {
					if (number < minMinutes) {
						newErrors.push(`The ${keyName} is smaller than ${minMinutes}.`);
					} else if (number > maxMinutes) {
						newErrors.push(`The ${keyName} is larger than ${maxMinutes}.`);
					}
				}
			};

			const validateArray = (arr: unknown[] | readonly unknown[], maxLength: number, keyName: string) =>
				arr.length > maxLength && newErrors.push(`The ${keyName} has more than ${maxLength} items`);

			const premium = data?.premium ?? false;

			if ("autoRoleTimeout" in changes) {
				validateMinutes(changes.autoRoleTimeout!, MIN_AUTO_ROLE_TIMEOUT, MAX_AUTO_ROLE_TIMEOUT, "auto role timeout");
			}

			if ("mentionCooldown" in changes) {
				if (changes.mentionCooldown) {
					validateMinutes(changes.mentionCooldown, MIN_MENTION_COOLDOWN, MAX_MENTION_COOLDOWN, "mention cooldown");
				} else {
					newErrors.push("The mention cooldown cannot be empty.");
				}
			}

			if ("milestonesInterval" in changes) {
				if (Number.isNaN(changes.milestonesInterval)) {
					newErrors.push("The milestones interval is not a valid number.");
				} else if (!changes.milestonesInterval || changes.milestonesInterval < MIN_MILESTONES_INTERVAL) {
					newErrors.push(`The milestones interval is smaller than ${MIN_MILESTONES_INTERVAL}.`);
				} else if (changes.milestonesInterval > MAX_MILESTONES_INTERVAL) {
					newErrors.push(`The milestones interval is larger than ${MAX_MILESTONES_INTERVAL}.`);
				} else if (changes.milestonesInterval % MILESTONES_INTERVAL_MULTIPLE_OF !== 0) {
					newErrors.push(`The milestones interval is not a multiple of ${MILESTONES_INTERVAL_MULTIPLE_OF}.`);
				}
			}

			if (typeof changes.vanity === "string" && changes.vanity !== "") {
				if (changes.vanity.length < MIN_VANITY_LENGTH) {
					newErrors.push(`The leveling leaderboard vanity is shorter than ${MIN_VANITY_LENGTH} characters.`);
				} else if (changes.vanity.length > MAX_VANITY_LENGTH) {
					newErrors.push(`The leveling leaderboard vanity is longer than ${MAX_VANITY_LENGTH} characters.`);
				} else if (VANITY_REGEX.test(changes.vanity)) {
					if (vanityAvailabilityTimeout) {
						clearTimeout(vanityAvailabilityTimeout);
					}

					vanityAvailabilityTimeout = setTimeout(() => {
						fetch(`${API_BASE_URL}/vanity/check?${new URLSearchParams({ vanity: changes.vanity! })}`)
							.then(async (res) => {
								if (!res.ok) return;

								const data = (await res.json()) as VanityCheckResponse;
								if (!data.available) {
									addNewError("The leaderboard vanity used is not available.");
								}
							})
							.catch(() => null);
					}, 1_000);
				} else {
					newErrors.push("The leveling leaderboard vanity can only contain alphanumeric characters.");
				}
			}

			if ("xpAnnounceChannel" in changes || changes.xpAnnounceChannelType) {
				if (changes.xpAnnounceChannel && changes.xpAnnounceChannelType !== XpAnnouncementChannelType.Custom) {
					newErrors.push("The leveling announcement channel type is not set to custom.");
				} else if (changes.xpAnnounceChannelType === XpAnnouncementChannelType.Custom && !changes.xpAnnounceChannel) {
					newErrors.push("The leveling announcement channel type is set to custom but the channel is not set.");
				}
			}

			if (changes.xpAnnounceLevels) {
				validateArray(changes.xpAnnounceLevels, MAX_XP_ANNOUNCE_LEVELS, "xp announce levels");

				if (changes.xpAnnounceLevels.some((level) => level > MAX_XP_ANNOUNCE_LEVEL || level < MIN_XP_ANNOUNCE_LEVEL)) {
					newErrors.push("One of the leveling announcement levels has an invalid value");
				}
			}

			if (
				typeof changes.xpAnnounceMinimumLevel === "number" &&
				(changes.xpAnnounceMinimumLevel > MAX_XP_ANNOUNCE_MINIMUM_LEVEL ||
					changes.xpAnnounceMinimumLevel < MIN_XP_ANNOUNCE_MINIMUM_LEVEL)
			) {
				newErrors.push("The leveling announcement minimum level has an invalid value");
			}

			if (
				typeof changes.xpAnnounceMultipleOf === "number" &&
				(changes.xpAnnounceMultipleOf > MAX_XP_ANNOUNCE_MULTIPLE_OF ||
					changes.xpAnnounceMultipleOf < MIN_XP_ANNOUNCE_MULTIPLE_OF)
			) {
				newErrors.push("The leveling announcement factor has an invalid value");
			}

			const xpChannelsLimit = premium ? MAX_XP_CHANNELS_PREMIUM : MAX_XP_CHANNELS;
			if (changes.xpChannels) {
				validateArray(changes.xpChannels, xpChannelsLimit, "leveling channels");
			}

			if (typeof changes.xpChannelMode === "number") {
				if (changes.xpChannelMode !== XpChannelMode.Blacklist && changes.xpChannelMode !== XpChannelMode.Whitelist) {
					newErrors.push("The leveling channel mode is invalid.");
				} else if (
					(changes.xpChannels ?? data?.xpChannels ?? []).length === 0 &&
					changes.xpChannelMode === XpChannelMode.Whitelist
				) {
					newWarnings.push(
						"You have set the leveling channel mode to whitelist, but you have not added any leveling channels. This means that members cannot gain xp.",
					);
				}
			}

			if (changes.xpDisallowedPrefixes) {
				const xpDisallowedPrefixesLimit = premium ? MAX_XP_DISALLOWED_PREFIXES_PREMIUM : MAX_XP_DISALLOWED_PREFIXES;
				validateArray(changes.xpDisallowedPrefixes, xpDisallowedPrefixesLimit, "xp disallowed prefixes");

				if (changes.xpDisallowedPrefixes.some((prefix) => prefix.length > MAX_XP_DISALLOWED_PREFIX_LENGTH)) {
					newErrors.push("One of the leveling disallowed prefixes is too long.");
				}
			}

			if (
				changes.xpMessage &&
				(changes.xpMessage.length < MIN_XP_MESSAGE_LENGTH || changes.xpMessage.length > MAX_XP_MESSAGE_LENGTH)
			) {
				newErrors.push(
					`The xp message is not within the ${MIN_XP_MESSAGE_LENGTH} - ${MAX_XP_MESSAGE_LENGTH} character limits.`,
				);
			}

			if (changes.xpMultipliers) {
				const xpMultipliersLimit = premium ? MAX_XP_MULTIPLIERS_PREMIUM : MAX_XP_MULTIPLIERS;
				validateArray(changes.xpMultipliers, xpMultipliersLimit, "xp multipliers");

				if (
					changes.xpMultipliers.some(
						({ multiplier }) =>
							Number.isNaN(multiplier) || multiplier < MIN_XP_MULTIPLIER_VALUE || multiplier > MAX_XP_MULTIPLIER_VALUE,
					)
				) {
					newErrors.push("One of the XP Multipliers has an invalid multiplier value.");
				}

				const keys = changes.xpMultipliers.map(({ multiplier, type }) => `${multiplier}-${type}`);
				if (new Set(keys).size !== keys.length) {
					newErrors.push("There are multiple XP Multipliers with the same multiplier and type. Please merge them.");
				}
			}

			if (changes.xpRoleRewards?.some((roleReward) => !roleReward.roleIds.length)) {
				newErrors.push("One of the XP Role Rewards is empty.");
			}

			if (changes.xpRoleRewards) {
				const xpRoleRewardsLimit = premium ? MAX_XP_ROLE_REWARDS_PREMIUM : MAX_XP_ROLE_REWARDS;
				validateArray(changes.xpRoleRewards, xpRoleRewardsLimit, "xp role rewards");

				const keys = changes.xpRoleRewards.map(({ level }) => level);
				if (new Set(keys).size !== keys.length) {
					newErrors.push("There are multiple XP Role Rewards with the same level. Please merge them.");
				}
			}

			if (data) {
				const keys = Object.keys(changes) as (keyof typeof changes)[];

				if (
					keys.some((key) => emojiListKeys.has(key)) &&
					("emojiList" in changes ? !changes.emojiList : !data.emojiList)
				) {
					newWarnings.push("You have made changes to the emoji list settings but the emoji list module is disabled.");
				}

				if (keys.some((key) => levelingKeys.has(key)) && ("levels" in changes ? !changes.levels : !data.levels)) {
					newWarnings.push("You have made changes to the leveling settings but the leveling module is disabled.");
				}

				if (
					keys.some((key) => milestonesKeys.has(key)) &&
					("storeMilestones" in changes ? !changes.storeMilestones : !data.storeMilestones)
				) {
					newWarnings.push("You have made changes to the milestones settings but the milestones module is disabled.");
				}
			}

			setErrors(newErrors);
			setWarnings(newWarnings);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const addChange = useCallback(
		<T extends keyof GuildSettings & keyof PatchGuildData = keyof GuildSettings & keyof PatchGuildData>(
			key: T,
			value: PatchGuildData[T],
		) => {
			const clone = JSON.parse(JSON.stringify(changes)) as Partial<PatchGuildData>;

			if (
				data &&
				(data[key] === value ||
					(Array.isArray(value) && !value.length && data[key] === null) ||
					(Array.isArray(data[key]) && !(data[key] as any[]).length && value === null) ||
					(data[key] === null && value === 0) ||
					(data[key] === 0 && value === null))
			) {
				if (key in clone) {
					// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
					delete clone[key];
					setChanges(clone);
					updateErrorsAndWarnings(clone, data);
				}

				return;
			}

			clone[key] = value;
			setChanges(clone);
			updateErrorsAndWarnings(clone, data);
		},
		[changes, data, updateErrorsAndWarnings],
	);

	const addMultipleChanges = useCallback(
		(
			entries: [
				keyof GuildSettings & keyof PatchGuildData,
				PatchGuildData[keyof GuildSettings & keyof PatchGuildData],
			][],
		) => {
			const clone = JSON.parse(JSON.stringify(changes)) as Partial<PatchGuildData>;

			for (const [key, value] of entries) {
				clone[key] = value as any;
			}

			setChanges(clone);
			updateErrorsAndWarnings(clone, data);
		},
		[changes, data, updateErrorsAndWarnings],
	);

	const clearChanges = useCallback(() => setChanges({}), []);

	const updateGuildId = useCallback(
		(newId: Snowflake) => {
			if (newId !== guildId) {
				setChanges({});
			}

			setGuildId(newId);
		},
		[guildId],
	);

	return (
		<GuildContext.Provider
			// TODO: Investigate
			// eslint-disable-next-line react/jsx-no-constructed-context-values
			value={{
				addChange,
				addMultipleChanges,
				changes,
				clearChanges,
				data,
				errors,
				guildId,
				section,
				updateData: setData,
				updateGuildId,
				updateSection: setSection,
				warnings,
			}}
		>
			{children}
		</GuildContext.Provider>
	);
}

export type Section =
	| "autorole"
	| "dangerZone"
	| "emojiList"
	| "leveling"
	| "mentionCooldown"
	| "milestones"
	| "miscellaneous";

interface VanityCheckResponse {
	available: boolean;
}

export interface GuildContextData {
	addChange<T extends keyof GuildSettings & keyof PatchGuildData>(key: T, value: PatchGuildData[T]): void;
	addMultipleChanges(
		entries: [keyof GuildSettings & keyof PatchGuildData, PatchGuildData[keyof GuildSettings & keyof PatchGuildData]][],
	): void;
	changes: Partial<PatchGuildData>;
	clearChanges(): void;
	data: PatchGuildData | null;
	errors: string[];
	guildId: Snowflake | null;
	section: Section;
	updateData(newData: GuildSettings): void;
	updateGuildId(newId: Snowflake): void;
	updateSection(newSection: Section): void;
	warnings: string[];
}

export type AddChangeFn = GuildContextData["addChange"];

interface GuildContextProps {
	readonly children: ReactNode;
}

export interface GuildSettings {
	accentColour: string | null;
	accentType: GuildAccentType | null;
	autoPublishChannels: string[];
	autoResetLevels: AutoResetLevelsEnum;
	autoRole: string[];
	autoRoleFlags: AutoRoleFlag[];
	autoRoleTimeout: number | null;
	emojiList: boolean;
	emojiListChannel: string | null;
	id: string;
	levels: boolean;
	mentionCooldown: number | null;
	mentionCooldownRoles: string[];
	milestonesChannel: string | null;
	milestonesInterval: number;
	milestonesMessage: string | null;
	milestonesRoles: string[];
	noXpRoles: string[];
	premium: boolean;
	prioritiseMultiplierRoleHierarchy: boolean;
	stackXpRoles: boolean;
	storeCounts: boolean;
	storeMilestones: boolean;
	topXpRole: string | null;
	vanity: string | null;
	voteBoostedXp: boolean;
	xpAnnounceChannel: string | null;
	xpAnnounceChannelType: XpAnnouncementChannelType;
	xpAnnounceLevels: number[];
	xpAnnounceMinimumLevel: number;
	xpAnnounceMultipleOf: number | null;
	xpAnnounceOnlyXpRoles: boolean;
	xpChannelMode: XpChannelMode;
	xpChannels: string[];
	xpDisallowedPrefixes: string[];
	xpInThreads: boolean;
	xpMessage: string | null;
	xpMultipliers: XpMultiplier[];
	xpRoleRewards: XpRoleReward[];
}

export enum AutoResetLevelsEnum {
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

export interface XpMultiplier {
	id: string;
	multiplier: number;
	targets: string[];
	type: XpMultiplierType;
}

export interface XpRoleReward {
	id: string;
	level: number;
	roleIds: string[];
}

export type PatchGuildData = Partial<Omit<GuildSettings, "id" | "premium">>;

export interface Channel {
	id: Snowflake;
	name: string;
	type: ChannelType;
}

export interface DiscordGuild {
	icon: string | null;
	id: Snowflake;
	name: string;
	roles: Role[];
}

export interface Role {
	color: number;
	id: Snowflake;
	name: string;
	position: number;
}

export interface ILevel {
	accentColour: `#${string}`;
	avatar: string | null;
	discriminator: string;
	level: number;
	messageCount: number;
	userId: Snowflake;
	username: string;
	xp: number;
}

export interface IMultiplier {
	id: string;
	multiplier: number;
	targets: Channel[] | Role[];
	type: XpMultiplierType;
}

export interface RoleReward {
	id: string;
	level: number;
	roles: Role[];
}

export interface AutoRoleFlag {
	flagId: number;
	id: string;
	roleIds: string[];
}

export enum ChannelType {
	GuildText,
	GuildVoice = 2,
	GuildAnnouncement = 5,
	GuildForum = 15,
}

export enum GuildAccentType {
	BannerAverage = "BannerAverage",
	Custom = "Custom",
	IconAverage = "IconAverage",
}
