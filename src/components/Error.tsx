import Head from 'next/head';

interface ErrorPageProps {
  code: number;
  message: string;
  title: string;
}

export default function ErrorPage({ code, message, title }: ErrorPageProps) {
  return (
    <div
      className="flex flex-col items-center justify-center bg-discord-dark text-center text-black"
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <Head>
        <title>{title} | Pepe Manager</title>
      </Head>

      <div>
        <h1 className="my-0 mr-5 ml-0 inline-block border-r border-solid border-white py-2 pr-6 pl-0 align-top text-2xl font-bold text-white">
          {code}
        </h1>

        <div className="inline-block h-12 text-left align-middle" style={{ lineHeight: '49px' }}>
          <h2 className="m-0 p-0 text-sm text-white" style={{ fontWeight: 'normal', lineHeight: 'inherit' }}>
            {message}
          </h2>
        </div>
      </div>
    </div>
  );
}
