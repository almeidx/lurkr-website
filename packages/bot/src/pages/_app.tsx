import '../styles/global.scss';

import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import Navbar from '../components/Navbar';
import GuildProvider from '../contexts/GuildContext';
import GuildsStoreProvider from '../contexts/GuildsStoreContext';
import UserProvider from '../contexts/UserContext';
import { useApollo } from '../graphql/client';

export default function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <GuildsStoreProvider>
          <GuildProvider>
            <Head>
              <title>Pepe Manager</title>
            </Head>

            <Navbar />

            <Component {...pageProps} />
          </GuildProvider>
        </GuildsStoreProvider>
      </UserProvider>
    </ApolloProvider>
  );
}
