import React from "react";
import Main from "next/head";

import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Main>
        <title>Pepe Emoji Server</title>
        <meta
          name="keywords"
          content="Pepe, Pepe Discord, Pepe Discord Server, Pepe Discord Guild, Pepe Emoji Server, Pepe Emojis, Pepe Emotes, Pepe Server Invite, Peepo Server Invite, Peepo Discord Server, Nitro, Discord Nitro, Peepo Emoji Server, Peeepo Emoji Guild, Discord"
        />
        <meta property="og:title" content="Pepe Emoji Server" />
        <meta
          property="og:description"
          content="More than 1,000 custom emojis for you to use on Discord!"
        />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#00a81a" />
        <meta name="description" content="Pepe Emojis for Discord" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="apple-touch-icon" href="/static/nitro-hover.png" />
        <link rel="manifest" href="/manifest.json" />
      </Main>
      <Component {...pageProps} />
    </>
  );
}
