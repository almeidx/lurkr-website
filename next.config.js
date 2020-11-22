module.exports = {
  redirects() {
    return [
      {
        source: '/bot-invite',
        destination: 'https://discord.com/oauth2/authorize?client_id=506186003816513538&permissions=1611000960&scope=bot',
        permanent: true,
      },
      {
        source: '/bot-vote',
        destination: 'https://top.gg/bot/506186003816513538/vote',
        permanent: true,
      },
      {
        source: '/merch',
        destination: 'https://teespring.com/stores/pepe-emoji-server',
        permanent: true,
      },
    ];
  },
};
