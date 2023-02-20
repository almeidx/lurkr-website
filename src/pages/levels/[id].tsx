import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { TbArrowsDownUp } from "react-icons/tb";
import Multiplier from "@/leaderboard/Multiplier";
import Role from "@/leaderboard/Role";
import User from "@/leaderboard/User";
import Failure from "~/components/Failure";
import Spinner from "~/components/Spinner";
import {
	XpMultiplierType,
	type Channel,
	type DiscordGuild,
	type ILevel,
	type IMultiplier,
	type RoleReward,
} from "~/contexts/GuildContext";
import { guildIconCdn } from "~/utils/cdn";
import { type Snowflake, FALLBACK_AVATAR, API_BASE_URL } from "~/utils/constants";

interface ErrorProps {
	error: string;
}

export const getStaticProps: GetStaticProps<ErrorProps | (GetLevelsResult & { guildId: Snowflake })> = async (ctx) => {
	if (typeof ctx.params?.id !== "string") {
		return { notFound: true };
	}

	const response = await fetch(`${API_BASE_URL}/levels/${ctx.params.id}`).catch(() => null);

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
};

export const getStaticPaths: GetStaticPaths = () => ({
	fallback: true,
	paths: [],
});

export default function Leaderboard(props: InferGetStaticPropsType<typeof getStaticProps>) {
	const [multiplierSortDir, setMultiplierSortDir] = useState<-1 | 1>(1);
	const [roleRewardsSortDir, setRoleRewardsSortDir] = useState<-1 | 1>(1);
	const { isFallback } = useRouter();

	if (isFallback) {
		return (
			<div className="flex min-h-screen-no-footer items-center justify-center bg-discord-dark">
				<Spinner className="h-auto w-60" />
			</div>
		);
	}

	if ("error" in props) {
		return <Failure href="/levels" message={props.error} />;
	}

	const { channels, guild, guildId, levels, multipliers, roleRewards } = props;

	return (
		<div className="flex min-h-screen-no-footer flex-col items-start gap-y-10 bg-discord-dark sm:px-6">
			<Head>
				<title>{`${guild.name} Leaderboard | Pepe Manager`}</title>
			</Head>

			<header className="mt-3 ml-10 flex flex-row items-center justify-center gap-6 sm:mt-10 xl:mt-0">
				<Image
					alt={`${guild.name} guild icon`}
					className="rounded-md"
					height={64}
					src={guild.icon ? guildIconCdn(guildId, guild.icon, 64) : FALLBACK_AVATAR}
					// Only optimize if the image is the fallback avatar
					unoptimized={Boolean(guild.icon)}
					width={64}
				/>

				<p className="text-xl font-bold text-white sm:text-4xl">{guild.name}</p>
			</header>

			<main className="my-4 flex w-full flex-col justify-center gap-y-6 sm:justify-between md:flex-row">
				{levels.length ? (
					<section className="h-fit w-full divide-y-2 divide-solid divide-gray-400 rounded-2xl bg-discord-not-quite-black">
						{levels.map((user, idx) => (
							<User {...user} index={idx} key={user.userId} />
						))}
					</section>
				) : (
					<p className="h-12 w-full rounded-2xl bg-discord-not-quite-black px-3 py-2 text-xl text-white">
						No leveling entries yet!
					</p>
				)}

				{(roleRewards || Boolean(multipliers.length)) && (
					<div className="mb-8 flex flex-col items-center gap-4 sm:ml-6">
						{roleRewards && (
							<div className="flex h-fit min-w-[15rem] max-w-[23rem] flex-col items-center divide-y-2 divide-solid divide-gray-400 rounded-2xl bg-discord-not-quite-black pb-4">
								<span className="mx-1 flex flex-row items-center gap-2 whitespace-nowrap py-3 text-center text-2xl font-medium text-white">
									Role Rewards
									<TbArrowsDownUp
										className="cursor-pointer rounded-lg bg-discord-slightly-darker p-1"
										onClick={() => setRoleRewardsSortDir((dir) => (dir === 1 ? -1 : 1))}
									/>
								</span>

								<div className="flex w-full max-w-lg flex-col rounded-lg">
									{roleRewards
										.sort((a, b) => (a.level - b.level) * roleRewardsSortDir)
										.map(({ level, roles }) => (
											<Role key={level} level={level} roles={roles} />
										))}
								</div>
							</div>
						)}

						{Boolean(multipliers.length) && (
							<div className="flex h-fit min-w-[15rem] max-w-[23rem] flex-col items-center divide-y-2 divide-solid divide-gray-400 rounded-2xl bg-discord-not-quite-black pb-4">
								<span className="mx-1 flex flex-row items-center gap-2 whitespace-nowrap py-3 text-center text-2xl font-medium text-white">
									Multipliers
									<TbArrowsDownUp
										className="cursor-pointer rounded-lg bg-discord-slightly-darker p-1"
										onClick={() => setMultiplierSortDir((dir) => (dir === 1 ? -1 : 1))}
									/>
								</span>

								<div className="flex w-full max-w-lg flex-col rounded-lg">
									{multipliers
										.sort((a, b) => (a.multiplier - b.multiplier) * multiplierSortDir)
										.map(({ id, multiplier, targets, type }) => (
											<Multiplier
												items={
													type === XpMultiplierType.Role
														? guild.roles
														: type === XpMultiplierType.Channel
														? channels
														: null
												}
												key={id}
												multiplier={multiplier}
												targets={targets}
												type={type}
											/>
										))}
								</div>
							</div>
						)}
					</div>
				)}
			</main>
		</div>
	);
}

interface GetLevelsResult {
	channels: Channel[];
	guild: DiscordGuild;
	levels: ILevel[];
	multipliers: IMultiplier[];
	roleRewards: RoleReward[];
}
