import type { Metadata } from "next";

export default function PrivacyPolicy() {
	const lastModified = new Date(2_021, 5, 20).toLocaleString("en-GB", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-2xl font-bold">Privacy Policy</h1>

			<p className="mb-5 tracking-tighter text-white/75">Last modified: {lastModified}</p>

			<main className="mb-8 flex max-w-7xl flex-col gap-5 px-4">
				<p className="text-white/75">
					This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your
					information when You use the Service and tells You about Your privacy rights and how the law protects You.
				</p>

				<p className="text-white/75">
					If you choose to use our Service, then you agree to the collection and use of information in relation to this
					policy. The Personal Information that we collect is used for providing and improving the Service. We will not
					use or share your information with anyone except as described in this Privacy Policy.
				</p>

				<a href="#information-collection" id="information-collection" className="mt-5 text-2xl font-semibold">
					Information Collection and Use
				</a>

				<p className="text-white/75">
					For a better experience, while using our Service, we may require you to provide us with certain personally
					identifiable information, including but not limited to Discord ID. The information that we request will be
					retained by us and used as described in this privacy policy.
				</p>

				<a href="#log-data" id="log-data" className="mt-5 text-2xl font-semibold">
					Log Data
				</a>

				<p className="text-white/75">
					We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and
					information (through third party products) on your phone called Log Data. This Log Data may include
					information such as your device Internet Protocol (&quot;IP&quot;) address, device name, operating system
					version, the configuration of the app when utilizing our Service, the time and date of your use of the
					Service, and other statistics.
				</p>

				<a href="#cookies" id="cookies" className="mt-5 text-2xl font-semibold">
					Cookies
				</a>

				<p className="text-white/75">
					Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These
					are sent to your browser from the websites that you visit and are stored on your device&apos;s internal
					memory.
				</p>
				<p className="text-white/75">
					This Service does not use these &quot;cookies&quot; explicitly. However, the app may use third party code and
					libraries that use &quot;cookies&quot; to collect information and improve their services. You have the option
					to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to
					refuse our cookies, you may not be able to use some portions of this Service.
				</p>

				<a href="#security" id="security" className="mt-5 text-2xl font-semibold">
					Security
				</a>

				<p className="text-white/75">
					We value your trust in providing us your Personal Information, thus we are striving to use commercially
					acceptable means of protecting it. But remember that no method of transmission over the internet, or method of
					electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
				</p>

				<a href="#links" id="links" className="mt-5 text-2xl font-semibold">
					Links to Other Sites
				</a>

				<p className="text-white/75">
					This Service may contain links to other sites. If you click on a third-party link, you will be directed to
					that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review
					the Privacy Policy of these websites. We have no control over and assume no responsibility for the content,
					privacy policies, or practices of any third-party sites or services.
				</p>

				<a href="#children-privacy" id="children-privacy" className="mt-5 text-2xl font-semibold">
					Children&apos;s Privacy
				</a>

				<p className="text-white/75">
					These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable
					information from children under 13 years of age. In the case we discover that a child under 13 has provided us
					with personal information, we immediately delete this from our servers. If you are a parent or guardian and
					you are aware that your child has provided us with personal information, please contact us so that we will be
					able to do necessary actions.
				</p>

				<a href="#changes" id="changes" className="mt-5 text-2xl font-semibold">
					Changes to This Privacy Policy
				</a>

				<p className="text-white/75">
					We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for
					any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
				</p>

				<a href="#contact-us" id="contact-us" className="mt-5 text-2xl font-semibold">
					Contact Us
				</a>

				<p className="text-white/75">
					If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at{" "}
					<a className="text-blue-300" href="mailto:admin@lurkr.gg">
						admin@lurkr.gg
					</a>
					.
				</p>
			</main>
		</div>
	);
}

export const metadata: Metadata = {
	title: "Privacy Policy • Lurkr",
};
