module.exports = {
	content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/styles/*.css"],
	theme: {
		fontFamily: {
			sans: ['"Noto Sans KR"', "sans-serif"],
			display: ['"Noto Sans KR"', "sans-serif"],
		},
		extend: {
			backgroundColor: {
				blurple: "#5662f6",
				"lighter-blurple": "#6e78fa",
				"discord-dark": "#202327",
				"discord-slightly-darker": "#1B1E21",
				"discord-not-quite-black": "#2f3136",
				"discord-lighter": "#40444b",
				"discord-green": "#3ea25e",
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
