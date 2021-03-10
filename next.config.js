exports.redirects = () => {
  return [
    {
      destination:
        'https://discord.com/oauth2/authorize?client_id=506186003816513538&permissions=1611000960&scope=bot',
      permanent: true,
      source: '/bot-invite',
    },
    {
      destination: 'https://top.gg/bot/506186003816513538/vote',
      permanent: true,
      source: '/vote',
    },
    {
      destination: 'https://teespring.com/stores/pepe-emoji-server',
      permanent: true,
      source: '/merch',
    },
    {
      destination: 'https://patreon.com/pepemanager',
      permanent: true,
      source: '/patreon',
    },
    {
      destination: 'https://docs.pepe-is.life/',
      permanent: true,
      source: '/docs',
    },
  ];
};
