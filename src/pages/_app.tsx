import type { AppProps } from 'next/dist/next-server/lib/router/router';
import Navbar from '../components/Navbar';
import SearchBarProvider from '../contexts/SearchBarContext';
import '../styles/global.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <SearchBarProvider>
        <Component {...pageProps} />
      </SearchBarProvider>
    </>
  );
}
