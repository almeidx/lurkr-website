import { Link as HeroLink } from "@heroui/react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { configLimitFeatures, extraFeatures, levelingFeatures } from "@/app/premium/features.ts";
import { PremiumPlan } from "@/app/premium/plan.tsx";
import { ComparisonTable } from "@/app/premium/table.tsx";
import logoImg from "@/assets/logo.webp";
import lurkrFreeImg from "@/assets/premium-plans/lurkr-free.webp";
import lurkrMaxImg from "@/assets/premium-plans/lurkr-max.webp";
import lurkrUltimateImg from "@/assets/premium-plans/lurkr-ultimate.webp";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";

export default async function Premium() {
	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	const currentPlan = token ? await getData(token) : null;

	return (
		<div className="container mx-auto flex flex-col items-center px-4 py-8">
			{/* Hero Section */}
			<div className="mb-12 flex flex-col items-center gap-6 text-center">
				<Image alt="Lurkr logo" className="size-32 md:size-40" height={160} priority src={logoImg} width={160} />
				<div className="space-y-2">
					<h1 className="font-bold text-3xl text-shadow-regular md:text-4xl lg:text-5xl">
						Upgrade Your Lurkr Experience
					</h1>
					<p className="max-w-2xl text-lg text-white/60">
						Unlimited Leveling. Premium Support. Choose the plan that fits your needs.
					</p>
				</div>
			</div>

			{/* Pricing Cards */}
			<div className="mb-12 grid w-full max-w-5xl grid-cols-1 items-end gap-6 lg:grid-cols-3 lg:gap-8">
				<PremiumPlan
					buttonText="Stay Free"
					funny="Buys you groceries…"
					img={lurkrFreeImg}
					isCurrent={currentPlan?.plan === "None"}
					name="Lurkr Free"
					perks={["Standard configuration limits", "Access to all core features", "Community support"]}
					price={0}
					tier={0}
				/>

				<PremiumPlan
					buttonText="Become Ultimate"
					funny="Helps you pay taxes…"
					img={lurkrUltimateImg}
					isCurrent={currentPlan?.plan === "Guild"}
					isPopular
					name="Lurkr Ultimate"
					perks={[
						"Premium Lurkr for a whole server",
						"Huge increase in configuration limits",
						"Everything from Lurkr Max",
						"Patreon role in support server",
						"Premium support",
						"Help maintain Lurkr!",
					]}
					price={5}
					tier={2}
				/>

				<PremiumPlan
					buttonText="Get Max"
					funny="Kisses you goodnight…"
					img={lurkrMaxImg}
					isCurrent={currentPlan?.plan === "Basic"}
					name="Lurkr Max"
					perks={[
						"Personal Premium Lurkr",
						"No tips on /level command",
						"Patreon role in support server",
						"Premium support",
					]}
					price={1}
					tier={1}
				/>
			</div>

			{/* Legal Notice */}
			<p className="mb-16 max-w-prose text-balance text-center text-sm text-white/50">
				Purchases are subject to our{" "}
				<Link className="underline hover:text-white/70" href="/terms">
					Terms of Service
				</Link>{" "}
				&{" "}
				<Link className="underline hover:text-white/70" href="/privacy">
					Privacy Policy
				</Link>{" "}
				and to the{" "}
				<HeroLink
					className="underline hover:text-white/70"
					href="https://www.patreon.com/policy/legal"
					rel="external noopener noreferrer"
					target="_blank"
				>
					Terms of Service
				</HeroLink>{" "}
				and{" "}
				<HeroLink
					className="underline hover:text-white/70"
					href="https://support.patreon.com/hc/articles/205032045-Patreon-s-refund-policy"
					rel="external noopener noreferrer"
					target="_blank"
				>
					Refund Policy
				</HeroLink>{" "}
				of Patreon, Inc.
			</p>

			{/* Comparison Section */}
			<div className="flex w-full flex-col items-center gap-8">
				<div className="text-center">
					<h2 className="font-bold text-2xl md:text-3xl">Compare Plans</h2>
					<p className="mt-2 text-white/60">See what's included in each plan</p>
				</div>

				<div className="flex w-full flex-col items-center gap-8">
					<ComparisonTable features={levelingFeatures} section="Leveling" />
					<ComparisonTable features={configLimitFeatures} section="Configuration Limits" />
					<ComparisonTable features={extraFeatures} section="Extras" />
				</div>
			</div>
		</div>
	);
}

export const metadata: Metadata = {
	description:
		"Get the most out of Lurkr with our premium plans. Compare the different plans and choose the one that fits your needs.",
	title: "Premium Plans",
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
