import { Open_Sans } from "next/font/google";

export const openSans = Open_Sans({
	fallback: [
		"ui-sans-serif",
		"system-ui",
		"sans-serif",
		"Apple Color Emoji",
		"Segoe UI Emoji",
		"Segoe UI Symbol",
		"Noto Color Emoji",
	],
	subsets: ["latin"],
	variable: "--font-sans",
});
