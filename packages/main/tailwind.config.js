module.exports = {
  mode: 'jit',
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    extend: {
      backgroundColor: {
        'discord-dark': '#202327',
        'discord-not-quite-black': '#2f3136',
        'discord-green': '#3ea25e',
      },
      gridTemplateColumns: {
        '1fr-4fr': '1fr 4fr',
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
