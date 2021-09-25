import Document, { Head, Html, Main, NextScript } from 'next/document';

import { appleIcons, keywords } from '../utils/constants';

export default class MyDocument extends Document {
  public override render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.png" type="image/png" />
          <meta name="theme-color" content="#00a81a" />

          <meta name="keywords" content={keywords.join(', ')} />

          <meta name="title" content="Pepe Emoji" />
          <meta property="og:title" content="Pepe Emoji" />
          <meta name="description" content="More than 1,500 unique Pepe emojis for you to use on Discord" />
          <meta property="og:description" content="More than 1,500 unique Pepe emojis for you to use on Discord" />
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
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
