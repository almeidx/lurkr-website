require('dotenv/config');

module.exports = {
  title: 'Pepe Manager Docs',
  tagline: 'Documentation for Pepe Manager, the Discord bot',
  url: 'https://docs.pepe-is.life',
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
        alt: 'Pepe Manager',
        src: 'img/pepe-manager.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://pepe-is.life/bot',
          label: 'Website',
          position: 'left',
        },
        {
          href: 'https://discord.gg/pepe',
          label: 'Discord',
          position: 'left',
        },
        {
          href: 'https://discord.com/api/oauth2/authorize?client_id=506186003816513538&permissions=1611000960&scope=bot',
          label: 'Invite',
          position: 'right',
        },
        {
          href: 'https://top.gg/bot/506186003816513538/vote',
          label: 'Vote',
          position: 'right',
        },
        {
          href: 'https://github.com/almeidx/pepe-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: 'docs/',
            },
            {
              label: 'Inviting the bot',
              to: 'docs/#inviting-the-bot',
            },
          ],
        },
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
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/almeidx/pepe-docs',
            },
            {
              label: 'Website',
              href: 'https://pepe-is.life/bot',
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Pepe Emoji Server, Inc. Built with Docusaurus.`,
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
