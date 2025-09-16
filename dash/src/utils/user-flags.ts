import activeDeveloper from "@/assets/badges/active-developer.svg";
import bugHunterLevel1 from "@/assets/badges/bug-hunter-level-1.svg";
import bugHunterLevel2 from "@/assets/badges/bug-hunter-level-2.svg";
import certifiedModerator from "@/assets/badges/certified-moderator.svg";
import earlySupporter from "@/assets/badges/early-supporter.svg";
import hypeSquadBalance from "@/assets/badges/hypesquad-balance.svg";
import hypeSquadBravery from "@/assets/badges/hypesquad-bravery.svg";
import hypeSquadBrilliance from "@/assets/badges/hypesquad-brilliance.svg";
import hypeSquadEvents from "@/assets/badges/hypesquad-events.svg";
import partner from "@/assets/badges/partner.svg";
import staff from "@/assets/badges/staff.svg";
import verifiedDeveloper from "@/assets/badges/verified-developer.svg";

export enum UserFlags {
	Staff = 1,
	Partner = 2,
	Hypesquad = 4,
	BugHunterLevel1 = 8,
	/**
	 * HypeSquad Bravery
	 */
	HypeSquadOnlineHouse1 = 64,
	/**
	 * HypeSquad Brilliance
	 */
	HypeSquadOnlineHouse2 = 128,
	/**
	 * HypeSquad Balance
	 */
	HypeSquadOnlineHouse3 = 256,
	PremiumEarlySupporter = 512,
	BugHunterLevel2 = 16_384,
	VerifiedDeveloper = 131_072,
	CertifiedModerator = 262_144,
	ActiveDeveloper = 4_194_304,
}

export const BadgeInfo = {
	[UserFlags.ActiveDeveloper]: { icon: activeDeveloper, name: "Active Developer" },
	[UserFlags.BugHunterLevel1]: { icon: bugHunterLevel1, name: "Bug Hunter" },
	[UserFlags.BugHunterLevel2]: { icon: bugHunterLevel2, name: "Bug Hunter (Level 2)" },
	[UserFlags.CertifiedModerator]: { icon: certifiedModerator, name: "Certified Moderator" },
	[UserFlags.Staff]: { icon: staff, name: "Discord Staff" },
	[UserFlags.PremiumEarlySupporter]: { icon: earlySupporter, name: "Early Supporter" },
	[UserFlags.VerifiedDeveloper]: { icon: verifiedDeveloper, name: "Early Verified Bot Developer" },
	[UserFlags.HypeSquadOnlineHouse3]: { icon: hypeSquadBalance, name: "HypeSquad Balance" },
	[UserFlags.HypeSquadOnlineHouse1]: { icon: hypeSquadBravery, name: "HypeSquad Bravery" },
	[UserFlags.HypeSquadOnlineHouse2]: { icon: hypeSquadBrilliance, name: "HypeSquad Brilliance" },
	[UserFlags.Hypesquad]: { icon: hypeSquadEvents, name: "HypeSquad Events" },
	[UserFlags.Partner]: { icon: partner, name: "Partner" },
};
