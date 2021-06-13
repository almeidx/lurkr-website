import Head from 'next/head';

import Error from '../components/Error';

export default function _404() {
  return (
    <>
      <Head>
        <title>Not Found - Pepe Manager</title>
      </Head>

      <Error />
    </>
  );
}
