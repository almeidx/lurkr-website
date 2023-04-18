import tailwindScrollbar from "tailwind-scrollbar";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	content: ["./src/**/*.{ts,tsx,css}"],

	theme: {
		fontFamily: {
			sans: ["var(--font-open-sans)", ...fontFamily.sans],
		},

		colors: {
			...colors,

			brand: "#ff7077",
			blurple: "#5662f6",
			"lighter-blurple": "#6e78fa",
			"discord-dark": "#202327",
			"discord-slightly-darker": "#1B1E21",
			"discord-not-quite-black": "#2f3136",
			"discord-lighter": "#40444b",
			"discord-green": "#3ea25e",
			"discord-red": "#ED4245",
		},

		extend: {
			animation: {
				"bounce-slow": "bounce-slow 1s infinite alternate",
			},

			keyframes: {
				"bounce-slow": {
					"0%": {
						transform: "translateY(0)",
					},
					"100%": {
						transform: "translateY(-10px)",
					},
				},
			},

			minHeight: {
				"screen-no-footer": "calc(100vh - 5rem)",
			},
		},
	},

	plugins: [
		//
		tailwindScrollbar({ nocompatible: true }),
	],
} satisfies Config;
