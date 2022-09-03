import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { fetchQuery } from "relay-runtime";
import type { UserGuildsQuery, UserGuildsQuery$data } from "../../__generated__/UserGuildsQuery.graphql";
import Guild from "../../components/Guild";
import Input from "../../components/form/Input";
import UserGuilds from "../../graphql/queries/UserGuilds";
import environment from "../../relay/environment";
import {
	isValidSnowflake,
	removeNonStringValues,
	type CorrectSnowflakeTypes,
	type DeepMutable,
} from "../../utils/utils";

type Guilds = CorrectSnowflakeTypes<DeepMutable<UserGuildsQuery$data["getUserGuilds"]>>;

export const getServerSideProps: GetServerSideProps<{ guilds: Guilds }> = async (ctx) => {
	const env = environment(undefined, removeNonStringValues(ctx.req.headers));
	const data = await fetchQuery<UserGuildsQuery>(env, UserGuilds, { withPermissions: false }).toPromise();
	if (!data) {
		return { notFound: true };
	}

	return {
		props: {
			guilds: data.getUserGuilds
				? ([...data.getUserGuilds] as Exclude<Guilds, null>).sort((a, b) => a.name.localeCompare(b.name))
				: null,
		},
	};
};

export default function Levels({ guilds }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [serverId, setServerId] = useState<string>("");
	const submitRef = useRef<HTMLButtonElement>(null);
	const router = useRouter();

	useEffect(() => {
		window.scroll({
			behavior: "auto",
			left: 0,
			top: 0,
		});
	}, []);

	let timeout: NodeJS.Timeout | null = null;

	const handleServerIdSubmit = () => {
		if (isValidSnowflake(serverId)) {
			void router.push(`/levels/${serverId}`);
		} else {
			if (submitRef.current) {
				submitRef.current.style.color = "#ed4245";
			}

			if (timeout) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(() => {
				if (submitRef.current) {
					submitRef.current.style.color = "#fff";
				}
			}, 1_000);
		}
	};

	return (
		<div className="flex min-h-screen-no-footer flex-col items-center justify-center gap-y-8 bg-discord-dark text-center">
			<Head>
				<title>Levels | Pepe Manager</title>
			</Head>

			{guilds && (
				<>
					<h1 className="font-display text-2xl font-bold text-white sm:text-4xl">
						Pick a server to view the levels of
					</h1>
					<main className="flex max-w-7xl flex-row flex-wrap items-start justify-center gap-6">
						{guilds.map(({ icon, id, name }) => (
							<Guild baseRedirectPath="/levels/" icon={icon} id={id} key={id} name={name} />
						))}
					</main>
				</>
			)}

			<div className="flex w-full flex-col items-center justify-center px-4 text-center">
				<h1 className="font-display text-2xl font-bold text-white sm:text-4xl">
					{guilds ? "Alternatively, enter a server ID" : "Enter the ID of the server you want to view"}
				</h1>

				<div className="w-full sm:w-8/12 md:w-6/12 lg:w-4/12">
					<Input
						className="my-5"
						id="searchTerm"
						initialValue={""}
						maxLength={20}
						onChange={(text) => (text ? /^\d+$/.test(text) && setServerId(text) : setServerId(text))}
						onSubmit={handleServerIdSubmit}
						placeholder="Enter a server ID"
						submitRef={submitRef}
					/>
				</div>
			</div>
		</div>
	);
}
