import 'tailwindcss/tailwind.css';
import '../styles/font.css';

import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import Navbar from '../components/Navbar';
import { useApollo } from '../graphql/client';

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
