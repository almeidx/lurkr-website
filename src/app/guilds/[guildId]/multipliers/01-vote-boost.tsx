import { ExternalLink } from "@/components/ExternalLink.tsx";
import { Toggle } from "@/components/Toggle.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { TOPGG_URL } from "../../../../../shared-links.mjs";

export function VoteBoost({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<div className="flex h-6 gap-4 rounded-lg">
			<Text
				docsPath="/guides/leveling-automation"
				htmlFor="voteBoostedXp"
				tooltip="" // TODO: docsPath and tooltip
			>
				<span className="whitespace-normal">
					Allow users that vote for Lurkr on{" "}
					<ExternalLink href={`${TOPGG_URL}?source=dash-multipliers`} className="transition-colors hover:text-blurple">
						top.gg
					</ExternalLink>{" "}
					to gain 20% more experience?{" "}
				</span>
			</Text>

			<Toggle initialValue={defaultValue} id="voteBoostedXp" />
		</div>
	);
}
