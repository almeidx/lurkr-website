import Head from "next/head";
import Link from "next/link";

export default function Privacy() {
	return (
		<div className="flex w-full flex-col items-center bg-discord-dark">
			<Head>
				<title>Privacy Policy | Pepe Manager</title>
			</Head>

			<header className="flex flex-col items-center justify-center pt-3 sm:pt-1">
				<h1 className="font-display text-2xl font-bold text-white sm:text-4xl">Privacy Policy</h1>
				<span className="mt-3 text-gray-400">Last updated and effective: June 20, 2021.</span>
			</header>

			<main className="max-w-4xl">
				<p className="mx-3 mt-6 font-light text-gray-400 sm:mx-0">
					This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your
					information when You use the Service and tells You about Your privacy rights and how the law protects You.
				</p>
				<p className="mx-3 mt-6 mb-9 font-light text-gray-400 sm:mx-0">
					If you choose to use our Service, then you agree to the collection and use of information in relation to this
					policy. The Personal Information that we collect is used for providing and improving the Service. We will not
					use or share your information with anyone except as described in this Privacy Policy.
				</p>

				<Link
					className="mx-3 text-xl font-bold uppercase text-gray-200 sm:mx-0 sm:text-3xl"
					href="#information-collection-and-use"
					id="information-collection-and-use"
				>
					Information Collection and Use
				</Link>

				<p className="mx-3 mt-6 mb-9 font-light text-gray-400 sm:mx-0">
					For a better experience, while using our Service, we may require you to provide us with certain personally
					identifiable information, including but not limited to Discord ID. The information that we request will be
					retained by us and used as described in this privacy policy.
				</p>

				<Link
					className="mx-3 text-xl font-bold uppercase text-gray-200 sm:mx-0 sm:text-3xl"
					href="#log-data"
					id="log-data"
				>
					Log Data
				</Link>

				<p className="mx-3 mt-6 mb-9 font-light text-gray-400 sm:mx-0">
					We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and
					information (through third party products) on your phone called Log Data. This Log Data may include
					information such as your device Internet Protocol (&quot;IP&quot;) address, device name, operating system
					version, the configuration of the app when utilizing our Service, the time and date of your use of the
					Service, and other statistics.
				</p>

				<Link
					className="mx-3 text-xl font-bold uppercase text-gray-200 sm:mx-0 sm:text-3xl"
					href="#cookies"
					id="cookies"
				>
					Cookies
				</Link>

				<p className="mx-3 mt-6 font-light text-gray-400 sm:mx-0">
					Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These
					are sent to your browser from the websites that you visit and are stored on your device&apos;s internal
					memory.
				</p>
				<p className="mx-3 mt-3 mb-9 font-light text-gray-400 sm:mx-0">
					This Service does not use these &quot;cookies&quot; explicitly. However, the app may use third party code and
					libraries that use &quot;cookies&quot; to collect information and improve their services. You have the option
					to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to
					refuse our cookies, you may not be able to use some portions of this Service.
				</p>

				<Link
					className="mx-3 text-xl font-bold uppercase text-gray-200 sm:mx-0 sm:text-3xl"
					href="#security"
					id="security"
				>
					Security
				</Link>

				<p className="mx-3 mt-3 mb-9 font-light text-gray-400 sm:mx-0">
					We value your trust in providing us your Personal Information, thus we are striving to use commercially
					acceptable means of protecting it. But remember that no method of transmission over the internet, or method of
					electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
				</p>

				<Link
					className="mx-3 text-xl font-bold uppercase text-gray-200 sm:mx-0 sm:text-3xl"
					href="#links-to-other-sites"
					id="links-to-other-sites"
				>
					Links to Other Sites
				</Link>

				<p className="mx-3 mt-3 mb-9 font-light text-gray-400 sm:mx-0">
					This Service may contain links to other sites. If you click on a third-party link, you will be directed to
					that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review
					the Privacy Policy of these websites. We have no control over and assume no responsibility for the content,
					privacy policies, or practices of any third-party sites or services.
				</p>

				<Link
					className="mx-3 text-xl font-bold uppercase text-gray-200 sm:mx-0 sm:text-3xl"
					href="#children-privacy"
					id="children-privacy"
				>
					Children&apos;s Privacy
				</Link>

				<p className="mx-3 mt-3 mb-9 font-light text-gray-400 sm:mx-0">
					These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable
					information from children under 13 years of age. In the case we discover that a child under 13 has provided us
					with personal information, we immediately delete this from our servers. If you are a parent or guardian and
					you are aware that your child has provided us with personal information, please contact us so that we will be
					able to do necessary actions.
				</p>

				<Link
					className="mx-3 text-xl font-bold uppercase text-gray-200 sm:mx-0 sm:text-3xl"
					href="#changes"
					id="changes"
				>
					Changes to This Privacy Policy
				</Link>

				<p className="mx-3 mt-3 mb-9 font-light text-gray-400 sm:mx-0">
					We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for
					any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
				</p>

				<Link
					className="mx-3 text-xl font-bold uppercase text-gray-200 sm:mx-0 sm:text-3xl"
					href="#contact"
					id="contact"
				>
					Contact Us
				</Link>

				<p className="mx-3 mt-3 mb-9 font-light text-gray-400 sm:mx-0">
					If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at{" "}
					<a className="text-blue-300" href="mailto:admin@almeidx.dev">
						admin@almeidx.dev
					</a>
					.
				</p>
			</main>
		</div>
	);
}
