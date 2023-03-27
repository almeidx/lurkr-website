/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports, tsdoc/syntax */

const colors = require("tailwindcss/colors");

/** @type {import("tailwindcss").Config} */
module.exports = {
	content: ["./src/**/*.{ts,tsx,css}"],

	theme: {
		fontFamily: {
			display: ['"Noto Sans KR"', "sans-serif"],
			sans: ['"Noto Sans KR"', "sans-serif"],
		},

		colors: {
			...colors,

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
		require("tailwind-scrollbar")({ nocompatible: true }),
	],
};
