import localFont from "next/font/local";

export const openSans = localFont({
	src: [
		{
			path: "../assets/fonts/OpenSans-Light.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../assets/fonts/OpenSans-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../assets/fonts/OpenSans-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../assets/fonts/OpenSans-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "../assets/fonts/OpenSans-Bold.ttf",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-open-sans",
});
