import { ExternalLink } from "@/components/ExternalLink.tsx";
import { SUPPORT_SERVER_INVITE } from "@/shared-links.js";
import type { Metadata } from "next";
import Link from "next/link";

export default function TermsAndConditions() {
	const lastModified = new Date(2_024, 5, 29).toLocaleDateString("en-GB", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<div className="prose lg:prose-lg prose-blue-400 mx-auto mt-5 px-4 prose-headings:text-white prose-strong:text-white text-white/75 md:px-0">
			<h1>Terms of Service</h1>

			<p>Last modified and effective: {lastModified}</p>

			<main>
				<p>
					Welcome to Lurkr. These Terms of Service ("Terms") govern your use of the Lurkr Discord bot and any associated
					services (collectively, the "Service"). By using Lurkr, you agree to comply with and be bound by these Terms.
					If you do not agree to these Terms, please do not use our Service.
				</p>

				<h2>1. Use of the Service</h2>

				<p>
					<strong>1.1 Eligibility: </strong>
					You must be at least 13 years old to use Lurkr. By using the Service, you represent and warrant that you meet
					this age requirement.
				</p>

				<p>
					<strong>1.2 Compliance: </strong>
					You agree to comply with all applicable laws and regulations when using the Service.
				</p>

				<p>
					<strong>1.3 Account Responsibility: </strong>
					You are responsible for maintaining the confidentiality of any authentication tokens and for all activities
					that occur under your account.
				</p>

				<h2>2. Data Collection and Privacy</h2>

				<p>
					<strong>2.1 Data Collection: </strong>
					Our <Link href="/privacy">Privacy Policy</Link> outlines the data we collect and how we use it. By using the
					Service, you consent to the collection and use of your data as described in our{" "}
					<Link href="/privacy">Privacy Policy</Link>.
				</p>

				<p>
					<strong>2.2 User Data: </strong>
					You acknowledge that we collect certain data related to your use of the Service, including user and server
					data, to provide and improve our services.
				</p>

				<h2>3. Service Availability and Modifications</h2>

				<p>
					<strong>3.1 Availability: </strong>
					We strive to keep the Service available at all times but do not guarantee uninterrupted access.
				</p>

				<p>
					<strong>3.2 Modifications: </strong>
					We reserve the right to modify, suspend, or discontinue the Service at any time without notice. We are not
					liable for any such changes or interruptions.
				</p>

				<h2>4. Prohibited Activities</h2>
				<p>You agree not to engage in any of the following activities:</p>

				<p>
					<strong>4.1 Misuse: </strong>
					Using the Service for any unlawful purpose or in violation of any applicable laws or regulations.
				</p>

				<p>
					<strong>4.2 Disruption: </strong>
					Attempting to disrupt or interfere with the Service or its infrastructure.
				</p>

				<p>
					<strong>4.3 Unauthorized Access: </strong>
					Gaining or attempting to gain unauthorized access to any part of the Service.
				</p>

				<h2>5. Intellectual Property</h2>

				<p>
					<strong>5.1 Ownership: </strong>
					All content, trademarks, and intellectual property related to Lurkr are owned by us or our licensors. You may
					not use any of our intellectual property without our prior written consent.
				</p>

				<p>
					<strong>5.2 User Content: </strong>
					By submitting content through the Service, you grant us a worldwide, non-exclusive, royalty-free license to
					use, reproduce, and distribute such content as necessary to provide the Service.
				</p>

				<h2>6. Termination</h2>

				<p>
					<strong>6.1 Termination by User: </strong>
					You may stop using the Service at any time.
				</p>

				<p>
					<strong>6.2 Termination by Us: </strong>
					We may suspend or terminate your access to the Service at any time for any reason, including if you violate
					these Terms.
				</p>

				<h2>7. Disclaimers and Limitation of Liability</h2>

				<p>
					<strong>7.1 Disclaimers: </strong>
					The Service is provided "as is" and "as available" without warranties of any kind, either express or implied.
				</p>

				<p>
					<strong>7.2 Limitation of Liability: </strong>
					To the fullest extent permitted by law, we are not liable for any indirect, incidental, special,
					consequential, or punitive damages arising from your use of the Service.
				</p>

				<h2>8. Indemnification</h2>
				<p>
					You agree to indemnify and hold us harmless from any claims, damages, liabilities, and expenses arising out of
					your use of the Service or your violation of these Terms.
				</p>

				<h2>9. Changes to These Terms</h2>
				<p>
					We may update these Terms from time to time. We will notify you of any changes by updating the effective date
					of these Terms. Your continued use of the Service after any such changes constitutes your acceptance of the
					new Terms.
				</p>

				<h2>10. Contact Information</h2>
				<p>
					For questions or concerns about these Terms, contact us at <a href="mailto:admin@lurkr.gg">admin@lurkr.gg</a>{" "}
					or via a Direct Message in <ExternalLink href={SUPPORT_SERVER_INVITE}>Discord</ExternalLink>.
				</p>
			</main>
		</div>
	);
}

export const metadata: Metadata = {
	title: "Terms of Service",
	description:
		"See our terms and conditions to learn about the rules and guidelines you must follow when using our services.",
};
