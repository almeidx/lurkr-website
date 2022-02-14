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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const records: RecordMap = useMemo(() => {
    if (r) return r;
    if (typeof document !== 'undefined') {
      const recordsData = document.getElementById('relay-data')?.innerHTML;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      if (recordsData) return JSON.parse(Buffer.from(recordsData, 'base64').toString());
    }
    return {};
  }, [r]);

  return (
    <RelayEnvironmentProvider
      // @ts-expect-error
      environment={environment(records)}
    >
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
