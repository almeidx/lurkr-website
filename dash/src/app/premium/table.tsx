import { Check, Xmark } from "@gravity-ui/icons";
import { Chip, Surface } from "@heroui/react";
import type { ConfigLimitComparison, LevelingFeature } from "@/app/premium/features.ts";

export function ComparisonTable({ section, features }: ComparisonTableProps) {
	const isConfigLimit = "suffix" in features[0]!;

	return (
		<div className="w-full max-w-5xl">
			<div className="mb-4 flex items-center gap-3">
				<Chip className="bg-white/10 font-medium" size="sm">
					{section}
				</Chip>
				<div className="h-px flex-1 bg-white/10" />
			</div>

			<Surface className="overflow-hidden rounded-2xl">
				<div className="overflow-x-auto">
					<table aria-label={`${section} comparison table`} className="w-full min-w-[600px]">
						<thead>
							<tr className="border-white/10 border-b bg-white/5">
								<th className="px-6 py-4 text-left font-medium text-sm text-white/60 uppercase tracking-wider">
									Feature
								</th>
								<th className="w-32 px-4 py-4 text-center font-medium text-sm text-white/60 uppercase tracking-wider">
									Free
								</th>
								<th className="w-32 px-4 py-4 text-center font-medium text-sm uppercase tracking-wider">
									<span className="bg-gradient-to-r from-[#aad6c6] via-[#fa9079] to-[#74da9c] bg-clip-text text-transparent">
										Max
									</span>
								</th>
								<th className="w-32 px-4 py-4 text-center font-medium text-sm uppercase tracking-wider">
									<span className="bg-gradient-to-r from-[#a2fbec] via-[#f985ff] to-[#4d54fe] bg-clip-text text-transparent">
										Ultimate
									</span>
								</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-white/5">
							{features.map((feature, index) => (
								<tr
									className={`transition-colors hover:bg-white/5 ${index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}`}
									key={feature.name}
								>
									<td className="px-6 py-4 text-sm text-white/80">{feature.name}</td>
									<td className="px-4 py-4 text-center">
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
									<td className="px-4 py-4 text-center">
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
									<td className="px-4 py-4 text-center">
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
	);
}

interface ComparisonTableProps {
	section: string;
	features: LevelingFeature[] | ConfigLimitComparison[];
}
