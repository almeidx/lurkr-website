import type { GetServerSideProps, InferGetServerSidePropsType, PageConfig } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Input from "@/form/Input";
import Guild from "~/components/Guild";
import type { UserGuild } from "~/contexts/UserContext";
import { isValidSnowflake } from "~/utils/common";
import { API_BASE_URL } from "~/utils/constants";
import { MAX_VANITY_LENGTH } from "~/utils/guild-config";

export const config: PageConfig = {
	runtime: "experimental-edge",
};

export const getServerSideProps = (async (ctx) => {
	const response = await fetch(API_BASE_URL + "/guilds/@me", {
		credentials: "include",
		headers: ctx.req.headers.cookie ? { cookie: ctx.req.headers.cookie } : {},
	});

	if (!response?.ok) {
		return { props: { guilds: null } };
	}

	const data = (await response.json()) as GetGuildsMeResult;

	return {
		props: {
			guilds: data.sort((a, b) => a.name.localeCompare(b.name)),
		},
	};
}) satisfies GetServerSideProps;

export default function Levels({ guilds }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [serverIdOrVanity, setServerIdOrVanity] = useState<string>("");
	const submitRef = useRef<HTMLButtonElement>(null);
	const router = useRouter();

	useEffect(() => {
		window.scroll({ behavior: "auto", left: 0, top: 0 });
	}, []);

	let timeout: NodeJS.Timeout | null = null;

	const handleServerIdSubmit = () => {
		if (isValidSnowflake(serverIdOrVanity) || isValidVanity(serverIdOrVanity)) {
			void router.push(`/levels/${serverIdOrVanity}`);
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
				<title>Levels | Lurkr</title>
			</Head>

			{guilds ? (
				<>
					<h1 className="text-xl font-bold text-white sm:text-3xl">Pick a server to view the levels of</h1>
					<main className="flex max-w-7xl flex-row flex-wrap items-start justify-center gap-6">
						{guilds.map(({ icon, id, name }) => (
							<Guild baseRedirectPath="/levels" icon={icon} id={id} key={id} name={name} />
						))}
					</main>
				</>
			) : null}

			<div className="flex w-full flex-col items-center justify-center px-4 text-center">
				<h1 className="text-xl font-bold text-white sm:text-3xl">
					{guilds ? "Or enter a server ID/vanity" : "Enter the ID/vanity of the server you want to view"}
				</h1>

				<form className="w-full sm:w-8/12 md:w-6/12 lg:w-4/12">
					<Input
						buttonType="submit"
						className="my-5"
						id="searchTerm"
						initialValue=""
						maxLength={MAX_VANITY_LENGTH}
						onChange={(text) =>
							text
								? /(?:^[1-9]\d{17,19}$)|(?:^[\da-z]+$)/i.test(text) && setServerIdOrVanity(text)
								: setServerIdOrVanity(text)
						}
						onSubmit={handleServerIdSubmit}
						placeholder="Enter a server ID/vanity"
						submitRef={submitRef}
					/>
				</form>
			</div>
		</div>
	);
}

type GetGuildsMeResult = UserGuild[];

function isValidVanity(str: string) {
	return /^[\da-z]{2,32}$/i.test(str);
}
