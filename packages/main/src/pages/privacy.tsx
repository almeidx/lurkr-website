import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="bg-discord-dark w-full flex flex-col items-center">
      <Head>
        <title>Privacy Policy | Pepe Emoji</title>
      </Head>

      <header className="flex flex-col items-center justify-center pt-3 sm:pt-1">
        <h1 className="text-white font-bold text-3xl sm:text-4xl">Privacy Policy</h1>
        <span className="text-gray-400 mt-3">Last updated and effective: June 20, 2021.</span>
      </header>

      <main className="max-w-4xl">
        <p className="text-gray-400 font-light mt-6 mx-3 sm:mx-0">
          This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your
          information when You use the Service and tells You about Your privacy rights and how the law protects You.
        </p>
        <p className="text-gray-400 font-light mt-6 mb-9 mx-3 sm:mx-0">
          If you choose to use our Service, then you agree to the collection and use of information in relation to this
          policy. The Personal Information that we collect is used for providing and improving the Service. We will not
          use or share your information with anyone except as described in this Privacy Policy.
        </p>

        <Link href="#information-collection-and-use">
          <a className="text-gray-200 font-bold text-xl sm:text-3xl uppercase mx-3 sm:mx-0">
            Information Collection and Use
          </a>
        </Link>

        <p className="text-gray-400 font-light mt-6 mb-9 mx-3 sm:mx-0">
          For a better experience, while using our Service, we may require you to provide us with certain personally
          identifiable information, including but not limited to Discord ID. The information that we request will be
          retained by us and used as described in this privacy policy.
        </p>

        <Link href="#log-data">
          <a className="text-gray-200 font-bold text-xl sm:text-3xl uppercase mx-3 sm:mx-0">Log Data</a>
        </Link>

        <p className="text-gray-400 font-light mt-6 mb-9 mx-3 sm:mx-0">
          We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and
          information (through third party products) on your phone called Log Data. This Log Data may include
          information such as your device Internet Protocol (&quot;IP&quot;) address, device name, operating system
          version, the configuration of the app when utilizing our Service, the time and date of your use of the
          Service, and other statistics.
        </p>

        <Link href="#cookies">
          <a className="text-gray-200 font-bold text-xl sm:text-3xl uppercase mx-3 sm:mx-0">Cookies</a>
        </Link>

        <p className="text-gray-400 font-light mt-6 mx-3 sm:mx-0">
          Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These
          are sent to your browser from the websites that you visit and are stored on your device&apos;s internal
          memory.
        </p>
        <p className="text-gray-400 font-light mt-3 mb-9 mx-3 sm:mx-0">
          This Service does not use these &quot;cookies&quot; explicitly. However, the app may use third party code and
          libraries that use &quot;cookies&quot; to collect information and improve their services. You have the option
          to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to
          refuse our cookies, you may not be able to use some portions of this Service.
        </p>

        <Link href="#security">
          <a className="text-gray-200 font-bold text-xl sm:text-3xl uppercase mx-3 sm:mx-0">Security</a>
        </Link>

        <p className="text-gray-400 font-light mt-3 mb-9 mx-3 sm:mx-0">
          We value your trust in providing us your Personal Information, thus we are striving to use commercially
          acceptable means of protecting it. But remember that no method of transmission over the internet, or method of
          electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
        </p>

        <Link href="#links-to-other-sites">
          <a className="text-gray-200 font-bold text-xl sm:text-3xl uppercase mx-3 sm:mx-0">Links to Other Sites</a>
        </Link>

        <p className="text-gray-400 font-light mt-3 mb-9 mx-3 sm:mx-0">
          This Service may contain links to other sites. If you click on a third-party link, you will be directed to
          that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review
          the Privacy Policy of these websites. We have no control over and assume no responsibility for the content,
          privacy policies, or practices of any third-party sites or services.
        </p>

        <Link href="#children-privacy">
          <a className="text-gray-200 font-bold text-xl sm:text-3xl uppercase mx-3 sm:mx-0">Children&apos;s Privacy</a>
        </Link>

        <p className="text-gray-400 font-light mt-3 mb-9 mx-3 sm:mx-0">
          These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable
          information from children under 13 years of age. In the case we discover that a child under 13 has provided us
          with personal information, we immediately delete this from our servers. If you are a parent or guardian and
          you are aware that your child has provided us with personal information, please contact us so that we will be
          able to do necessary actions.
        </p>

        <Link href="#changes">
          <a className="text-gray-200 font-bold text-xl sm:text-3xl uppercase mx-3 sm:mx-0">
            Changes to This Privacy Policy
          </a>
        </Link>

        <p className="text-gray-400 font-light mt-3 mb-9 mx-3 sm:mx-0">
          We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for
          any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>

        <Link href="#contact">
          <a className="text-gray-200 font-bold text-xl sm:text-3xl uppercase mx-3 sm:mx-0">Contact Us</a>
        </Link>

        <p className="text-gray-400 font-light mt-3 mb-9 mx-3 sm:mx-0">
          If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at{' '}
          <a href="mailto:admin@almeidx.dev" className="text-blue-300">
            admin@almeidx.dev
          </a>
          .
        </p>
      </main>
    </div>
  );
}
