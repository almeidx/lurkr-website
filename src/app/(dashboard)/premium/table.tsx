import type { ConfigLimitComparison, LevelingFeature } from "@/app/(dashboard)/premium/features.ts";
import { Check } from "@/components/icons/mdi/check.tsx";
import { Close } from "@/components/icons/mdi/close.tsx";

export function ComparisonTable({ section, features }: ComparisonTableProps) {
	const isConfigLimit = "suffix" in features[0]!;

	return (
		<table className="border-collapse">
			<thead>
				<tr>
					<th
						align="center"
						className="border-white/25 border-r border-b px-1.5 py-2 text-left font-bold text-lg md:text-2xl"
					>
						<h3>{section}</h3>
					</th>
					<th
						align="center"
						className="w-fit max-w-40 border border-white/25 border-t-0 px-1.5 py-2 font-bold text-lg md:w-40 md:text-2xl"
					>
						Free
					</th>
					<th
						align="center"
						className="w-fit max-w-40 border border-white/25 border-t-0 px-1.5 py-2 font-bold text-lg md:w-40 md:text-2xl"
					>
						Max
					</th>
					<th
						align="center"
						className="w-fit max-w-40 border-white/25 border-b border-l px-1.5 py-2 font-bold text-lg md:w-40 md:text-2xl"
					>
						Ultimate
					</th>
				</tr>
			</thead>

			<tbody>
				{features.map((feature) => (
					<tr className="group" key={feature.name}>
						<td className="text-wrap border border-white/25 border-l-0 group-last-of-type:border-b-0">
							<span className="text-wrap px-1.5 py-2">{feature.name}</span>
						</td>
						<td className="border border-white/25 group-last-of-type:border-b-0">
							<div className="flex items-center justify-center px-1.5 py-2">
								{isConfigLimit ? (
									`${feature.free} ${(feature as ConfigLimitComparison).suffix}`
								) : feature.free ? (
									<Check aria-label="Included" className="size-8 text-[#93e19c]" />
								) : (
									<Close aria-label="Not included" className="size-8 text-red" />
								)}
							</div>
						</td>
						<td className="border border-white/25 group-last-of-type:border-b-0">
							<div className="flex items-center justify-center px-1.5 py-2">
								{isConfigLimit ? (
									`${feature.max ?? feature.free} ${(feature as ConfigLimitComparison).suffix}`
								) : feature.max ? (
									<Check aria-label="Included" className="size-8 text-[#93e19c]" />
								) : (
									<Close aria-label="Not included" className="size-8 text-red" />
								)}
							</div>
						</td>
						<td className="border border-white/25 border-r-0 group-last-of-type:border-b-0">
							<div className="flex items-center justify-center px-1.5 py-2">
								{isConfigLimit ? (
									`${feature.ultimate} ${(feature as ConfigLimitComparison).suffix}`
								) : feature.ultimate ? (
									<Check aria-label="Included" className="size-8 text-[#93e19c]" />
								) : (
									<Close aria-label="Not included" className="size-8 text-red" />
								)}
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

interface ComparisonTableProps {
	section: string;
	features: LevelingFeature[] | ConfigLimitComparison[];
}
