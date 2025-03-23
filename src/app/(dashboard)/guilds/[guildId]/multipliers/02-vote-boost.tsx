import { ExternalLink } from "@/components/ExternalLink.tsx";
import { Toggle } from "@/components/Toggle.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { TOPGG_URL } from "@/shared-links.js";

export function VoteBoost({ defaultValue }: { readonly defaultValue: boolean }) {
	return (
		<div className="flex h-6 gap-4 rounded-lg">
			<Text
				docsPath="/guides/setting-up-leveling-multipliers#toggling-vote-boosting-leveling"
				htmlFor="voteBoostedXp"
				tooltip="Users that vote for Lurkr on top.gg will gain 20% more experience."
			>
				<span className="whitespace-normal">
					Allow users that vote for Lurkr on{" "}
					<ExternalLink href={`${TOPGG_URL}&utm_campaign=multipliers`} className="transition-colors hover:text-blurple">
						top.gg
					</ExternalLink>{" "}
					to gain 20% more experience?{" "}
				</span>
			</Text>

			<Toggle initialValue={defaultValue} id="voteBoostedXp" />
		</div>
	);
}
