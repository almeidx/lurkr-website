import { configLimitFeatures, extraFeatures, levelingFeatures } from "@/app/premium/features.ts";
import { PremiumPlan } from "@/app/premium/plan.tsx";
import { ComparisonTable } from "@/app/premium/table.tsx";
import logoImg from "@/assets/logo.png";
import lurkrFreeImg from "@/assets/premium-plans/lurkr-free.png";
import lurkrMaxImg from "@/assets/premium-plans/lurkr-max.png";
import lurkrUltimateImg from "@/assets/premium-plans/lurkr-ultimate.png";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function Premium() {
	const token = cookies().get(TOKEN_COOKIE)?.value;
	const currentPlan = token ? await getData(token) : null;

	return (
		<div className="container mx-auto flex flex-col justify-center">
			<div className="mb-6 flex flex-col items-center gap-4 xl:gap-0">
				<div className="flex flex-col items-center gap-4 xl:flex-row">
					<p className="font-bold text-lg text-shadow-regular xl:whitespace-nowrap xl:text-2xl">
						Unlimited Leveling. Limited Investment.
					</p>
					<Image
						alt="Lurkr logo"
						className="hidden aspect-square size-72 xl:block"
						height={288}
						width={288}
						priority
						src={logoImg}
					/>
					<p className="font-bold text-lg text-shadow-regular xl:whitespace-nowrap xl:text-2xl">
						Premium Status. Premium Support.
					</p>
				</div>

				<main className="flex w-full flex-col items-center">
					<div className="flex flex-col gap-4 lg:flex-row lg:gap-10 xl:gap-16">
						<PremiumPlan
							name="Lurkr Max"
							img={lurkrMaxImg}
							price={1}
							perks={[
								"Personal Premium Lurkr for you!",
								"No tips on /level command for you",
								"Patreon role in Lurkr support server",
								"Premium support",
							]}
							funny="Buys you groceries…"
							buttonText="Turn it to Max!"
							tier={1}
							isCurrent={currentPlan?.plan === "Basic"}
						/>

						<PremiumPlan
							name="Lurkr Ultimate"
							img={lurkrUltimateImg}
							price={5}
							perks={[
								"Premium Lurkr for a whole server",
								"Huge increase in configuration limits",
								"Everything from Lurkr Max",
								"Patreon role in Lurkr support server",
								"Premium support",
								"Helps developers maintain Lurkr!",
							]}
							funny="Helps you pay taxes…"
							buttonText="Become Ultimate!"
							tier={2}
							isCurrent={currentPlan?.plan === "Guild"}
						/>

						<PremiumPlan
							name="Lurkr Free"
							img={lurkrFreeImg}
							price={0}
							perks={["Standard configuration limits"]}
							regular={["Tips on /level command", "No role in Lurkr support server", "Standard support"]}
							funny="Kisses you goodnight…"
							buttonText="Stay Free!"
							tier={0}
							isCurrent={currentPlan?.plan === "None"}
						/>
					</div>

					<p className="max-w-prose text-balance text-center text-white/75">
						Purchases are subject to our <Link href="/terms">Terms & Conditions</Link> &{" "}
						<Link href="/privacy">Privacy Policy</Link> and to the{" "}
						<ExternalLink href="https://www.patreon.com/policy/legal">Terms of Service</ExternalLink> and{" "}
						<ExternalLink href="https://support.patreon.com/hc/articles/205032045-Patreon-s-refund-policy">
							Refund Policy
						</ExternalLink>{" "}
						of Patreon, Inc.
					</p>

					<h2 className="mt-8 font-bold text-4xl">Compare Lurkr Plans</h2>

					<div className="mt-6 space-y-6">
						<ComparisonTable section="Leveling" features={levelingFeatures} />
						<ComparisonTable section="Configuration" features={configLimitFeatures} />
						<ComparisonTable section="Extras" features={extraFeatures} />
					</div>
				</main>
			</div>
		</div>
	);
}

export const metadata: Metadata = {
	title: "Premium Plans",
	description:
		"Get the most out of Lurkr with our premium plans. Compare the different plans and choose the one that fits your needs.",
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
	plan: "None" | "Basic" | "Guild";
}
