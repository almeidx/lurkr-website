import { type FeaturedGuild, FeaturedGuilds } from "@/app/featured-guilds.tsx";
import { sc } from "./outfit.ts";
import { Eyebrow } from "./ui.tsx";

interface FeaturedServersSectionProps {
	readonly featured: FeaturedGuild[];
}

export function FeaturedServersSection({ featured }: FeaturedServersSectionProps) {
	const half = Math.ceil(featured.length / 2);
	const featured1 = featured.slice(0, half);
	const featured2 = featured.slice(half);

	return (
		<section className="w-full overflow-hidden border-white/[0.07] border-y py-20">
			{/* Centered heading */}
			<div className="mx-auto mb-12 flex max-w-7xl flex-col items-center gap-3 px-5 text-center sm:px-8">
				<Eyebrow>Community</Eyebrow>
				<h2 className={`${sc} font-extrabold text-3xl text-white lg:text-4xl`}>
					Trusted by servers <span className="text-gradient-lurkr italic">you know.</span>
				</h2>
				<p className="text-white/40">Discord&apos;s top communities level up with Lurkr.</p>
			</div>

			{/* Full-bleed marquee */}
			<div className="flex flex-col gap-4">
				{featured.length > 8 ? (
					<>
						<FeaturedGuilds guilds={featured1} speed={40} />
						<FeaturedGuilds direction="right" guilds={featured2} speed={30} />
					</>
				) : (
					<FeaturedGuilds guilds={featured} speed={40} />
				)}
			</div>
		</section>
	);
}
