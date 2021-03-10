import type { AppProps } from 'next/dist/next-server/lib/router/router';
import Navbar from '../components/Navbar';
import SearchBarProvider from '../contexts/SearchBarContext';
import { Scrollbars } from 'react-custom-scrollbars';
import Head from 'next/head';
import '../styles/global.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Scrollbars
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      universal
      style={{ width: '100vw', height: '100vh' }}
      renderThumbVertical={({ style, ...props }) => <div {...props} style={{ ...style, background: 'var(--black)' }} />}
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>

      <Navbar />
      <SearchBarProvider>
        <Component {...pageProps} />
      </SearchBarProvider>
    </Scrollbars>
  );
}
