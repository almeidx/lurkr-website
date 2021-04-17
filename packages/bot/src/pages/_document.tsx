import Document, { Head, Html, Main, NextScript } from 'next/document';

const appleIcons: { href: string; media: string }[] = [
  {
    href: 'icons/apple-splash-2048-2732.png',
    media:
      '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2732-2048.png',
    media:
      '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1668-2388.png',
    media:
      '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2388-1668.png',
    media:
      '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1536-2048.png',
    media:
      '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2048-1536.png',
    media:
      '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1668-2224.png',
    media:
      '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2224-1668.png',
    media:
      '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1620-2160.png',
    media:
      '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2160-1620.png',
    media:
      '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1284-2778.png',
    media:
      '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2778-1284.png',
    media:
      '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1170-2532.png',
    media:
      '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2532-1170.png',
    media:
      '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1125-2436.png',
    media:
      '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2436-1125.png',
    media:
      '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1242-2688.png',
    media:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2688-1242.png',
    media:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-828-1792.png',
    media:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-1792-828.png',
    media:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1242-2208.png',
    media:
      '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2208-1242.png',
    media:
      '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-750-1334.png',
    media:
      '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-1334-750.png',
    media:
      '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-640-1136.png',
    media:
      '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-1136-640.png',
    media:
      '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
];

const keywords: string[] = [
  'Pepe',
  'Peepo',
  'Pepe Manager',
  'Pepe Manager Bot',
  'Pepe Manager Bot Discord',
  'Pepe Manager Discord',
  'Pepe Manager Discord Server',
  'Pepe Manager Discord Guild',
  'Emoji Manager',
  'Emoji Manager Discord',
  'Pepe Manager Invite',
  'Pepe Manager Bot Invite',
];

export default class MyDocument extends Document {
  public render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.png" type="image/png" />
          <meta name="theme-color" content="#00a81a" />

          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600&display=swap"
            rel="stylesheet"
          />

          <meta name="keywords" content={keywords.join(', ')} />

          <meta name="title" content="Pepe Manager" />
          <meta property="og:title" content="Pepe Manager" />
          <meta
            name="description"
            content="A Discord bot with focus on automation, leveling, emoji management, and image manipulation"
          />
          <meta
            property="og:description"
            content="A Discord bot with focus on automation, leveling, emoji management, and image manipulation"
          />
          <meta property="og:type" content="website" />

          <link rel="apple-touch-icon" href="icons/apple-icon-180.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          {appleIcons.map(({ href, media }, i) => (
            <link key={i} rel="apple-touch-icon" href={href} media={media} />
          ))}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
