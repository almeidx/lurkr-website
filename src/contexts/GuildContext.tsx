/* eslint-disable promise/prefer-await-to-callbacks, promise/prefer-await-to-then */

import cloneDeep from "lodash.clonedeep";
import { createContext, useCallback, useState, type ReactNode } from "react";
import type { DatabaseChanges } from "../graphql/mutations/updateDatabaseGuild";
import type { DashboardDatabaseGuild } from "../graphql/queries/DashboardGuild";
import { API_BASE_URL, VANITY_REGEX, type DATABASE_LIMITS, type Snowflake } from "../utils/constants";
import { getDatabaseLimit } from "../utils/utils";

export type Section = "autorole" | "emojiList" | "leveling" | "mentionCooldown" | "milestones" | "miscellaneous";

interface VanityCheckResponse {
	available: boolean;
}

const emojiListKeys: (keyof DatabaseChanges)[] = ["emojiListChannel"];

const levelingKeys: (keyof DatabaseChanges)[] = [
	"noXpRoles",
	"stackXpRoles",
	"topXpRole",
	"xpBlacklistedChannels",
	"xpDisallowedPrefixes",
	"xpMessage",
	"xpMultipliers",
	"xpResponseType",
	"xpWhitelistedChannels",
];

const milestonesKeys: (keyof DatabaseChanges)[] = [
	"milestonesChannel",
	"milestonesInterval",
	"milestonesMessage",
	"milestonesRoles",
];

interface GuildContextData {
	addChange<T extends keyof DashboardDatabaseGuild & keyof DatabaseChanges>(key: T, value: DatabaseChanges[T]): void;
	changes: Partial<DatabaseChanges>;
	clearChanges(): void;
	data: DatabaseChanges | null;
	errors: string[];
	guildId: Snowflake | null;
	section: Section;
	updateData(newData: DashboardDatabaseGuild): void;
	updateGuildId(newId: Snowflake): void;
	updateSection(newSection: Section): void;
	warnings: string[];
}

interface GuildContextProps {
	children: ReactNode;
}

export const GuildContext = createContext({} as GuildContextData);

let vanityAvailabilityTimeout: NodeJS.Timeout | undefined;

export default function GuildContextProvider({ children }: GuildContextProps) {
	const [guildId, setGuildId] = useState<Snowflake | null>(null);
	const [section, setSection] = useState<Section>("leveling");
	const [changes, setChanges] = useState<Partial<DatabaseChanges>>({});
	const [data, setData] = useState<DashboardDatabaseGuild | null>(null);
	const [errors, setErrors] = useState<string[]>([]);
	const [warnings, setWarnings] = useState<string[]>([]);

	const addNewError = useCallback((error: string) => setErrors((prevErrors) => [...prevErrors, error]), []);

	const updateErrorsAndWarnings = useCallback(
		(changes: Partial<DatabaseChanges>, data: DashboardDatabaseGuild | null) => {
			if (!Object.keys(changes).length) {
				setErrors([]);
				setWarnings([]);
				return;
			}

			const newErrors: string[] = [];
			const newWarnings: string[] = [];
			const getLimit = <K extends keyof typeof DATABASE_LIMITS>(key: K): typeof DATABASE_LIMITS[K] =>
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
							.catch((error) => console.error("vanity availability check error: ", error));
					}, 1_000);
				} else {
					newErrors.push("The leveling leaderboard vanity can only contain alphanumeric characters.");
				}
			}

			const xpDisallowedPrefixesLimit = getLimit("xpDisallowedPrefixes");
			if (changes.xpDisallowedPrefixes && changes.xpDisallowedPrefixes.length > xpDisallowedPrefixesLimit.maxLength) {
				newErrors.push(`You cannot have more than ${xpDisallowedPrefixesLimit.maxLength} xp disallowed prefixes.`);
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
		<
			T extends keyof DashboardDatabaseGuild & keyof DatabaseChanges = keyof DashboardDatabaseGuild &
				keyof DatabaseChanges,
		>(
			key: T,
			value: DatabaseChanges[T],
		) => {
			const clone = cloneDeep<Partial<DatabaseChanges>>(changes);

			if (
				data &&
				// TODO: Figure out the types
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
