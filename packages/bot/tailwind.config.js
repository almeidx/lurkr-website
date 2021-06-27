module.exports = {
  mode: 'jit',
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['"Nunito"', 'sans-serif'],
      display: ['"Inter"', 'sans-serif'],
    },
    extend: {
      backgroundColor: {
        blurple: '#5662f6',
        'lighter-blurple': '#6e78fa',
        'discord-dark': '#202327',
        'discord-slightly-darker': '#1B1E21',
        'discord-not-quite-black': '#2f3136',
        'discord-lighter': '#40444b',
      },
      textColor: {
        'discord-red': '#ED4245',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
