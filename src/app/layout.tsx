import "tailwindcss/tailwind.css";
import "~/styles/global.css";

import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
// import NextProgress from "next-progress";
import { Noto_Sans } from "next/font/google";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { inProductionEnvironment } from "../utils/common";

const NotoSans = Noto_Sans({
	weight: ["100", "300", "400", "500", "700", "900"],
	subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html className={`scroll-smooth ${NotoSans.className}`} lang="en">
			<body>
				<Navbar />
				{/* <NextProgress color="#2ecc71" /> */}
				{children}
				<Footer />

				{inProductionEnvironment() ? <Analytics /> : null}
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	title: "Pepe Manager",
	description: "A Discord bot with focus on automation, leveling, emoji management, and image manipulation",
	manifest: "/manifest.json",
	appleWebApp: { capable: true },
	themeColor: "#00a81a",
	keywords: [
		"Pepe",
		"Peepo",
		"Pepe Manager",
		"Pepe Manager Bot",
		"Pepe Manager Bot Discord",
		"Pepe Manager Discord",
		"Pepe Manager Discord Server",
		"Pepe Manager Discord Guild",
		"Emoji Manager",
		"Emoji Manager Discord",
		"Pepe Manager Invite",
		"Pepe Manager Bot Invite",
	],
	icons: {
		apple: [
			{
				url: "/apple-splash-2048-2732.png",
				media:
					"(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/apple-splash-2732-2048.png",
				media:
					"(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
			},
			{
				url: "/apple-splash-1668-2388.png",
				media:
					"(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/apple-splash-2388-1668.png",
				media:
					"(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
			},
			{
				url: "/apple-splash-1536-2048.png",
				media:
					"(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/apple-splash-2048-1536.png",
				media:
					"(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
			},
			{
				url: "/apple-splash-1668-2224.png",
				media:
					"(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/apple-splash-2224-1668.png",
				media:
					"(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
			},
			{
				url: "/apple-splash-1620-2160.png",
				media:
					"(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/apple-splash-2160-1620.png",
				media:
					"(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
			},
			{
				url: "/apple-splash-1284-2778.png",
				media:
					"(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
			},
			{
				url: "/apple-splash-2778-1284.png",
				media:
					"(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
			},
			{
				url: "/apple-splash-1170-2532.png",
				media:
					"(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
			},
			{
				url: "/apple-splash-2532-1170.png",
				media:
					"(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
			},
			{
				url: "/apple-splash-1125-2436.png",
				media:
					"(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
			},
			{
				url: "/apple-splash-2436-1125.png",
				media:
					"(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
			},
			{
				url: "/apple-splash-1242-2688.png",
				media:
					"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
			},
			{
				url: "/apple-splash-2688-1242.png",
				media:
					"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
			},
			{
				url: "/apple-splash-828-1792.png",
				media:
					"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/apple-splash-1792-828.png",
				media:
					"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
			},
			{
				url: "/apple-splash-1242-2208.png",
				media:
					"(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
			},
			{
				url: "/apple-splash-2208-1242.png",
				media:
					"(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
			},
			{
				url: "/apple-splash-750-1334.png",
				media:
					"(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/apple-splash-1334-750.png",
				media:
					"(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
			},
			{
				url: "/apple-splash-640-1136.png",
				media:
					"(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/apple-splash-1136-640.png",
				media:
					"(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
			},
		],
		shortcut: "/favicon.png",
		other: [
			{
				rel: "apple-touch-icon",
				url: "/apple-icon-180.png",
			},
		],
	},
};
