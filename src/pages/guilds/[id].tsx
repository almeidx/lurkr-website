import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { Suspense, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Failure from "../../components/Failure";
import Message from "../../components/Message";
import Spinner from "../../components/Spinner";
import Menu, { isValidSection } from "../../components/dashboard/Menu";
import { GuildContext, type Channel, type DiscordGuild, type GuildSettings } from "../../contexts/GuildContext";
import { UserContext } from "../../contexts/UserContext";
import { isValidSnowflake } from "../../utils/common";
import { API_BASE_URL, type Snowflake } from "../../utils/constants";

const Autorole = dynamic(async () => import("../../components/dashboard/pages/Autorole"), { suspense: true });
const Leveling = dynamic(async () => import("../../components/dashboard/pages/Leveling"), { suspense: true });
const Milestones = dynamic(async () => import("../../components/dashboard/pages/Milestones"), { suspense: true });
const EmojiList = dynamic(async () => import("../../components/dashboard/pages/EmojiList"), { suspense: true });
const MentionCooldown = dynamic(async () => import("../../components/dashboard/pages/MentionCooldown"), {
	suspense: true,
});
const Miscellaneous = dynamic(async () => import("../../components/dashboard/pages/Miscellaneous"), { suspense: true });
const DangerZone = dynamic(async () => import("../../components/dashboard/pages/DangerZone"), { suspense: true });

type PageProps = GetGuildResult & { guildId: Snowflake };

interface ErrorProps extends PageProps {
	error: string;
	withSignIn?: boolean;
}

export const getServerSideProps: GetServerSideProps<ErrorProps | PageProps> = async (ctx) => {
	if (typeof ctx.params?.id !== "string" || !isValidSnowflake(ctx.params.id)) {
		return { notFound: true };
	}

	const response = await fetch(`${API_BASE_URL}/guilds/${ctx.params.id}`, {
		credentials: "include",
		headers: ctx.req.headers.cookie ? { cookie: ctx.req.headers.cookie } : {},
	}).catch(() => null);

	// eslint-disable-next-line unicorn/consistent-function-scoping
	function makeErrorProps(error: string, withSignIn?: boolean) {
		return {
			guild: {} as DiscordGuild,
			channels: [],
			error,
			guildId: "",
			settings: {} as GuildSettings,
			withSignIn: withSignIn ?? false,
		};
	}

	if (!response) {
		return { props: makeErrorProps("Failed to retrieve guild information") };
	}

	if (response.status === 404) {
		return { props: makeErrorProps("Guild not found") };
	}

	if (response.status === 401) {
		return { props: makeErrorProps("You need to sign in to view this page", true) };
	}

	if (response.status === 403) {
		return { props: makeErrorProps("You are not authorized to view this page") };
	}

	const data = (await response.json()) as GetGuildResult;

	return {
		props: {
			...data,
			guildId: ctx.params.id,
		},
	};
};

export default function Guild(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [menuOpen, setMenuOpen] = useState<boolean>(true);
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { changes, errors, section, updateData, updateGuildId, updateSection, warnings } = useContext(GuildContext);
	const { authenticated } = useContext(UserContext);
	const router = useRouter();

	const closeMenu = useCallback((): void => setMenuOpen(false), []);
	const openMenu = useCallback((): void => setMenuOpen(true), []);

	const { channels, settings, guild, guildId } = props;

	const sortedChannels = useMemo(() => [...(channels ?? [])].sort((a, b) => a.name.localeCompare(b.name)), [channels]);
	const sortedRoles = useMemo(() => [...(guild?.roles ?? [])].sort((a, b) => b.position - a.position), [guild]);

	useEffect(() => {
		if (!Object.keys(changes).length) {
			return undefined;
		}

		const handleUnload = (event: BeforeUnloadEvent) => (event.returnValue = "Changes that you made may not be saved.");

		window.addEventListener("beforeunload", handleUnload);
		return () => window.removeEventListener("beforeunload", handleUnload);
	}, [changes]);

	useEffect(() => {
		const pageQuery = String(router.query.p);

		if (pageQuery && guildId && pageQuery !== section) {
			const pageName = isValidSection(pageQuery) ? pageQuery : "leveling";
			void router.push(`/guilds/${guildId}?p=${pageName}`, `/guilds/${guildId}?p=${pageName}`, { shallow: true });
			updateSection(pageName);
			closeMenu();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	useEffect(() => {
		if (guild) {
			updateGuildId(guildId);
		}

		if (settings) {
			updateData(settings);
		}
	}, [settings, guild, guildId, updateData, updateGuildId]);

	if ("error" in props) {
		return <Failure href="/guilds" message={props.error} withSignIn={props.withSignIn} />;
	}

	if (!authenticated) {
		return <Failure href="/guilds" message="You need to sign in to view this page" withSignIn />;
	}

	return (
		<div className="w-full bg-discord-dark">
			<div className="mx-auto flex min-h-screen-no-footer max-w-[992px] flex-col divide-gray-600 sm:flex-row sm:divide-x-2 xl:max-w-[1440px]">
				<Head>
					<title>{`${guild.name} Dashboard | Pepe Manager`}</title>
				</Head>

				<Menu closeMenu={closeMenu} guild={guild} guildId={guildId} menuOpen={menuOpen} premium={settings.premium} />

				<main className={`w-full px-4 pb-5 md:pt-6 ${menuOpen ? "hidden" : "block"} sm:block`}>
					{warnings.length > 0 || errors.length > 0 ? (
						<div className="mb-2 flex flex-col gap-3">
							{errors.length > 0 && errors.map((msg, idx) => <Message key={idx} message={msg} />)}
							{warnings.length > 0 && warnings.map((msg, idx) => <Message key={idx} message={msg} type="warning" />)}
						</div>
					) : null}

					<Suspense
						fallback={
							<div className="flex min-h-screen-no-footer items-center justify-center bg-discord-dark">
								<Spinner className="h-auto w-60" />
							</div>
						}
					>
						{section === "autorole" ? (
							<Autorole openMenu={openMenu} roles={sortedRoles} settings={settings} />
						) : section === "milestones" ? (
							<Milestones channels={sortedChannels} openMenu={openMenu} roles={sortedRoles} settings={settings} />
						) : section === "emojiList" ? (
							<EmojiList channels={sortedChannels} openMenu={openMenu} settings={settings} />
						) : section === "mentionCooldown" ? (
							<MentionCooldown openMenu={openMenu} roles={sortedRoles} settings={settings} />
						) : section === "miscellaneous" ? (
							<Miscellaneous channels={sortedChannels} openMenu={openMenu} settings={settings} />
						) : section === "dangerZone" ? (
							<DangerZone openMenu={openMenu} settings={settings} />
						) : (
							<Leveling channels={sortedChannels} openMenu={openMenu} roles={sortedRoles} settings={settings} />
						)}
					</Suspense>
				</main>
			</div>
		</div>
	);
}

interface GetGuildResult {
	channels: Channel[];
	guild: DiscordGuild;
	settings: GuildSettings;
}
