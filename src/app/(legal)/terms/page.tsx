import { ExternalLink } from "@/components/ExternalLink.tsx";
import { SUPPORT_SERVER_INVITE } from "@/shared-links.mjs";
import type { Metadata } from "next";
import Link from "next/link";
import type { PropsWithChildren } from "react";

export default function TermsAndConditions() {
	const lastModified = new Date(2_024, 5, 29).toLocaleDateString("en-GB", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<div className="container mx-auto mt-5 flex flex-col items-center">
			<h1 className="font-bold text-2xl">Terms of Service</h1>

			<p className="mb-5 text-white/75 tracking-tighter">Last modified and effective: {lastModified}</p>

			<main className="mb-8 flex max-w-4xl flex-col gap-5 px-4 text-white/75">
				<p>
					Welcome to Lurkr. These Terms of Service ("Terms") govern your use of the Lurkr Discord bot and any associated
					services (collectively, the "Service"). By using Lurkr, you agree to comply with and be bound by these Terms.
					If you do not agree to these Terms, please do not use our Service.
				</p>

				<SectionHeading>1. Use of the Service</SectionHeading>

				<p>
					<BoldSubHeader>1.1 Eligibility: </BoldSubHeader>
					You must be at least 13 years old to use Lurkr. By using the Service, you represent and warrant that you meet
					this age requirement.
				</p>

				<p>
					<BoldSubHeader>1.2 Compliance: </BoldSubHeader>
					You agree to comply with all applicable laws and regulations when using the Service.
				</p>

				<p>
					<BoldSubHeader>1.3 Account Responsibility: </BoldSubHeader>
					You are responsible for maintaining the confidentiality of any authentication tokens and for all activities
					that occur under your account.
				</p>

				<SectionHeading>2. Data Collection and Privacy</SectionHeading>

				<p>
					<BoldSubHeader>2.1 Data Collection: </BoldSubHeader>
					Our{" "}
					<Link className="text-blue-400 hover:text-blue-600" href="/privacy">
						Privacy Policy
					</Link>{" "}
					outlines the data we collect and how we use it. By using the Service, you consent to the collection and use of
					your data as described in our{" "}
					<Link className="text-blue-400 hover:text-blue-600" href="/privacy">
						Privacy Policy
					</Link>
					.
				</p>

				<p>
					<BoldSubHeader>2.2 User Data: </BoldSubHeader>
					You acknowledge that we collect certain data related to your use of the Service, including user and server
					data, to provide and improve our services.
				</p>

				<SectionHeading>3. Service Availability and Modifications</SectionHeading>

				<p>
					<BoldSubHeader>3.1 Availability: </BoldSubHeader>
					We strive to keep the Service available at all times but do not guarantee uninterrupted access.
				</p>

				<p>
					<BoldSubHeader>3.2 Modifications: </BoldSubHeader>
					We reserve the right to modify, suspend, or discontinue the Service at any time without notice. We are not
					liable for any such changes or interruptions.
				</p>

				<SectionHeading>4. Prohibited Activities</SectionHeading>
				<p>You agree not to engage in any of the following activities:</p>

				<p>
					<BoldSubHeader>4.1 Misuse: </BoldSubHeader>
					Using the Service for any unlawful purpose or in violation of any applicable laws or regulations.
				</p>

				<p>
					<BoldSubHeader>4.2 Disruption: </BoldSubHeader>
					Attempting to disrupt or interfere with the Service or its infrastructure.
				</p>

				<p>
					<BoldSubHeader>4.3 Unauthorized Access: </BoldSubHeader>
					Gaining or attempting to gain unauthorized access to any part of the Service.
				</p>

				<SectionHeading>5. Intellectual Property</SectionHeading>

				<p>
					<BoldSubHeader>5.1 Ownership: </BoldSubHeader>
					All content, trademarks, and intellectual property related to Lurkr are owned by us or our licensors. You may
					not use any of our intellectual property without our prior written consent.
				</p>

				<p>
					<BoldSubHeader>5.2 User Content: </BoldSubHeader>
					By submitting content through the Service, you grant us a worldwide, non-exclusive, royalty-free license to
					use, reproduce, and distribute such content as necessary to provide the Service.
				</p>

				<SectionHeading>6. Termination</SectionHeading>

				<p>
					<BoldSubHeader>6.1 Termination by User: </BoldSubHeader>
					You may stop using the Service at any time.
				</p>

				<p>
					<BoldSubHeader>6.2 Termination by Us: </BoldSubHeader>
					We may suspend or terminate your access to the Service at any time for any reason, including if you violate
					these Terms.
				</p>

				<SectionHeading>7. Disclaimers and Limitation of Liability</SectionHeading>

				<p>
					<BoldSubHeader>7.1 Disclaimers: </BoldSubHeader>
					The Service is provided "as is" and "as available" without warranties of any kind, either express or implied.
				</p>

				<p>
					<BoldSubHeader>7.2 Limitation of Liability: </BoldSubHeader>
					To the fullest extent permitted by law, we are not liable for any indirect, incidental, special,
					consequential, or punitive damages arising from your use of the Service.
				</p>

				<SectionHeading>8. Indemnification</SectionHeading>
				<p>
					You agree to indemnify and hold us harmless from any claims, damages, liabilities, and expenses arising out of
					your use of the Service or your violation of these Terms.
				</p>

				<SectionHeading>9. Changes to These Terms</SectionHeading>
				<p>
					We may update these Terms from time to time. We will notify you of any changes by updating the effective date
					of these Terms. Your continued use of the Service after any such changes constitutes your acceptance of the
					new Terms.
				</p>

				<SectionHeading>10. Contact Information</SectionHeading>
				<p>
					For questions or concerns about these Terms, contact us at{" "}
					<a className="text-blue-400 hover:text-blue-600" href="mailto:admin@lurkr.gg">
						admin@lurkr.gg
					</a>{" "}
					or via a Direct Message in{" "}
					<ExternalLink className="text-blue-400 hover:text-blue-600" href={SUPPORT_SERVER_INVITE}>
						Discord
					</ExternalLink>
					.
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

function SectionHeading({ children }: PropsWithChildren) {
	return <h2 className="mt-5 font-semibold text-2xl text-white">{children}</h2>;
}

function BoldSubHeader({ children }: PropsWithChildren) {
	return <span className="font-semibold text-white">{children}</span>;
}
