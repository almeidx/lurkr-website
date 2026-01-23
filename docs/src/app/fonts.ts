import { Open_Sans } from "next/font/google";

export const openSans = Open_Sans({
	// From https://tailwindcss.com/docs/font-family
	fallback: [
		"ui-sans-serif",
		"system-ui",
		"sans-serif",
		"Apple Color Emoji",
		"Segoe UI Emoji",
		"Segoe UI Symbol",
		"Noto Color Emoji",
	],
	style: "normal",
	subsets: ["latin"],
	variable: "--font-sans",
	weight: ["300", "400", "500", "600", "700", "800"],
});
