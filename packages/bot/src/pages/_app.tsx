import 'tailwindcss/tailwind.css';
import '../styles/global.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useMemo } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import type { RecordMap } from 'relay-runtime/lib/store/RelayStoreTypes';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import GuildProvider from '../contexts/GuildContext';
import UserProvider from '../contexts/UserContext';
import environment from '../relay/environment';

interface Props {
  records?: RecordMap;
}

export default function MyApp({ Component, pageProps, records: r }: AppProps & Props) {
  const records: RecordMap = useMemo(() => {
    if (r) return r;
    if (typeof document !== 'undefined') {
      const recordsData = document.getElementById('relay-data')?.innerHTML;
      if (recordsData) return JSON.parse(Buffer.from(recordsData, 'base64').toString());
    }
    return {};
  }, [r]);

  return (
    <RelayEnvironmentProvider environment={environment(records)}>
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
    </RelayEnvironmentProvider>
  );
}
