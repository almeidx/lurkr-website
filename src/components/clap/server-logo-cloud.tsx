import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { type Snowflake, guildIcon } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import Marquee from "react-fast-marquee";

export async function ServerLogoCloud() {
	const guilds = await getFeaturedGuilds();

	const half = Math.ceil(guilds.length / 2);
	const guildsTop = guilds.slice(0, half);
	const guildsBottom = guilds.slice(half);

	return (
		<section
			id="logo cloud"
			aria-label="Company logos"
			className="mt-24 flex animate-slide-up-fade flex-col items-center justify-center gap-y-6 text-center sm:mt-32"
			style={{ animationDuration: "1500ms" }}
		>
			<p className="font-medium text-gray-800 text-lg tracking-tighter dark:text-gray-200">
				Trusted by the Discord server's you know and love
			</p>
			<div className="flex max-w-4xl flex-col gap-10 gap-y-4 text-gray-900 dark:text-gray-200">
				{guilds.length > 8 ? (
					<>
						<FeaturedGuilds guilds={guildsTop} />
						<FeaturedGuilds guilds={guildsBottom} direction="right" speed={10} />
					</>
				) : (
					<FeaturedGuilds guilds={guilds} />
				)}
			</div>
		</section>
	);
}

function FeaturedGuilds({
	guilds,
	direction = "left",
	speed = 20,
}: { guilds: FeaturedGuild[]; direction?: "left" | "right"; speed?: number }) {
	return (
		<Marquee play speed={speed} direction={direction} gradient gradientColor="#030712">
			{guilds.map((guild) => (
				<div key={guild.id} className="flex items-center gap-2">
					<ImageWithFallback
						className="no-drag rounded-full bg-zinc-900"
						src={guildIcon(guild.id, guild.icon)}
						alt={guild.name}
						width={25}
						height={25}
					/>
					<span>{guild.name}</span>
				</div>
			))}
		</Marquee>
	);
}

async function getFeaturedGuilds() {
	const response = await makeApiRequest("/guilds/featured", null, {
		next: {
			revalidate: 60 * 60, // 1 hour
		},
	});

	if (!response.ok) {
		return [];
	}

	const data = (await response.json()) as FeaturedGuild[];
	return data;
}

export interface FeaturedGuild {
	id: Snowflake;
	name: string;
	icon: string | null;
	memberCount: number;
	verified: boolean;
	partner: boolean;
}
