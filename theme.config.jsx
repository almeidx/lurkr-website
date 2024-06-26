import "@/app/globals.css";

import faviconImg from "@/app/icon.png";
import logoSmallImg from "@/assets/logo-small.webp";
import { Footer } from "@/components/Footer.tsx";
import { Discord } from "@/components/icons/Discord.tsx";
import { GitHub } from "@/components/icons/GitHub.tsx";
import { BASE_URL } from "@/utils/constants.ts";
import { usePathname } from "next/navigation";
import { Link, useConfig } from "nextra-theme-docs";
import { SUPPORT_SERVER_INVITE } from "./shared-links.mjs";

/** @type {import("nextra-theme-docs").DocsThemeConfig} */
export default {
	logo: (
		<div className="flex items-center gap-2">
			<img alt="Lurkr logo" className="size-[45px]" height={45} src={logoSmallImg.src} fetchpriority="high" />

			<p className="font-medium text-xl no-underline">Lurkr</p>
		</div>
	),
	head: () => {
		const pathname = usePathname();
		const { frontMatter } = useConfig();
		const url = `${BASE_URL}${pathname}`;

		const lastPathParam = pathname.split("/").at(-1).replaceAll("-", " ");
		const capitalizedPathTitle = lastPathParam.replace(/\b\w/g, (l) => l.toUpperCase());
		const title = frontMatter.title
			? `${frontMatter.title} • Lurkr`
			: capitalizedPathTitle
				? `${capitalizedPathTitle} • Lurkr`
				: "Lurkr";

		return (
			<>
				<link rel="icon" href={faviconImg.src} type="image/png" />
				<title>{title}</title>
				<meta property="og:url" content={url} />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={frontMatter.description || "Lurkr documentation"} />
			</>
		);
	},
	project: {
		link: "https://github.com/almeidx/lurkr-website",
		icon: <GitHub className="size-7" />,
	},
	docsRepositoryBase: "https://github.com/almeidx/lurkr-website/edit/beta/src/pages/docs",
	footer: {
		component: <Footer />,
	},
	primaryHue: 357.06,
	primarySaturation: 100,
	chat: {
		link: SUPPORT_SERVER_INVITE,
		icon: <Discord className="size-7" />,
	},
	darkMode: false,
	nextThemes: {
		defaultTheme: "dark",
	},
};
