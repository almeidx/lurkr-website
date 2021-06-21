import Document, { Head, Html, Main, NextScript } from 'next/document';

import { appleIcons, keywords } from '../utils/constants';

export default class MyDocument extends Document {
  public render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.png" type="image/png" />
          <meta name="theme-color" content="#00a81a" />

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
