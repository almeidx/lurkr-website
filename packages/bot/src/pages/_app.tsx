import 'tailwindcss/tailwind.css';
import '../styles/global.css';

import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import UserProvider from '../contexts/UserContext';
import { useApollo } from '../graphql/client';

export default function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <Head>
          <title>Pepe Manager</title>
        </Head>

        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </UserProvider>
    </ApolloProvider>
  );
}
