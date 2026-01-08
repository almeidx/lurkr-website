import { ArrowsExpand, Clock, LockOpen, Person } from "@gravity-ui/icons";
import { Accordion } from "@heroui/react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { configLimitFeatures, extraFeatures } from "@/app/premium/features.ts";
import { PremiumPlan } from "@/app/premium/plan.tsx";
import { ComparisonTable } from "@/app/premium/table.tsx";
import lurkrFreeImg from "@/assets/premium-plans/lurkr-free.webp";
import lurkrMaxImg from "@/assets/premium-plans/lurkr-max.webp";
import lurkrUltimateImg from "@/assets/premium-plans/lurkr-ultimate.webp";
import { PremiumTier } from "@/lib/auth.ts";
import { SUPPORT_SERVER_INVITE } from "@/shared-links.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";

export default async function Premium() {
	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	const currentPlan = token ? await getData(token) : null;

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-12 px-4 py-12">
			<header className="flex flex-col items-center justify-center gap-4 text-center">
				<h1 className="bg-linear-to-br from-white to-white/50 bg-clip-text font-bold text-4xl text-transparent">
					Support Lurkr Development
				</h1>

				<p className="max-w-lg text-center text-white/80 text-xl leading-relaxed tracking-tight">
					All features are free, forever. Supporting us just gets you increased limits and helps keep Lurkr running.
				</p>
			</header>

			<div className="grid w-full max-w-7xl grid-cols-1 items-end gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
				<PremiumPlan
					buttonText="Stay Free"
					funny="Buys you groceries…"
					img={lurkrFreeImg}
					isCurrent={currentPlan?.plan === PremiumTier.None}
					name="Lurkr Free"
					perks={["All features included", "Standard configuration limits", "Community support"]}
					price={0}
					tier={0}
				/>

				<PremiumPlan
					buttonText="Support Us"
					funny="Helps you pay taxes…"
					img={lurkrUltimateImg}
					isCurrent={currentPlan?.plan === PremiumTier.Guild}
					isPopular
					name="Lurkr Ultimate"
					perks={["Increased limits for a whole server", "Everything from Lurkr Max", "Directly support development!"]}
					price={5}
					tier={2}
				/>

				<PremiumPlan
					buttonText="Get Max"
					funny="Kisses you goodnight…"
					img={lurkrMaxImg}
					isCurrent={currentPlan?.plan === PremiumTier.Basic}
					name="Lurkr Max"
					perks={["No tips on /level command", "Patreon role in support server", "Premium support"]}
					price={1}
					tier={1}
				/>
			</div>

			<p className="max-w-prose text-balance text-center text-sm text-white/50">
				Purchases are subject to our{" "}
				<Link className="text-white/50 underline decoration-white/30 hover:text-white/70" href="/terms">
					Terms of Service
				</Link>{" "}
				&{" "}
				<Link className="text-white/50 underline decoration-white/30 hover:text-white/70" href="/privacy">
					Privacy Policy
				</Link>{" "}
				and to the{" "}
				<a
					className="text-white/50 underline decoration-white/30 hover:text-white/70"
					href="https://www.patreon.com/policy/legal"
					rel="external noopener noreferrer"
					target="_blank"
				>
					Terms of Service
				</a>{" "}
				and{" "}
				<a
					className="text-white/50 underline decoration-white/30 hover:text-white/70"
					href="https://support.patreon.com/hc/articles/205032045-Patreon-s-refund-policy"
					rel="external noopener noreferrer"
					target="_blank"
				>
					Refund Policy
				</a>{" "}
				of Patreon, Inc.
			</p>

			<div className="flex w-full flex-col items-center gap-8">
				<div className="text-center">
					<h2 className="font-bold text-2xl md:text-3xl">Compare Plans</h2>
					<p className="mt-2 text-white/60">See the increased limits you get for supporting us</p>
				</div>

				<div className="flex w-full flex-col items-center gap-8">
					<ComparisonTable features={configLimitFeatures} section="Configuration Limits" />
					<ComparisonTable features={extraFeatures} section="Extras" />
				</div>
			</div>

			<div className="flex w-full max-w-3xl flex-col items-center gap-6">
				<h2 className="font-bold text-2xl md:text-3xl">Frequently Asked Questions</h2>

				<Accordion className="w-full">
					<Accordion.Item id="subscription-expiry">
						<Accordion.Heading>
							<Accordion.Trigger>
								<div className="flex items-center gap-3">
									<Clock className="text-zinc-400" />
									What happens if my subscription runs out?
								</div>
								<Accordion.Indicator />
							</Accordion.Trigger>
						</Accordion.Heading>
						<Accordion.Panel className="text-muted">
							Currently, your server configured with premium limits will retain those settings (even if they exceed free
							limits) and continue to work. This may change in the future, but for now your configuration stays intact.
						</Accordion.Panel>
					</Accordion.Item>

					<Accordion.Item id="limit-increase">
						<Accordion.Heading>
							<Accordion.Trigger>
								<div className="flex items-center gap-3">
									<ArrowsExpand className="text-zinc-400" />
									The premium limits are not enough!
								</div>
								<Accordion.Indicator />
							</Accordion.Trigger>
						</Accordion.Heading>
						<Accordion.Panel className="text-muted">
							You can join the{" "}
							<a
								className="text-white/70 underline decoration-white/30 hover:text-white"
								href={SUPPORT_SERVER_INVITE}
								rel="external noopener noreferrer"
								target="_blank"
							>
								support server
							</a>
							, explain your use case, and mention @almeida or @cmddata to request a bigger limit increase.
						</Accordion.Panel>
					</Accordion.Item>

					<Accordion.Item id="paywalling">
						<Accordion.Heading>
							<Accordion.Trigger>
								<div className="flex items-center gap-3">
									<LockOpen className="text-zinc-400" />
									Will features become paywalled?
								</div>
								<Accordion.Indicator />
							</Accordion.Trigger>
						</Accordion.Heading>
						<Accordion.Panel className="text-muted">
							No. This would go against the philosophy of Lurkr. We created premium tiers because running the bot still
							has costs for us, but all features will always remain free.
						</Accordion.Panel>
					</Accordion.Item>

					<Accordion.Item id="target-audience">
						<Accordion.Heading>
							<Accordion.Trigger>
								<div className="flex items-center gap-3">
									<Person className="text-zinc-400" />
									Who is this for?
								</div>
								<Accordion.Indicator />
							</Accordion.Trigger>
						</Accordion.Heading>
						<Accordion.Panel className="text-muted">
							The Max plan is for users who want to support the development of Lurkr while gaining some benefits
							compared to the free plan. The Ultimate plan is primarily made for larger servers that need higher
							configuration limits.
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</div>
		</div>
	);
}

export const metadata: Metadata = {
	description:
		"Support Lurkr development and get increased configuration limits. All features are free - premium just helps keep Lurkr running.",
	title: "Support Lurkr",
};

async function getData(token: string) {
	const response = await makeApiRequest("/users/@me/premium", token, {
		next: {
			revalidate: 2 * 60, // 2 minutes
		},
	});

	if (!response.ok) {
		return null;
	}

	return response.json() as Promise<CurrentPlanResponse>;
}

interface CurrentPlanResponse {
	plan: PremiumTier;
}
