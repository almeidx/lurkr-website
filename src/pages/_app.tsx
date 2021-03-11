import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Scrollbars } from 'react-custom-scrollbars';
import type { AppProps } from 'next/dist/next-server/lib/router/router';
import SearchBarProvider from '../contexts/SearchBarContext';
import '../styles/global.css';

const appleIcons: { href: string; media: string }[] = [
  {
    href: '/icons/apple-splash-2048-2732.png',
    media:
      '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: '/icons/apple-splash-2732-2048.png',
    media:
      '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: '/icons/apple-splash-1668-2388.png',
    media:
      '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: '/icons/apple-splash-2388-1668.png',
    media:
      '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: '/icons/apple-splash-1536-2048.png',
    media:
      '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: '/icons/apple-splash-2048-1536.png',
    media:
      '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: '/icons/apple-splash-1668-2224.png',
    media:
      '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: '/icons/apple-splash-2224-1668.png',
    media:
      '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: '/icons/apple-splash-1620-2160.png',
    media:
      '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: '/icons/apple-splash-2160-1620.png',
    media:
      '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: '/icons/apple-splash-1284-2778.png',
    media:
      '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: '/icons/apple-splash-2778-1284.png',
    media:
      '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: '/icons/apple-splash-1170-2532.png',
    media:
      '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: '/icons/apple-splash-2532-1170.png',
    media:
      '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: '/icons/apple-splash-1125-2436.png',
    media:
      '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: '/icons/apple-splash-2436-1125.png',
    media:
      '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: '/icons/apple-splash-1242-2688.png',
    media:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: '/icons/apple-splash-2688-1242.png',
    media:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: '/icons/apple-splash-828-1792.png',
    media:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: '/icons/apple-splash-1792-828.png',
    media:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: '/icons/apple-splash-1242-2208.png',
    media:
      '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: '/icons/apple-splash-2208-1242.png',
    media:
      '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: '/icons/apple-splash-750-1334.png',
    media:
      '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: '/icons/apple-splash-1334-750.png',
    media:
      '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: '/icons/apple-splash-640-1136.png',
    media:
      '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: '/icons/apple-splash-1136-640.png',
    media:
      '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
];

const keywords = [
  'Pepe',
  'Pepe Discord',
  'Pepe Discord Server',
  'Pepe Discord Guild',
  'Pepe Emoji Server',
  'Pepe Emojis',
  'Pepe Emotes',
  'Pepe Server Invite',
  'Peepo Server Invite',
  'Peepo Discord Server',
  'Nitro',
  'Discord Nitro',
  'Peepo Emoji Server',
  'Peeepo Emoji Guild',
  'Discord',
  'Emotes',
  'Emojis',
];

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <Scrollbars
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      universal
      style={{ width: '100vw', height: '100vh' }}
      renderThumbVertical={({ style, ...props }) => <div {...props} style={{ ...style, background: 'var(--black)' }} />}
    >
      <Head>
        <link rel="manifest" href="manifest.json" />
        <link rel="shortcut icon" href="favicon.png" type="image/png" />
        <meta name="theme-color" content="#00a81a" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        <meta name="keywords" content={keywords.join(', ')} />

        <meta name="title" content="Pepe Emoji" />
        <meta property="og:title" content="Pepe Emoji" />
        <meta name="description" content="More than 1,400 unique Pepe emojis for you to use on Discord" />
        <meta property="og:description" content="More than 1,400 unique Pepe emojis for you to use on Discord" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Pepe Emoji offers a powerful Discord bot to manage your server and unique Pepe emojis for you to use on Discord"
        />

        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {appleIcons.map(({ href, media }, i) => (
          <link key={i} rel="apple-touch-icon" href={href} media={media} />
        ))}
      </Head>

      <nav className="navbarContainer">
        <span onClick={() => router.push('/')}>PEPE MANAGER</span>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/bot">Bot</Link>
          </li>
          <li>
            <Link href="/levels">Levels</Link>
          </li>
          <li>
            <Link href="/merch">Merch</Link>
          </li>
          <li>
            <Link href="https://discord.gg/pepe">Support Server</Link>
          </li>
        </ul>
        <div>
          <button>Login</button>
        </div>
      </nav>
      <SearchBarProvider>
        <Component {...pageProps} />
      </SearchBarProvider>
    </Scrollbars>
  );
}
