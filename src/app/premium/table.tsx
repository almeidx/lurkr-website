import type { ConfigLimitComparison, LevelingFeature } from "@/app/premium/features.ts";
import { BiCheck } from "@react-icons/all-files/bi/BiCheck";
import { ImCross } from "@react-icons/all-files/im/ImCross";

export function ComparisonTable({ section, features }: ComparisonTableProps) {
	const isConfigLimit = "suffix" in features[0]!;

	return (
		<table className="border-collapse">
			<thead>
				<tr>
					<th
						align="center"
						className="border-b border-r border-white/25 text-left text-lg md:text-2xl px-1.5 py-2 font-bold"
					>
						<h3>{section}</h3>
					</th>
					<th
						align="center"
						className="border border-t-0 border-white/25 text-lg md:text-2xl px-1.5 py-2 font-bold w-fit max-w-40 md:w-40"
					>
						Free
					</th>
					<th
						align="center"
						className="border border-t-0 border-white/25 text-lg md:text-2xl px-1.5 py-2 font-bold w-fit max-w-40 md:w-40"
					>
						Max
					</th>
					<th
						align="center"
						className="border-b border-l border-white/25 text-lg md:text-2xl px-1.5 py-2 font-bold w-fit max-w-40 md:w-40"
					>
						Ultimate
					</th>
				</tr>
			</thead>

			<tbody>
				{features.map((feature) => (
					<tr key={feature.name} className="group">
						<td className="border border-l-0 group-last-of-type:border-b-0 border-white/25 text-wrap">
							<span className="px-1.5 py-2 text-wrap">{feature.name}</span>
						</td>
						<td className="border group-last-of-type:border-b-0 border-white/25">
							<div className="py-2 px-1.5 flex items-center justify-center">
								{isConfigLimit ? (
									`${feature.free} ${(feature as ConfigLimitComparison).suffix}`
								) : feature.free ? (
									<BiCheck color="#93e19c" size={35} />
								) : (
									<ImCross color="#df4444" size={19} />
								)}
							</div>
						</td>
						<td className="border group-last-of-type:border-b-0 border-white/25">
							<div className="py-2 px-1.5 flex items-center justify-center">
								{isConfigLimit ? (
									`${feature.max ?? feature.free} ${(feature as ConfigLimitComparison).suffix}`
								) : feature.max ? (
									<BiCheck color="#93e19c" size={35} />
								) : (
									<ImCross color="#df4444" size={19} />
								)}
							</div>
						</td>
						<td className="border border-r-0 group-last-of-type:border-b-0 border-white/25">
							<div className="py-2 px-1.5 flex items-center justify-center">
								{isConfigLimit ? (
									`${feature.ultimate} ${(feature as ConfigLimitComparison).suffix}`
								) : feature.ultimate ? (
									<BiCheck color="#93e19c" size={35} />
								) : (
									<ImCross color="#df4444" size={19} />
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
