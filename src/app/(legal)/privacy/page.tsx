import { ExternalLink } from "@/components/ExternalLink.tsx";
import { SUPPORT_SERVER_INVITE } from "@/shared-links.mjs";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export default function PrivacyPolicy() {
	const lastModified = new Date(2_024, 5, 29).toLocaleDateString("en-GB", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const contactDetails = (
		<>
			at{" "}
			<a className="text-blue-400 hover:text-blue-600" href="mailto:admin@lurkr.gg">
				admin@lurkr.gg
			</a>{" "}
			or via a Direct Message in{" "}
			<ExternalLink className="text-blue-400 hover:text-blue-600" href={SUPPORT_SERVER_INVITE}>
				Discord
			</ExternalLink>
			.
		</>
	);

	return (
		<div className="container mx-auto mt-5 flex flex-col items-center">
			<h1 className="font-bold text-2xl">Privacy Policy</h1>

			<p className="mb-5 text-white/75 tracking-tighter">Last modified: {lastModified}</p>

			<main className="mb-8 flex max-w-4xl flex-col gap-5 px-4 text-white/75">
				<p>
					Welcome to Lurkr. Lurkr is a Discord bot that provides several features such as leveling, image generation,
					member growth tracking, emoji management, automated member milestones, on join roles, and role mention
					cooldown. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your
					information when you use our services.
				</p>

				<SectionHeading>Information Collection</SectionHeading>

				<p>We collect the following Discord-related data:</p>

				<UnorderedList>
					<li className="space-y-2">
						<span className="font-bold">User:</span> id, avatar, discriminator, global name, locale, username:
						<UnorderedList>
							<li>Primarily used for the web dashboard and leveling leaderboard;</li>
							<li>Automatically collected via the leveling system and web dashboard authentication.</li>
						</UnorderedList>
					</li>

					<li className="space-y-2">
						<span className="font-bold">Guild:</span> id, icon, name, member count, owner id:
						<UnorderedList>
							<li>Mainly for displaying user servers on the web dashboard;</li>
							<li>Member count used for the member growth tracking and automated member milestones systems;</li>
							<li>Automatically collected upon adding Lurkr to a server.</li>
						</UnorderedList>
					</li>

					<li className="space-y-2">
						<span className="font-bold">Channels and Roles:</span> id, name, and other public fields:
						<UnorderedList>
							<li>For server settings in the web dashboard;</li>
							<li>Automatically collected upon adding Lurkr to a server.</li>
						</UnorderedList>
					</li>
				</UnorderedList>

				<SectionHeading>Additional Data Collected</SectionHeading>

				<p>
					When certain Lurkr systems, which are opt-in, are enabled, additional data may be collected. This data is used
					to provide the functionality of the system. The systems and the data they collect are as follows:
				</p>

				<UnorderedList>
					<li className="space-y-2">
						<span className="font-bold">Leveling System:</span> (disabled by default)
						<UnorderedList>
							<li>Total messages contributing to user experience in leveling-enabled channels;</li>
							<li>Daily log of the amount of messages contributing to the user's level.</li>
						</UnorderedList>
					</li>

					<li className="space-y-2">
						<span className="font-bold">Automated Member Milestones System:</span> (disabled by default)
						<UnorderedList>
							<li>User id and member count upon hitting milestones.</li>
						</UnorderedList>
					</li>

					<li className="space-y-2">
						<span className="font-bold">Member Growth Feature:</span> (disabled by default)
						<UnorderedList>
							<li>Daily member count at 0:00 UTC for growth tracking.</li>
						</UnorderedList>
					</li>

					<li className="space-y-2">
						<span className="font-bold">Role Mention Cooldown System:</span> (disabled by default)
						<UnorderedList>
							<li>Temporary storage of role and user ids for mentioned roles.</li>
						</UnorderedList>
					</li>
				</UnorderedList>

				<p>
					We also store several bot-related settings that control the behavior of Lurkr, together with the Guild data.
				</p>

				<SectionHeading>Use of Information</SectionHeading>

				<p>The information we collect is used to:</p>

				<UnorderedList>
					<li>Provide and improve bot functionality;</li>

					<li>
						Improving user experience through features such as the web dashboard, leaderboards, graphs, and automated
						systems.
					</li>
				</UnorderedList>

				<SectionHeading>Data Sharing and Disclosure</SectionHeading>

				<p>We do not share your data with third parties except as required by law.</p>

				<SectionHeading>Data Security</SectionHeading>

				<p>We implement industry-standard security measures to protect your data from unauthorized access and use.</p>

				<SectionHeading>User Control</SectionHeading>

				<p>
					Server admins can delete all stored data (including levels, logs, milestones, daily member counts) via a
					command or the web dashboard. They can also reset bot-related settings to their default values.
				</p>

				<p>
					Individual users can request their data deletion or address questions or concerns by contacting us{" "}
					{contactDetails}
				</p>

				<SectionHeading>Data Retention</SectionHeading>

				<p>
					Data is stored as long as the bot is in the server. If the bot is removed, associated data is retained for 30
					days in case the server admins decide to re-invite it. After this period, all data is deleted.
				</p>

				<SectionHeading>Cookies</SectionHeading>

				<p>
					We use functional cookies to provide the web dashboard, namely for authentication purposes. Our third-party
					DNS provider, Cloudflare, may also use cookies to provide their service. For more information, please refer to
					the{" "}
					<ExternalLink className="text-blue-400 hover:text-blue-600" href="https://www.cloudflare.com/cookie-policy/">
						Cloudflare Cookie Policy
					</ExternalLink>
					.
				</p>

				<SectionHeading>Third-Party Services</SectionHeading>

				<p>We make use of the following third-party systems:</p>

				<UnorderedList>
					<li>
						<span className="font-bold">Cloudflare:</span> DNS provider and web security.{" "}
						<ExternalLink
							className="text-blue-400 hover:text-blue-600"
							href="https://www.cloudflare.com/privacypolicy/"
						>
							Cloudflare Privacy Policy
						</ExternalLink>
					</li>

					<li>
						<span className="font-bold">Cloudflare Web Analytics:</span> Web analytics.{" "}
						<ExternalLink
							className="text-blue-400 hover:text-blue-600"
							href="https://www.cloudflare.com/privacypolicy/"
						>
							Cloudflare Privacy Policy
						</ExternalLink>
					</li>

					<li>
						<span className="font-bold">Vercel:</span> Web dashboard hosting.{" "}
						<ExternalLink className="text-blue-400 hover:text-blue-600" href="https://vercel.com/legal/privacy-policy">
							Vercel Privacy Policy
						</ExternalLink>
					</li>

					<li>
						<span className="font-bold">Google Tag Manager:</span> Managing website tags.{" "}
						<ExternalLink className="text-blue-400 hover:text-blue-600" href="https://policies.google.com/privacy">
							Google Privacy Policy
						</ExternalLink>
					</li>
				</UnorderedList>

				<SectionHeading>Changes to this Policy</SectionHeading>

				<p>
					We may update this Privacy Policy from time to time. We will notify you of any changes by updating the
					effective date of this policy.
				</p>

				<SectionHeading>Contact Information</SectionHeading>

				<p>For questions or concerns about this Privacy Policy, contact us {contactDetails}</p>
			</main>
		</div>
	);
}

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"See our privacy policy to learn how we collect, use, and protect your information when you use our services.",
};

function SectionHeading({ children }: PropsWithChildren) {
	return <h2 className="mt-5 font-semibold text-2xl text-white">{children}</h2>;
}

function UnorderedList({ children }: PropsWithChildren) {
	return <ul className="ml-6 list-disc space-y-4">{children}</ul>;
}
