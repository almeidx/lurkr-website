import type { Metadata } from "next";

export default function TermsAndConditions() {
	const lastModified = new Date(2_021, 5, 20).toLocaleString("en-GB", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<div className="container mx-auto mt-5 flex flex-col items-center">
			<h1 className="font-bold text-2xl">Terms and Conditions</h1>

			<p className="mb-5 text-white/75 tracking-tighter">Last modified: {lastModified}</p>

			<main className="mb-8 flex max-w-7xl flex-col gap-5 px-4">
				<p className="text-white/75">
					These terms and conditions ("Agreement") set forth the general terms and conditions of your use of the
					lurkr.gg website ("Website" or "Service") and any of its related products and services (collectively,
					"Services"). This Agreement is legally binding between you ("User", "you" or "your") and this Website operator
					("Operator", "we", "us" or "our"). By accessing and using the Website and Services, you acknowledge that you
					have read, understood, and agree to be bound by the terms of this Agreement. If you are entering into this
					Agreement on behalf of a business or other legal entity, you represent that you have the authority to bind
					such entity to this Agreement, in which case the terms "User", "you" or "your" shall refer to such entity. If
					you do not have such authority, or if you do not agree with the terms of this Agreement, you must not accept
					this Agreement and may not access and use the Website and Services. You acknowledge that this Agreement is a
					contract between you and the Operator, even though it is electronic and is not physically signed by you, and
					it governs your use of the Website and Services.
				</p>

				<a href="#age-requirement" id="age-requirement" className="mt-5 font-semibold text-2xl">
					Age Requirement
				</a>

				<p className="text-white/75">
					You must be at least 13 years of age to use the Website and Services. By using the Website and Services and by
					agreeing to this Agreement you warrant and represent that you are at least 13 years of age.
				</p>

				<a href="#other-resources" id="other-resources" className="mt-5 font-semibold text-2xl">
					Links to other resources
				</a>

				<p className="text-white/75">
					Although the Website and Services may link to other resources (such as websites, mobile applications, etc.),
					we are not, directly or indirectly, implying any approval, association, sponsorship, endorsement, or
					affiliation with any linked resource, unless specifically stated herein. We are not responsible for examining
					or evaluating, and we do not warrant the offerings of, any businesses or individuals or the content of their
					resources. We do not assume any responsibility or liability for the actions, products, services, and content
					of any other third parties. You should carefully review the legal statements and other conditions of use of
					any resource which you access through a link on the Website and Services. Your linking to any other off-site
					resources is at your own risk.
				</p>

				<a href="#prohibited-uses" id="prohibited-uses" className="mt-5 font-semibold text-2xl">
					Prohibited uses
				</a>

				<p className="text-white/75">
					In addition to other terms as set forth in the Agreement, you are prohibited from using the Website and
					Services or Content: (a) for any unlawful purpose; (b) to solicit others to perform or participate in any
					unlawful acts; (c) to violate any international, federal, provincial or state regulations, rules, laws, or
					local ordinances; (d) to infringe upon or violate our intellectual property rights or the intellectual
					property rights of others; (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or
					discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or
					disability; (f) to submit false or misleading information; (g) to upload or transmit viruses or any other type
					of malicious code that will or may be used in any way that will affect the functionality or operation of the
					Website and Services, third party products and services, or the Internet; (h) to spam, phish, pharm, pretext,
					spider, crawl, or scrape; (i) for any obscene or immoral purpose; or (j) to interfere with or circumvent the
					security features of the Website and Services, third party products and services, or the Internet. We reserve
					the right to terminate your use of the Website and Services for violating any of the prohibited uses.
				</p>

				<a href="#property-rights" id="property-rights" className="mt-5 font-semibold text-2xl">
					Intellectual property rights
				</a>

				<p className="text-white/75">
					&quot;Intellectual Property Rights&quot; means all present and future rights conferred by statute, common law
					or equity in or in relation to any copyright and related rights, trademarks, designs, patents, inventions,
					goodwill and the right to sue for passing off, rights to inventions, rights to use, and all other intellectual
					property rights, in each case whether registered or unregistered and including all applications and rights to
					apply for and be granted, rights to claim priority from, such rights and all similar or equivalent rights or
					forms of protection and any other results of intellectual activity which subsist or will subsist now or in the
					future in any part of the world. This Agreement does not transfer to you any intellectual property owned by
					the Operator or third parties, and all rights, titles, and interests in and to such property will remain (as
					between the parties) solely with the Operator. All trademarks, service marks, graphics and logos used in
					connection with the Website and Services, are trademarks or registered trademarks of the Operator or its
					licensors. Other trademarks, service marks, graphics and logos used in connection with the Website and
					Services may be the trademarks of other third parties. Your use of the Website and Services grants you no
					right or license to reproduce or otherwise use any of the Operator or third party trademarks.
				</p>

				<a href="#severability" id="severability" className="mt-5 font-semibold text-2xl">
					Severability
				</a>

				<p className="text-white/75">
					All rights and restrictions contained in this Agreement may be exercised and shall be applicable and binding
					only to the extent that they do not violate any applicable laws and are intended to be limited to the extent
					necessary so that they will not render this Agreement illegal, invalid or unenforceable. If any provision or
					portion of any provision of this Agreement shall be held to be illegal, invalid or unenforceable by a court of
					competent jurisdiction, it is the intention of the parties that the remaining provisions or portions thereof
					shall constitute their agreement with respect to the subject matter hereof, and all such remaining provisions
					or portions thereof shall remain in full force and effect.
				</p>

				<a href="#changes-and-amendments" id="changes-and-amendments" className="mt-5 font-semibold text-2xl">
					Changes and amendments
				</a>

				<p className="text-white/75">
					We reserve the right to modify this Agreement or its terms relating to the Website and Services at any time,
					effective upon posting of an updated version of this Agreement on the Website. When we do, we will revise the
					updated date at the bottom of this page. Continued use of the Website and Services after any such changes
					shall constitute your consent to such changes.
				</p>

				<a href="#acceptance" id="acceptance" className="mt-5 font-semibold text-2xl">
					Acceptance of these terms
				</a>

				<p className="text-white/75">
					You acknowledge that you have read this Agreement and agree to all its terms and conditions. By accessing and
					using the Website and Services you agree to be bound by this Agreement. If you do not agree to abide by the
					terms of this Agreement, you are not authorized to access or use the Website and Services.
				</p>

				<a href="#contact-us" id="contact-us" className="mt-5 font-semibold text-2xl">
					Contacting us
				</a>

				<p className="text-white/75">
					If you would like to contact us to understand more about this Agreement or wish to contact us concerning any
					matter relating to it, you may send an email to{" "}
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
	title: "Terms and Conditions",
};
