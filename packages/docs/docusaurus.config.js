require('dotenv/config');

module.exports = {
  title: 'Pepe Manager',
  tagline: 'Documentation for Pepe Manager, a Discord bot with focus on automation, leveling, emoji management, and image manipulation.',
  url: 'https://docs.pepemanager.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'almeidx',
  projectName: 'pepe-docs',
  themeConfig: {
    // algolia: {
    //   apiKey: process.env.ALGOLIA_KEY,
    //   indexName: 'pepe-docs',
    // },
    navbar: {
      title: 'Pepe Manager',
      logo: {
        alt: 'Pepe Manager icon',
        src: 'img/pepe-manager.png',
      },
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/pepe',
            },
          ],
        },
        {
          title: 'Find Us Online',
          items: [
            {
              label: 'Top.gg',
              href: 'https://top.gg/bot/506186003816513538',
            },
            {
              label: 'Bots.gg',
              href: 'https://discord.bots.gg/bots/506186003816513538',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Dashboard',
              href: 'https://pepemanager.com',
            },
            {
              label: 'Terms',
              href: 'https://pepemanager.com/terms',
            },
            {
              label: 'Privacy Policy',
              href: 'https://pepemanager.com/privacy',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Pepe Emoji. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/almeidx/pepe-docs/edit/main',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
