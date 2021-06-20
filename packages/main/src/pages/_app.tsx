import 'tailwindcss/tailwind.css';

import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { useApollo } from '../graphql/client';
import Navbar from '../components/Navbar';

export default function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <title>Pepe Emoji</title>
      </Head>

      <Navbar />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
