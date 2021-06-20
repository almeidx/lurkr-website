module.exports = {
  mode: 'jit',
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['"Noto Sans KR"', 'sans-serif'],
    },
    extend: {
      backgroundColor: {
        'discord-dark': '#202327',
        'discord-slightly-darker': '#1B1E21',
        'discord-not-quite-black': '#2f3136',
        'discord-green': '#3ea25e',
        'discord-lighter-green': '#24c558',
      },
      textColor: {
        'discord-red': '#ED4245',
      },
    },
    gridTemplateAreas: {
      // prettier-ignore
      guild: [
        'icon name join',
        'icon members join',
      ],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@savvywombat/tailwindcss-grid-areas')],
};
