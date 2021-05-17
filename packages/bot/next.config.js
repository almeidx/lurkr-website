module.exports = {
  poweredByHeader: false,
  /*
   * TODO: Enable this whenever react-visibility-sensor updates to not use the findDOMNode function
   * maybe even use the react-in-viewpost package instead, whenever their update to remove this function is merged
   */
  reactStrictMode: false,
  redirects() {
    return [
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
};
