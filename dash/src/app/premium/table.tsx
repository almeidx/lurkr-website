import { Check, Xmark } from "@gravity-ui/icons";
import { Chip, Surface } from "@heroui/react";
import type { ConfigLimitComparison, LevelingFeature } from "@/app/premium/features.ts";

export function ComparisonTable({ section, features }: ComparisonTableProps) {
	const isConfigLimit = "suffix" in features[0]!;

	return (
		<div className="w-full max-w-7xl">
			<div className="mb-4 flex items-center gap-3">
				<Chip className="bg-white/10 font-medium" size="sm">
					{section}
				</Chip>
				<div className="h-px flex-1 bg-white/10" />
			</div>

			<div className="relative">
				{/* Gradient glow behind Ultimate column - hidden on mobile */}
				<div className="pointer-events-none absolute top-0 right-0 -z-10 hidden h-full w-32 rounded-2xl bg-gradient-to-br from-[#a2fbec]/30 via-[#f985ff]/30 to-[#4d54fe]/30 opacity-50 blur-xl md:block" />

				{/* Gradient border overlay for Ultimate column - hidden on mobile */}
				<div className="pointer-events-none absolute top-0 right-0 z-10 hidden h-full w-32 rounded-2xl bg-[conic-gradient(from_180deg,#a2fbec,#f985ff,#4d54fe,#f985ff,#a2fbec)] p-0.5 md:block">
					<div className="h-full w-full rounded-[14px] bg-[#18181b]" />
				</div>

				<Surface className="overflow-hidden rounded-2xl">
					<div className="overflow-x-auto">
						<table
							aria-label={`${section} comparison table`}
							className="w-full min-w-[600px] border-separate border-spacing-0"
						>
							<thead>
								<tr>
									<th className="border-white/10 border-b bg-white/5 px-6 py-4 text-left font-medium text-sm text-white/60 uppercase tracking-wider">
										Feature
									</th>
									<th className="w-32 border-white/10 border-b bg-white/5 px-4 py-4 text-center font-medium text-sm text-white/60 uppercase tracking-wider">
										Free
									</th>
									<th className="hidden w-32 border-white/10 border-b bg-white/5 px-4 py-4 text-center font-medium text-sm uppercase tracking-wider md:table-cell">
										<span className="bg-gradient-to-r from-[#aad6c6] via-[#fa9079] to-[#74da9c] bg-clip-text text-transparent">
											Max
										</span>
									</th>
									<th className="relative z-20 w-32 border-white/10 border-b bg-white/5 px-4 py-4 text-center font-medium text-sm uppercase tracking-wider">
										<span className="bg-gradient-to-r from-[#a2fbec] via-[#f985ff] to-[#4d54fe] bg-clip-text text-transparent">
											Ultimate
										</span>
									</th>
								</tr>
							</thead>

							<tbody>
								{features.map((feature, index) => (
									<tr className="transition-colors hover:bg-white/5" key={feature.name}>
										<td
											className={`border-white/5 border-b px-6 py-4 text-sm text-white/80 ${index % 2 !== 0 ? "bg-white/[0.02]" : ""}`}
										>
											{feature.name}
										</td>
										<td
											className={`border-white/5 border-b px-4 py-4 text-center ${index % 2 !== 0 ? "bg-white/[0.02]" : ""}`}
										>
											{isConfigLimit ? (
												<span className="text-sm text-white/60">
													{(feature as ConfigLimitComparison).free}{" "}
													<span className="text-white/40">{(feature as ConfigLimitComparison).suffix}</span>
												</span>
											) : feature.free ? (
												<div className="flex justify-center">
													<div className="flex size-6 items-center justify-center rounded-full bg-[#93e19c]/20">
														<Check aria-label="Included" className="size-4 text-[#93e19c]" />
													</div>
												</div>
											) : (
												<div className="flex justify-center">
													<div className="flex size-6 items-center justify-center rounded-full bg-white/10">
														<Xmark aria-label="Not included" className="size-4 text-white/30" />
													</div>
												</div>
											)}
										</td>
										<td
											className={`hidden border-white/5 border-b px-4 py-4 text-center md:table-cell ${index % 2 !== 0 ? "bg-white/[0.02]" : ""}`}
										>
											{isConfigLimit ? (
												<span className="text-sm text-white/60">
													{(feature as ConfigLimitComparison).max ?? (feature as ConfigLimitComparison).free}{" "}
													<span className="text-white/40">{(feature as ConfigLimitComparison).suffix}</span>
												</span>
											) : (feature as LevelingFeature).max ? (
												<div className="flex justify-center">
													<div className="flex size-6 items-center justify-center rounded-full bg-[#93e19c]/20">
														<Check aria-label="Included" className="size-4 text-[#93e19c]" />
													</div>
												</div>
											) : (
												<div className="flex justify-center">
													<div className="flex size-6 items-center justify-center rounded-full bg-white/10">
														<Xmark aria-label="Not included" className="size-4 text-white/30" />
													</div>
												</div>
											)}
										</td>
										<td
											className={`relative z-20 border-white/5 border-b px-4 py-4 text-center ${index % 2 !== 0 ? "bg-white/[0.02]" : ""}`}
										>
											{isConfigLimit ? (
												<span className="font-medium text-sm text-white/80">
													{(feature as ConfigLimitComparison).ultimate}{" "}
													<span className="text-white/40">{(feature as ConfigLimitComparison).suffix}</span>
												</span>
											) : (feature as LevelingFeature).ultimate ? (
												<div className="flex justify-center">
													<div className="flex size-6 items-center justify-center rounded-full bg-[#93e19c]/20">
														<Check aria-label="Included" className="size-4 text-[#93e19c]" />
													</div>
												</div>
											) : (
												<div className="flex justify-center">
													<div className="flex size-6 items-center justify-center rounded-full bg-white/10">
														<Xmark aria-label="Not included" className="size-4 text-white/30" />
													</div>
												</div>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Surface>
			</div>
		</div>
	);
}

interface ComparisonTableProps {
	section: string;
	features: LevelingFeature[] | ConfigLimitComparison[];
}
