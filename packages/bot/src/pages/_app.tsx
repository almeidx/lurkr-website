import 'tailwindcss/tailwind.css';
import '../styles/global.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactRelayContext } from 'react-relay';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import GuildProvider from '../contexts/GuildContext';
import UserProvider from '../contexts/UserContext';
import { useEnvironment } from '../relay/environment';

export default function MyApp({ Component, pageProps }: AppProps) {
  const environment = useEnvironment(pageProps.initialRecords);

  return (
    <ReactRelayContext.Provider value={{ environment }}>
      <UserProvider>
        <GuildProvider>
          <Head>
            <title>Pepe Manager</title>
          </Head>

          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </GuildProvider>
      </UserProvider>
    </ReactRelayContext.Provider>
  );
}
