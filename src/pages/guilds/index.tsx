import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useContext } from "react";
import { fetchQuery } from "relay-runtime";
import type { UserGuildsQuery, UserGuildsQuery$data } from "../../__generated__/UserGuildsQuery.graphql";
import Failure from "../../components/Failure";
import Guild from "../../components/Guild";
import { UserContext } from "../../contexts/UserContext";
import UserGuilds from "../../graphql/queries/UserGuilds";
import environment from "../../relay/environment";
import { removeNonStringValues } from "../../utils/utils";

interface GuildsProps {
	guilds: UserGuildsQuery$data["getUserGuilds"];
}

export const getServerSideProps: GetServerSideProps<GuildsProps> = async (ctx) => {
	const env = environment(undefined, removeNonStringValues(ctx.req.headers));
	const res = await fetchQuery<UserGuildsQuery>(env, UserGuilds, { withPermissions: true }).toPromise();

	return {
		props: { guilds: res?.getUserGuilds ? [...res.getUserGuilds].sort((a, b) => a.name.localeCompare(b.name)) : null },
	};
};

export default function Guilds({ guilds }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { authenticated } = useContext(UserContext);

	if (!authenticated) {
		return <Failure message="You need to sign in to view this page." />;
	}

	if (!guilds) {
		return <Failure message="You are not the manager of any servers." />;
	}

	return (
		<div className="flex min-h-screen-no-footer flex-col items-center justify-center gap-y-8 bg-discord-dark py-6 text-center sm:pt-0">
			<Head>
				<title>Guilds | Pepe Manager</title>
			</Head>

			<h1 className="font-display text-2xl font-bold text-white sm:text-4xl">
				Pick the server you would like to configure
			</h1>

			<main className="flex max-w-7xl flex-row flex-wrap items-start justify-center gap-6">
				{guilds.map(({ icon, id, name }) => (
					<Guild baseRedirectPath="/guilds/" icon={icon} id={id} key={id} name={name} />
				))}
			</main>
		</div>
	);
}
