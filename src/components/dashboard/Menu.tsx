import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useContext, useRef, useState, type MouseEventHandler } from "react";
import type { IconType } from "react-icons";
import { BsFillShiftFill, BsPersonPlusFill } from "react-icons/bs";
import { FaPatreon, FaShapes, FaTrophy } from "react-icons/fa";
import { HiEmojiHappy } from "react-icons/hi";
import { RiSave3Fill, RiTimerFlashFill } from "react-icons/ri";
import { TiWarningOutline } from "react-icons/ti";
import { GuildContext, type PatchGuildData, type Section } from "~/contexts/GuildContext";
import { guildIconCdn } from "~/utils/cdn";
import { type Snowflake, FALLBACK_AVATAR, API_BASE_URL } from "~/utils/constants";

const menuItems = [
	{ Icon: BsFillShiftFill, id: "leveling", name: "Leveling" },
	{ Icon: BsPersonPlusFill, id: "autorole", name: "Autorole" },
	{ Icon: FaTrophy, id: "milestones", name: "Milestones" },
	{ Icon: HiEmojiHappy, id: "emojiList", name: "Emoji List" },
	{ Icon: RiTimerFlashFill, id: "mentionCooldown", name: "Mention Cooldown" },
	{ Icon: FaShapes, id: "miscellaneous", name: "Miscellaneous" },
	{ Icon: TiWarningOutline, id: "dangerZone", name: "Danger Zone" },
] satisfies MenuItem[];

let timeout: NodeJS.Timeout | undefined;

export default function Menu({ closeMenu, guild, guildId: argGuildId, menuOpen, premium }: MenuProps) {
	const [saveButtonText, setSaveButtonText] = useState("Save");
	const saveButtonRef = useRef<HTMLButtonElement>(null);
	const isSaving = useRef<boolean>(false);

	const { changes, clearChanges, errors, guildId, section, updateData, updateSection } = useContext(GuildContext);
	const router = useRouter();

	const saveButtonDisabled = !Object.keys(changes).length || Boolean(errors.length) || Boolean(isSaving.current);

	const handleSaveButtonClick: MouseEventHandler<HTMLButtonElement> = useCallback(async () => {
		if (isSaving.current || errors.length) {
			return;
		}

		if (saveButtonRef.current) {
			saveButtonRef.current.style.background = "#158d3b";
			setSaveButtonText("Saving...");
		}

		const clonedData = JSON.parse(JSON.stringify(changes)) as PatchGuildData;

		if (!guildId || !Object.keys(clonedData).length) {
			return;
		}

		if (clonedData.autoRoleTimeout === 0) {
			clonedData.autoRoleTimeout = null;
		} else if (clonedData.autoRoleTimeout) {
			clonedData.autoRoleTimeout *= 60_000;
		}

		if (clonedData.mentionCooldown) {
			clonedData.mentionCooldown *= 60_000;
		}

		let hasFailed = false;

		try {
			const response = await fetch(`${API_BASE_URL}/guilds/${guildId}`, {
				body: JSON.stringify(clonedData),
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				method: "PATCH",
			});

			if (!response.ok) {
				throw new Error(`${response.status}: ${response.statusText}`);
			}

			updateData(await response.json());
		} catch (error) {
			console.error(error);
			hasFailed = true;
		} finally {
			if (saveButtonRef.current) {
				saveButtonRef.current.style.background = hasFailed ? "#ed4245" : "";
			}

			setSaveButtonText(hasFailed ? "Failed to save" : "Saved!");
			if (!hasFailed) {
				clearChanges();
			}

			if (timeout) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(() => {
				setSaveButtonText("Save");
				if (saveButtonRef.current) {
					saveButtonRef.current.style.background = "";
				}

				isSaving.current = false;
			}, 3_000);
		}
	}, [changes, clearChanges, errors, guildId, saveButtonRef, updateData]);

	return (
		<aside
			className={`${
				menuOpen ? "" : "hidden"
			} absolute left-0 top-0 mt-20 w-full min-w-[300px] bg-discord-dark sm:relative sm:mt-0 sm:block sm:w-96`}
		>
			<div className="sticky top-0 sm:py-6">
				<header className="mb-6 flex flex-col items-center gap-4 bg-discord-slightly-darker px-6 py-4 sm:flex-row sm:bg-discord-dark">
					<Image
						alt={`${guild.name} guild icon`}
						className="rounded-full"
						height={64}
						priority
						src={guild.icon ? guildIconCdn(argGuildId, guild.icon, 64) : FALLBACK_AVATAR}
						// Only optimize if the image is the fallback avatar
						unoptimized={Boolean(guild.icon)}
						width={64}
					/>

					<div className="flex flex-col gap-2">
						<span className="w-full break-words text-center text-white sm:text-base">{guild.name}</span>

						<a
							className={`flex flex-row items-center justify-center gap-2 ${
								premium ? "bg-[#ff424d] hover:bg-[#c0323a]" : "bg-[#c0323a] hover:bg-[#802127]"
							} w-full cursor-pointer rounded-lg px-2 py-1 text-center text-white transition-colors`}
							href="https://docs.lurkr.gg/information/patreon-perks"
							rel="noreferrer"
							target="_blank"
						>
							<FaPatreon />
							{premium ? "Premium" : "Get Premium"}
						</a>
					</div>
				</header>

				<section className="flex flex-col gap-y-3 px-6 sm:ml-auto sm:max-w-[14rem] sm:p-0 sm:pr-4">
					<button
						className={`flex w-full flex-row items-center gap-2 rounded-lg px-4 py-2 text-center text-white transition-colors focus:outline-none${
							saveButtonDisabled
								? " cursor-not-allowed bg-discord-lighter opacity-30"
								: " cursor-pointer bg-discord-green opacity-100 hover:bg-[#25c959]"
						}`}
						disabled={!Object.keys(changes).length || isSaving.current || Boolean(errors.length)}
						onClick={handleSaveButtonClick}
						ref={saveButtonRef}
						type="button"
					>
						<RiSave3Fill className="fill-current" />
						{saveButtonText}
					</button>

					{menuItems.map(({ Icon, id, name }, idx) => (
						<button
							className={`${section === id ? "sm:bg-gray-500 " : ""}${
								id === "dangerZone" ? "text-yellow-300" : "text-white"
							} flex w-full cursor-pointer flex-row items-center gap-2 rounded-lg px-4 py-2 text-center hover:bg-discord-lighter focus:outline-none`}
							key={idx}
							onClick={() => {
								updateSection(id);
								void router.push(`/guilds/${guildId}?p=${id}`, `/guilds/${guildId}?p=${id}`, { shallow: true });
								closeMenu();
							}}
							type="button"
						>
							<Icon className="fill-current" />
							{name}
						</button>
					))}
				</section>
			</div>
		</aside>
	);
}

export function isValidSection(str: string): str is Section {
	return menuItems.map((item) => item.id).includes(str as Section);
}

interface MenuProps {
	closeMenu(): void;
	readonly guild: {
		icon: string | null;
		id: Snowflake;
		name: string;
	};
	readonly guildId: Snowflake;
	readonly menuOpen: boolean;
	readonly premium: boolean;
}

interface MenuItem {
	Icon: IconType;
	id: Section;
	name: string;
}
