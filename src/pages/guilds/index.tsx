import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useContext } from "react";
import Failure from "~/components/Failure";
import Guild from "~/components/Guild";
import { UserContext, type UserGuild } from "~/contexts/UserContext";
import { API_BASE_URL } from "~/utils/constants";

export const getServerSideProps = (async (ctx) => {
	const response = await fetch(`${API_BASE_URL}/guilds/@me?withPermissions=true`, {
		credentials: "include",
		headers: ctx.req.headers.cookie ? { cookie: ctx.req.headers.cookie } : {},
	});

	if (response.status === 500) {
		return { props: { error: "Failed to retrieve guilds. Try again later" } };
	}

	if (response.status === 401) {
		return { props: { error: "You need to sign in to view this page", withSignIn: true } };
	}

	const data = (await response.json()) as GetGuildsMeResult;

	if (!data.length) {
		return { props: { error: "You are not the manager of any guilds" } };
	}

	return {
		props: { guilds: data.sort((a, b) => a.name.localeCompare(b.name)) },
	};
}) satisfies GetServerSideProps;

export default function Guilds(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { authenticated } = useContext(UserContext);

	if ("error" in props) {
		return <Failure href="/" message={props.error!} withSignIn={props.withSignIn} />;
	}

	if (!authenticated) {
		return <Failure href="/" message="You need to sign in to view this page" />;
	}

	return (
		<div className="flex min-h-screen-no-footer flex-col items-center justify-center gap-y-8 bg-discord-dark py-6 text-center sm:pt-0">
			<Head>
				<title>Dashboard | Lurkr</title>
			</Head>

			<h1 className="font-display text-2xl font-bold text-white sm:text-4xl">
				Pick the server you would like to configure
			</h1>

			<main className="flex max-w-7xl flex-row flex-wrap items-start justify-center gap-6">
				{props.guilds.map(({ icon, id, name }) => (
					<Guild baseRedirectPath="/guilds/" icon={icon} id={id} key={id} name={name} />
				))}
			</main>
		</div>
	);
}

type GetGuildsMeResult = UserGuild[];
