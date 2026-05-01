import { type FeaturedGuild, FeaturedGuilds } from "@/app/featured-guilds.tsx";
import { GradientText } from "./shared.tsx";

export function LogoWall({ featured }: { readonly featured: readonly FeaturedGuild[] }) {
	if (!featured.length) return null;

	const half = Math.ceil(featured.length / 2);
	const rowA = featured.slice(0, half);
	const rowB = featured.slice(half);

	return (
		<section className="mx-auto w-full max-w-[1400px] pt-24 pb-8 max-md:pt-16">
			<div className="mb-12 px-8 text-center">
				<p className="m-0 font-semibold text-[13px] text-white/45 uppercase tracking-[2px]">
					— Trusted by communities —
				</p>
				<h2 className="m-0 mt-3 font-extrabold text-[clamp(2rem,4vw,3.25rem)] text-white tracking-[-0.02em]">
					Servers <GradientText italic>you</GradientText> know.
				</h2>
			</div>

			<div className="flex flex-col gap-3.5">
				{featured.length > 8 ? (
					<>
						<FeaturedGuilds guilds={rowA} speed={40} />
						<FeaturedGuilds direction="right" guilds={rowB} speed={30} />
					</>
				) : (
					<FeaturedGuilds guilds={featured} speed={40} />
				)}
			</div>
		</section>
	);
}
