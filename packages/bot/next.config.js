module.exports = {
  poweredByHeader: false,
  reactStrictMode: true,
  redirects() {
    return [
      {
        destination: 'https://pepe-is.life',
        permanent: true,
        source: '/emojis',
      },
      {
        destination:
          'https://discord.com/oauth2/authorize?client_id=506186003816513538&scope=bot%20applications.commands&permissions=1074129920',
        permanent: true,
        source: '/invite',
      },
      {
        destination: 'https://top.gg/bot/506186003816513538/vote',
        permanent: true,
        source: '/vote',
      },
      {
        destination: 'https://patreon.com/pepemanager',
        permanent: true,
        source: '/patreon',
      },
      {
        destination: 'https://docs.pepemanager.com/',
        permanent: true,
        source: '/docs',
      },
    ];
  },
  // webpack: (config) => {
  //   config.optimization.minimize = false;
  //   config.optimization.minimizer = [];
  //   return config;
  // },
  webpack5: false,
};
