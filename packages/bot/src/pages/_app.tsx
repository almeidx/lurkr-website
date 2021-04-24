import '../styles/global.scss';

import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Scrollbars } from 'react-custom-scrollbars';

import Navbar from '../components/Navbar';
import GuildProvider from '../contexts/GuildContext';
import GuildsStoreProvider from '../contexts/GuildsStoreContext';
import UserProvider from '../contexts/UserContext';
import { useApollo } from '../graphql/client';

export default function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <Scrollbars
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      universal
      style={{ height: '100vh', width: '100vw' }}
      renderThumbVertical={({ style, ...props }) => <div {...props} style={{ ...style, background: 'var(--black)' }} />}
    >
      <ApolloProvider client={apolloClient}>
        <UserProvider>
          <GuildsStoreProvider>
            <GuildProvider>
              <Head>
                <title>Pepe Emoji</title>
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
                />
              </Head>

              <Navbar />

              <Component {...pageProps} />
            </GuildProvider>
          </GuildsStoreProvider>
        </UserProvider>
      </ApolloProvider>
    </Scrollbars>
  );
}
