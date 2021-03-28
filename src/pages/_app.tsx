import '../styles/global.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider as AuthProvider } from 'next-auth/client';
import { Scrollbars } from 'react-custom-scrollbars';

import Navbar from '../components/Navbar';
import SearchBarProvider from '../contexts/SearchBarContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Scrollbars
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      universal
      style={{ height: '100vh', width: '100vw' }}
      renderThumbVertical={({ style, ...props }) => <div {...props} style={{ ...style, background: 'var(--black)' }} />}
    >
      <Head>
        <title>Pepe Emoji</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>

      <Navbar />

      <SearchBarProvider>
        <AuthProvider session={pageProps.session}>
          <Component {...pageProps} />
        </AuthProvider>
      </SearchBarProvider>
    </Scrollbars>
  );
}
