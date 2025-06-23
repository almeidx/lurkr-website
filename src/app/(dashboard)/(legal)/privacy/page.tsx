import type { Metadata } from "next";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { SUPPORT_SERVER_INVITE } from "@/shared-links.js";

export default function PrivacyPolicy() {
	const lastModified = new Date(2_025, 1, 15).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	const contactDetails = (
		<>
			at <a href="mailto:admin@lurkr.gg">admin@lurkr.gg</a> or via a Direct Message in{" "}
			<ExternalLink href={SUPPORT_SERVER_INVITE}>Discord</ExternalLink>.
		</>
	);

	return (
		<div className="prose lg:prose-lg prose-blue-400 mx-auto mt-5 px-4 prose-headings:text-white prose-strong:text-white text-white/75 md:px-0">
			<h1>Privacy Policy</h1>

			<p>Last modified: {lastModified}</p>

			<main>
				<p>
					Welcome to Lurkr. Lurkr is a Discord bot that provides several features such as leveling, image generation,
					member growth tracking, emoji management, automated member milestones, on join roles, and role mention
					cooldown. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your
					information when you use our services.
				</p>

				<h2>Information Collection</h2>

				<p>We collect the following Discord-related data:</p>

				<ul>
					<li>
						<strong>User:</strong> id, avatar, discriminator, global name, locale, username:
						<ul>
							<li>Primarily used for the web dashboard and leveling leaderboard;</li>
							<li>Automatically collected via the leveling system and web dashboard authentication.</li>
						</ul>
					</li>

					<li>
						<strong>Guild:</strong> id, icon, name, member count, owner id:
						<ul>
							<li>Mainly for displaying user servers on the web dashboard;</li>
							<li>Member count used for the member growth tracking and automated member milestones systems;</li>
							<li>Automatically collected upon adding Lurkr to a server.</li>
						</ul>
					</li>

					<li>
						<strong>Channels and Roles:</strong> id, name, and other public fields:
						<ul>
							<li>For server settings in the web dashboard;</li>
							<li>Automatically collected upon adding Lurkr to a server.</li>
						</ul>
					</li>
				</ul>

				<h2>Additional Data Collected</h2>

				<p>
					When certain Lurkr systems, which are opt-in, are enabled, additional data may be collected. This data is used
					to provide the functionality of the system. The systems and the data they collect are as follows:
				</p>

				<ul>
					<li>
						<strong>Leveling System:</strong> (disabled by default)
						<ul>
							<li>Total messages contributing to user experience in leveling-enabled channels;</li>
							<li>Daily log of the amount of messages contributing to the user's level.</li>
						</ul>
					</li>

					<li>
						<strong>Automated Member Milestones System:</strong> (disabled by default)
						<ul>
							<li>User id and member count upon hitting milestones.</li>
						</ul>
					</li>

					<li>
						<strong>Member Growth Feature:</strong> (disabled by default)
						<ul>
							<li>Daily member count at 0:00 UTC for growth tracking.</li>
						</ul>
					</li>

					<li>
						<strong>Role Mention Cooldown System:</strong> (disabled by default)
						<ul>
							<li>Temporary storage of role and user ids for mentioned roles.</li>
						</ul>
					</li>
				</ul>

				<p>
					We also store several bot-related settings that control the behavior of Lurkr, together with the Guild data.
				</p>

				<h2>Use of Information</h2>

				<p>The information we collect is used to:</p>

				<ul>
					<li>Provide and improve bot functionality;</li>

					<li>
						Improving user experience through features such as the web dashboard, leaderboards, graphs, and automated
						systems.
					</li>
				</ul>

				<h2>Data Sharing and Disclosure</h2>

				<p>We do not share your data with third parties except as required by law.</p>

				<h2>Data Security</h2>

				<p>We implement industry-standard security measures to protect your data from unauthorized access and use.</p>

				<h2>User Control</h2>

				<p>
					Server admins can delete all stored data (including levels, logs, milestones, daily member counts) via a
					command or the web dashboard. They can also reset bot-related settings to their default values.
				</p>

				<p>
					Individual users can request their data deletion or address questions or concerns by contacting us{" "}
					{contactDetails}
				</p>

				<h2>Data Retention</h2>

				<p>
					Data is stored as long as the bot is in the server. If the bot is removed, associated data is retained for 30
					days in case the server admins decide to re-invite it. After this period, all data is deleted.
				</p>

				<h2>Cookies</h2>

				<p>
					We use functional cookies to provide the web dashboard, namely for authentication purposes. Our third-party
					DNS provider, Cloudflare, may also use cookies to provide their service. For more information, please refer to
					the <ExternalLink href="https://www.cloudflare.com/cookie-policy/">Cloudflare Cookie Policy</ExternalLink>.
				</p>

				<h2>Third-Party Services</h2>

				<p>We make use of the following third-party systems:</p>

				<ul>
					<li>
						<strong>Cloudflare:</strong> DNS provider and web security.{" "}
						<ExternalLink href="https://www.cloudflare.com/privacypolicy/">Cloudflare Privacy Policy</ExternalLink>
					</li>

					<li>
						<strong>Cloudflare Web Analytics:</strong> Web analytics.{" "}
						<ExternalLink href="https://www.cloudflare.com/privacypolicy/">Cloudflare Privacy Policy</ExternalLink>
					</li>

					<li>
						<strong>Vercel:</strong> Web dashboard hosting.{" "}
						<ExternalLink href="https://vercel.com/legal/privacy-policy">Vercel Privacy Policy</ExternalLink>
					</li>
				</ul>

				<h2>Changes to this Policy</h2>

				<p>
					We may update this Privacy Policy from time to time. We will notify you of any changes by updating the
					effective date of this policy.
				</p>

				<h2>Contact Information</h2>

				<p>For questions or concerns about this Privacy Policy, contact us {contactDetails}</p>
			</main>
		</div>
	);
}

export const metadata: Metadata = {
	description:
		"See our privacy policy to learn how we collect, use, and protect your information when you use our services.",
	title: "Privacy Policy",
};
