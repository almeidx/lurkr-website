import { Badge } from "@/components/ui/badge.tsx";

const features = [
	{
		name: "Import & Export",
		description: "Import and export your data from Lurkr to other platforms.",
	},
	{
		name: "Customizable rank cards",
		description: "Customize your rank cards to your liking.",
	},
	{
		name: "In-depth multipliers",
		description: "Multipliers are a great way to incentivize your members to level up.",
	},
];

export function Features() {
	return (
		<div className="px-3">
			<section
				aria-labelledby="global-database-title"
				className="relative mx-auto mt-28 flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-3xl bg-gray-950 pt-24 shadow-black/30 shadow-xl md:mt-40"
			>
				<div className="absolute top-[17rem] size-[40rem] rounded-full bg-indigo-800 blur-3xl md:top-[20rem]" />

				<Badge className="z-10 inline-block rounded-lg border border-indigo-400/20 bg-indigo-800/20 px-3 py-1.5 font-semibold uppercase leading-4 tracking-tight sm:text-sm">
					Track Growth & Engagement
				</Badge>

				<h2
					id="global-database-title"
					className="z-10 mt-6 inline-block bg-gradient-to-b from-white to-indigo-100 bg-clip-text px-2 text-center font-bold text-5xl text-transparent tracking-tighter md:text-8xl"
				>
					Level Up Your <br />
					Discord Community
				</h2>

				<div className="-mt-32 xs:-mt-44 sm:-mt-56 md:-mt-72 lg:-mt-80 z-20 h-[36rem] w-full overflow-hidden">
					<div className="absolute bottom-0 h-3/5 w-full bg-gradient-to-b from-transparent via-gray-950/95 to-gray-950" />
					<div className="absolute inset-x-6 bottom-12 m-auto max-w-4xl md:top-2/3">
						<div className="grid grid-cols-1 gap-x-10 gap-y-6 rounded-lg border border-white/[3%] bg-white/[1%] px-6 py-6 shadow-xl backdrop-blur md:grid-cols-3 md:p-8">
							{features.map((item) => (
								<div key={item.name} className="flex flex-col gap-2">
									<h3
										className="whitespace-nowrap bg-gradient-to-b from-indigo-300 to-indigo-500 bg-clip-text font-semibold text-lg text-transparent md:text-xl"
										title={item.name}
									>
										{item.name}
									</h3>
									<p className="text-indigo-200/40 text-sm leading-6">{item.description}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
