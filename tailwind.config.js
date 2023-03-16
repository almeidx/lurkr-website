/* eslint-disable tsdoc/syntax */

/** @type {import("tailwindcss").Config} */
module.exports = {
	content: ["./src/**/*.{ts,tsx,css}"],
	theme: {
		fontFamily: {
			sans: ['"Noto Sans KR"', "sans-serif"],
			display: ['"Noto Sans KR"', "sans-serif"],
		},
		extend: {
			animation: {
				"bounce-slow": "bounce-slow 1s infinite alternate",
			},

			backgroundColor: {
				blurple: "#5662f6",
				"lighter-blurple": "#6e78fa",
				"discord-dark": "#202327",
				"discord-slightly-darker": "#1B1E21",
				"discord-not-quite-black": "#2f3136",
				"discord-lighter": "#40444b",
				"discord-green": "#3ea25e",
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

			textColor: {
				"discord-red": "#ED4245",
			},

			minHeight: {
				"screen-no-footer": "calc(100vh - 5rem)",
			},
		},
	},
	plugins: [],
};
