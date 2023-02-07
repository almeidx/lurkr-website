/* eslint-disable promise/prefer-await-to-callbacks, promise/prefer-await-to-then */

import { createContext, useCallback, useState, type ReactNode } from "react";
import { getDatabaseLimit } from "~/utils/common";
import { API_BASE_URL, VANITY_REGEX, type DATABASE_LIMITS, type Snowflake } from "~/utils/constants";

const emojiListKeys: (keyof PatchGuildData)[] = ["emojiListChannel"];

const levelingKeys: (keyof PatchGuildData)[] = [
	"noXpRoles",
	"stackXpRoles",
	"topXpRole",
	"xpChannels",
	"xpChannelMode",
	"xpDisallowedPrefixes",
	"xpDisallowedPrefixes",
	"xpMessage",
	"xpMultipliers",
	"xpResponseType",
];

const milestonesKeys: (keyof PatchGuildData)[] = [
	"milestonesChannel",
	"milestonesInterval",
	"milestonesMessage",
	"milestonesRoles",
];

export enum XpChannelMode {
	Blacklist,
	Whitelist,
}

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
			const getLimit = <K extends keyof typeof DATABASE_LIMITS>(key: K): (typeof DATABASE_LIMITS)[K] =>
				getDatabaseLimit(key, data?.premium ?? false);

			const validateMinutes = (
				number: number | null,
				{ min, max }: { max: number; min: number },
				keyName: string,
			): void => {
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

			if ("autoRoleTimeout" in changes) {
				validateMinutes(changes.autoRoleTimeout!, getLimit("autoRoleTimeout"), "auto role timeout");
			}

			if ("mentionCooldown" in changes) {
				if (changes.mentionCooldown) {
					validateMinutes(changes.mentionCooldown, getLimit("mentionCooldown"), "mention cooldown");
				} else {
					newErrors.push("The mention cooldown cannot be empty.");
				}
			}

			if ("milestonesInterval" in changes) {
				const milestonesIntervalLimits = getLimit("milestonesInterval");
				if (Number.isNaN(changes.milestonesInterval)) {
					newErrors.push("The milestones interval is not a valid number.");
				} else if (!changes.milestonesInterval || changes.milestonesInterval < milestonesIntervalLimits.min) {
					newErrors.push(`The milestones interval is smaller than ${milestonesIntervalLimits.min}.`);
				} else if (changes.milestonesInterval > milestonesIntervalLimits.max) {
					newErrors.push(`The milestones interval is larger than ${milestonesIntervalLimits.max}.`);
				}
			}

			if (typeof changes.vanity === "string" && changes.vanity !== "") {
				const vanityLimits = getLimit("vanity");
				if (changes.vanity.length < vanityLimits.minLength) {
					newErrors.push(`The leveling leaderboard vanity is shorter than ${vanityLimits.minLength} characters.`);
				} else if (changes.vanity.length > vanityLimits.maxLength) {
					newErrors.push(`The leveling leaderboard vanity is longer than ${vanityLimits.maxLength} characters.`);
				} else if (VANITY_REGEX.test(changes.vanity)) {
					if (vanityAvailabilityTimeout) {
						clearTimeout(vanityAvailabilityTimeout);
					}

					vanityAvailabilityTimeout = setTimeout(() => {
						fetch(`${API_BASE_URL}/vanity/check?${new URLSearchParams({ vanity: changes.vanity! })}`)
							.then(async (res) => {
								const data = (await res.json()) as VanityCheckResponse;
								if (!data.available) {
									addNewError("The leaderboard vanity used is not available.");
								}
							})
							.catch(() => {});
					}, 1_000);
				} else {
					newErrors.push("The leveling leaderboard vanity can only contain alphanumeric characters.");
				}
			}

			const xpAnnounceLevelsLimits = getLimit("xpAnnounceLevels");
			const xpAnnounceLevelLimits = getLimit("xpAnnounceLevel");
			if (changes.xpAnnounceLevels) {
				validateArray(changes.xpAnnounceLevels, xpAnnounceLevelsLimits.maxLength, "xp announce levels");

				if (
					changes.xpAnnounceLevels.some(
						(level) => level > xpAnnounceLevelLimits.max || level < xpAnnounceLevelLimits.min,
					)
				) {
					newErrors.push("One of the leveling announcement levels has an invalid value");
				}
			}

			const xpAnnounceMinimumLevelLimits = getLimit("xpAnnounceMinimumLevel");
			if (
				typeof changes.xpAnnounceMinimumLevel === "number" &&
				(changes.xpAnnounceMinimumLevel > xpAnnounceMinimumLevelLimits.max ||
					changes.xpAnnounceMinimumLevel < xpAnnounceMinimumLevelLimits.min)
			) {
				newErrors.push("The leveling announcement minimum level has an invalid value");
			}

			const xpAnnounceMultipleOfLimits = getLimit("xpAnnounceMultipleOf");
			if (
				typeof changes.xpAnnounceMultipleOf === "number" &&
				(changes.xpAnnounceMultipleOf > xpAnnounceMultipleOfLimits.max ||
					changes.xpAnnounceMultipleOf < xpAnnounceMultipleOfLimits.min)
			) {
				newErrors.push("The leveling announcement factor has an invalid value");
			}

			const xpChannelsLimit = getLimit("xpChannels").maxLength;
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

			const xpDisallowedPrefixesLimit = getLimit("xpDisallowedPrefixes");
			if (changes.xpDisallowedPrefixes) {
				validateArray(changes.xpDisallowedPrefixes, xpDisallowedPrefixesLimit.maxLength, "xp disallowed prefixes");
			}

			const xpMessageLimits = getLimit("xpMessage");
			if (changes.xpMessage && changes.xpMessage.length > xpMessageLimits.maxLength) {
				newErrors.push(`The xp message is longer than ${xpMessageLimits.maxLength} characters.`);
			}

			if (changes.xpMultipliers?.some(({ multiplier }) => Number.isNaN(multiplier))) {
				newErrors.push("One of the XP Multipliers has an invalid multiplier value.");
			}

			if (changes.xpMultipliers) {
				validateArray(changes.xpMultipliers, 5, "xp multipliers");

				if (changes.xpMultipliers.some(({ multiplier }) => multiplier < 0)) {
					newErrors.push("One of the XP Multipliers has a negative multiplier value.");
				}
			}

			if (changes.xpRoleRewards?.some((roleReward) => !roleReward.roleIds.length)) {
				newErrors.push("One of the XP Role Rewards is empty.");
			}

			if (changes.xpRoleRewards) {
				validateArray(changes.xpRoleRewards, 100, "xp role rewards");
			}

			if (data) {
				if (
					emojiListKeys.some((key) => key in changes) &&
					("emojiList" in changes ? !changes.emojiList : !data.emojiList)
				) {
					newWarnings.push("You have made changes to the emoji list settings but the emoji list module is disabled.");
				}

				if (levelingKeys.some((key) => key in changes) && ("levels" in changes ? !changes.levels : !data.levels)) {
					newWarnings.push("You have made changes to the leveling settings but the leveling module is disabled.");
				}

				if (
					milestonesKeys.some((key) => key in changes) &&
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
	children: ReactNode;
}

export interface GuildSettings {
	autoPublishChannels: string[];
	autoResetLevels: AutoResetLevelsEnum;
	autoRole: string[];
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
	prefix: string;
	premium: boolean;
	prioritiseMultiplierRoleHierarchy: boolean;
	stackXpRoles: boolean;
	storeCounts: boolean;
	storeMilestones: boolean;
	topXp: string | null;
	topXpRole: string | null;
	vanity: string | null;
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
	xpResponseType: string | null;
	xpRoleRewards: XpRoleReward[];
}

export enum AutoResetLevelsEnum {
	None,
	Leave,
	Ban,
	Both,
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
	avatar: string | null;
	level: number;
	tag: string | null;
	userId: Snowflake;
	xp: number;
}

export interface IMultiplier {
	id: string;
	multiplier: number;
	targets: Snowflake[];
	type: "Channel" | "Global" | "Role";
}

export interface RoleReward {
	level: number;
	roles: Role[];
}

export enum ChannelType {
	GuildText,
	GuildVoice = 2,
	GuildAnnouncement = 5,
	GuildForum = 15,
}
