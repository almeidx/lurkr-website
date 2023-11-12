import scrollbars from "tailwind-scrollbar";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
	content: ["./src/app/**/*.{ts,tsx,css}", "./src/components/**/*.{ts,tsx,css}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-open-sans)", ...fontFamily.sans],
			},

			boxShadow: {
				"dim-inner": "0px 0px 10px 0px #00000080 inset",
			},

			colors: {
				background: "#171717",
				white: "#e2e2e2",
				blurple: "#5865f2",
				primary: "#ff7077",

				darker: "#1e1f22",

				"light-gray": "#474747",
				"dark-gray": "#232323",

				red: { ...colors.red, DEFAULT: "#df4444" },
				yellow: { ...colors.yellow, DEFAULT: "#fbb748" },
				green: { ...colors.green, DEFAULT: "#3ea25e" },
			},

			backgroundImage: {
				"gradient-radial": "linear-gradient(92.52deg, #FF7077 0%, #FFE87C 100%)",
				"gradient-radial-2": "linear-gradient(93deg, #FFE87C 0%, #804994 100%)",

				"gradient-radial-blur": "linear-gradient(225deg, rgba(255, 112, 119, 0.75) 0%, rgba(255, 232, 124, 0.75) 100%)",

				"ellipse-radial": "linear-gradient(67.07deg, #D2FFAE 6.76%, #804994 93.13%)",

				"dashed-squares": "linear-gradient(to bottom, rgba(226, 226, 226, 0.75) 50%, #171717 50%)",

				patreon: "linear-gradient(93.24deg, #FF424D 0%, #FF7077 100%)",
			},

			backgroundSize: {
				"size-10": "10px 10px",
			},

			textShadow: {
				regular: "1.5px 1.5px 0px rgba(0, 33, 66, 0.95)",
			},

			dropShadow: {
				regular: "1.5px 1.5px 0px rgba(0, 33, 66, 0.95)",
			},

			fill: {
				"icon-gradient-primary": "url(#icon-gradient-primary)",
				"icon-gradient-tertiary": "url(#icon-gradient-tertiary)",
			},

			keyframes: {
				"pulse-success": {
					"0%, 100%": {
						backgroundColor: "rgba(62, 162, 94, 1)",
					},
					"50%": {
						backgroundColor: "rgba(62, 162, 94, 0.6)",
					},
				},
			},

			animation: {
				"pulse-success": "pulse-success 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
		},
	},
	plugins: [
		scrollbars({ nocompatible: true }),

		// https://www.hyperui.dev/blog/text-shadow-with-tailwindcss
		plugin(({ matchUtilities, theme }) => {
			matchUtilities({ "text-shadow": (value) => ({ textShadow: value }) }, { values: theme("textShadow") });
		}),

		plugin(({ addVariant, e: escapeClass }) => {
			// @ts-expect-error: Tailwind types are wrong
			addVariant("slider-thumb", ({ modifySelectors, separator }) => {
				modifySelectors(({ className }: { className: string }) => {
					return `.${escapeClass(`slider-thumb${separator}${className}`)}::-webkit-slider-thumb, .${escapeClass(
						`slider-thumb${separator}${className}`,
					)}::-moz-range-thumb`;
				});
			});
		}),
	],
} satisfies Config;
