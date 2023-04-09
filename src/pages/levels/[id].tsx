import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { TbArrowsDownUp } from "react-icons/tb";
import Multiplier from "@/leaderboard/Multiplier";
import Role from "@/leaderboard/Role";
import UserRow from "@/leaderboard/UserRow";
import Failure from "~/components/Failure";
import Spinner from "~/components/Spinner";
import type { DiscordGuild, ILevel, IMultiplier, RoleReward } from "~/contexts/GuildContext";
import { guildIconCdn } from "~/utils/cdn";
import { FALLBACK_AVATAR, API_BASE_URL } from "~/utils/constants";

export const getStaticProps = (async (ctx) => {
	if (typeof ctx.params?.id !== "string") {
		return { notFound: true };
	}

	const response = await fetch(`${API_BASE_URL}/levels/${ctx.params.id}?page=1`).catch(() => null);

	if (!response) {
		return { props: { error: "Failed to retrieve leveling information. Try again later" } };
	}

	if (response.status === 404) {
		return { props: { error: "Guild not found" } };
	}

	if (response.status === 400) {
		return { props: { error: "The leveling system is not enabled on this guild" } };
	}

	const data = (await response.json()) as GetLevelsResult;

	return {
		props: { ...data, guildId: data.guild.id },
		revalidate: 60,
	};
}) satisfies GetStaticProps;

export const getStaticPaths: GetStaticPaths = () => ({
	fallback: true,
	paths: [],
});

export default function Leaderboard(props: InferGetStaticPropsType<typeof getStaticProps>) {
	const [multiplierSortDir, setMultiplierSortDir] = useState<-1 | 1>(1);
	const [roleRewardsSortDir, setRoleRewardsSortDir] = useState<-1 | 1>(1);
	const { isFallback } = useRouter();

	const sortedRoleRewards = useMemo(
		() => ("roleRewards" in props ? props.roleRewards.sort((a, b) => (a.level - b.level) * roleRewardsSortDir) : null),
		[props, roleRewardsSortDir],
	);

	const sortedMultipliers = useMemo(
		() =>
			"multipliers" in props
				? props.multipliers.sort((a, b) => (a.multiplier - b.multiplier) * multiplierSortDir)
				: null,
		[multiplierSortDir, props],
	);

	if (isFallback) {
		return (
			<div className="min-h-screen-no-footer bg-discord-dark flex items-center justify-center">
				<Spinner className="h-auto w-60" />
			</div>
		);
	}

	if ("error" in props) {
		return <Failure href="/levels" message={props.error!} />;
	}

	const { guild, guildId, levels } = props;

	return (
		<div className="min-h-screen-no-footer bg-discord-dark flex flex-col items-start gap-y-10 sm:px-6">
			<Head>
				<title>{`${guild.name} Leaderboard | Lurkr`}</title>
			</Head>

			<main className="mx-auto my-4 flex w-full flex-col justify-center gap-y-6 xl:max-w-7xl">
				<div className="flex items-center gap-3">
					<Image
						alt={`${guild.name} guild icon`}
						className="rounded-md"
						height={64}
						priority
						src={guild.icon ? guildIconCdn(guildId, guild.icon, 64) : FALLBACK_AVATAR}
						// Only optimize if the image is the fallback avatar
						unoptimized={Boolean(guild.icon)}
						width={64}
					/>

					<p className="text-xl font-bold text-white sm:text-4xl">{guild.name}</p>
				</div>

				<div className="flex w-full flex-col justify-center gap-y-6 sm:justify-between md:flex-row">
					{levels.length ? (
						<table className="bg-discord-not-quite-black h-fit w-full divide-y-2 divide-solid divide-gray-400 rounded-2xl text-left font-medium text-white">
							<thead>
								<tr className="h-12 text-xl">
									<th align="center" className="px-3 py-2">
										Rank
									</th>
									<th className="w-full px-3 py-2">User</th>
									<th align="center" className="hidden px-3 py-2 lg:table-cell">
										Messages
									</th>
									<th align="center" className="hidden px-3 py-2 lg:table-cell">
										XP
									</th>
									<th align="center" className="px-3 py-2">
										Level
									</th>
								</tr>
							</thead>

							{levels.map((user, idx) => (
								<UserRow index={idx} key={idx} {...user} />
							))}
						</table>
					) : (
						<p className="bg-discord-not-quite-black h-12 w-full rounded-2xl px-3 py-2 text-xl text-white">
							No leveling entries yet!
						</p>
					)}

					{sortedRoleRewards?.length || sortedMultipliers?.length ? (
						<div className="mb-8 flex flex-col items-center gap-6 md:ml-6">
							{sortedRoleRewards?.length ? (
								<div className="bg-discord-not-quite-black flex h-fit w-full flex-col items-center divide-y-2 divide-solid divide-gray-400 rounded-2xl pb-4 md:w-72">
									<span className="mx-1 flex flex-row items-center gap-2 whitespace-nowrap py-3 text-center text-2xl font-medium text-white">
										Role Rewards
										<TbArrowsDownUp
											className="bg-discord-slightly-darker cursor-pointer rounded-lg p-1"
											onClick={() => setRoleRewardsSortDir((dir) => (dir === 1 ? -1 : 1))}
										/>
									</span>

									<div className="flex w-full max-w-lg flex-col rounded-lg">
										{sortedRoleRewards.map(({ level, roles }) => (
											<Role key={level} level={level} roles={roles} />
										))}
									</div>
								</div>
							) : null}

							{sortedMultipliers?.length ? (
								<div className="bg-discord-not-quite-black flex h-fit w-full flex-col items-center divide-y-2 divide-solid divide-gray-400 rounded-2xl pb-4 md:w-72">
									<span className="mx-1 flex flex-row items-center gap-2 whitespace-nowrap py-3 text-center text-2xl font-medium text-white">
										Multipliers
										<TbArrowsDownUp
											className="bg-discord-slightly-darker cursor-pointer rounded-lg p-1"
											onClick={() => setMultiplierSortDir((dir) => (dir === 1 ? -1 : 1))}
										/>
									</span>

									<div className="flex w-full max-w-lg flex-col rounded-lg">
										{sortedMultipliers.map(({ id, multiplier, targets, type }) => (
											<Multiplier key={id} multiplier={multiplier} targets={targets} type={type} />
										))}
									</div>
								</div>
							) : null}
						</div>
					) : null}
				</div>
			</main>
		</div>
	);
}

interface GetLevelsResult {
	guild: Omit<DiscordGuild, "roles">;
	levels: ILevel[];
	multipliers: IMultiplier[];
	roleRewards: RoleReward[];
}
